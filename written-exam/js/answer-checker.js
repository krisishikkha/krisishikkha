// ============================================
// Answer Checker
// ============================================

function checkAnswer(studentAnswer, acceptedAnswers) {
    if (!studentAnswer || !acceptedAnswers || acceptedAnswers.length === 0) {
        return false;
    }

    let normalized = studentAnswer.trim().toLowerCase();

    // Bengali to English number conversion
    const bengaliNumbers = {
        '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
        '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };

    for (let bn in bengaliNumbers) {
        normalized = normalized.replace(new RegExp(bn, 'g'), bengaliNumbers[bn]);
    }

    normalized = normalized.replace(/\s+/g, ' ');

    return acceptedAnswers.some(acceptedAnswer => {
        let normalizedAccepted = acceptedAnswer.trim().toLowerCase();
        normalizedAccepted = normalizedAccepted.replace(/\s+/g, ' ');
        return normalized === normalizedAccepted;
    });
}

console.log('✅ Answer checker loaded');
