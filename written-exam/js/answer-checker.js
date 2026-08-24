// ============================================
// Answer Checker Module
// Smart Answer Matching for Written Exams
// ============================================

/**
 * Check if student answer matches any accepted answer
 * @param {string} studentAnswer - Student's submitted answer
 * @param {array} acceptedAnswers - Array of correct answers
 * @returns {boolean} - True if answer is correct
 */
function checkAnswer(studentAnswer, acceptedAnswers) {
    if (!studentAnswer || !acceptedAnswers || acceptedAnswers.length === 0) {
        return false;
    }

    // Normalize student answer
    const normalizedStudentAnswer = normalizeAnswer(studentAnswer);

    // Check against each accepted answer
    for (let acceptedAnswer of acceptedAnswers) {
        const normalizedAcceptedAnswer = normalizeAnswer(acceptedAnswer);
        
        if (normalizedStudentAnswer === normalizedAcceptedAnswer) {
            return true;
        }
    }

    return false;
}

/**
 * Normalize answer for comparison
 * @param {string} answer - Raw answer
 * @returns {string} - Normalized answer
 */
function normalizeAnswer(answer) {
    if (!answer) return '';

    let normalized = answer;

    // Convert to string if not already
    normalized = String(normalized);

    // Trim leading/trailing spaces
    if (ANSWER_CHECKER_CONFIG.trimSpaces) {
        normalized = normalized.trim();
    }

    // Convert to lowercase (if case-insensitive)
    if (!ANSWER_CHECKER_CONFIG.caseSensitive) {
        normalized = normalized.toLowerCase();
    }

    // Normalize multiple spaces to single space
    if (ANSWER_CHECKER_CONFIG.normalizeSpaces) {
        normalized = normalized.replace(/\s+/g, ' ');
    }

    // Normalize Bengali numbers to English
    if (ANSWER_CHECKER_CONFIG.normalizeBengaliNumbers) {
        normalized = normalizeBengaliToEnglishNumbers(normalized);
    }

    // Remove common punctuation (if configured)
    if (ANSWER_CHECKER_CONFIG.removePunctuation) {
        normalized = normalized.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
        normalized = normalized.trim();
    }

    return normalized;
}

/**
 * Convert Bengali numbers to English numbers
 * @param {string} text - Text containing Bengali numbers
 * @returns {string} - Text with English numbers
 */
function normalizeBengaliToEnglishNumbers(text) {
    const bengaliNumbers = {
        '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
        '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };

    let result = text;
    for (let bengali in bengaliNumbers) {
        result = result.replace(new RegExp(bengali, 'g'), bengaliNumbers[bengali]);
    }

    return result;
}

/**
 * Fuzzy match (optional - for future use)
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Similarity score (0-1)
 */
function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) {
        return 1.0;
    }
    
    const editDistance = getEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate Levenshtein distance
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Edit distance
 */
function getEditDistance(str1, str2) {
    const costs = [];
    
    for (let i = 0; i <= str1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= str2.length; j++) {
            if (i === 0) {
                costs[j] = j;
            } else if (j > 0) {
                let newValue = costs[j - 1];
                if (str1.charAt(i - 1) !== str2.charAt(j - 1)) {
                    newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                }
                costs[j - 1] = lastValue;
                lastValue = newValue;
            }
        }
        if (i > 0) {
            costs[str2.length] = lastValue;
        }
    }
    
    return costs[str2.length];
}

/**
 * Check answer with fuzzy matching (if enabled)
 * @param {string} studentAnswer - Student's answer
 * @param {array} acceptedAnswers - Array of correct answers
 * @returns {boolean} - True if answer is correct (with fuzzy match)
 */
function checkAnswerFuzzy(studentAnswer, acceptedAnswers) {
    if (!ANSWER_CHECKER_CONFIG.enableFuzzyMatch) {
        return checkAnswer(studentAnswer, acceptedAnswers);
    }

    const normalizedStudentAnswer = normalizeAnswer(studentAnswer);

    for (let acceptedAnswer of acceptedAnswers) {
        const normalizedAcceptedAnswer = normalizeAnswer(acceptedAnswer);
        const similarity = calculateSimilarity(normalizedStudentAnswer, normalizedAcceptedAnswer);
        
        if (similarity >= ANSWER_CHECKER_CONFIG.fuzzyMatchThreshold) {
            return true;
        }
    }

    return false;
}

// Export functions (for ES6 modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkAnswer,
        normalizeAnswer,
        normalizeBengaliToEnglishNumbers,
        calculateSimilarity,
        checkAnswerFuzzy
    };
}
