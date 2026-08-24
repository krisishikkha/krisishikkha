// ============================================
// BINA SO Exam – 1
// Complete Question Set
// ============================================

const EXAM_BINA_SO_1 = {
    examInfo: {
        id: "bina-so-exam-1",
        title: "BINA SO Exam – 1",
        subtitle: "Bangladesh Institute of Nuclear Agriculture",
        accessCode: "BINA2026",
        durationMinutes: 30,
        totalMarks: 50,
        passingMarks: 25,
        negativeMark: 0.25,
        attemptLimit: 1,
        instructions: [
            "এই পরীক্ষায় ৫০টি লিখিত প্রশ্ন রয়েছে",
            "প্রতিটি প্রশ্নের উত্তর নিজে লিখতে হবে",
            "সময় ৩০ মিনিট",
            "ভুল উত্তরের জন্য ০.২৫ নম্বর কাটা যাবে",
            "প্রতিটি সঠিক উত্তরের জন্য ১ নম্বর"
        ]
    },
    questions: [
        {
            id: 1,
            question: "ধানের বৈজ্ঞানিক নাম কী?",
            acceptedAnswers: ["Oryza sativa", "Oryza sativa L.", "oryza sativa"],
            marks: 1
        },
        {
            id: 2,
            question: "What is the basic chromosome number of rice?",
            acceptedAnswers: ["12", "12 chromosomes", "n=12"],
            marks: 1
        },
        {
            id: 3,
            question: "ধানের ফটোসিনথেসিস কোন ধরনের?",
            acceptedAnswers: ["C3", "C3 type", "সি থ্রি"],
            marks: 1
        },
        {
            id: 4,
            question: "What is the scientific name of wheat?",
            acceptedAnswers: ["Triticum aestivum", "Triticum aestivum L.", "triticum aestivum"],
            marks: 1
        },
        {
            id: 5,
            question: "বাংলাদেশে ধান গবেষণা ইনস্টিটিউটের সংক্ষিপ্ত নাম কী?",
            acceptedAnswers: ["BRRI", "ব্রি", "বিআরআরআই"],
            marks: 1
        },
        {
            id: 6,
            question: "Name the father of genetics.",
            acceptedAnswers: ["Gregor Mendel", "Mendel", "Gregor Johann Mendel"],
            marks: 1
        },
        {
            id: 7,
            question: "নাইট্রোজেন সারের একটি উদাহরণ লিখুন।",
            acceptedAnswers: ["ইউরিয়া", "Urea", "urea", "ইউরিয়া সার"],
            marks: 1
        },
        {
            id: 8,
            question: "What is the formula of urea?",
            acceptedAnswers: ["CO(NH2)2", "CH4N2O", "(NH2)2CO"],
            marks: 1
        },
        {
            id: 9,
            question: "মাটির pH কত হলে তা নিরপেক্ষ বলা হয়?",
            acceptedAnswers: ["7", "৭", "pH 7"],
            marks: 1
        },
        {
            id: 10,
            question: "What is NPK fertilizer?",
            acceptedAnswers: ["Nitrogen Phosphorus Potassium", "Nitrogen, Phosphorus, Potassium", "N, P, K fertilizer"],
            marks: 1
        }
        // আপনি বাকি 40টি প্রশ্ন এখানে যোগ করবেন
        // একই format follow করে
    ]
};

console.log('✅ BINA SO Exam 1 loaded:', EXAM_BINA_SO_1.questions.length, 'questions');
