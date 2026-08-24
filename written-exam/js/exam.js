class ExamController {
    constructor() {
        this.examId = sessionStorage.getItem('selectedExamId');
        this.examMeta = EXAM_REGISTRY.exams.find(e => e.id === this.examId);
        this.examData = null;
        this.currentQuestionIndex = 0;
        this.studentName = '';
        this.answers = {};
        this.timer = null;
        this.answerChecker = new AnswerChecker();
        this.autoSaveInterval = null;
        this.isSubmitted = false;
        this.init();
    }

    async init() {
        this.loadExamData();
        this.setupEventListeners();
    }

    loadExamData() {
        // 🔥 SMART AUTO-LOADING - কোন manual mapping লাগবে না!
        const varName = 'EXAM_DATA_' + this.examId.toUpperCase().replace(/-/g, '_');
        
        if (!window[varName]) {
            alert('Question data not loaded!');
            window.location.href = 'index.html';
            return;
        }

        this.examData = {
            ...this.examMeta,
            questions: window[varName].questions
        };

        this.examData.questions.forEach(q => {
            this.answers[q.id] = { answer: '', isAnswered: false };
        });
    }

    setupEventListeners() {
        document.getElementById('studentEntryForm').addEventListener('submit', (e) => this.handleStudentEntry(e));
        document.getElementById('editBtn').addEventListener('click', () => this.enableEdit());
        document.getElementById('tickBtn').addEventListener('click', () => this.saveAnswer());
        document.getElementById('answerInput').addEventListener('keypress', (e) => { if(e.key==='Enter') this.saveAnswer(); });
        document.getElementById('prevBtn').addEventListener('click', () => { if(this.currentQuestionIndex>0) this.loadQuestion(this.currentQuestionIndex-1); });
        document.getElementById('nextBtn').addEventListener('click', () => { if(this.currentQuestionIndex<this.examData.questions.length-1) this.loadQuestion(this.currentQuestionIndex+1); });
        document.getElementById('submitBtn').addEventListener('click', () => this.showSubmitModal());
        document.getElementById('cancelSubmit').addEventListener('click', () => document.getElementById('submitModal').classList.remove('active'));
        document.getElementById('confirmSubmit').addEventListener('click', () => this.submitExam());
    }

    async handleStudentEntry(e) {
        e.preventDefault();
        this.studentName = document.getElementById('studentName').value.trim();
        const code = document.getElementById('accessCode').value.trim();
        
        if (EXAM_REGISTRY.accessCodes[this.examId] !== code) {
            alert('Invalid access code!'); return;
        }

        const { data } = await supabase.from('written_exam_submissions').select('id').eq('exam_id', this.examId).eq('student_name', this.studentName).limit(1);
        if (data && data.length > 0) {
            alert('You already attempted this exam!'); 
            window.location.href = 'index.html'; 
            return;
        }

        this.startExam();
    }

    startExam() {
        document.getElementById('studentEntryModal').classList.remove('active');
        document.getElementById('examInterface').style.display = 'block';
        document.getElementById('examTitle').textContent = this.examData.name;
        document.getElementById('studentNameDisplay').textContent = this.studentName;
        this.buildNavigator();
        this.loadQuestion(0);
        this.timer = new ExamTimer(this.examData.duration, () => this.submitExam(), () => {});
        this.timer.start();
        this.autoSaveInterval = setInterval(() => this.autoSave(), 30000);
    }

    buildNavigator() {
        const grid = document.getElementById('questionGrid');
        grid.innerHTML = '';
        this.examData.questions.forEach((q, i) => {
            const btn = document.createElement('button');
            btn.className = 'question-btn unanswered';
            btn.textContent = i + 1;
            btn.onclick = () => this.loadQuestion(i);
            grid.appendChild(btn);
        });
    }

    loadQuestion(index) {
        this.currentQuestionIndex = index;
        const q = this.examData.questions[index];
        
        document.getElementById('questionNumber').textContent = `Question ${index+1} of ${this.examData.questions.length}`;
        document.getElementById('questionMarks').textContent = `Marks: ${q.marks}`;
        document.getElementById('questionText').innerHTML = `
            <div><strong>প্রশ্ন:</strong> ${q.question}</div>
            ${q.questionEnglish ? `<div style="color:#666;margin-top:10px;"><strong>Question:</strong> ${q.questionEnglish}</div>` : ''}
        `;

        const input = document.getElementById('answerInput');
        input.value = this.answers[q.id].answer;
        input.disabled = true;

        this.updateUI();
    }

    updateUI() {
        const q = this.examData.questions[this.currentQuestionIndex];
        const isAnswered = this.answers[q.id].isAnswered;
        
        document.getElementById('editBtn').style.display = 'inline-block';
        document.getElementById('tickBtn').style.display = 'none';
        document.getElementById('answerInput').disabled = true;
        document.getElementById('answerStatus').style.display = isAnswered ? 'block' : 'none';
        document.getElementById('answerStatus').textContent = isAnswered ? '✓ Saved' : '';
        document.getElementById('answerStatus').className = 'answer-status saved';

        document.querySelectorAll('.question-btn').forEach((btn, i) => {
            btn.classList.remove('current', 'answered', 'unanswered');
            if (i === this.currentQuestionIndex) btn.classList.add('current');
            else if (this.answers[this.examData.questions[i].id].isAnswered) btn.classList.add('answered');
            else btn.classList.add('unanswered');
        });

        document.getElementById('prevBtn').disabled = this.currentQuestionIndex === 0;
        document.getElementById('nextBtn').disabled = this.currentQuestionIndex === this.examData.questions.length - 1;
    }

    enableEdit() {
        document.getElementById('answerInput').disabled = false;
        document.getElementById('answerInput').focus();
        document.getElementById('editBtn').style.display = 'none';
        document.getElementById('tickBtn').style.display = 'inline-block';
    }

    saveAnswer() {
        const q = this.examData.questions[this.currentQuestionIndex];
        const answer = document.getElementById('answerInput').value.trim();
        this.answers[q.id] = { answer, isAnswered: answer !== '' };
        this.updateUI();
        this.autoSave();
    }

    autoSave() {
        localStorage.setItem(`exam_${this.examId}_${this.studentName}`, JSON.stringify({
            examId: this.examId, studentName: this.studentName, answers: this.answers, current: this.currentQuestionIndex
        }));
        document.getElementById('autoSaveStatus').textContent = '✓ Auto-saved';
    }

    showSubmitModal() {
        const answered = Object.values(this.answers).filter(a => a.isAnswered).length;
        document.getElementById('submitSummary').innerHTML = `
            <div style="background:#f3f4f6;padding:15px;border-radius:8px;">
                <p>Total: ${this.examData.questions.length}</p>
                <p>Answered: ${answered}</p>
                <p>Not Answered: ${this.examData.questions.length - answered}</p>
            </div>
        `;
        document.getElementById('submitModal').classList.add('active');
    }

    async submitExam() {
        if (this.isSubmitted) return;
        this.isSubmitted = true;
        
        if (this.timer) this.timer.stop();
        if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);

        const results = this.calculateResults();
        await this.saveResults(results);

        sessionStorage.setItem('examResults', JSON.stringify({
            examId: this.examId,
            examName: this.examData.name,
            studentName: this.studentName,
            results,
            answers: this.answers,
            questions: this.examData.questions
        }));

        window.location.href = 'result.html';
    }

    calculateResults() {
        let correct = 0, wrong = 0, skipped = 0, answered = 0;
        const questionResults = {};

        this.examData.questions.forEach(q => {
            const userAns = this.answers[q.id];
            if (!userAns.isAnswered) {
                skipped++;
                questionResults[q.id] = { status: 'skipped', userAnswer: '', correctAnswer: q.correctAnswer, isCorrect: false };
            } else {
                answered++;
                const check = this.answerChecker.checkAnswer(userAns.answer, q.acceptedAnswers);
                if (check.isCorrect) {
                    correct++;
                    questionResults[q.id] = { status: 'correct', userAnswer: userAns.answer, correctAnswer: q.correctAnswer, isCorrect: true };
                } else {
                    wrong++;
                    questionResults[q.id] = { status: 'wrong', userAnswer: userAns.answer, correctAnswer: q.correctAnswer, isCorrect: false };
                }
            }
        });

        const totalMarks = this.examData.questions.length * this.examData.marksPerQuestion;
        let obtained = correct * this.examData.marksPerQuestion - (this.examData.negativeMarking ? wrong * this.examData.negativeMarks : 0);
        obtained = Math.max(0, obtained);
        const percentage = ((obtained / totalMarks) * 100).toFixed(2);

        return { totalQuestions: this.examData.questions.length, answered, correct, wrong, skipped, totalMarks, obtainedMarks: parseFloat(obtained.toFixed(2)), percentage: parseFloat(percentage), questionResults };
    }

    async saveResults(results) {
        try {
            await supabase.from('written_exam_submissions').insert([{
                exam_id: this.examId,
                exam_name: this.examData.name,
                student_name: this.studentName,
                total_questions: results.totalQuestions,
                answered: results.answered,
                correct: results.correct,
                wrong: results.wrong,
                skipped: results.skipped,
                total_marks: results.totalMarks,
                obtained_marks: results.obtainedMarks,
                percentage: results.percentage
            }]);
            localStorage.removeItem(`exam_${this.examId}_${this.studentName}`);
        } catch (error) {
            console.error('Save error:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new ExamController());