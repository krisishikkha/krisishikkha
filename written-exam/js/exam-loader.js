// written-exam/js/exam-loader.js
// exams.js-এর তালিকা অনুযায়ী প্রতিটা exam data ফাইল dynamically লোড করে

function loadExamDataFiles(callback) {
    if (typeof EXAMS_REGISTRY === 'undefined' || !Array.isArray(EXAMS_REGISTRY) || EXAMS_REGISTRY.length === 0) {
        console.error('EXAMS_REGISTRY পাওয়া যায়নি বা খালি।');
        callback();
        return;
    }

    let loadedCount = 0;
    const total = EXAMS_REGISTRY.length;

    EXAMS_REGISTRY.forEach(entry => {
        const script = document.createElement('script');
        script.src = 'data/' + entry.file;

        script.onload = () => {
            loadedCount++;
            if (loadedCount === total) callback();
        };
        script.onerror = () => {
            console.error('লোড ব্যর্থ: data/' + entry.file);
            loadedCount++;
            if (loadedCount === total) callback();
        };

        document.head.appendChild(script);
    });
}