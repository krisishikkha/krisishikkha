const EXAM_DATA_BINA_SO_EXAM_1 = {
    // Exam Configuration (সব settings এখানে)
    duration: 60,                // মিনিট
    marksPerQuestion: 1,         // প্রতি প্রশ্নের মার্ক
    negativeMarking: true,       // negative marking আছে কিনা
    negativeMarks: 0.25,         // ভুল উত্তরের জন্য কাটা
    
    // Questions (যত প্রশ্ন এখানে থাকবে ততই count হবে)
    questions: [
        {
            id: 1,
            question: 'বাংলাদেশের রাজধানীর নাম কী?',
            questionEnglish: 'What is the capital of Bangladesh?',
            acceptedAnswers: ['ঢাকা', 'dhaka', 'Dhaka'],
            correctAnswer: 'ঢাকা',
            explanation: 'বাংলাদেশের রাজধানী ঢাকা।',
            marks: 1
        },
        {
            id: 2,
            question: 'পানির রাসায়নিক সংকেত কী?',
            questionEnglish: 'What is the chemical formula of water?',
            acceptedAnswers: ['H2O', 'h2o', 'H₂O'],
            correctAnswer: 'H₂O',
            explanation: 'পানির রাসায়নিক সংকেত H₂O।',
            marks: 1
        },
        {
            id: 3,
            question: 'বাংলাদেশের স্বাধীনতা দিবস কবে?',
            questionEnglish: 'When is Bangladesh Independence Day?',
            acceptedAnswers: ['26 মার্চ', '26 march', '26th March'],
            correctAnswer: '26 মার্চ',
            explanation: 'বাংলাদেশের স্বাধীনতা দিবস 26 মার্চ।',
            marks: 1
        },
        {
            id: 4,
            question: 'বাংলাদেশের জাতীয় ফুল কী?',
            questionEnglish: 'What is the national flower of Bangladesh?',
            acceptedAnswers: ['শাপলা', 'shapla', 'Shapla'],
            correctAnswer: 'শাপলা',
            explanation: 'বাংলাদেশের জাতীয় ফুল শাপলা।',
            marks: 1
        },
        {
            id: 5,
            question: 'বাংলাদেশের মুক্তিযুদ্ধ কত সালে হয়?',
            questionEnglish: 'In which year was the Liberation War?',
            acceptedAnswers: ['1971', '১৯৭১'],
            correctAnswer: '১৯৭১',
            explanation: 'বাংলাদেশের মুক্তিযুদ্ধ ১৯৭১ সালে।',
            marks: 1
        }
        // আপনার 40টা প্রশ্ন এখানে দিন
        // totalQuestions automatically count হবে questions.length থেকে
    ]
};