// ==========================================
// PDF Viewer - Advanced Version
// Created for krisishikkha.com
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

// PDF.js worker setup (CDN থেকে)
pdfjsLib.GlobalWorkerOptions.workerSrc = 
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Get PDF path from URL
const params = new URLSearchParams(window.location.search);
let pdfPath = params.get("pdf");

// Validation
if (!pdfPath) {
    showError("PDF নির্দিষ্ট করা হয়নি। URL এ ?pdf=filename.pdf যোগ করুন।");
    throw new Error("PDF missing");
}

// GitHub path correction
if (!pdfPath.startsWith('http')) {
    pdfPath = "/krisishikkha/" + pdfPath;
}

// Progress tracking
const progressKey = "pdf-progress-" + encodeURIComponent(pdfPath);
let pdfDoc = null;
let totalHeight = 0;
let renderedPages = 0;
let canvasHeights = [];

// ==========================================
// Error Handler
// ==========================================
function showError(message) {
    elements.loadingScreen.style.display = 'none';
    elements.errorBox.style.display = 'block';
    elements.errorMessage.textContent = message;
}

// ==========================================
// Load PDF
// ==========================================
async function loadPDF() {
    try {
        elements.loadingScreen.style.display = 'flex';
        
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        
        pdfDoc = await loadingTask.promise;
        
        elements.totalPages.textContent = pdfDoc.numPages;
        
        // Render all pages
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            await renderPage(pageNum);
        }
        
        // Hide loading, show progress bar
        elements.loadingScreen.style.display = 'none';
        elements.progressBox.style.display = 'flex';
        
        // Restore previous progress
        restoreProgress();
        
        // Enable scroll tracking
        enableScrollTracking();
        
    } catch (error) {
        console.error('PDF Load Error:', error);
        showError(`PDF লোড করতে ব্যর্থ: ${error.message}`);
    }
}

// ==========================================
// Render Single Page
// ==========================================
async function renderPage(pageNum) {
    try {
        const page = await pdfDoc.getPage(pageNum);
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Responsive scale calculation
        const containerWidth = Math.min(window.innerWidth - 40, 1200);
        const viewport = page.getViewport({ scale: 1 });
        const scale = containerWidth / viewport.width;
        
        const scaledViewport = page.getViewport({ scale: scale });
        
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        
        canvas.setAttribute('data-page', pageNum);
        
        elements.pdfContainer.appendChild(canvas);
        
        await page.render({
            canvasContext: ctx,
            viewport: scaledViewport
        }).promise;
        
        // Store height for progress calculation
        canvasHeights.push(canvas.offsetTop + canvas.height);
        totalHeight = Math.max(totalHeight, canvas.offsetTop + canvas.height);
        
        renderedPages++;
        
    } catch (error) {
        console.error(`Page ${pageNum} render error:`, error);
    }
}

// ==========================================
// Scroll Progress Tracking
// ==========================================
function enableScrollTracking() {
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        
        // Progress percentage
        const scrollPercent = Math.min(100, Math.round(
            ((scrollTop + windowHeight) / docHeight) * 100
        ));
        
        elements.progressPercent.textContent = scrollPercent + '%';
        
        // Current page detection
        const currentPage = getCurrentPage(scrollTop + windowHeight / 2);
        elements.currentPage.textContent = currentPage;
        
        // Save progress
        localStorage.setItem(progressKey, JSON.stringify({
            percent: scrollPercent,
            page: currentPage,
            scrollTop: scrollTop
        }));
    });
}

// ==========================================
// Get Current Page Number
// ==========================================
function getCurrentPage(scrollPosition) {
    const canvases = elements.pdfContainer.querySelectorAll('canvas');
    
    for (let i = 0; i < canvases.length; i++) {
        const canvas = canvases[i];
        const rect = canvas.getBoundingClientRect();
        
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            return i + 1;
        }
    }
    
    return 1;
}

// ==========================================
// Restore Previous Progress
// ==========================================
function restoreProgress() {
    const saved = localStorage.getItem(progressKey);
    
    if (saved) {
        try {
            const data = JSON.parse(saved);
            
            elements.progressPercent.textContent = data.percent + '%';
            elements.currentPage.textContent = data.page;
            
            // Scroll to last position (optional)
            // window.scrollTo(0, data.scrollTop);
            
        } catch (e) {
            console.error('Progress restore error:', e);
        }
    }
}

// ==========================================
// PWA Install Prompt
// ==========================================
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 400 && deferredPrompt) {
        elements.installBtn.style.display = 'block';
    }
});

elements.installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            elements.installBtn.style.display = 'none';
        }
        
        deferredPrompt = null;
    }
});

// ==========================================
// Initialize
// ==========================================
loadPDF();

// Save progress before page unload
window.addEventListener('beforeunload', () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    
    const scrollPercent = Math.min(100, Math.round(
        ((scrollTop + windowHeight) / docHeight) * 100
    ));
    
    const currentPage = getCurrentPage(scrollTop + windowHeight / 2);
    
    localStorage.setItem(progressKey, JSON.stringify({
        percent: scrollPercent,
        page: currentPage,
        scrollTop: scrollTop
    }));
});
