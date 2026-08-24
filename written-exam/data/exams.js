// Exam Registry
const EXAMS_REGISTRY = [
    {
        id: 'bina-so-exam-1',
        name: 'BINA SO Exam - Set 1',
        description: 'বিনা এসও পরীক্ষা - সেট ১',
        totalQuestions: 4,
        duration: 60, // minutes
        marksPerQuestion: 1,
        negativeMarking: true,
        negativeMarks: 0,
        accessCode: 'BINA2024',
        status: 'active',
        dataFile: 'data/bina-so-exam-1.js'
    },
    {
        id: 'bina-so-exam-2',
        name: 'BINA SO Exam - Set 2',
        description: 'বিনা এসও পরীক্ষা - সেট ২',
        totalQuestions: 40,
        duration: 60,
        marksPerQuestion: 1,
        negativeMarking: true,
        negativeMarks: 0.25,
        accessCode: 'BINA2025',
        status: 'active',
        dataFile: 'data/bina-so-exam-2.js'
    },
    {
        id: 'bari-so-exam-3',
        name: 'BARI SO Exam - Set 3',
        description: 'বারি এসও পরীক্ষা - সেট ৩',
        totalQuestions: 40,
        duration: 60,
        marksPerQuestion: 1,
        negativeMarking: true,
        negativeMarks: 0.25,
        accessCode: 'BARI2024',
        status: 'active',
        dataFile: 'data/bari-so-exam-3.js'
    },
    {
        id: 'bsri-exam-4',
        name: 'BSRI Exam - Set 4',
        description: 'বিএসআরআই পরীক্ষা - সেট ৪',
        totalQuestions: 40,
        duration: 60,
        marksPerQuestion: 1,
        negativeMarking: true,
        negativeMarks: 0.25,
        accessCode: 'BSRI2024',
        status: 'active',
        dataFile: 'data/bsri-exam-4.js'
    }
];