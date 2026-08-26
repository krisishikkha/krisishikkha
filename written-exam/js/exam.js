// written-exam/js/exam.js

let currentExam = null;
let currentStudentName = '';
let studentAnswers = {};

function getExamIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function loadCurrentExam() {
    const examId = getExamIdFromUrl();
    const entry = EXAMS_REGISTRY.find(e => e.id === examId);

    if (!entry) {
        document.getElementById('entryExamTitle').textContent = 'Exam Not Found';
        document.getElementById('enterExamBtn').disabled = true;
        return null;
    }

    const examData = window[entry.dataVar];

    if (!examData || !Array.isArray(examData.questions) || examData.questions.length === 0) {
        document.getElementById('entryExamTitle').textContent = 'Exam Data Invalid';
        document.getElementById('enterExamBtn').disabled = true;
        return null;
    }

    const status = examData.status || 'live';
    if (status === 'locked' || status === 'draft') {
        document.getElementById('entryExamTitle').textContent = examData.title;
        document.getElementById('entryExamMeta').textContent = 'এই পরীক্ষাটি এখন সরাসরি নেওয়া যাচ্ছে না। ভর্তি সংক্রান্ত তথ্যের জন্য WhatsApp-এ যোগাযোগ করুন।';
        document.getElementById('enterExamBtn').disabled = true;
        return null;
    }

    document.getElementById('entryExamTitle').textContent = examData.title;
    document.getElementById('entryExamMeta').textContent =
        `${examData.questions.length} Questions | ${examData.totalMarks} Marks | ${examData.durationMinutes} minutes`;

    return examData;
}

function showEntryError(msg) {
    const el = document.getElementById('entryError');
    el.textContent = msg;
    el.style.display = 'block';
}

async function handleEnterExam() {
    const nameInput = document.getElementById('studentName');
    const codeInput = document.getElementById('accessCode');
    const name = nameInput.value.trim();
    const code = codeInput.value.trim();

    document.getElementById('entryError').style.display = 'none';

    if (!name) {
        showEntryError('অনুগ্রহ করে আপনার নাম লিখুন।');
        return;
    }
    if (!code) {
        showEntryError('অনুগ্রহ করে Access Code লিখুন।');
        return;
    }
    if (code !== currentExam.accessCode) {
        showEntryError('ভুল Access Code। আবার চেষ্টা করুন।');
        return;
    }

    const enterBtn = document.getElementById('enterExamBtn');
    enterBtn.disabled = true;
    enterBtn.textContent = 'Checking...';

    try {
        const { data, error } = await supabaseClient
            .from(SUBMISSIONS_TABLE)
            .select('id')
            .eq('exam_id', currentExam.id)
            .ilike('student_name', name);

        if (error) {
            console.error('Attempt check error:', error);
            showEntryError('সার্ভারে সমস্যা হয়েছে, একটু পর আবার চেষ্টা করুন।');
            enterBtn.disabled = false;
            enterBtn.textContent = 'Enter Exam';
            return;
        }

        if (data && data.length >= currentExam.attemptLimit) {
            showEntryError('আপনি ইতিমধ্যে এই পরীক্ষা সম্পন্ন করেছেন। পুনরায় দেওয়া যাবে না।');
            enterBtn.disabled = false;
            enterBtn.textContent = 'Enter Exam';
            return;
        }
    } catch (err) {
        console.error('Unexpected error:', err);
        showEntryError('একটি সমস্যা হয়েছে। ইন্টারনেট সংযোগ চেক করুন।');
        enterBtn.disabled = false;
        enterBtn.textContent = 'Enter Exam';
        return;
    }

    currentStudentName = name;
    startExam();
}

function getAnswersStorageKey() {
    return `we_answers_${currentExam.id}`;
}

function saveAnswersToLocal() {
    localStorage.setItem(getAnswersStorageKey(), JSON.stringify(studentAnswers));
}

function loadAnswersFromLocal() {
    const saved = localStorage.getItem(getAnswersStorageKey());
    if (saved) {
        try {
            studentAnswers = JSON.parse(saved);
        } catch (e) {
            studentAnswers = {};
        }
    }
}

function startExam() {
    document.getElementById('entryScreen').style.display = 'none';
    document.getElementById('examScreen').style.display = 'block';

    loadAnswersFromLocal();
    renderQuestions();
    renderNavigator();

    startTimer(
        currentExam.id,
        currentExam.durationMinutes,
        (display) => {
            document.getElementById('timerDisplay').textContent = `Time Remaining: ${display}`;
        },
        () => {
            submitExam(true);
        }
    );
}

function renderQuestions() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';

    currentExam.questions.forEach((q, index) => {
        const saved = studentAnswers[q.id] || { text: '', locked: false };

        const block = document.createElement('div');
        block.className = 'we-question-block';
        block.id = `qblock-${q.id}`;
        block.innerHTML = `
            <p class="we-question-number">প্রশ্ন ${index + 1} <span class="we-question-marks">(${q.marks} Marks)</span></p>
            <p class="we-question-text">${q.question}</p>
            <div class="we-answer-row">
                <input
                    type="text"
                    class="we-answer-input"
                    id="answer-${q.id}"
                    placeholder="আপনার উত্তর লিখুন"
                    value="${saved.text.replace(/"/g, '&quot;')}"
                    ${saved.locked ? 'disabled' : ''}
                >
                <button class="we-tick-btn" id="tick-${q.id}" style="${saved.locked ? 'display:none;' : ''}">✓</button>
                <button class="we-edit-btn" id="edit-${q.id}" style="${saved.locked ? '' : 'display:none;'}">✎</button>
            </div>
        `;
        container.appendChild(block);

        document.getElementById(`tick-${q.id}`).addEventListener('click', () => lockAnswer(q.id));
        document.getElementById(`edit-${q.id}`).addEventListener('click', () => unlockAnswer(q.id));

        document.getElementById(`answer-${q.id}`).addEventListener('input', (e) => {
            studentAnswers[q.id] = { text: e.target.value, locked: false };
            saveAnswersToLocal();
            renderNavigator();
        });
    });
}

