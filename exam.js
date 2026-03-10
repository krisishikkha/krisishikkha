// ==================== exam.js ====================

// -------------------- Global Variables --------------------
let examStartTime;
let timerInterval;
let userAnswers = [];
let studentName = "";
let allResults = JSON.parse(localStorage.getItem("krisishikkha_results") || "[]");

// -------------------- Helpers --------------------
function getActiveExamId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("exam") || "exam-1";
}

// -------------------- LOGIN --------------------
function validateAccess() {
    const nameInput = document.getElementById("studentName").value.trim();
    const codeInput = document.getElementById("accessCode").value.trim();

    if (!nameInput || !codeInput) {
        document.getElementById("warning").innerText = "নাম ও কোড অবশ্যই দিতে হবে।";
        return;
    }

    studentName = nameInput;
    document.getElementById("loginSection").style.display = "none";

    startExam();
}

// -------------------- EXAM --------------------
function startExam() {
    examStartTime = new Date();
    const examMain = document.getElementById("examMain");
    examMain.style.display = "block";

    renderQuestions();   // ✅ এখন questions show হবে
    startTimer(25 * 60); // 25 মিনিট
}

function renderQuestions() {
    const container = document.getElementById("examContainer");
    container.innerHTML = "";

    QUESTIONS.forEach((q, idx) => {
        const div = document.createElement("div");
        div.className = "question-box";
        div.style.marginBottom = "15px";

        let optionsHTML = "";
        q.options.forEach((opt, oidx) => {
            optionsHTML += `
                <label style="display:block; margin-left:15px;">
                    <input type="radio" name="q${idx}" value="${oidx}" onchange="userAnswers[${idx}] = ${oidx}">
                    ${opt}
                </label>
            `;
        });

        div.innerHTML = `
            <strong>${idx + 1}. ${q.question}</strong>
            <div>${optionsHTML}</div>
        `;
        container.appendChild(div);
    });
}

// -------------------- TIMER --------------------
function startTimer(seconds) {
    const display = document.getElementById("timeLeft");
    let remaining = seconds;

    function updateTimer() {
        const min = Math.floor(remaining / 60);
        const sec = remaining % 60;
        display.innerText = `${min.toString().padStart(2,"0")}:${sec.toString().padStart(2,"0")}`;

        if (remaining <= 0) {
            clearInterval(timerInterval);
            submitExam();
        }
        remaining--;
    }

    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
}

// -------------------- SUBMIT & SCOREBOARD --------------------
function submitExam() {
    clearInterval(timerInterval);
    const examEndTime = new Date();

    let correct = 0, wrong = 0, unanswered = 0;

    QUESTIONS.forEach((q, idx) => {
        const ans = userAnswers[idx];
        if (ans === undefined) {
            unanswered++;
        } else if (ans === q.answer) {
            correct++;
        } else {
            wrong++;
        }
    });

    const percent = Math.round((correct / QUESTIONS.length) * 100);
    const passMark = 40;
    const status = percent >= passMark ? "✅ PASS" : "❌ FAIL";

    // Save result
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
    allResults.push(resultObj);
    localStorage.setItem("krisishikkha_results", JSON.stringify(allResults));

    // Render scoreboard + questions + explanation
    renderScoreboard(resultObj);
}

function renderScoreboard(resultObj) {
    const examMain = document.getElementById("examMain");
    let html = `
        <div style="padding:20px;">
            <h2>📊 পরীক্ষার ফলাফল</h2>
            <div style="background:${resultObj.percent >= 40 ? '#d4edda' : '#f8d7da'}; padding:15px; border-radius:8px; margin-bottom:20px; font-size:18px;">
                <strong>${resultObj.name}</strong><br>
                ✔️ সঠিক: ${resultObj.correct}<br>
                ❌ ভুল: ${resultObj.wrong}<br>
                ❓ উত্তর নেই: ${resultObj.unanswered}<br>
                📈 শতাংশ: ${resultObj.percent}%<br>
                🎯 ফলাফল: <strong>${resultObj.percent >= 40 ? 'PASS ✅' : 'FAIL ❌'}</strong>
            </div>
            <hr>
            <h3>📋 প্রশ্ন ও উত্তর ও ব্যাখ্যা</h3>
    `;

    QUESTIONS.forEach((q, idx) => {
        const userAns = userAnswers[idx];
        const correctAns = q.answer;

        const userText = userAns === undefined ? "কোনও উত্তর নেই" : q.options[userAns];
        const correctText = q.options[correctAns];
        const bgColor = userAns === correctAns ? "#d4edda" : "#f8d7da";

        html += `
            <div style="margin-bottom:15px; padding:10px; border-radius:6px; background:${bgColor};">
                <strong>${idx + 1}. ${q.question}</strong><br>
                ➡️ আপনার উত্তর: ${userText}<br>
                ✔️ সঠিক উত্তর: ${correctText}<br>
                🧠 ব্যাখ্যা: <em>${q.explanation}</em>
            </div>
        `;
    });

    html += `</div>`;
    examMain.innerHTML = html;
    window.scrollTo({ top: 0, behavior: "auto" });
}
