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
// -------------------- Submit Exam --------------------
function submitExam() {
    clearInterval(timerInterval);

    const studentName = document.getElementById("studentName").value;

    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    QUESTIONS.forEach((q, index) => {
        if (userAnswers[index] === undefined) {
            unanswered++;
        } else if (userAnswers[index] === q.answer) {
            correct++;
        } else {
            wrong++;
        }
    });

    let percent = ((correct / QUESTIONS.length) * 100).toFixed(2);

    const examMain = document.getElementById("examMain");

    examMain.innerHTML = `
        <div class="scoreboard-card">
          <h2>${studentName}</h2>
          <p>✔️ সঠিক: ${correct}</p>
          <p>❌ ভুল: ${wrong}</p>
          <p>❓ উত্তর দেয়নি: ${unanswered}</p>
          <h3>📊 শতাংশ: ${percent}%</h3>
        </div>
    `;

    QUESTIONS.forEach((q, index) => {
        const userAns = userAnswers[index];
        const correctAns = q.answer;

        let statusClass = "";
        if (userAns === undefined) {
            statusClass = "red";
        } else if (userAns === correctAns) {
            statusClass = "green";
        } else {
            statusClass = "red";
        }

        examMain.innerHTML += `
          <div class="review-card">
            <h4>${index + 1}: ${q.question}</h4>
            <p class="${statusClass}">
              ${userAns === undefined ? "উত্তর দেননি" : "উত্তর: " + q.options[userAns]}
            </p>
            <p style="color:green;">
              সঠিক উত্তর: ${q.options[correctAns]}
            </p>
            <p class="explanation">
              <strong>ব্যাখ্যা:</strong> ${q.explanation}
            </p>
          </div>
        `;
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    let examEndTime = new Date();

    allResults.push({
        name: studentName,
        correct,
        wrong,
        unanswered,
        percent,
        start: examStartTime,
        end: examEndTime
    });

    examMain.innerHTML += `
      <div style="margin-top:20px;">
        <button onclick="downloadAnswerSheetPDF()">📄 উত্তরপত্র (PDF) ডাউনলোড করুন</button>
        <button onclick="downloadAllResultsPDF()">📄 সকল ফলাফল (Admin)</button>
      </div>
    `;
}

// -------------------- Answer Sheet PDF --------------------
function downloadAnswerSheetPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.addFileToVFS("SolaimanLipi.ttf", solaimanLipiBase64);
    doc.addFont("SolaimanLipi.ttf", "SolaimanLipi", "normal");
    doc.setFont("SolaimanLipi");

    doc.setFontSize(14);
    doc.text("উত্তরপত্র", 10, 10);

    QUESTIONS.forEach((q, index) => {
        const userAns = userAnswers[index];
        const correctAns = q.answer;

        let ansText = userAns === undefined ? "উত্তর দেননি" : q.options[userAns];
        let y = 20 + index * 40;

        doc.text(`${index + 1}. ${q.question}`, 10, y);
        doc.text(`আপনার উত্তর: ${ansText}`, 10, y + 5);
        doc.text(`সঠিক উত্তর: ${q.options[correctAns]}`, 10, y + 10);
        doc.text(`ব্যাখ্যা: ${q.explanation}`, 10, y + 15);
    });

    doc.save("answer-sheet.pdf");
}

// -------------------- All Results PDF --------------------
function downloadAllResultsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.addFileToVFS("SolaimanLipi.ttf", solaimanLipiBase64);
    doc.addFont("SolaimanLipi.ttf", "SolaimanLipi", "normal");
    doc.setFont("SolaimanLipi");

    doc.setFontSize(14);
    doc.text("সকল পরীক্ষার্থীর ফলাফল", 10, 10);

    allResults.forEach((res, index) => {
        let y = 20 + index * 30;
        doc.text(`${index + 1}. ${res.name}`, 10, y);
        doc.text(`✔️ সঠিক: ${res.correct}`, 10, y + 5);
        doc.text(`❌ ভুল: ${res.wrong}`, 10, y + 10);
        doc.text(`❓ উত্তর দেয়নি: ${res.unanswered}`, 10, y + 15);
        doc.text(`📊 শতাংশ: ${res.percent}%`, 10, y + 20);
    });

    doc.save("all-results.pdf");
}