function lockAnswer(qId) {
    const input = document.getElementById(`answer-${qId}`);
    const text = input.value.trim();

    studentAnswers[qId] = { text, locked: true };
    saveAnswersToLocal();

    input.disabled = true;
    document.getElementById(`tick-${qId}`).style.display = 'none';
    document.getElementById(`edit-${qId}`).style.display = 'inline-block';
    renderNavigator();
}

function unlockAnswer(qId) {
    const input = document.getElementById(`answer-${qId}`);

    studentAnswers[qId] = { text: input.value, locked: false };
    saveAnswersToLocal();

    input.disabled = false;
    input.focus();
    document.getElementById(`tick-${qId}`).style.display = 'inline-block';
    document.getElementById(`edit-${qId}`).style.display = 'none';
    renderNavigator();
}

function renderNavigator() {
    const nav = document.getElementById('navigator');
    nav.innerHTML = '';

    currentExam.questions.forEach((q, index) => {
        const answered = studentAnswers[q.id] && studentAnswers[q.id].text.trim() !== '';
        const btn = document.createElement('button');
        btn.className = `we-nav-btn ${answered ? 'we-nav-answered' : ''}`;
        btn.textContent = index + 1;
        btn.addEventListener('click', () => {
            document.getElementById(`qblock-${q.id}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        nav.appendChild(btn);
    });
}

document.getElementById('submitExamBtn').addEventListener('click', () => {
    const answeredCount = currentExam.questions.filter(
        q => studentAnswers[q.id] && studentAnswers[q.id].text.trim() !== ''
    ).length;
    const notAnswered = currentExam.questions.length - answeredCount;

    document.getElementById('confirmText').textContent =
        `You have answered: ${answeredCount}\nNot answered: ${notAnswered}\n\nAre you sure you want to submit?`;
    document.getElementById('confirmModal').style.display = 'flex';
});

document.getElementById('cancelSubmitBtn').addEventListener('click', () => {
    document.getElementById('confirmModal').style.display = 'none';
});

document.getElementById('confirmSubmitBtn').addEventListener('click', () => {
    document.getElementById('confirmModal').style.display = 'none';
    submitExam(false);
});

async function submitExam(autoSubmitted) {
    document.getElementById('confirmModal').style.display = 'none';
    stopTimer(currentExam.id);

    let correct = 0, wrong = 0, skipped = 0, obtainedMarks = 0;
    const answersDetail = [];

    currentExam.questions.forEach(q => {
        const studentAns = (studentAnswers[q.id] && studentAnswers[q.id].text.trim()) || '';

        if (!studentAns) {
            skipped++;
            answersDetail.push({
                question_id: q.id, question: q.question,
                student_answer: '', correct_answer: q.acceptedAnswers[0],
                is_correct: false, marks_obtained: 0, status: 'skipped',
                explanation: q.explanation || ''
            });
            return;
        }

        const matched = checkAnswer(studentAns, q.acceptedAnswers);
        if (matched) {
            correct++;
            obtainedMarks += q.marks;
            answersDetail.push({
                question_id: q.id, question: q.question,
                student_answer: studentAns, correct_answer: q.acceptedAnswers[0],
                is_correct: true, marks_obtained: q.marks, status: 'correct',
                explanation: q.explanation || ''
            });
        } else {
            wrong++;
            const penalty = currentExam.negativeMark || 0;
            obtainedMarks -= penalty;
            answersDetail.push({
                question_id: q.id, question: q.question,
                student_answer: studentAns, correct_answer: q.acceptedAnswers[0],
                is_correct: false, marks_obtained: -penalty, status: 'wrong',
                explanation: q.explanation || ''
            });
        }
    });

    if (obtainedMarks < 0) obtainedMarks = 0;
    const percentage = currentExam.totalMarks > 0
        ? Math.round((obtainedMarks / currentExam.totalMarks) * 10000) / 100
        : 0;

    const resultPayload = {
        exam_id: currentExam.id,
        exam_name: currentExam.title,
        student_name: currentStudentName,
        access_code_used: currentExam.accessCode,
        total_questions: currentExam.questions.length,
        answered: currentExam.questions.length - skipped,
        correct, wrong, skipped,
        total_marks: currentExam.totalMarks,
        obtained_marks: obtainedMarks,
        percentage,
        attempt_no: 1,
        answers: answersDetail
    };

    try {
        const { error } = await supabaseClient.from(SUBMISSIONS_TABLE).insert([resultPayload]);
        if (error) console.error('Submission save error:', error);
    } catch (err) {
        console.error('Unexpected submission error:', err);
    }

    localStorage.setItem('we_last_result', JSON.stringify(resultPayload));
    localStorage.removeItem(getAnswersStorageKey());

    window.location.href = 'result.html';
}

document.addEventListener('DOMContentLoaded', () => {
    loadExamDataFiles(() => {
        currentExam = loadCurrentExam();
        if (currentExam) {
            document.getElementById('enterExamBtn').addEventListener('click', handleEnterExam);
        }
    });
});
