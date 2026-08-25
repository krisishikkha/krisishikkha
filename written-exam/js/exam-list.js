// written-exam/js/exam-list.js

function renderExamList() {
    const container = document.getElementById('examListContainer');

    if (typeof EXAMS_REGISTRY === 'undefined') {
        container.innerHTML = '<p class="we-error">Error: EXAMS_REGISTRY পাওয়া যায়নি।</p>';
        return;
    }

    if (!Array.isArray(EXAMS_REGISTRY) || EXAMS_REGISTRY.length === 0) {
        container.innerHTML = '<p class="we-empty">No exams available right now.</p>';
        return;
    }

    container.innerHTML = '';
    let debugMessages = [];

    EXAMS_REGISTRY.forEach(entry => {
        const examData = window[entry.dataVar];

        if (!examData) {
            debugMessages.push(`❌ "${entry.dataVar}" পাওয়া যায়নি (exam: ${entry.id})`);
            return;
        }
        if (!Array.isArray(examData.questions)) {
            debugMessages.push(`❌ "${entry.dataVar}"-এ questions array পাওয়া যায়নি (exam: ${entry.id})`);
            return;
        }

        const card = document.createElement('div');
        card.className = 'we-exam-card';
        card.innerHTML = `
            <h2 class="we-exam-title">${examData.title}</h2>
            <p class="we-exam-meta">${examData.questions.length} Questions | ${examData.totalMarks} Marks</p>
            <p class="we-exam-meta">Duration: ${examData.durationMinutes} minutes</p>
            <a href="exam.html?id=${examData.id}" class="we-btn we-btn-start">Start Exam</a>
        `;
        container.appendChild(card);
    });

    if (container.innerHTML === '') {
        container.innerHTML = '<p class="we-empty">No valid exams found.</p>' +
            '<div style="padding:10px;font-size:12px;color:#c00;text-align:left;">' +
            debugMessages.join('<br>') + '</div>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadExamDataFiles(renderExamList);
});