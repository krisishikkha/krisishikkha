let examStartTime;
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
examStartTime = new Date(); // পরীক্ষার শুরুর সময় ধরে রাখো
    const params = new URLSearchParams(window.location.search);
    const examId = params.get("exam");
    ...
}
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

  document.getElementById("examTitle").innerText =
    EXAM_STATUS[examId].title;
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
        <p>✔️ সঠিকঃ ${correct}</p>
        <p>❌ ভুলঃ ${wrong}</p>
        <p>⏺️ উত্তর দেননিঃ ${unanswered}</p>
        <h3 style="margin-top:10px;">📊 শতাংশঃ ${percent}%</h3>
    </div>
    `;

    // Review Section
    QUESTIONS.forEach((q, index) => {
        const userAns = userAnswers[index];
        const correctAns = q.answer;

        let statusClass = "";
        let statusText = "";

        if (userAns === undefined) {
            statusClass = "red";
            statusText = "উত্তর দেননি";
        } else if (userAns === correctAns) {
            statusClass = "green";
            statusText = "সঠিক";
        } else {
            statusClass = "red";
            statusText = "ভুল";
        }

        examMain.innerHTML += `
        <div class="review-card">
            <h4>প্রশ্ন ${index + 1}: ${q.question}</h4>
            <p class="${statusClass}">
                আপনার উত্তরঃ ${userAns !== undefined ? q.options[userAns] : "উত্তর দেননি"}
            </p>
            <p style="color:green;">
                সঠিক উত্তরঃ ${q.options[correctAns]}
            </p>
            <p class="explanation">
                <strong>ব্যাখ্যাঃ</strong> ${q.explanation}
            </p>
        </div>
        `;
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // জমা দেওয়ার সময় বের করো
    let examEndTime = new Date();

    // PDF বানাও
    downloadScoreboardPDF(studentName, correct, wrong, unanswered, percent, examStartTime, examEndTime);
}
function downloadScoreboardPDF(studentName, correct, wrong, unanswered, percent) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Exam Scoreboard", 20, 20);

  doc.setFontSize(14);
  doc.text(`👤 নাম: ${studentName}`, 20, 40);
  doc.text(`✔️ সঠিক: ${correct}`, 20, 55);
  doc.text(`❌ ভুল: ${wrong}`, 20, 70);
  doc.text(`⏺️ অনুত্তরিত: ${unanswered}`, 20, 85);
  doc.text(`📊 শতাংশ: ${percent}%`, 20, 100);

  doc.save(`${studentName}_Scoreboard.pdf`);
}
