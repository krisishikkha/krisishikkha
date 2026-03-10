// -------------------- Global Variables --------------------
let examStartTime;
let allResults = JSON.parse(localStorage.getItem("krisishikkha_results")) || []; // <-- ফিক্স
let userAnswers = [];
let timerInterval;
let studentName = "";

// -------------------- Login Validation --------------------
function validateAccess() {
    const name = document.getElementById("studentName").value.trim();
    const code = document.getElementById("accessCode").value.trim();
    const warning = document.getElementById("warning");

    if (name === "") {
        warning.innerText = "নাম লিখুন";
        return;
    }

    let examId = getActiveExamId();
    const validCodes = (EXAM_STATUS[examId].codes || []);

    if (!validCodes.includes(code)) {
        warning.innerText = "❌ ভুল এক্সেস কোড";
        return;
    }

    studentName = name; // save globally

    document.getElementById("loginSection").style.display = "none";
    document.getElementById("examMain").style.display = "block";

    initExam(examId);
}

// -------------------- Auto Exam ID --------------------
function getActiveExamId() {
    const params = new URLSearchParams(window.location.search);
    let examId = params.get("exam");

    if (!examId) {
        for (const id in EXAM_STATUS) {
            if (EXAM_STATUS[id].visible && EXAM_STATUS[id].status === "live") {
                examId = id;
                break;
            }
        }
    }
    return examId;
}

// -------------------- Exam Init --------------------
function initExam(examId) {
    examStartTime = new Date();

    if (!examId || !EXAM_STATUS[examId]) {
        document.body.innerHTML = "<h2>Invalid Exam ID</h2>";
        return;
    }

    if (EXAM_STATUS[examId].status !== "live") {
        document.body.innerHTML = "<h2>Exam Locked</h2>";
        return;
    }

    document.getElementById("examTitle").innerText = EXAM_STATUS[examId].title;

    const script = document.createElement("script");
    script.src = `./exam-corner/${examId}/questions.js`;

    script.onload = function () {
        if (typeof QUESTIONS === "undefined" || QUESTIONS.length === 0) {
            alert("⚠️ প্রশ্ন ফাইল লোড হয়নি!");
            return;
        }
        renderQuestions();
        startTimer();
    };

    script.onerror = function () {
        alert("⚠️ questions.js লোড করতে সমস্যা হয়েছে!");
    };

    document.body.appendChild(script);
}

// -------------------- Render Questions --------------------
function renderQuestions() {
    const container = document.getElementById("examContainer");
    container.innerHTML = "";

    QUESTIONS.forEach((q, index) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
            <h4>${index + 1}. ${q.question}</h4>
            ${q.options.map((opt, i) =>
                `<button onclick="selectAnswer(${index}, ${i}, this)">
                    ${opt}
                </button><br>`
            ).join("")}
        `;
        container.appendChild(div);
    });
}

function selectAnswer(qIndex, optIndex, btn) {
    if (userAnswers[qIndex] !== undefined) return;

    userAnswers[qIndex] = optIndex;

    const buttons = btn.parentElement.querySelectorAll("button");
    buttons.forEach(function(b) {
        b.disabled = true;
    });

    btn.classList.add("selected");
}

// -------------------- Timer --------------------
let totalTime = 25 * 60;

function startTimer() {
    const timerBox = document.querySelector(".timer-box");
    const timeDisplay = document.getElementById("timeLeft");

    timerInterval = setInterval(function () {
        let minutes = Math.floor(totalTime / 60);
        let seconds = totalTime % 60;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timeDisplay.innerText = minutes + ":" + seconds;

        if (totalTime <= 300 && totalTime > 120) {
            timerBox.classList.add("timer-warning");
        }

        if (totalTime <= 120) {
            timerBox.classList.remove("timer-warning");
            timerBox.classList.add("timer-danger");
        }

        if (totalTime <= 0) {
            clearInterval(timerInterval);
            submitExam();
        }

        totalTime--;
    }, 1000);
}

// -------------------- Submit Exam --------------------
function submitExam() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    clearInterval(timerInterval);

    let examEndTime = new Date();

    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    QUESTIONS.forEach((q, index) => {
        const userAns = userAnswers[index];
        if (userAns === undefined) {
            unanswered++;
        } else if (userAns === q.answer) {
            correct++;
        } else {
            wrong++;
        }
    });

    let percent = Math.round((correct / QUESTIONS.length) * 100);
    let passMark = 40;
    let status = percent >= passMark ? "✅ PASS" : "❌ FAIL";

    const resultObj = {
        examId: getActiveExamId(),
        name: studentName,
        correct,
        wrong,
        unanswered,
        percent,
        start: examStartTime,
        end: examEndTime
    };

    // ------------------- LOCAL STORAGE FIX -------------------
    let existingResults = JSON.parse(localStorage.getItem("krisishikkha_results")) || [];
    existingResults.push(resultObj);
    localStorage.setItem("krisishikkha_results", JSON.stringify(existingResults));
    allResults = existingResults; // update global array

    // ------------------- SEND TO GOOGLE SHEET -----------------
    if (typeof sendToGoogleSheet === "function") {
        sendToGoogleSheet(resultObj);
    }

    // ------------------- DISPLAY RESULT ---------------------
    let resultHTML = `
        <div style="padding:20px;">
            <h2>📊 পরীক্ষার ফলাফল</h2>
            <div style="
                background:${percent >= passMark ? '#d4edda' : '#f8d7da'};
                padding:15px;
                border-radius:8px;
                margin-bottom:20px;
                font-size:18px;
            ">
                <strong>${studentName}</strong><br>
                ✔️ সঠিক: ${correct}<br>
                ❌ ভুল: ${wrong}<br>
                ❓ উত্তর নেই: ${unanswered}<br>
                📈 শতাংশ: ${percent}%<br>
                🎯 ফলাফল: <strong>${status}</strong>
            </div>
            <hr>
            <h3>📋 উত্তর ও ব্যাখ্যা</h3>
    `;

    QUESTIONS.forEach((q, index) => {
        const userAns = userAnswers[index];
        const correctAns = q.answer;

        let ansText = userAns === undefined ? "কোনও উত্তর নেই" : q.options[userAns];
        let boxColor = userAns === correctAns ? "#d4edda" : "#f8d7da";

        resultHTML += `
            <div style="
                margin-bottom:15px;
                padding:10px;
                border-radius:6px;
                background:${boxColor};
            ">
                <strong>${index + 1}. ${q.question}</strong><br>
                ➡️ আপনার উত্তর: ${ansText}<br>
                ✔️ সঠিক উত্তর: ${q.options[correctAns]}<br>
                🧠 ব্যাখ্যা: <em>${q.explanation}</em>
            </div>
        `;
    });

    resultHTML += `</div>`;
    document.getElementById("examMain").innerHTML = resultHTML;
}
