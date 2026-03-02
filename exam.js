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

const validCodes = EXAM_STATUS[examId].codes || [];

if (!validCodes.includes(code)) {
    warning.innerText = "❌ ভুল এক্সেস কোড";
    return;
}

  document.getElementById("loginSection").style.display = "none";
  document.getElementById("examMain").style.display = "block";

  initExam();
}

function initExam() {
    // পরীক্ষার শুরু সময় সেট করো
    examStartTime = new Date();

    // URL থেকে examId বের করো
    const params = new URLSearchParams(window.location.search);
    const examId = params.get("exam");

    // যদি examId ভুল হয়
    if (!examId || !EXAM_STATUS[examId]) {
        document.body.innerHTML = "<h2>Invalid Exam ID</h2>";
        return;
    }

    // যদি এক্সাম লাইভ না থাকে
    if (EXAM_STATUS[examId].status !== "live") {
        document.body.innerHTML = "<h2>Exam Locked</h2>";
        return;
    }

    // শিরোনাম দেখাও
    document.getElementById("examTitle").innerText = EXAM_STATUS[examId].title;

    // প্রশ্ন লোড করো
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
    div.classList.add("card");  // 👈 এইখানে বসাবি
    div.innerHTML = `
      <h4>${index + 1}. ${q.question}</h4>
      ${q.options.map((opt, i) =>
        `<button onclick="selectAnswer(${index}, ${i}, this)">
            ${opt}
         </button><br>`
      ).join("")}
      <br>
    `;

    container.appendChild(div);
  });
}

function selectAnswer(qIndex, optIndex, btn) {

  // আগে যদি ওই প্রশ্নের উত্তর দেওয়া থাকে, তাহলে আর কিছু করবে না
  if (userAnswers[qIndex] !== undefined) return;

  // উত্তর সেভ কর
  userAnswers[qIndex] = optIndex;

  // শুধু ওই প্রশ্নের বাটনগুলো নাও
  const buttons = btn.parentElement.querySelectorAll("button");

  // সব বাটন disable কর
  buttons.forEach(function(b) {
    b.disabled = true;
  });

  // যেটা ক্লিক করা হয়েছে সেটাতে selected class যোগ কর
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

    // Last 5 minutes
    if (totalTime <= 300 && totalTime > 120) {
      timerBox.classList.add("timer-warning");
    }

    // Last 2 minutes
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
        <p>⏺️ উত্তর দেননি: ${unanswered}</p>
        <h3 style="margin-top:10px;">📊 শতাংশ: ${percent}%</h3>
    </div>
    `;

    // Review Section
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
            <h4>প্রশ্ন ${index + 1}: ${q.question}</h4>
            <p class="${statusClass}">
                আপনার উত্তর: ${userAns !== undefined ? q.options[userAns] : "উত্তর দেননি"}
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

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // জমা দেওয়ার সময় বের করো
    let examEndTime = new Date();

    // Individual PDF (পরীক্ষার্থীর জন্য)
    downloadScoreboardPDF(studentName, correct, wrong, unanswered, percent, examStartTime, examEndTime);

    // অ্যাডমিনের জন্য সব ফলাফল জমা করো
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

// Helper function সময় ফরম্যাট করার জন্য
function formatDateTime(dateObj) {
    return dateObj.toLocaleString("bn-BD", {
        dateStyle: "medium",
        timeStyle: "short"
    });
}

// Individual PDF
function downloadScoreboardPDF(studentName, correct, wrong, unanswered, percent, examStartTime, examEndTime) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Exam Scoreboard", 20, 20);

    doc.setFontSize(14);
    doc.text(`👤 নাম: ${studentName}`, 20, 40);
    doc.text(`✔️ সঠিক: ${correct}`, 20, 55);
    doc.text(`❌ ভুল: ${wrong}`, 20, 70);
    doc.text(`⏺️ উত্তর দেননি: ${unanswered}`, 20, 85);
    doc.text(`📊 শতাংশ: ${percent}%`, 20, 100);

    doc.text(`🕒 শুরু: ${formatDateTime(examStartTime)}`, 20, 115);
    doc.text(`🕒 জমা: ${formatDateTime(examEndTime)}`, 20, 130);

    doc.save(`${studentName}_Scoreboard.pdf`);
}

// Admin PDF (সব পরীক্ষার্থীর ফলাফল)
function downloadAllResultsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("All Exam Results", 20, 20);

    let startY = 40;
    doc.setFontSize(12);
    doc.text("নাম", 20, startY);
    doc.text("সঠিক", 60, startY);
    doc.text("ভুল", 80, startY);
    doc.text("শতাংশ", 100, startY);
    doc.text("শুরু সময়", 130, startY);
    doc.text("জমা সময়", 170, startY);

    startY += 10;

    allResults.forEach(result => {
        doc.text(result.name, 20, startY);
        doc.text(String(result.correct), 60, startY);
        doc.text(String(result.wrong), 80, startY);
        doc.text(result.percent + "%", 100, startY);
        doc.text(formatDateTime(result.start), 130, startY);
        doc.text(formatDateTime(result.end), 170, startY);
        startY += 10;
    });

    doc.save("All_Results.pdf");
}
