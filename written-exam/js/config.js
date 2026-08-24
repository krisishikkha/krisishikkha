// ============================================
// Written Exam System - Configuration
// ============================================

// Supabase Configuration
const SUPABASE_CONFIG = {
    url: 'https://bpkheipwdjzlyuzyqdxz.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwa2hlaXB3ZGp6bHl1enlxZHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNDIxNDEsImV4cCI6MjA4ODYxODE0MX0.OGgbZffNS8q6IOnCY0Hq02D0A_MTfHPFZ8KSzBcAfZs'
};

const WRITTEN_EXAM_TABLE = 'written_exam_submissions';

// Exam List (Only metadata)
const EXAMS_LIST = [
    {
        id: "bina-so-exam-1",
        title: "BINA SO Exam – 1",
        description: "Bangladesh Institute of Nuclear Agriculture - Scientific Officer Exam",
        totalQuestions: 50,
        totalMarks: 50,
        duration: 30,
        isActive: true,
        dataFile: "bina-so-exam-1.js"  // আলাদা file
    },
    {
        id: "bina-so-exam-2",
        title: "BINA SO Exam – 2",
        description: "Bangladesh Institute of Nuclear Agriculture - Set 2",
        totalQuestions: 50,
        totalMarks: 50,
        duration: 30,
        isActive: true,
        dataFile: "bina-so-exam-2.js"  // আলাদা file
    },
    {
        id: "bari-so-exam-3",
        title: "BARI SO Exam – 3",
        description: "Bangladesh Agricultural Research Institute",
        totalQuestions: 60,
        totalMarks: 60,
        duration: 45,
        isActive: true,
        dataFile: "bari-so-exam-3.js"  // আলাদা file
    },
    {
        id: "bsri-exam-4",
        title: "BSRI Exam – 4",
        description: "Bangladesh Sugarcane Research Institute",
        totalQuestions: 40,
        totalMarks: 40,
        duration: 25,
        isActive: true,
        dataFile: "bsri-exam-4.js"  // আলাদা file
    }
];

console.log('✅ Config loaded');
