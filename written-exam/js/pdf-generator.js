// written-exam/js/pdf-generator.js

function populatePdfExamSelect() {
    const select = document.getElementById('pdfExamSelect');
    select.innerHTML = '';
    EXAMS_REGISTRY.forEach(entry => {
        const opt = document.createElement('option');
        opt.value = entry.id;
        opt.textContent = entry.title;
        select.appendChild(opt);
    });
}

async function generateQuestionAnswerPdf() {
    const statusEl = document.getElementById('pdfStatus');
    statusEl.style.display = 'none';

    const examId = document.getElementById('pdfExamSelect').value;
    const entry = EXAMS_REGISTRY.find(e => e.id === examId);

    if (!entry) {
        statusEl.textContent = 'Exam পাওয়া যায়নি।';
        statusEl.style.display = 'block';
        return;
    }

    const examData = window[entry.dataVar];
    if (!examData || !Array.isArray(examData.questions) || examData.questions.length === 0) {
        statusEl.textContent = 'এই Exam-এর প্রশ্ন ডেটা পাওয়া যায়নি।';
        statusEl.style.display = 'block';
        return;
    }

    const btn = document.getElementById('downloadQPdfBtn');
    btn.disabled = true;
    btn.textContent = 'Generating...';

    const rowsHtml = examData.questions.map((q, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${q.question}</td>
            <td>${q.acceptedAnswers.join(' / ')}</td>
            <td>${q.marks}</td>
        </tr>
    `).join('');

    const renderArea = document.createElement('div');
    renderArea.className = 'we-pdf-render-area';
    renderArea.innerHTML = `
        <h2>${examData.title}</h2>
        <p class="we-pdf-meta">Total Questions: ${examData.questions.length} | Total Marks: ${examData.totalMarks}</p>
        <table>
            <thead><tr><th>#</th><th>Question</th><th>Accepted Answer(s)</th><th>Marks</th></tr></thead>
            <tbody>${rowsHtml}</tbody>
        </table>
    `;
    document.body.appendChild(renderArea);

    if (document.fonts && document.fonts.ready) {
        await document.fonts.ready; // ফন্ট লোড নিশ্চিত হওয়ার পর ক্যাপচার
    }

    try {
        const canvas = await html2canvas(renderArea, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'pt', 'a4');
        await canvasToMultiPagePdf(canvas, doc);
        doc.save(`${examData.title.replace(/\s+/g, '_')}_Q_and_A.pdf`);
    } catch (err) {
        console.error(err);
        statusEl.textContent = 'PDF তৈরি করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।';
        statusEl.style.display = 'block';
    } finally {
        document.body.removeChild(renderArea);
        btn.disabled = false;
        btn.textContent = 'Download PDF';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    populatePdfExamSelect();
    document.getElementById('downloadQPdfBtn').addEventListener('click', generateQuestionAnswerPdf);
});