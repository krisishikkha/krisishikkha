class ExamController {
    constructor() {
        console.log('=== ExamController Constructor ===');
        
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
        
        // Initialize immediately (don't wait for DOMContentLoaded)
        this.init();
    }

    init() {
        console.log('Initializing exam...');
        
        // Load exam data
        if (!this.loadExamData()) {
            return; // Failed to load
        }
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('✅ ExamController initialized successfully');
    }

    loadExamData() {
        console.log('Loading exam data...');
        
        // Get question data from global variable
        const varName = 'EXAM_DATA_' + this.examId.toUpperCase().replace(/-/g, '_');
        console.log('Looking for variable:', varName);
        
        if (typeof window[varName] === 'undefined') {
            console.error('❌ Question data not found:', varName);
            alert('Question data not loaded! Please refresh the page.');
            window.location.href = 'index.html';
            return false;
        }
        
        const questionData = window[varName];
        console.log('✅ Question data found:', questionData);
        
        if (!questionData.questions || questionData.questions.length === 0) {
            console.error('❌ No questions in data');
            alert('No questions found!');
            window.location.href = 'index.html';
            return false;
        }
        
        // Merge metadata with question data
        this.examData = {
            id: this.examId,
            name: this.examMeta.name,
            description: this.examMeta.description,
            duration: questionData.duration,
            marksPerQuestion: questionData.marksPerQuestion,
            negativeMarking: questionData.negativeMarking,
            negativeMarks: questionData.negativeMarks,
            questions: questionData.questions,
            totalQuestions: questionData.questions.length
        };
        
        console.log('✅ Exam data loaded:');
        console.log('  Name:', this.examData.name);
        console.log('  Questions:', this.examData.totalQuestions);
        console.log('  Duration:', this.examData.duration, 'minutes');
        
        // Initialize answers object
        this.examData.questions.forEach(q => {
            this.answers[q.id] = { answer: '', isAnswered: false };
        });
        
        return true;
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Student entry form
        const form = document.getElementById('studentEntryForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleStudentEntry(e);
            });
        }
        
        // Edit/Save buttons
        document.getElementById('editBtn').addEventListener('click', () => this.enableEdit());
        document.getElementById('tickBtn').addEventListener('click', () => this.saveAnswer());
        
        // Enter key to save
        document.getElementById('answerInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveAnswer();
        });
        
        // Navigation buttons
        document.getElementById('prevBtn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('submitBtn').addEventListener('click', () => this.showSubmitModal());
        
        // Submit modal
        document.getElementById('cancelSubmit').addEventListener('click', () => {
            document.getElementById('submitModal').classList.remove('active');
        });
        document.getElementById('confirmSubmit').addEventListener('click', () => this.submitExam());
        
        console.log('✅ Event listeners ready');
    }

    async handleStudentEntry(e) {
        e.preventDefault();
        console.log('=== Student Entry ===');
        
        this.studentName = document.getElementById('studentName').value.trim();
        const accessCode = document.getElementById('accessCode').value.trim();
        
        console.log('Student:', this.studentName);
        console.log('Code entered:', accessCode);
        
        // Validate access code
        const correctCode = EXAM_REGISTRY.accessCodes[this.examId];
        if (correctCode !== accessCode) {
            alert('❌ Invalid access code!');
            return;
        }
        
        console.log('✅ Access code valid');
        
        // Check previous attempt
        try {
            const { data, error } = await supabase
                .from('written_exam_submissions')
                .select('id')
                .eq('exam_id', this.examId)
                .eq('student_name', this.studentName)
                .limit(1);
            
            if (error) {
                console.error('Supabase error:', error);
            }
            
            if (data && data.length > 0) {
                alert('⚠️ You already attempted this exam!');
                window.location.href = 'index.html';
                return;
            }
            
            console.log('✅ No previous attempt');
        } catch (error) {
            console.error('Error checking attempt:', error);
        }
        
        // Start the exam
        this.startExam();
    }

    startExam() {
        console.log('=== STARTING EXAM ===');
        
        // Hide modal, show interface
        document.getElementById('studentEntryModal').classList.remove('active');
        document.getElementById('examInterface').style.display = 'block';
        
        // Set header info
        document.getElementById('examTitle').textContent = this.examData.name;
        document.getElementById('studentNameDisplay').textContent = '👤 ' + this.studentName;
        
        // Build question navigator
        this.buildNavigator();
        
        // Load first question
        this.loadQuestion(0);
        
        // Start timer
        this.timer = new ExamTimer(
            this.examData.duration,
            () => {
                alert('⏰ Time is up! Submitting...');
                this.submitExam();
            },
            () => {}
        );
        this.timer.start();
        
        // Start auto-save
        this.autoSaveInterval = setInterval(() => this.autoSave(), 30000);
        
        console.log('✅ EXAM STARTED SUCCESSFULLY');
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
        
        console.log('✅ Navigator built with', this.examData.questions.length, 'buttons');
    }

    loadQuestion(index) {
        console.log('Loading question', index + 1);
        
        this.currentQuestionIndex = index;
        const q = this.examData.questions[index];
        
        // Update question number and marks
        document.getElementById('questionNumber').textContent = 
            `Question ${index + 1} of ${this.examData.totalQuestions}`;
        document.getElementById('questionMarks').textContent = `Marks: ${q.marks}`;
        
        // Display question
        document.getElementById('questionText').innerHTML = `
            <div style="margin-bottom:15px;font-size:18px;">
                <strong>প্রশ্ন:</strong> ${q.question}
            </div>
            ${q.questionEnglish ? `
                <div style="color:#666;font-size:16px;">
                    <strong>Question:</strong> ${q.questionEnglish}
                </div>
            ` : ''}
        `;
        
        // Load saved answer
        const input = document.getElementById('answerInput');
        input.value = this.answers[q.id].answer;
        input.disabled = true;
        
        // Update UI
        this.updateUI();
    }

    updateUI() {
        const q = this.examData.questions[this.currentQuestionIndex];
        const isAnswered = this.answers[q.id].isAnswered;
        
        // Update edit/tick buttons
        document.getElementById('editBtn').style.display = 'inline-block';
        document.getElementById('tickBtn').style.display = 'none';
        document.getElementById('answerInput').disabled = true;
        
        // Update status
        const status = document.getElementById('answerStatus');
        if (isAnswered) {
            status.textContent = '✓ Answer saved';
            status.className = 'answer-status saved';
            status.style.display = 'block';
        } else {
            status.style.display = 'none';
        }
        
        // Update navigator buttons
        document.querySelectorAll('.question-btn').forEach((btn, i) => {
            btn.classList.remove('current', 'answered', 'unanswered');
            
            if (i === this.currentQuestionIndex) {
                btn.classList.add('current');
            } else if (this.answers[this.examData.questions[i].id].isAnswered) {
                btn.classList.add('answered');
            } else {
                btn.classList.add('unanswered');
            }
        });
        
        // Update prev/next buttons
        document.getElementById('prevBtn').disabled = this.currentQuestionIndex === 0;
        document.getElementById('nextBtn').disabled = 
            this.currentQuestionIndex === this.examData.totalQuestions - 1;
    }

    enableEdit() {
        const input = document.getElementById('answerInput');
        input.disabled = false;
        input.focus();
        
        document.getElementById('editBtn').style.display = 'none';
        document.getElementById('tickBtn').style.display = 'inline-block';
    }

    saveAnswer() {
        const q = this.examData.questions[this.currentQuestionIndex];
        const answer = document.getElementById('answerInput').value.trim();
        
        this.answers[q.id] = {
            answer: answer,
            isAnswered: answer !== ''
        };
        
        console.log('Answer saved for question', q.id, ':', answer);
        
        this.updateUI();
        this.autoSave();
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.loadQuestion(this.currentQuestionIndex - 1);
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.examData.totalQuestions - 1) {
            this.loadQuestion(this.currentQuestionIndex + 1);
        }
    }

    autoSave() {
        localStorage.setItem(`exam_${this.examId}_${this.studentName}`, JSON.stringify({
            examId: this.examId,
            studentName: this.studentName,
            answers: this.answers,
            currentQuestion: this.currentQuestionIndex
        }));
        
        const status = document.getElementById('autoSaveStatus');
        status.textContent = '✓ Auto-saved';
        status.style.opacity = '1';
        
        setTimeout(() => {
            status.style.opacity = '0.7';
        }, 2000);
    }

    showSubmitModal() {
        const answered = Object.values(this.answers).filter(a => a.isAnswered).length;
        
        document.getElementById('submitSummary').innerHTML = `
            <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin:20px 0;">
                <p style="margin:5px 0;"><strong>Total Questions:</strong> ${this.examData.totalQuestions}</p>
                <p style="margin:5px 0;"><strong>Answered:</strong> <span style="color:#10B981;">${answered}</span></p>
                <p style="margin:5px 0;"><strong>Not Answered:</strong> <span style="color:#F59E0B;">${this.examData.totalQuestions - answered}</span></p>
            </div>
        `;
        
        document.getElementById('submitModal').classList.add('active');
    }

    async submitExam() {
        if (this.isSubmitted) return;
        this.isSubmitted = true;
        
        console.log('=== SUBMITTING EXAM ===');
        
        // Stop timer and auto-save
        if (this.timer) this.timer.stop();
        if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);
        
        // Calculate results
        const results = this.calculateResults();
        console.log('Results:', results);
        
        // Save to Supabase
        await this.saveResults(results);
        
        // Store in session for result page
        sessionStorage.setItem('examResults', JSON.stringify({
            examId: this.examId,
            examName: this.examData.name,
            studentName: this.studentName,
            results: results,
            answers: this.answers,
            questions: this.examData.questions
        }));
        
        // Redirect to result page
        window.location.href = 'result.html';
    }

    calculateResults() {
        let correct = 0, wrong = 0, skipped = 0, answered = 0;
        const questionResults = {};
        
        this.examData.questions.forEach(q => {
            const userAns = this.answers[q.id];
            
            if (!userAns.isAnswered || userAns.answer === '') {
                skipped++;
                questionResults[q.id] = {
                    status: 'skipped',
                    userAnswer: '',
                    correctAnswer: q.correctAnswer,
                    isCorrect: false
                };
            } else {
                answered++;
                const check = this.answerChecker.checkAnswer(userAns.answer, q.acceptedAnswers);
                
                if (check.isCorrect) {
                    correct++;
                    questionResults[q.id] = {
                        status: 'correct',
                        userAnswer: userAns.answer,
                        correctAnswer: q.correctAnswer,
                        isCorrect: true
                    };
                } else {
                    wrong++;
                    questionResults[q.id] = {
                        status: 'wrong',
                        userAnswer: userAns.answer,
                        correctAnswer: q.correctAnswer,
                        isCorrect: false
                    };
                }
            }
        });
        
        // Calculate marks
        const totalMarks = this.examData.totalQuestions * this.examData.marksPerQuestion;
        let obtainedMarks = correct * this.examData.marksPerQuestion;
        
        if (this.examData.negativeMarking) {
            obtainedMarks -= wrong * this.examData.negativeMarks;
        }
        
        obtainedMarks = Math.max(0, obtainedMarks);
        const percentage = ((obtainedMarks / totalMarks) * 100).toFixed(2);
        
        return {
            totalQuestions: this.examData.totalQuestions,
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

    async saveResults(results) {
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
            console.error('❌ Error saving to Supabase:', error);
            alert('Warning: Results may not be saved properly.');
        }
    }
}

// Initialize immediately (NOT waiting for DOMContentLoaded)
console.log('Creating ExamController instance...');
new ExamController();