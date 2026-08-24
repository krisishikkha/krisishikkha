// ============================================
// All Exam Data (Hardcoded)
// ============================================

const SUPABASE_CONFIG = {
    url: 'https://bpkheipwdjzlyuzyqdxz.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwa2hlaXB3ZGp6bHl1enlxZHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNDIxNDEsImV4cCI6MjA4ODYxODE0MX0.OGgbZffNS8q6IOnCY0Hq02D0A_MTfHPFZ8KSzBcAfZs'
};

const WRITTEN_EXAM_TABLE = 'written_exam_submissions';

const EXAMS_DATA = {
    "exams": [
        {
            "id": "bina-so-exam-1",
            "title": "BINA SO Exam – 1",
            "description": "Bangladesh Institute of Nuclear Agriculture - Scientific Officer Exam",
            "totalQuestions": 50,
            "totalMarks": 50,
            "duration": 30,
            "accessCode": "BINA2026",
            "isActive": true
        },
        {
            "id": "bina-so-exam-2",
            "title": "BINA SO Exam – 2",
            "description": "Bangladesh Institute of Nuclear Agriculture - Set 2",
            "totalQuestions": 50,
            "totalMarks": 50,
            "duration": 30,
            "accessCode": "BINA2027",
            "isActive": true
        },
        {
            "id": "bari-so-exam-3",
            "title": "BARI SO Exam – 3",
            "description": "Bangladesh Agricultural Research Institute",
            "totalQuestions": 60,
            "totalMarks": 60,
            "duration": 45,
            "accessCode": "BARI2026",
            "isActive": true
        },
        {
            "id": "bsri-exam-4",
            "title": "BSRI Exam – 4",
            "description": "Bangladesh Sugarcane Research Institute",
            "totalQuestions": 40,
            "totalMarks": 40,
            "duration": 25,
            "accessCode": "BSRI2026",
            "isActive": true
        }
    ]
};

const EXAM_QUESTIONS = {
    "bina-so-exam-1": {
        "examInfo": {
            "id": "bina-so-exam-1",
            "title": "BINA SO Exam – 1",
            "subtitle": "Bangladesh Institute of Nuclear Agriculture",
            "accessCode": "BINA2026",
            "durationMinutes": 30,
            "totalMarks": 50,
            "passingMarks": 25,
            "negativeMark": 0.25,
            "attemptLimit": 1,
            "instructions": [
                "এই পরীক্ষায় ৫০টি লিখিত প্রশ্ন রয়েছে",
                "প্রতিটি প্রশ্নের উত্তর নিজে লিখতে হবে",
                "সময় ৩০ মিনিট",
                "ভুল উত্তরের জন্য ০.২৫ নম্বর কাটা যাবে",
                "প্রতিটি সঠিক উত্তরের জন্য ১ নম্বর"
            ]
        },
        "questions": [
            {
                "id": 1,
                "question": "ধানের বৈজ্ঞানিক নাম কী?",
                "acceptedAnswers": ["Oryza sativa", "Oryza sativa L.", "oryza sativa"],
                "marks": 1
            },
            {
                "id": 2,
                "question": "What is the basic chromosome number of rice?",
                "acceptedAnswers": ["12", "12 chromosomes", "n=12"],
                "marks": 1
            },
            {
                "id": 3,
                "question": "ধানের ফটোসিনথেসিস কোন ধরনের?",
                "acceptedAnswers": ["C3", "C3 type", "সি থ্রি"],
                "marks": 1
            },
            {
                "id": 4,
                "question": "What is the scientific name of wheat?",
                "acceptedAnswers": ["Triticum aestivum", "Triticum aestivum L.", "triticum aestivum"],
                "marks": 1
            },
            {
                "id": 5,
                "question": "বাংলাদেশে ধান গবেষণা ইনস্টিটিউটের সংক্ষিপ্ত নাম কী?",
                "acceptedAnswers": ["BRRI", "ব্রি", "বিআরআরআই"],
                "marks": 1
            }
            // Add all 50 questions here (showing 5 for example)
        ]
    },
    "bina-so-exam-2": {
        "examInfo": {
            "id": "bina-so-exam-2",
            "title": "BINA SO Exam – 2",
            "subtitle": "Bangladesh Institute of Nuclear Agriculture - Set 2",
            "accessCode": "BINA2027",
            "durationMinutes": 30,
            "totalMarks": 50,
            "passingMarks": 25,
            "negativeMark": 0.25,
            "attemptLimit": 1,
            "instructions": ["এই পরীক্ষায় ৫০টি লিখিত প্রশ্ন রয়েছে", "সময় ৩০ মিনিট"]
        },
        "questions": [
            {"id": 1, "question": "Sample question", "acceptedAnswers": ["Answer"], "marks": 1}
        ]
    }
};

// Answer Checker Function
function checkAnswer(studentAnswer, acceptedAnswers) {
    if (!studentAnswer || !acceptedAnswers) return false;
    
    const normalized = studentAnswer.trim().toLowerCase();
    
    // Bengali to English number conversion
    const bengaliNumbers = {'০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9'};
    let converted = normalized;
    for (let bn in bengaliNumbers) {
        converted = converted.replace(new RegExp(bn, 'g'), bengaliNumbers[bn]);
    }
    
    return acceptedAnswers.some(ans => 
        ans.trim().toLowerCase() === converted
    );
}
