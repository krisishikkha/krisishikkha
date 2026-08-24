// Review Controller
class ReviewController {
    constructor() {
        this.resultData = null;
        this.init();
    }

    init() {
        const storedData = sessionStorage.getItem('examResults');
        
        if (!storedData) {
            alert('No results found. Redirecting to home...');
            window.location.href = 'index.html';
            return;
        }

        this.resultData = JSON.parse(storedData);
        this.displayReview();
    }

    displayReview() {
        document.getElementById('examName').textContent = this.resultData.examName;

        const container = document.getElementById('reviewContainer');
        const { questions, results, answers } = this.resultData;

        container.innerHTML = questions.map((question, index) => {
            const questionResult = results.questionResults[question.id];
            const userAnswer = answers[question.id];

            return this.createQuestionReview(question, questionResult, userAnswer, index);
        }).join('');
    }

    createQuestionReview(question, result, userAnswer, index) {
        const statusClass = result.status;
        const statusText = {
            'correct': '✓ Correct',
            'wrong': '✗ Wrong',
            'skipped': '○ Not Answered'
        }[statusClass];

        const statusColor = {
            'correct': '#10B981',
            'wrong': '#EF4444',
            'skipped': '#F59E0B'
        }[statusClass];

        return `
            <div class="review-question ${statusClass}">
                <div class="review-header">
                    <span class="question-number"><strong>Question ${index + 1}</strong></span>
                    <span class="review-status ${statusClass}">${statusText}</span>
                </div>

                <div class="review-question-text">
                    <div style="margin-bottom: 10px;">
                        <strong>বাংলা:</strong> ${question.question}
                    </div>
                    <div>
                        <strong>English:</strong> ${question.questionEnglish || question.question}
                    </div>
                </div>

                <div class="review-answers">
                    ${userAnswer.isAnswered ? 
                        `<div class="review-answer-item">
                            <strong>Your Answer:</strong> 
                            <span style="color: ${result.isCorrect ? '#10B981' : '#EF4444'}">
                                ${userAnswer.answer || 'Not answered'}
                            </span>
                        </div>` 
                        : 
                        `<div class="review-answer-item">
                            <strong>Your Answer:</strong> 
                            <span style="color: #F59E0B">Not answered</span>
                        </div>`
                    }
                    
                    <div class="review-answer-item">
                        <strong>Correct Answer:</strong> 
                        <span style="color: #10B981; font-weight: 600;">
                            ${question.correctAnswer}
                        </span>
                    </div>

                    ${question.acceptedAnswers.length > 1 ? 
                        `<div class="review-answer-item">
                            <strong>Accepted Answers:</strong> 
                            ${question.acceptedAnswers.join(', ')}
                        </div>` 
                        : ''
                    }
                </div>

                <div class="review-explanation">
                    <strong>📖 Explanation:</strong>
                    <div style="margin-top: 8px;">
                        <div>${question.explanation}</div>
                        ${question.explanationEnglish ? 
                            `<div style="margin-top: 8px; color: #6B7280;">
                                ${question.explanationEnglish}
                            </div>` 
                            : ''
                        }
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new ReviewController();
});