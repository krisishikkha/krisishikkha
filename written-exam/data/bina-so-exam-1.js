const EXAM_DATA_BINA_SO_1 = {
    id: 'bina-so-exam-1',
    name: 'BINA SO Exam - Set 1',
    duration: 60,
    totalQuestions: 40,
    marksPerQuestion: 1,
    negativeMarks: 0.25,
    
    questions: [
        {
            id: 1,
            question: 'বাংলাদেশের রাজধানীর নাম কী?',
            questionEnglish: 'What is the capital of Bangladesh?',
            type: 'short', // short, number, one-word
            acceptedAnswers: ['ঢাকা', 'dhaka', 'Dhaka', 'DHAKA'],
            correctAnswer: 'ঢাকা',
            explanation: 'বাংলাদেশের রাজধানী ঢাকা। এটি দেশের বৃহত্তম শহর এবং প্রশাসনিক কেন্দ্র।',
            explanationEnglish: 'The capital of Bangladesh is Dhaka. It is the largest city and administrative center.',
            marks: 1
        },
        {
            id: 2,
            question: 'পানির রাসায়নিক সংকেত কী?',
            questionEnglish: 'What is the chemical formula of water?',
            type: 'short',
            acceptedAnswers: ['H2O', 'h2o', 'H₂O'],
            correctAnswer: 'H₂O',
            explanation: 'পানির রাসায়নিক সংকেত H₂O। এতে দুইটি হাইড্রোজেন এবং একটি অক্সিজেন পরমাণু থাকে।',
            explanationEnglish: 'The chemical formula of water is H₂O. It contains two hydrogen atoms and one oxygen atom.',
            marks: 1
        },
        {
            id: 3,
            question: 'বাংলাদেশের স্বাধীনতা দিবস কবে?',
            questionEnglish: 'When is Bangladesh Independence Day?',
            type: 'short',
            acceptedAnswers: ['26 মার্চ', '26 march', '26th March', '26/3', '26-03'],
            correctAnswer: '26 মার্চ',
            explanation: 'বাংলাদেশের স্বাধীনতা দিবস 26 মার্চ।',
            explanationEnglish: 'Bangladesh Independence Day is on 26th March.',
            marks: 1
        },
        {
            id: 4,
            question: '১০০ এর বর্গমূল কত?',
            questionEnglish: 'What is the square root of 100?',
            type: 'number',
            acceptedAnswers: ['10', '১০'],
            correctAnswer: '10',
            explanation: '১০০ এর বর্গমূল = ১০',
            explanationEnglish: 'Square root of 100 = 10',
            marks: 1
        },
        // Add 36 more questions to make it 40 total
        ...Array.from({length: 36}, (_, i) => ({
            id: i + 5,
            question: `প্রশ্ন নম্বর ${i + 5}`,
            questionEnglish: `Question number ${i + 5}`,
            type: 'short',
            acceptedAnswers: ['উত্তর', 'answer'],
            correctAnswer: 'উত্তর',
            explanation: 'ব্যাখ্যা',
            explanationEnglish: 'Explanation',
            marks: 1
        }))
    ]
};