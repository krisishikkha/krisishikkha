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

function generateQuestionAnswerPdf() {
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

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(examData.title, 14, 15);
    doc.setFontSize(10);
    doc.text(`Total Questions: ${examData.questions.length}  |  Total Marks: ${examData.totalMarks}`, 14, 22);

    const rows = examData.questions.map((q, index) => [
        index + 1,
        q.question,
        q.acceptedAnswers.join(' / '),
        q.marks
    ]);

    doc.autoTable({
        startY: 28,
        head: [['#', 'Question', 'Accepted Answer(s)', 'Marks']],
        body: rows,
        styles: { fontSize: 9, cellWidth: 'wrap' },
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 90 },
            2: { cellWidth: 70 },
            3: { cellWidth: 15 }
        }
    });

    doc.save(`${examData.title.replace(/\s+/g, '_')}_Q_and_A.pdf`);
}

document.addEventListener('DOMContentLoaded', () => {
    populatePdfExamSelect();
    document.getElementById('downloadQPdfBtn').addEventListener('click', generateQuestionAnswerPdf);
});