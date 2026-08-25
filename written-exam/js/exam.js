// written-exam/js/exam.js — PART 1 of 2
// (এই ফাইলের নিচে ধাপ ৬-এ আরও কোড যোগ হবে — এখনই এটা বসিয়ে রাখুন, এই মুহূর্তে
//  এন্ট্রি স্ক্রিন কাজ করবে, "Enter Exam"-এ ক্লিক করলে exam স্ক্রিন blank দেখাবে,
//  ধাপ ৬ যোগ করার পর পুরো ইঞ্জিন চালু হবে)

let currentExam = null;
let currentStudentName = '';

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

    // Attempt limit check — একই exam_id + student_name আগে submit করেছে কিনা
    try {
        const { data, error } = await supabaseClient
            .from(SUBMISSIONS_TABLE)
            .select('id')
            .eq('exam_id', currentExam.id)
            .ilike('student_name', name); // case-insensitive match

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
    startExam(); // ধাপ ৬-এ define হবে
}

document.addEventListener('DOMContentLoaded', () => {
    currentExam = loadCurrentExam();
    if (currentExam) {
        document.getElementById('enterExamBtn').addEventListener('click', handleEnterExam);
    }
});

// ⬇️ ধাপ ৬-এর কোড এই লাইনের নিচে যোগ হবে (startExam, timer, render, autosave, submit)