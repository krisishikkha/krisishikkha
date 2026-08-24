// Exam List Manager
class ExamListManager {
    constructor() {
        this.exams = [];
        this.init();
    }

    init() {
        this.loadExams();
        this.renderExamList();
    }

    loadExams() {
        // Get only active exams from registry
        if (typeof EXAM_REGISTRY !== 'undefined') {
            this.exams = EXAM_REGISTRY.exams.filter(exam => exam.status === 'active');
        } else {
            console.error('EXAM_REGISTRY not found!');
            this.exams = [];
        }
    }

    renderExamList() {
        const examList = document.getElementById('examList');
        
        if (!this.exams || this.exams.length === 0) {
            examList.innerHTML = `
                <div style="text-align: center; padding: 40px; grid-column: 1/-1;">
                    <h3>❌ No Active Exams Available</h3>
                    <p>কোন সক্রিয় পরীক্ষা পাওয়া যায়নি</p>
                </div>
            `;
            return;
        }

        examList.innerHTML = this.exams.map(exam => this.createExamCard(exam)).join('');

        // Add event listeners to all start buttons
        document.querySelectorAll('.start-exam-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const examId = e.target.dataset.examId;
                this.startExam(examId);
            });
        });
    }

    createExamCard(exam) {
        return `
            <div class="exam-card">
                <h3>${exam.name}</h3>
                <p>${exam.description}</p>
                <div class="exam-meta">
                    <span>📝 ${exam.totalQuestions} Questions</span>
                    <span>⏱️ ${exam.duration} Minutes</span>
                </div>
                <div class="exam-meta">
                    <span>✅ +${exam.marksPerQuestion} mark each</span>
                    ${exam.negativeMarking ? `<span>❌ -${exam.negativeMarks} for wrong</span>` : ''}
                </div>
                <button class="btn btn-primary start-exam-btn" data-exam-id="${exam.id}">
                    🚀 Start Exam / পরীক্ষা শুরু করুন
                </button>
            </div>
        `;
    }

    startExam(examId) {
        // Store selected exam ID in sessionStorage
        sessionStorage.setItem('selectedExamId', examId);
        
        // Redirect to exam page
        window.location.href = 'exam.html';
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ExamListManager();
});