// ==================== exam.js ====================

// -------------------- Global Variables --------------------
let examStartTime;
let userAnswers = [];
let timerInterval;
let studentName = "";
let totalTime = 25 * 60; // 25 মিনিট

// -------------------- Login Validation --------------------
function validateAccess() {
    const name = document.getElementById("studentName").value.trim();
    const code = document.getElementById("accessCode").value.trim();
    const warning = document.getElementById("warning");

    if (!name) {
        warning.innerText = "নাম লিখুন";
        return;
    }

    let examId = getActiveExamId();
    const validCodes = EXAM_STATUS[examId].codes || [];

    if (!validCodes.includes(code)) {
        warning.innerText = "❌ ভুল এক্সেস কোড";
        return;
    }

    studentName = name;
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("examMain").style.display = "block";

    initExam(examId);
}

// -------------------- Exam ID --------------------
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
        if (!QUESTIONS || QUESTIONS.length === 0) {
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

    QUESTIONS.forEach((q, i) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `<h4>${i + 1}. ${q.question}</h4>
            ${q.options.map((opt, idx) =>
                `<button onclick="selectAnswer(${i}, ${idx}, this)">${opt}</button>`
            ).join("<br>")}
        `;
        container.appendChild(div);
    });

    // **HTML-এ থাকা Submit Button ব্যবহার হবে, JS থেকে আর তৈরি হবে না**
}

// -------------------- Select Answer --------------------
function selectAnswer(qIndex, optIndex, btn) {
    if (userAnswers[qIndex] !== undefined) return;

    userAnswers[qIndex] = optIndex;

    const buttons = btn.parentElement.querySelectorAll("button");
    buttons.forEach(b => b.disabled = true);
    btn.classList.add("selected");
}

// -------------------- Timer --------------------
function startTimer() {
    const timerBox = document.querySelector(".timer-box");
    const timeDisplay = document.getElementById("timeLeft");

    timerInterval = setInterval(() => {
        let minutes = Math.floor(totalTime / 60);
        let seconds = totalTime % 60;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timeDisplay.innerText = `${minutes}:${seconds}`;

        if (totalTime <= 300 && totalTime > 120) timerBox.classList.add("timer-warning");
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
async function submitExam() {
    clearInterval(timerInterval);

    const examEndTime = new Date();
    let correct = 0, wrong = 0, unanswered = 0;

    QUESTIONS.forEach((q, i) => {
        const ans = userAnswers[i];
        if (ans === undefined) unanswered++;
        else if (ans === q.answer) correct++;
        else wrong++;
    });

    const percent = Math.round((correct / QUESTIONS.length) * 100);
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

    // Save to Supabase
    try {
        const supabaseClient = supabase.createClient(
            "https://bpkheipwdjzlyuzyqdxz.supabase.co",
            "sb_publishable_xOzl8Ctl6AtJlR1i8g3bEw_veKboXz2"
        );
        await supabaseClient.from("exam_results").insert([resultObj]);
    } catch (err) {
        console.error("Supabase connection failed:", err);
    }

    renderScoreboard(resultObj);
}

// -------------------- Render Scoreboard --------------------
function renderScoreboard(resultObj) {
    let container = document.getElementById("examResultContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "examResultContainer";
        container.style.marginTop = "20px";
        container.style.padding = "20px";
        document.getElementById("examMain").appendChild(container);
    }

    let html = `<h2>📊 পরীক্ষার ফলাফল</h2>
    <div class="scoreboard-card">
        <strong>${resultObj.name}</strong><br>
        ✔️ সঠিক: ${resultObj.correct}<br>
        ❌ ভুল: ${resultObj.wrong}<br>
        ❓ উত্তর নেই: ${resultObj.unanswered}<br>
        📈 শতাংশ: ${resultObj.percent}%<br>
        🎯 ফলাফল: <strong>${resultObj.percent >= 40 ? 'PASS ✅' : 'FAIL ❌'}</strong>
    </div>
    <hr>
    <h3>📋 প্রশ্ন ও উত্তর ও ব্যাখ্যা</h3>`;

    QUESTIONS.forEach((q, i) => {
        const userAns = userAnswers[i];
        const correctAns = q.answer;
        const ansText = userAns === undefined ? "কোনও উত্তর নেই" : q.options[userAns];

        let bgColor = "#ffffff";
        if (userAns === undefined) bgColor = "#fff3cd"; // unanswered yellow
        else if (userAns === correctAns) bgColor = "#d4edda"; // correct green
        else bgColor = "#f8d7da"; // wrong red

        html += `
        <div class="review-card" style="background:${bgColor}; border-left:5px solid ${userAns === correctAns ? '#28a745' : '#dc3545'}">
            <strong>${i + 1}. ${q.question}</strong><br><br>
            ➡️ আপনার উত্তর: <b>${ansText}</b><br>
            ✔️ সঠিক উত্তর: <b style="color:#28a745">${q.options[correctAns]}</b><br>
            🧠 ব্যাখ্যা:<br>
            <i>${q.explanation}</i>
        </div>`;
    });

    container.innerHTML = html;
    container.scrollIntoView({ behavior: "smooth" });
}
