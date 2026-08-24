// Main Exam Controller
class ExamController {
    constructor() {
        this.examId = sessionStorage.getItem('selectedExamId');
        this.examMeta = null;
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
        if (!this.examId) {
            alert('No exam selected!');
            window.location.href = 'index.html';
            return;
        }

        // Load exam data
        await this.loadExamData();

        // Show student entry modal
        this.showStudentEntryModal();

        // Setup all event listeners
        this.setupEventListeners();
    }

    async loadExamData() {
        try {
            // Get metadata from registry
            this.examMeta = EXAM_REGISTRY.exams.find(e => e.id === this.examId);
            
            if (!this.examMeta) {
                throw new Error('Exam metadata not found');
            }

            // Map exam ID to global variable
            const dataMap = {
                'bina-so-exam-1': window.EXAM_DATA_BINA_SO_1,
                'bina-so-exam-2': window.EXAM_DATA_BINA_SO_2,
                'bari-so-exam-3': window.EXAM_DATA_BARI_SO_3,
                'bsri-exam-4': window.EXAM_DATA_BSRI_4
            };

            const questionData = dataMap[this.examId];

            if (!questionData || !questionData.questions) {
                throw new Error('Question data not loaded');
            }

            // Merge metadata with questions
            this.examData = {
                ...this.examMeta,
                questions: questionData.questions
            };

            console.log('✅ Exam loaded:', this.examData.name);
            console.log('📝 Total questions:', this.examData.questions.length);

            // Initialize answers object
            this.examData.questions.forEach(q => {
                this.answers[q.id] = {
                    answer: '',
                    isAnswered: false,
                    savedAt: null
                };
            });

        } catch (error) {
            console.error('❌ Error loading exam:', error);
            alert('Error: ' + error.message);
            window.location.href = 'index.html';
        }
    }

    showStudentEntryModal() {
        const modal = document.getElementById('studentEntryModal');
        modal.classList.add('active');
    }

    setupEventListeners() {
        // Student entry form
        document.getElementById('studentEntryForm').addEventListener('submit', (e) => {
            this.handleStudentEntry(e);
        });

        // Edit button
        document.getElementById('editBtn').addEventListener('click', () => {
            this.enableAnswerInput();
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

        // Previous button
        document.getElementById('prevBtn').addEventListener('click', () => {
            if (this.currentQuestionIndex > 0) {
                this.loadQuestion(this.currentQuestionIndex - 1);
            }
        });

        // Next button
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

    async handleStudentEntry(e) {
        e.preventDefault();

        const nameInput = document.getElementById('studentName');
        const codeInput = document.getElementById('accessCode');

        this.studentName = nameInput.value.trim();
        const accessCode = codeInput.value.trim();

        // Validate access code
        const correctCode = EXAM_REGISTRY.accessCodes[this.examId];
        
        if (correctCode !== accessCode) {
            alert('❌ Invalid Access Code! / ভুল এক্সেস কোড!');
            codeInput.value = '';
            codeInput.focus();
            return;
        }

        // Check if student already attempted
        const hasAttempted = await this.checkPreviousAttempt();
        
        if (hasAttempted) {
            alert('⚠️ You have already attempted this exam!\nআপনি ইতিমধ্যে এই পরীক্ষায় অংশ নিয়েছেন!');
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

            if (error) {
                console.error('Supabase error:', error);
                return false;
            }

            return data && data.length > 0;

        } catch (error) {
            console.error('Error checking attempt:', error);
            return false;
        }
    }

    startExam() {
        // Hide entry modal
        document.getElementById('studentEntryModal').classList.remove('active');

        // Show exam interface
        document.getElementById('examInterface').style.display = 'block';

        // Set exam title and student name
        document.getElementById('examTitle').textContent = this.examData.name;
        document.getElementById('studentNameDisplay').textContent = '👤 ' + this.studentName;

        // Build question navigator
        this.buildQuestionNavigator();

        // Load first question
        this.loadQuestion(0);

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
        alert('⏰ Time is up! Exam will be submitted automatically.\nসময় শেষ! পরীক্ষা স্বয়ংক্রিয়ভাবে জমা হবে।');
        this.submitExam();
    }

    handleTick(remaining) {
        // Optional: Any action on each tick
    }

    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            this.autoSave();
        }, 30000); // Every 30 seconds
    }

