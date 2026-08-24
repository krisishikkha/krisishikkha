// Timer Management
class ExamTimer {
    constructor(durationMinutes, onTimeUp, onTick) {
        this.totalSeconds = durationMinutes * 60;
        this.remainingSeconds = this.totalSeconds;
        this.timerInterval = null;
        this.onTimeUp = onTimeUp;
        this.onTick = onTick;
        this.isPaused = false;
    }

    start() {
        this.timerInterval = setInterval(() => {
            if (!this.isPaused) {
                this.remainingSeconds--;
                this.updateDisplay();
                
                if (this.onTick) {
                    this.onTick(this.remainingSeconds);
                }

                if (this.remainingSeconds <= 0) {
                    this.stop();
                    if (this.onTimeUp) {
                        this.onTimeUp();
                    }
                }
            }
        }, 1000);
    }

    stop() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    updateDisplay() {
        const timerElement = document.getElementById('timer');
        if (!timerElement) return;

        const minutes = Math.floor(this.remainingSeconds / 60);
        const seconds = this.remainingSeconds % 60;
        
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timerElement.textContent = timeString;

        // Add warning classes
        timerElement.classList.remove('warning', 'danger');
        
        if (this.remainingSeconds <= 60) {
            timerElement.classList.add('danger');
        } else if (this.remainingSeconds <= 300) {
            timerElement.classList.add('warning');
        }
    }

    getTimeElapsed() {
        return this.totalSeconds - this.remainingSeconds;
    }

    getFormattedTime() {
        const minutes = Math.floor(this.remainingSeconds / 60);
        const seconds = this.remainingSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}