// written-exam/js/answer-checker.js

/**
 * একটি answer normalize করে — spacing, case, সাধারণ punctuation ঠিক করে
 * বাংলা ও ইংরেজি উভয়ের জন্য কাজ করবে
 */
function normalizeAnswer(text) {
    if (!text) return '';

    return text
        .toString()
        .trim()
        .replace(/\s+/g, ' ')              // একাধিক স্পেস → একটা স্পেস
        .toLowerCase()                      // ইংরেজির জন্য case-insensitive (বাংলায় প্রভাব নেই)
        .replace(/[.।,;:!?]+$/g, '')        // শেষে থাকা যতিচিহ্ন বাদ (বাংলা দাঁড়ি সহ)
        .replace(/\s*-\s*/g, '-')           // হাইফেনের চারপাশের স্পেস normalize
        .trim();
}

/**
 * student-এর answer কে accepted answers array-এর সাথে মেলায়।
 * মিললে matched accepted answer (original form) রিটার্ন করে, না মিললে null।
 */
function checkAnswer(studentAnswer, acceptedAnswers) {
    if (!studentAnswer || !Array.isArray(acceptedAnswers)) return null;

    const normalizedStudent = normalizeAnswer(studentAnswer);
    if (!normalizedStudent) return null;

    for (const accepted of acceptedAnswers) {
        if (normalizeAnswer(accepted) === normalizedStudent) {
            return accepted; // exact normalized match — কোনো fuzzy matching নেই, false positive এড়াতে
        }
    }
    return null;
}