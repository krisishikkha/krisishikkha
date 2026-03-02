let examStartTime;
let allResults = [];
let userAnswers = [];
let timerInterval;

function validateAccess() {
    const name = document.getElementById("studentName").value.trim();
    const code = document.getElementById("accessCode").value.trim();
    const warning = document.getElementById("warning");

    if (name === "") {
        warning.innerText = "নাম লিখুন";
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const examId = params.get("exam");

    const validCodes = (EXAM_STATUS[examId].codes || []);

    if (!validCodes.includes(code)) {
        warning.innerText = "❌ ভুল এক্সেস কোড";
        return;
    }

    document.getElementById("loginSection").style.display = "none";
    document.getElementById("examMain").style.display = "block";

    initExam();
}

function initExam() {
    examStartTime = new Date();

    const params = new URLSearchParams(window.location.search);
    const examId = params.get("exam");

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
          <h2 style="font-size:22px; margin-bottom:10px;">${studentName}</h2>
          <p>✔️ সঠিক: ${correct}</p>
          <p>❌ ভুল: ${wrong}</p>
          <p>❓ উত্তর দেয়নি: ${unanswered}</p>
          <h3 style="margin-top:10px;">📊 শতাংশ: ${percent}%</h3>
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
}

function downloadAllResultsPDF() {
    const { jsPDF } = window.jspdf; // ✅ সঠিকভাবে jsPDF ইনিশিয়ালাইজ
    const doc = new jsPDF();

    const params = new URLSearchParams(window.location.search);
    const examId = params.get("exam") || "Exam";
    const examTitle = EXAM_STATUS[examId]?.title || examId;

    doc.setFontSize(22);
    doc.text("Result Sheet", 105, 20, { align: "center" });

    doc.setFontSize(18);
    doc.text("Agriculture Teacher Registration Exam 2026", 105, 30, { align: "center" });

    doc.setFontSize(14);
    doc.text(`Exam: ${examTitle}`, 105, 40, { align: "center" });

    let startY = 60;
    doc.setFontSize(12);
    doc.text("Name", 20, startY);
    doc.text("Correct", 60, startY);
    doc.text("Wrong", 80, startY);
    doc.text("Unanswered", 100, startY);
    doc.text("Percent", 130, startY);
    doc.text("Start Time", 160, startY);
    doc.text("End Time", 190, startY);

    allResults.sort((a, b) => b.percent - a.percent);

    allResults.forEach(result => {
        startY += 10;
        doc.text(result.name, 20, startY);
        doc.text(String(result.correct), 60, startY);
        doc.text(String(result.wrong), 80, startY);
        doc.text(String(result.unanswered), 100, startY);
        doc.text(result.percent + "%", 130, startY);
        doc.text(formatDateTime(result.start), 160, startY);
        doc.text(formatDateTime(result.end), 190, startY);
    });

    doc.save((examId || "Exam") + "_All_Results.pdf"); // ✅ fallback নাম
}

function formatDateTime(dateTime) {
    const d = new Date(dateTime);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hour = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hour}:${minutes}`;
}
