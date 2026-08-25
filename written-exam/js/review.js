// written-exam/js/review.js

function renderReview() {
    const saved = localStorage.getItem('we_last_result');
    const listEl = document.getElementById('reviewList');
    const summaryEl = document.getElementById('reviewSummary');

    if (!saved) {
        listEl.innerHTML = '<p class="we-empty">কোনো review data পাওয়া যায়নি।</p>';
        return;
    }

    let result;
    try {
        result = JSON.parse(saved);
    } catch (e) {
        listEl.innerHTML = '<p class="we-empty">Data corrupted।</p>';
        return;
    }

    document.getElementById('reviewExamName').textContent = result.exam_name || 'Review';

    summaryEl.innerHTML = `
        <p>Correct: <strong class="we-text-correct">${result.correct}</strong> &nbsp;|&nbsp;
           Wrong: <strong class="we-text-wrong">${result.wrong}</strong> &nbsp;|&nbsp;
           Not Answered: <strong>${result.skipped}</strong></p>
    `;

    if (!Array.isArray(result.answers) || result.answers.length === 0) { // <--- 'answers_detail' বদলে 'answers' করা হয়েছে
        listEl.innerHTML = '<p class="we-empty">Question-wise review data পাওয়া যায়নি।</p>';
        return;
    }

    listEl.innerHTML = '';

    result.answers.forEach((item, index) => { // <--- 'answers_detail' বদলে 'answers' করা হয়েছে
        const statusClass =
            item.status === 'correct' ? 'we-review-correct' :
            item.status === 'wrong' ? 'we-review-wrong' : 'we-review-skipped';

        const statusLabel =
            item.status === 'correct' ? `Correct — ${item.marks_obtained}/${item.marks_obtained > 0 ? item.marks_obtained : ''}` :
            item.status === 'wrong' ? `Wrong — ${item.marks_obtained}` :
            'Not Answered — 0';

        const block = document.createElement('div');
        block.className = `we-review-block ${statusClass}`;
        block.innerHTML = `
            <p class="we-review-qnum">প্রশ্ন ${index + 1}</p>
            <p class="we-review-question">${item.question}</p>
            <p class="we-review-your-answer">Your Answer: <strong>${item.student_answer || '(ফাঁকা)'}</strong></p>
            <p class="we-review-correct-answer">Correct Answer: <strong>${item.correct_answer}</strong></p>
            ${item.explanation ? `<p class="we-review-explanation">💡 Explanation: ${item.explanation}</p>` : ''}
            <p class="we-review-status">${statusLabel}</p>
        `;
        listEl.appendChild(block);
    });
}

document.addEventListener('DOMContentLoaded', renderReview);
