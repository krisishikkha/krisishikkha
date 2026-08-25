// written-exam/js/timer.js

let timerInterval = null;

/**
 * Timer শুরু করে। examId দিয়ে localStorage-এ endTime সেভ থাকে,
 * তাই refresh হলেও সঠিক সময় থেকে চলবে।
 */
function startTimer(examId, durationMinutes, onTick, onExpire) {
    const storageKey = `we_timer_end_${examId}`;
    let endTime = localStorage.getItem(storageKey);

    if (!endTime) {
        endTime = Date.now() + durationMinutes * 60 * 1000;
        localStorage.setItem(storageKey, endTime);
    } else {
        endTime = parseInt(endTime, 10);
    }

    function tick() {
        const remainingMs = endTime - Date.now();

        if (remainingMs <= 0) {
            clearInterval(timerInterval);
            onExpire();
            return;
        }

        const totalSeconds = Math.floor(remainingMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        onTick(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }

    tick();
    timerInterval = setInterval(tick, 1000);
}

function stopTimer(examId) {
    clearInterval(timerInterval);
    localStorage.removeItem(`we_timer_end_${examId}`);
}