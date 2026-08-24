// Result Display Controller
class ResultController {
    constructor() {
        this.resultData = null;
        this.init();
    }

    init() {
        // Get results from sessionStorage
        const storedData = sessionStorage.getItem('examResults');
        
        if (!storedData) {
            alert('No results found. Redirecting to home...');
            window.location.href = 'index.html';
            return;
        }

        this.resultData = JSON.parse(storedData);
        this.displayResults();
        this.setupEventListeners();
    }

    displayResults() {
        const { examName, studentName, results } = this.resultData;

        // Set exam name and student info
        document.getElementById('examName').textContent = examName;
        document.getElementById('studentName').textContent = `Student: ${studentName}`;
        document.getElementById('submissionTime').textContent = 
            `Submitted: ${new Date().toLocaleString()}`;

        // Display statistics
        document.getElementById('totalQuestions').textContent = results.totalQuestions;
        document.getElementById('answered').textContent = results.answered;
        document.getElementById('correct').textContent = results.correct;
        document.getElementById('wrong').textContent = results.wrong;
        document.getElementById('skipped').textContent = results.skipped;

        // Display marks
        document.getElementById('totalMarks').textContent = results.totalMarks;
        document.getElementById('obtainedMarks').textContent = results.obtainedMarks.toFixed(2);
        document.getElementById('percentage').textContent = results.percentage + '%';

        // Add performance message
        this.showPerformanceMessage(parseFloat(results.percentage));
    }

    showPerformanceMessage(percentage) {
        const resultContainer = document.querySelector('.result-container');
        
        let message = '';
        let emoji = '';
        let color = '';

        if (percentage >= 80) {
            message = 'Excellent! Outstanding Performance! / চমৎকার! অসাধারণ পারফরম্যান্স!';
            emoji = '🏆';
            color = '#10B981';
        } else if (percentage >= 60) {
            message = 'Good Job! Keep it up! / ভালো করেছেন! এভাবে চালিয়ে যান!';
            emoji = '👍';
            color = '#3B82F6';
        } else if (percentage >= 40) {
            message = 'Fair Performance. Practice more! / মোটামুটি। আরো অনুশীলন করুন!';
            emoji = '📚';
            color = '#F59E0B';
        } else {
            message = 'Need Improvement. Don\'t give up! / উন্নতি প্রয়োজন। হাল ছাড়বেন না!';
            emoji = '💪';
            color = '#EF4444';
        }

        const messageBox = document.createElement('div');
        messageBox.style.cssText = `
            background: ${color}22;
            border: 3px solid ${color};
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
            font-size: 18px;
            font-weight: 600;
            color: ${color};
        `;
        messageBox.innerHTML = `${emoji} ${message}`;

        resultContainer.insertBefore(messageBox, document.querySelector('.result-cards'));
    }

    setupEventListeners() {
        document.getElementById('reviewBtn').addEventListener('click', () => {
            window.location.href = 'review.html';
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new ResultController();
});