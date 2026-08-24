// Main Exam Controller
class ExamController {
    constructor() {
        this.examId = null;
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
        // Get exam ID from session storage
        this.examId = sessionStorage.getItem('selectedExamId');
        
        if (!this.examId) {
            alert('No exam selected. Redirecting to exam list...');
            window.location.href = 'index.html';
            return;
        }

        // Load exam data
        await this.loadExamData();

        // Show student entry modal
        this.showStudentEntryModal();

        // Setup event listeners
        this.setupEventListeners();
    }

    async loadExamData() {
        // Load exam data dynamically
        try {
            // For demonstration, we'll use the global variable
            // In production, you might load this dynamically
            const examConfig = EXAMS_REGISTRY.find(e => e.id === this.examId);
            
            if (!examConfig) {
                throw new Error('Exam not found');
            }

            // Load exam questions based on exam ID
            switch(this.examId) {
                case 'bina-so-exam-1':
                    this.examData = EXAM_DATA_BINA_SO_1;
                    break;
                // Add other exams
                default:
                    this.examData = EXAM_DATA_BINA_SO_1; // Fallback
            }

            // Initialize answers object
            this.examData.questions.forEach(q => {
                this.answers[q.id] = {
                    answer: '',
                    isAnswered: false,
                    savedAt: null
                };
            });

        } catch (error) {
            console.error('Error loading exam:', error);
            alert('Error loading exam data');
            window.location.href = 'index.html';
        }
    }

    showStudentEntryModal() {
        const modal = document.getElementById('studentEntryModal');
        modal.classList.add('active');

        const form = document.getElementById('studentEntryForm');
        form.addEventListener('submit', (e) => this.handleStudentEntry(e));
    }

    async handleStudentEntry(e) {
        e.preventDefault();

        const nameInput = document.getElementById('studentName');
        const codeInput = document.getElementById('accessCode');

        this.studentName = nameInput.value.trim();
        const accessCode = codeInput.value.trim();

        // Validate access code
        if (ACCESS_CODES[this.examId] !== accessCode) {
            alert('Invalid access code! / ভুল এক্সেস কোড!');
            return;
        }

        // Check if student already attempted this exam
        const hasAttempted = await this.checkPreviousAttempt();
        
        if (hasAttempted) {
            alert('You have already attempted this exam! / আপনি ইতিমধ্যে এই পরীক্ষায় অংশ নিয়েছেন!');
            window.location.href = 'index.html';
            return;
        }

        // Start exam
        this.startExam();
    }

    async checkPreviousAttempt() {
        try {
            const { data, error } = await supabase
                .from('written_exam_submissions')
                .select('id')
                .eq('exam_id', this.examId)
                .eq('student_name', this.studentName)
                .limit(1);

            if (error) throw error;

            return data && data.length > 0;
        } catch (error) {
            console.error('Error checking previous attempt:', error);
            return false;
        }
    }

    startExam() {
        // Hide modal
        document.getElementById('studentEntryModal').classList.remove('active');

        // Show exam interface
        document.getElementById('examInterface').style.display = 'block';

        // Set exam title and student name
        document.getElementById('examTitle').textContent = this.examData.name;
        document.getElementById('studentNameDisplay').textContent = this.studentName;

        // Load first question
        this.loadQuestion(0);

        // Build question navigator
        this.buildQuestionNavigator();

        // Start timer
        this.startTimer();

        // Start auto-save
        this.startAutoSave();
    }

    startTimer() {
        this.timer = new ExamTimer(
            this.examData.duration,
            () => this.handleTimeUp(),
            (remaining) => this.handleTick(remaining)
        );
        this.timer.start();
    }

    handleTimeUp() {
        alert('Time is up! Submitting exam automatically...');
        this.submitExam();
    }

