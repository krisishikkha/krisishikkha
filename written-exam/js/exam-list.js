// written-exam/js/exam-list.js

function renderExamList() {
    const container = document.getElementById('examListContainer');

    if (!Array.isArray(EXAMS_REGISTRY) || EXAMS_REGISTRY.length === 0) {
        container.innerHTML = '<p class="we-empty">No exams available right now.</p>';
        return;
    }

    container.innerHTML = '';

    EXAMS_REGISTRY.forEach(entry => {
        const examData = window[entry.dataVar];

        if (!examData || !Array.isArray(examData.questions)) {
            console.error(`Exam data missing or invalid for: ${entry.dataVar}`);
            return; // এই exam skip, বাকিগুলো render হবে
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
        container.innerHTML = '<p class="we-empty">No valid exams found.</p>';
    }
}

document.addEventListener('DOMContentLoaded', renderExamList);