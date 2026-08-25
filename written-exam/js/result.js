// written-exam/js/result.js

function renderResult() {
    const saved = localStorage.getItem('we_last_result');
    const box = document.getElementById('resultBox');

    if (!saved) {
        box.innerHTML = '<p class="we-empty">কোনো result পাওয়া যায়নি। অনুগ্রহ করে exam list থেকে আবার চেষ্টা করুন।</p>';
        document.getElementById('reviewLink').style.display = 'none';
        return;
    }

    let result;
    try {
        result = JSON.parse(saved);
    } catch (e) {
        box.innerHTML = '<p class="we-empty">Result data corrupted। অনুগ্রহ করে আবার চেষ্টা করুন।</p>';
        document.getElementById('reviewLink').style.display = 'none';
        return;
    }

    document.getElementById('resultExamName').textContent = result.exam_name || 'Result';

    box.innerHTML = `
        <p class="we-result-name">Name: <strong>${result.student_name}</strong></p>

        <div class="we-result-grid">
            <div class="we-result-item">
                <span class="we-result-label">Total Questions</span>
                <span class="we-result-value">${result.total_questions}</span>
            </div>
            <div class="we-result-item">
                <span class="we-result-label">Answered</span>
                <span class="we-result-value">${result.answered}</span>
            </div>
            <div class="we-result-item we-result-correct">
                <span class="we-result-label">Correct</span>
                <span class="we-result-value">${result.correct}</span>
            </div>
            <div class="we-result-item we-result-wrong">
                <span class="we-result-label">Wrong</span>
                <span class="we-result-value">${result.wrong}</span>
            </div>
            <div class="we-result-item">
                <span class="we-result-label">Not Answered</span>
                <span class="we-result-value">${result.skipped}</span>
            </div>
        </div>

        <div class="we-result-summary">
            <p>Total Marks: <strong>${result.total_marks}</strong></p>
            <p>Obtained Marks: <strong>${result.obtained_marks}</strong></p>
            <p class="we-result-percentage">Percentage: <strong>${result.percentage}%</strong></p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', renderResult);