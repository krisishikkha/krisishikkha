// Exam List Page Logic
class ExamListManager {
    constructor() {
        this.exams = EXAMS_REGISTRY;
        this.init();
    }

    init() {
        this.renderExamList();
    }

    renderExamList() {
        const examList = document.getElementById('examList');
        
        if (!this.exams || this.exams.length === 0) {
            examList.innerHTML = `
                <div style="text-align: center; padding: 40px; grid-column: 1/-1;">
                    <h3>No exams available at the moment</h3>
                    <p>পরীক্ষা পাওয়া যায়নি</p>
                </div>
            `;
            return;
        }

        examList.innerHTML = this.exams
            .filter(exam => exam.status === 'active')
            .map(exam => this.createExamCard(exam))
            .join('');

        // Add click handlers
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
                    <span>✅ ${exam.marksPerQuestion} mark/question</span>
                    ${exam.negativeMarking ? `<span>❌ -${exam.negativeMarks} for wrong</span>` : ''}
                </div>
                <button class="btn btn-primary start-exam-btn" data-exam-id="${exam.id}">
                    Start Exam / পরীক্ষা শুরু করুন
                </button>
            </div>
        `;
    }

    startExam(examId) {
        // Store exam ID in sessionStorage and redirect to exam page
        sessionStorage.setItem('selectedExamId', examId);
        window.location.href = 'exam.html';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ExamListManager();
});