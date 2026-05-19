// ==========================================
// PDF Viewer for krisishikkha.com
// Custom Domain + GitHub Pages Compatible
// ==========================================

const elements = {
    loadingScreen: document.getElementById('loadingScreen'),
    errorBox: document.getElementById('errorBox'),
    errorMessage: document.getElementById('errorMessage'),
    progressBox: document.getElementById('progressBox'),
    progressPercent: document.getElementById('progressPercent'),
    currentPage: document.getElementById('currentPage'),
    totalPages: document.getElementById('totalPages'),
    pdfContainer: document.getElementById('pdfContainer'),
    installBtn: document.getElementById('installBtn')
};

// PDF.js Worker CDN
pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// URL থেকে PDF path নেওয়া
const params = new URLSearchParams(window.location.search);
let pdfPath = params.get("pdf");

if (!pdfPath) {
    showError("PDF নির্দিষ্ট করা হয়নি। URL এ ?pdf=pdf/file.pdf দিতে হবে।");
    throw new Error("PDF missing");
}

// ==========================================
// Smart PDF Path Builder
// ==========================================
function buildPDFPath(path) {
    path = path.trim();

    // যদি full URL দেওয়া থাকে
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    const hostname = window.location.hostname;

    // Custom domain হলে base path খালি
    // www.krisishikkha.com বা krisishikkha.com
    let basePath = "";

    // যদি github.io দিয়ে open করা হয়, তখন repo name দরকার হবে
    if (hostname.includes("github.io")) {
        basePath = "/krisishikkha";
    }

    // ভুল করে যদি path এর শুরুতে krisishikkha/ থাকে, সেটা remove করব
    // যেমন: krisishikkha/pdf/...
    if (path.startsWith("krisishikkha/")) {
        path = path.replace("krisishikkha/", "");
    }

    // ভুল করে যদি /krisishikkha/pdf/... থাকে, custom domain এ সেটা ঠিক করব
    if (!hostname.includes("github.io") && path.startsWith("/krisishikkha/")) {
        path = path.replace("/krisishikkha/", "");
    }

    // শুরুতে / থাকলে remove করি, পরে নিজে add করব
    path = path.replace(/^\/+/, "");

    return basePath + "/" + path;
}

pdfPath = buildPDFPath(pdfPath);

console.log("Final PDF Path:", pdfPath);

// Progress key
const progressKey = "pdf-progress-" + encodeURIComponent(pdfPath);

let pdfDoc = null;
let renderedPages = 0;

// ==========================================
// Error Handler
// ==========================================
function showError(message) {
    if (elements.loadingScreen) {
        elements.loadingScreen.style.display = 'none';
    }

    if (elements.errorBox && elements.errorMessage) {
        elements.errorBox.style.display = 'block';
        elements.errorMessage.textContent = message;
    } else {
        alert(message);
    }
}

// ==========================================
// Load PDF
// ==========================================
async function loadPDF() {
    try {
        if (elements.loadingScreen) {
            elements.loadingScreen.style.display = 'flex';
        }

        const loadingTask = pdfjsLib.getDocument({
            url: pdfPath,
            disableAutoFetch: false,
            disableStream: false
        });

        pdfDoc = await loadingTask.promise;

        elements.totalPages.textContent = pdfDoc.numPages;

        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            await renderPage(pageNum);
        }

        if (elements.loadingScreen) {
            elements.loadingScreen.style.display = 'none';
        }

        elements.progressBox.style.display = 'flex';

        restoreProgress();
        updateProgress();
        enableScrollTracking();

    } catch (error) {
        console.error("PDF Load Error:", error);
        showError("PDF লোড করতে ব্যর্থ: " + error.message);
    }
}

// ==========================================
// Render Page
// ==========================================
async function renderPage(pageNum) {
    const page = await pdfDoc.getPage(pageNum);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const originalViewport = page.getViewport({ scale: 1 });

    // Mobile/Desktop responsive width
    const availableWidth = Math.min(window.innerWidth - 24, 1000);
    const scale = availableWidth / originalViewport.width;

    const viewport = page.getViewport({ scale });

    const outputScale = window.devicePixelRatio || 1;

    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);

    canvas.style.width = Math.floor(viewport.width) + "px";
    canvas.style.height = Math.floor(viewport.height) + "px";

    canvas.setAttribute("data-page", pageNum);

    elements.pdfContainer.appendChild(canvas);

    const transform = outputScale !== 1
        ? [outputScale, 0, 0, outputScale, 0, 0]
        : null;

    await page.render({
        canvasContext: ctx,
        viewport: viewport,
        transform: transform
    }).promise;

    renderedPages++;
}

// ==========================================
// Progress Tracking
// ==========================================
function enableScrollTracking() {
    window.addEventListener("scroll", updateProgress, { passive: true });
}

function updateProgress() {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    let percent = Math.round(((scrollTop + windowHeight) / documentHeight) * 100);
    percent = Math.min(100, Math.max(0, percent));

    const currentPage = getCurrentPage();

    elements.progressPercent.textContent = percent + "%";
    elements.currentPage.textContent = currentPage;

    localStorage.setItem(progressKey, JSON.stringify({
        percent: percent,
        page: currentPage,
        scrollTop: scrollTop
    }));
}

function getCurrentPage() {
    const canvases = elements.pdfContainer.querySelectorAll("canvas");

    let current = 1;
    const middle = window.innerHeight / 2;

    canvases.forEach((canvas, index) => {
        const rect = canvas.getBoundingClientRect();

        if (rect.top <= middle && rect.bottom >= middle) {
            current = index + 1;
        }
    });

    return current;
}

// ==========================================
// Restore Progress
// ==========================================
function restoreProgress() {
    const saved = localStorage.getItem(progressKey);

    if (!saved) return;

    try {
        const data = JSON.parse(saved);

        elements.progressPercent.textContent = data.percent + "%";
        elements.currentPage.textContent = data.page;

        // চাইলে আগের জায়গায় auto scroll করবে
        // অসুবিধা হলে নিচের ৩ লাইন comment করে দিতে পারেন
        if (data.scrollTop && data.scrollTop > 0) {
            setTimeout(() => {
                window.scrollTo(0, data.scrollTop);
            }, 300);
        }

    } catch (e) {
        console.error("Progress restore failed:", e);
    }
}

// ==========================================
// PWA Install Button
// ==========================================
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

if (elements.installBtn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 400 && deferredPrompt) {
            elements.installBtn.style.display = "block";
        }
    }, { passive: true });

    elements.installBtn.addEventListener("click", async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            elements.installBtn.style.display = "none";
        }

        deferredPrompt = null;
    });
}

// ==========================================
// Save before unload
// ==========================================
window.addEventListener("beforeunload", updateProgress);

// Start
loadPDF();
