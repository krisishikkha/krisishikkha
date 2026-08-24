const EXAM_REGISTRY = {
    // শুধু access codes
    accessCodes: {
        'bina-so-exam-1': 'BINA2024',
        'bina-so-exam-2': 'BINA2025',
        'bari-so-exam-3': 'BARI2024',
        'bsri-exam-4': 'BSRI2024'
    },

    // শুধু exam list + status
    exams: [
        {
            id: 'bina-so-exam-1',
            name: 'BINA SO Exam - Set 1',
            description: 'বিনা এসও পরীক্ষা - সেট ১',
            status: 'active'  // শুধু ON/OFF
        },
        {
            id: 'bina-so-exam-2',
            name: 'BINA SO Exam - Set 2',
            description: 'বিনা এসও পরীক্ষা - সেট ২',
            status: 'active'
        },
        {
            id: 'bari-so-exam-3',
            name: 'BARI SO Exam - Set 3',
            description: 'বারি এসও পরীক্ষা - সেট ৩',
            status: 'active'
        },
        {
            id: 'bsri-exam-4',
            name: 'BSRI Exam - Set 4',
            description: 'বিএসআরআই পরীক্ষা - সেট ৪',
            status: 'inactive'  // inactive করলে দেখাবে না
        }
    ]
};