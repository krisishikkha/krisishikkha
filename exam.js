// -------------------- Global Variables --------------------
let examStartTime;
let allResults = [];
let userAnswers = [];
let timerInterval;

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
        renderQuestions();
        startTimer();
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

function submitExam() {
    // অটো স্ক্রল করে উপরে যাবে
    window.scrollTo({ top: 0, behavior: "smooth" });

    let examEndTime = new Date();

    // ফলাফল লিস্টে যোগ করা
    allResults.push({
        name: studentName,
        correct,
        wrong,
        unanswered,
        percent,
        start: examStartTime,
        end: examEndTime
    });

    // স্কোরবোর্ড তৈরি
    let resultHTML = `
        <h2>✅ পরীক্ষার ফলাফল</h2>
        <p>✔️ সঠিক: ${correct}</p>
        <p>❌ ভুল: ${wrong}</p>
        <p>❓ উত্তর নেই: ${unanswered}</p>
        <p>📊 শতাংশ: ${percent}%</p>
        <hr>
        <h2>📋 উত্তরপত্র</h2>
    `;

    // প্রতিটি প্রশ্নের উত্তর ও ব্যাখ্যা দেখানো
    QUESTIONS.forEach((q, index) => {
        const userAns = userAnswers[index];
        const correctAns = q.answer;
        let ansText = userAns === undefined ? "কোনও উত্তর নেই" : q.options[userAns];

        resultHTML += `
            <div style="margin-bottom:15px; padding:10px; border:1px solid #ccc;">
                <strong>${index + 1}. ${q.question}</strong><br>
                ➡️ আপনার উত্তর: ${ansText}<br>
                ✔️ সঠিক উত্তর: ${q.options[correctAns]}<br>
                🧠 ব্যাখ্যা: <em>${q.explanation}</em>
            </div>
        `;
    });

    // সবশেষে ডাউনলোড বাটন
    resultHTML += `
        <div style="margin-top:20px;">
            <button onclick="downloadAnswerSheetPDF()">📄 উত্তরপত্র (PDF) ডাউনলোড</button>
            <button onclick="downloadAllResultsPDF()">📊 সমস্ত ফলাফল (Admin)</button>
        </div>
    `;

    document.getElementById("examMain").innerHTML = resultHTML;
}
function downloadAnswerSheetPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // বাংলা ফন্ট লোড (SolaimanLipi.js থেকে এসেছে)
    doc.setFont("SolaimanLipi_20-04-07", "normal");

    doc.setFontSize(14);
    doc.text("উত্তরপত্র", 10, 10);

    QUESTIONS.forEach((q, index) => {
        const userAns = userAnswers[index];
        const correctAns = q.answer;

        let ansText = userAns === undefined ? "কোনও উত্তর নেই" : q.options[userAns];
        let y = 20 + index * 40;

        doc.text(`${index + 1}. ${q.question}`, 10, y);
        doc.text(`➡️ আপনার উত্তর: ${ansText}`, 10, y + 5);
        doc.text(`✔️ সঠিক উত্তর: ${q.options[correctAns]}`, 10, y + 10);
        doc.text(`🧠 ব্যাখ্যা: ${q.explanation}`, 10, y + 15);
    });

    doc.save("answer-sheet.pdf");
                      }
function downloadAllResultsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // বাংলা ফন্ট লোড (SolaimanLipi.js থেকে এসেছে)
    doc.setFont("SolaimanLipi_20-04-07", "normal");

    doc.setFontSize(14);
    doc.text("সকল শিক্ষার্থীর ফলাফল", 10, 10);

    allResults.forEach((res, index) => {
        let y = 20 + index * 30;
        doc.text(`${index + 1}. ${res.name}`, 10, y);
        doc.text(`✔️ সঠিক: ${res.correct}`, 10, y + 5);
        doc.text(`❌ ভুল: ${res.wrong}`, 10, y + 10);
        doc.text(`❓ উত্তর নেই: ${res.unanswered}`, 10, y + 15);
        doc.text(`📊 শতাংশ: ${res.percent}%`, 10, y + 20);
    });

    doc.save("all-results.pdf");
}
