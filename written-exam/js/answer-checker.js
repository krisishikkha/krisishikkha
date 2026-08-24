// Answer Checking Logic
class AnswerChecker {
    constructor() {
        this.normalizeOptions = {
            caseSensitive: false,
            trimSpaces: true,
            removePunctuation: true,
            normalizeNumbers: true
        };
    }

    // Main answer checking method
    checkAnswer(userAnswer, acceptedAnswers) {
        if (!userAnswer || userAnswer.trim() === '') {
            return { isCorrect: false, matchedAnswer: null };
        }

        const normalizedUserAnswer = this.normalizeAnswer(userAnswer);

        for (let acceptedAnswer of acceptedAnswers) {
            const normalizedAccepted = this.normalizeAnswer(acceptedAnswer);
            
            if (this.isMatch(normalizedUserAnswer, normalizedAccepted)) {
                return { isCorrect: true, matchedAnswer: acceptedAnswer };
            }
        }

        return { isCorrect: false, matchedAnswer: null };
    }

    // Normalize answer for comparison
    normalizeAnswer(answer) {
        if (!answer) return '';

        let normalized = answer;

        // Trim spaces
        if (this.normalizeOptions.trimSpaces) {
            normalized = normalized.trim();
        }

        // Convert to lowercase
        if (!this.normalizeOptions.caseSensitive) {
            normalized = normalized.toLowerCase();
        }

        // Remove punctuation
        if (this.normalizeOptions.removePunctuation) {
            normalized = normalized.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()।]/g, '');
        }

        // Normalize Bengali numbers to English
        if (this.normalizeOptions.normalizeNumbers) {
            const bengaliToEnglish = {
                '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
                '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
            };
            
            Object.keys(bengaliToEnglish).forEach(bn => {
                normalized = normalized.replace(new RegExp(bn, 'g'), bengaliToEnglish[bn]);
            });
        }

        // Remove extra spaces
        normalized = normalized.replace(/\s+/g, ' ').trim();

        return normalized;
    }

    // Check if two normalized answers match
    isMatch(answer1, answer2) {
        return answer1 === answer2;
    }

    // Check if answer is numeric
    isNumeric(answer) {
        return !isNaN(parseFloat(answer)) && isFinite(answer);
    }

    // Get similarity percentage (for partial matching - optional)
    getSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 1.0;
        
        const editDistance = this.getEditDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    }

    // Levenshtein distance for similarity checking
    getEditDistance(str1, str2) {
        const matrix = [];

        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        return matrix[str2.length][str1.length];
    }
}