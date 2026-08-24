class ExamListManager {
    constructor() {
        this.exams = [];
        this.init();
    }

    async init() {
        await this.loadExamDetails();
        this.renderExamList();
    }

    async loadExamDetails() {
        // Active exams load করুন
        const activeExams = EXAM_REGISTRY.exams.filter(e => e.status === 'active');
        
        // প্রতি exam এর জন্য question file থেকে info নিন
        for (let exam of activeExams) {
            try {
                // Question file dynamically load করুন
                await this.loadExamQuestionFile(exam.id);
                
                const varName = 'EXAM_DATA_' + exam.id.toUpperCase().replace(/-/g, '_');
                const examData = window[varName];
                
                if (examData) {
                    this.exams.push({
                        ...exam,
                        totalQuestions: examData.questions.length,  // automatic count
                        duration: examData.duration,
                        marksPerQuestion: examData.marksPerQuestion,
                        negativeMarking: examData.negativeMarking,
                        negativeMarks: examData.negativeMarks
                    });
                }
            } catch (error) {
                console.error('Error loading exam:', exam.id, error);
            }
        }
    }

    loadExamQuestionFile(examId) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `data/${examId}.js`;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load ' + examId));
            document.head.appendChild(script);
        });
    }

    renderExamList() {
        const examList = document.getElementById('examList');
        
        if (this.exams.length === 0) {
            examList.innerHTML = `
                <div style="text-align:center;padding:40px;grid-column:1/-1;">
                    <h3>No Active Exams</h3>
                    <p>কোন সক্রিয় পরীক্ষা নেই</p>
                </div>
            `;
            return;
        }

        examList.innerHTML = this.exams.map(exam => `
            <div class="exam-card">
                <h3>${exam.name}</h3>
                <p>${exam.description}</p>
                <div class="exam-meta">
                    <span>📝 ${exam.totalQuestions} Questions</span>
                    <span>⏱️ ${exam.duration} Minutes</span>
                </div>
                <div class="exam-meta">
                    <span>✅ +${exam.marksPerQuestion} each</span>
                    ${exam.negativeMarking ? `<span>❌ -${exam.negativeMarks} wrong</span>` : ''}
                </div>
                <button class="btn btn-primary start-exam-btn" onclick="window.startExam('${exam.id}')">
                    Start Exam
                </button>
            </div>
        `).join('');
    }
}

// Global function
window.startExam = function(examId) {
    sessionStorage.setItem('selectedExamId', examId);
    window.location.href = 'exam.html';
};

document.addEventListener('DOMContentLoaded', () => {
    new ExamListManager();
});