// ============================================
// CENTRAL EXAM REGISTRY
// নতুন exam যোগ করতে শুধু এই array তে entry যোগ করুন
// ============================================

const EXAM_REGISTRY = {
    // Access Codes
    accessCodes: {
        'bina-so-exam-1': 'BINA2024',
        'bina-so-exam-2': 'BINA2025',
        'bari-so-exam-3': 'BARI2024',
        'bsri-exam-4': 'BSRI2024'
    },

    // Exam List
    exams: [
        {
            id: 'bina-so-exam-1',
            name: 'BINA SO Exam - Set 1',
            description: 'বিনা এসও পরীক্ষা - সেট ১',
            totalQuestions: 1,
            duration: 1,
            marksPerQuestion: 1,
            negativeMarking: true,
            negativeMarks: 0.25,
            status: 'active'
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
            status: 'active'
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
            status: 'active'
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
            status: 'inactive' // inactive করলে দেখাবে না
        }
    ]
};