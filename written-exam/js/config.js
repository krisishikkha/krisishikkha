// Supabase Configuration
const SUPABASE_CONFIG = {
    url: 'https://bpkheipwdjzlyuzyqdxz.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwa2hlaXB3ZGp6bHl1enlxZHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNDIxNDEsImV4cCI6MjA4ODYxODE0MX0.OGgbZffNS8q6IOnCY0Hq02D0A_MTfHPFZ8KSzBcAfZs'
};

// Initialize Supabase Client
const supabase = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// App Configuration
const APP_CONFIG = {
    brandName: 'Written Exam System',
    negativeMarking: true,
    negativeMarksPerQuestion: 0.25,
    autoSaveInterval: 30000, // 30 seconds
    adminAccessCode: 'ADMIN@2024' // Change this
};

// Access Codes (Store in GitHub)
const ACCESS_CODES = {
    'bina-so-exam-1': 'BINA2024',
    'bina-so-exam-2': 'BINA2025',
    'bari-so-exam-3': 'BARI2024',
    'bsri-exam-4': 'BSRI2024'
};