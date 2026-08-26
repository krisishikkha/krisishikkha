// written-exam/js/config.js
// Supabase Configuration for Written Exam System

const SUPABASE_CONFIG = {
    url: 'https://bpkheipwdjzlyuzyqdxz.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwa2hlaXB3ZGp6bHl1enlxZHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNDIxNDEsImV4cCI6MjA4ODYxODE0MX0.OGgbZffNS8q6IOnCY0Hq02D0A_MTfHPFZ8KSzBcAfZs'
};

// WhatsApp ভর্তি যোগাযোগ তথ্য (সব পেজে দরকার, তাই Supabase-এর আগে বসানো হলো)
const ADMISSION_WHATSAPP_NUMBER = '8801516013089';
const ADMISSION_WHATSAPP_MESSAGE = 'I want to enroll in the Written Exam batch';

// Supabase client শুধুমাত্র তখনই বানানো হবে, যদি supabase-js CDN আগে থেকে লোড থাকে
// (index.html-এর মতো পেজে Supabase লাগে না, তাই সেখানে CDN লোড করা হয় না — এটা যেন সেখানে crash না করে)
let supabaseClient = null;
if (typeof window.supabase !== 'undefined') {
    supabaseClient = window.supabase.createClient(
        SUPABASE_CONFIG.url,
        SUPABASE_CONFIG.anonKey
    );
}

const SUBMISSIONS_TABLE = 'written_exam_submissions';