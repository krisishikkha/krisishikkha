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
    let visibleCount = 0;

    EXAMS_REGISTRY.forEach(entry => {
        const examData = window[entry.dataVar];
        if (!examData || !Array.isArray(examData.questions)) return;

        const status = examData.status || 'live'; // status না থাকলে ধরে নেবে live
        if (status === 'draft') return; // draft কখনো লিস্টে দেখাবে না

        visibleCount++;

        const badgeHtml = status === 'locked'
            ? '<span class="we-badge we-badge-locked">🔒 Locked</span>'
            : status === 'archive'
            ? '<span class="we-badge we-badge-archive">📦 Archived</span>'
            : '';

        const actionHtml = status === 'locked'
            ? `<button class="we-btn we-btn-start we-locked-btn" data-exam-title="${examData.title}">Start Exam</button>`
            : `<a href="exam.html?id=${examData.id}" class="we-btn we-btn-start">Start Exam</a>`;

        const card = document.createElement('div');
        card.className = 'we-exam-card';
        card.innerHTML = `
            <h2 class="we-exam-title">${examData.title} ${badgeHtml}</h2>
            <p class="we-exam-meta">${examData.questions.length} Questions | ${examData.totalMarks} Marks</p>
            <p class="we-exam-meta">Duration: ${examData.durationMinutes} minutes</p>
            ${actionHtml}
        `;
        container.appendChild(card);
    });

    if (visibleCount === 0) {
        container.innerHTML = '<p class="we-empty">No exams available right now.</p>';
    }

    // Locked বাটনগুলোতে click listener বসানো (render হওয়ার পর)
    document.querySelectorAll('.we-locked-btn').forEach(btn => {
        btn.addEventListener('click', () => showLockedModal(btn.getAttribute('data-exam-title')));
    });
}

function showLockedModal(examTitle) {
    document.getElementById('lockedModalText').textContent =
        `"${examTitle}" — আপনি যদি এই এক্সাম ব্যাচে ভর্তি হতে চান, তাহলে WhatsApp-এ যোগাযোগ করুন।`;

    const waLink = `https://wa.me/${ADMISSION_WHATSAPP_NUMBER}?text=${encodeURIComponent(ADMISSION_WHATSAPP_MESSAGE)}`;
    document.getElementById('lockedWhatsappBtn').href = waLink;

    document.getElementById('lockedModal').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
    loadExamDataFiles(renderExamList);

    document.getElementById('closeLockedModalBtn').addEventListener('click', () => {
        document.getElementById('lockedModal').style.display = 'none';
    });
});