    autoSave() {
        const saveData = {
            examId: this.examId,
            studentName: this.studentName,
            answers: this.answers,
            currentQuestion: this.currentQuestionIndex,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem(`exam_${this.examId}_${this.studentName}`, JSON.stringify(saveData));

        // Show indicator
        const indicator = document.getElementById('autoSaveStatus');
        indicator.textContent = '✓ Auto-saved';
        indicator.style.opacity = '1';

        setTimeout(() => {
            indicator.style.opacity = '0.7';
        }, 2000);
    }

    buildQuestionNavigator() {
        const grid = document.getElementById('questionGrid');
        grid.innerHTML = '';

        this.examData.questions.forEach((question, index) => {
            const btn = document.createElement('button');
            btn.className = 'question-btn unanswered';
            btn.textContent = index + 1;
            btn.dataset.questionIndex = index;

            btn.addEventListener('click', () => {
                this.loadQuestion(index);
            });

            grid.appendChild(btn);
        });
    }

    loadQuestion(index) {
        this.currentQuestionIndex = index;
        const question = this.examData.questions[index];

        // Update question header
        document.getElementById('questionNumber').textContent = 
            `Question ${index + 1} of ${this.examData.questions.length}`;
        document.getElementById('questionMarks').textContent = 
            `Marks: ${question.marks}`;

        // Display question (both Bengali and English)
        document.getElementById('questionText').innerHTML = `
            <div style="margin-bottom: 15px;">
                <strong>প্রশ্ন:</strong> ${question.question}
            </div>
            ${question.questionEnglish ? `
                <div style="color: #6B7280;">
                    <strong>Question:</strong> ${question.questionEnglish}
                </div>
            ` : ''}
        `;

        // Load saved answer
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
        const question = this.examData.questions[this.currentQuestionIndex];
        const isAnswered = this.answers[question.id].isAnswered;

        const editBtn = document.getElementById('editBtn');
        const tickBtn = document.getElementById('tickBtn');
        const answerInput = document.getElementById('answerInput');
        const answerStatus = document.getElementById('answerStatus');

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

    enableAnswerInput() {
        const answerInput = document.getElementById('answerInput');
        const editBtn = document.getElementById('editBtn');
        const tickBtn = document.getElementById('tickBtn');

        answerInput.disabled = false;
        answerInput.focus();
        editBtn.style.display = 'none';
        tickBtn.style.display = 'inline-block';
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
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px;">
                <p><strong>Total Questions:</strong> ${this.examData.questions.length}</p>
                <p><strong>Answered:</strong> <span style="color: #10B981;">${answered}</span></p>
                <p><strong>Not Answered:</strong> <span style="color: #F59E0B;">${unanswered}</span></p>
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

        // Redirect to results
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
        let obtainedMarks = correct * this.examData.marksPerQuestion;
        
        if (this.examData.negativeMarking) {
            obtainedMarks -= wrong * this.examData.negativeMarks;
        }

        obtainedMarks = Math.max(0, obtainedMarks);
        const percentage = ((obtainedMarks / totalMarks) * 100).toFixed(2);

        return {
            totalQuestions: this.examData.questions.length,
            answered,
            correct,
            wrong,
            skipped,
            totalMarks,
            obtainedMarks: parseFloat(obtainedMarks.toFixed(2)),
            percentage: parseFloat(percentage),
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
                    percentage: results.percentage,
                    submitted_at: new Date().toISOString()
                }]);

            if (error) throw error;

            console.log('✅ Results saved to Supabase');

            // Clear localStorage
            localStorage.removeItem(`exam_${this.examId}_${this.studentName}`);

        } catch (error) {
            console.error('❌ Supabase save error:', error);
            alert('Warning: Results may not be saved. Please contact admin.');
        }
    }
}

// Initialize exam controller when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ExamController();
});