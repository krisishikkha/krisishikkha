/* ===========================
   ANSWER TOGGLE FUNCTIONALITY
   =========================== */

// Toggle single answer
function toggleAnswer(questionId) {
  const answerSection = document.getElementById(`answer-${questionId}`);
  const button = event.target;
  
  if (!answerSection) return;
  
  const isShowing = answerSection.classList.contains('show');
  
  if (isShowing) {
    // Hide answer
    answerSection.classList.remove('show');
    button.textContent = '👁️ উত্তর দেখুন';
    button.style.background = '#2e7d32';
  } else {
    // Show answer
    answerSection.classList.add('show');
    button.textContent = '🙈 উত্তর লুকান';
    button.style.background = '#1565c0';
  }
}

// Show all answers
function showAllAnswers() {
  const allAnswers = document.querySelectorAll('.answer-section');
  const allButtons = document.querySelectorAll('.toggle-answer-btn');
  
  allAnswers.forEach(answer => {
    answer.classList.add('show');
  });
  
  allButtons.forEach(btn => {
    btn.textContent = '🙈 উত্তর লুকান';
    btn.style.background = '#1565c0';
  });
}

// Hide all answers
function hideAllAnswers() {
  const allAnswers = document.querySelectorAll('.answer-section');
  const allButtons = document.querySelectorAll('.toggle-answer-btn');
  
  allAnswers.forEach(answer => {
    answer.classList.remove('show');
  });
  
  allButtons.forEach(btn => {
    btn.textContent = '👁️ উত্তর দেখুন';
    btn.style.background = '#2e7d32';
  });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Alt + S = Show All
  if (e.altKey && e.key === 's') {
    e.preventDefault();
    showAllAnswers();
  }
  
  // Alt + H = Hide All
  if (e.altKey && e.key === 'h') {
    e.preventDefault();
    hideAllAnswers();
  }
});