    handleTick(remaining) {
        // Update auto-save indicator based on remaining time
        if (remaining % 30 === 0) {
            this.autoSave();
        }
    }

    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            this.autoSave();
        }, APP_CONFIG.autoSaveInterval);
    }

    autoSave() {
        // Save to localStorage
        const saveData = {
            examId: this.examId,
            studentName: this.studentName,
            answers: this.answers,
            currentQuestion: this.currentQuestionIndex,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem(`exam_${this.examId}_${this.studentName}`, JSON.stringify(saveData));

        // Show auto-save indicator
        const indicator = document.getElementById('autoSaveStatus');
        indicator.textContent = 'Auto-saved ✓';
        indicator.style.opacity = '1';

        setTimeout(() => {
            indicator.style.opacity = '0.7';
        }, 2000);
    }

    loadQuestion(index) {
        this.currentQuestionIndex = index;
        const question = this.examData.questions[index];

        // Update question display
        document.getElementById('questionNumber').textContent = 
            `Question ${index + 1} of ${this.examData.questions.length}`;
        document.getElementById('questionMarks').textContent = 
            `Marks: ${question.marks}`;
        
        // Show both Bengali and English questions
        document.getElementById('questionText').innerHTML = `
            <div style="margin-bottom: 15px;">
                <strong>বাংলা:</strong> ${question.question}
            </div>
            <div>
                <strong>English:</strong> ${question.questionEnglish || question.question}
            </div>
        `;

        // Load saved answer if exists
        const savedAnswer = this.answers[question.id].answer;
        const answerInput = document.getElementById('answerInput');
        answerInput.value = savedAnswer;
        answerInput.disabled = true;

        // Update button states
        this.updateAnswerButtons();

        // Update navigator
        this.updateNavigator();

        // Update navigation buttons
        this.updateNavigationButtons();
    }

    updateAnswerButtons() {
        const answerInput = document.getElementById('answerInput');
        const editBtn = document.getElementById('editBtn');
        const tickBtn = document.getElementById('tickBtn');
        const answerStatus = document.getElementById('answerStatus');

        const question = this.examData.questions[this.currentQuestionIndex];
        const isAnswered = this.answers[question.id].isAnswered;

        if (isAnswered) {
            editBtn.style.display = 'inline-block';
            tickBtn.style.display = 'none';
            answerInput.disabled = true;
            answerStatus.textContent = '✓ Answer saved';
            answerStatus.className = 'answer-status saved';
            answerStatus.style.display = 'block';
        } else {
            editBtn.style.display = 'inline-block';
            tickBtn.style.display = 'none';
            answerInput.disabled = true;
            answerStatus.style.display = 'none';
        }
    }

    setupEventListeners() {
        // Edit button
        document.getElementById('editBtn').addEventListener('click', () => {
            const answerInput = document.getElementById('answerInput');
            const editBtn = document.getElementById('editBtn');
            const tickBtn = document.getElementById('tickBtn');

            answerInput.disabled = false;
            answerInput.focus();
            editBtn.style.display = 'none';
            tickBtn.style.display = 'inline-block';
        });

        // Tick button (save answer)
        document.getElementById('tickBtn').addEventListener('click', () => {
            this.saveCurrentAnswer();
        });

        // Answer input - Enter key to save
        document.getElementById('answerInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveCurrentAnswer();
            }
        });

        // Navigation buttons
        document.getElementById('prevBtn').addEventListener('click', () => {
            if (this.currentQuestionIndex > 0) {
                this.loadQuestion(this.currentQuestionIndex - 1);
            }
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            if (this.currentQuestionIndex < this.examData.questions.length - 1) {
                this.loadQuestion(this.currentQuestionIndex + 1);
            }
        });

        // Submit button
        document.getElementById('submitBtn').addEventListener('click', () => {
            this.showSubmitConfirmation();
        });

        // Submit modal buttons
        document.getElementById('cancelSubmit').addEventListener('click', () => {
            document.getElementById('submitModal').classList.remove('active');
        });

        document.getElementById('confirmSubmit').addEventListener('click', () => {
            this.submitExam();
        });
    }

    saveCurrentAnswer() {
        const question = this.examData.questions[this.currentQuestionIndex];
        const answerInput = document.getElementById('answerInput');
        const answer = answerInput.value.trim();

        this.answers[question.id] = {
            answer: answer,
            isAnswered: answer !== '',
            savedAt: new Date().toISOString()
        };

        // Update UI
        this.updateAnswerButtons();
        this.updateNavigator();

        // Auto-save
        this.autoSave();
    }

    buildQuestionNavigator() {
        const grid = document.getElementById('questionGrid');
        grid.innerHTML = '';

        this.examData.questions.forEach((question, index) => {
            const btn = document.createElement('button');
            btn.className = 'question-btn';
            btn.textContent = index + 1;
            btn.dataset.questionIndex = index;

            btn.addEventListener('click', () => {
                this.loadQuestion(index);
            });

            grid.appendChild(btn);
        });
    }

    updateNavigator() {
        const buttons = document.querySelectorAll('.question-btn');
        
        buttons.forEach((btn, index) => {
            const question = this.examData.questions[index];
            btn.classList.remove('current', 'answered', 'unanswered');

            if (index === this.currentQuestionIndex) {
                btn.classList.add('current');
            } else if (this.answers[question.id].isAnswered) {
                btn.classList.add('answered');
            } else {
                btn.classList.add('unanswered');
            }
        });
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        prevBtn.disabled = this.currentQuestionIndex === 0;
        nextBtn.disabled = this.currentQuestionIndex === this.examData.questions.length - 1;
    }

    showSubmitConfirmation() {
        const answered = Object.values(this.answers).filter(a => a.isAnswered).length;
        const unanswered = this.examData.questions.length - answered;

        document.getElementById('submitSummary').innerHTML = `
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Total Questions:</strong> ${this.examData.questions.length}</p>
                <p><strong>Answered:</strong> ${answered}</p>
                <p><strong>Not Answered:</strong> ${unanswered}</p>
            </div>
        `;

        document.getElementById('submitModal').classList.add('active');
    }

    async submitExam() {
        if (this.isSubmitted) return;

        this.isSubmitted = true;

        // Stop timer
        if (this.timer) {
            this.timer.stop();
        }

        // Stop auto-save
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }

        // Calculate results
        const results = this.calculateResults();

        // Save to Supabase
        await this.saveToSupabase(results);

        // Store results in sessionStorage
        sessionStorage.setItem('examResults', JSON.stringify({
            examId: this.examId,
            examName: this.examData.name,
            studentName: this.studentName,
            results: results,
            answers: this.answers,
            questions: this.examData.questions
        }));

        // Redirect to results page
        window.location.href = 'result.html';
    }

    calculateResults() {
        let correct = 0;
        let wrong = 0;
        let skipped = 0;
        let answered = 0;

        const questionResults = {};

        this.examData.questions.forEach(question => {
            const userAnswer = this.answers[question.id];

            if (!userAnswer.isAnswered || userAnswer.answer === '') {
                skipped++;
                questionResults[question.id] = {
                    status: 'skipped',
                    userAnswer: '',
                    correctAnswer: question.correctAnswer,
                    isCorrect: false
                };
            } else {
                answered++;
                const checkResult = this.answerChecker.checkAnswer(
                    userAnswer.answer,
                    question.acceptedAnswers
                );

                if (checkResult.isCorrect) {
                    correct++;
                    questionResults[question.id] = {
                        status: 'correct',
                        userAnswer: userAnswer.answer,
                        correctAnswer: question.correctAnswer,
                        isCorrect: true
                    };
                } else {
                    wrong++;
                    questionResults[question.id] = {
                        status: 'wrong',
                        userAnswer: userAnswer.answer,
                        correctAnswer: question.correctAnswer,
                        isCorrect: false
                    };
                }
            }
        });

        const totalMarks = this.examData.questions.length * this.examData.marksPerQuestion;
        const obtainedMarks = correct * this.examData.marksPerQuestion - 
                             (this.examData.negativeMarks ? wrong * this.examData.negativeMarks : 0);
        const percentage = ((obtainedMarks / totalMarks) * 100).toFixed(2);

        return {
            totalQuestions: this.examData.questions.length,
            answered,
            correct,
            wrong,
            skipped,
            totalMarks,
            obtainedMarks: Math.max(0, obtainedMarks),
            percentage: Math.max(0, percentage),
            questionResults
        };
    }

    async saveToSupabase(results) {
        try {
            const { data, error } = await supabase
                .from('written_exam_submissions')
                .insert([{
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
                    percentage: parseFloat(results.percentage),
                    submitted_at: new Date().toISOString()
                }]);

            if (error) throw error;

            console.log('Results saved successfully');

            // Clear localStorage
            localStorage.removeItem(`exam_${this.examId}_${this.studentName}`);

        } catch (error) {
            console.error('Error saving to Supabase:', error);
            alert('Error saving results. Please contact admin.');
        }
    }
}

// Initialize exam when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Load exam data file first
    const examId = sessionStorage.getItem('selectedExamId');
    if (examId) {
        const script = document.createElement('script');
        script.src = `data/${examId}.js`;
        script.onload = () => {
            new ExamController();
        };
        script.onerror = () => {
            // If specific file not found, continue anyway
            new ExamController();
        };
        document.head.appendChild(script);
    }
});