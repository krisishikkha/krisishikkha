// written-exam/js/config.js
// Supabase Configuration for Written Exam System

const SUPABASE_CONFIG = {
    url: 'https://bpkheipwdjzlyuzyqdxz.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwa2hlaXB3ZGp6bHl1enlxZHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNDIxNDEsImV4cCI6MjA4ODYxODE0MX0.OGgbZffNS8q6IOnCY0Hq02D0A_MTfHPFZ8KSzBcAfZs'
};

// Supabase client initialize (CDN থেকে supabase-js লোড হওয়ার পর কাজ করবে)
const supabaseClient = window.supabase.createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey
);

// পুরো written-exam মডিউল জুড়ে একই টেবিল নাম ব্যবহার হবে
const SUBMISSIONS_TABLE = 'written_exam_submissions';
// WhatsApp ভর্তি যোগাযোগ তথ্য (সব exam-এর জন্য কমন)
const ADMISSION_WHATSAPP_NUMBER = '8801516013089'; // এখানে আপনার নম্বর বসান, কোড সহ, + বা 00 ছাড়া
const ADMISSION_WHATSAPP_MESSAGE = 'I want to enroll in the Written Exam batch';