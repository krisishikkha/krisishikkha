const params = new URLSearchParams(window.location.search);
const pdfParam = params.get("pdf");
const titleParam = params.get("title");

const docTitle = document.getElementById("docTitle");
const docMeta = document.getElementById("docMeta");
const loadingBox = document.getElementById("loadingBox");
const pdfContainer = document.getElementById("pdfContainer");
const progressText = document.getElementById("progressPercent");
const pageCountText = document.getElementById("pageCount");

if (titleParam) {
  docTitle.textContent = decodeURIComponent(titleParam);
}

if (!pdfParam) {
  loadingBox.textContent = "PDF not specified.";
  throw new Error("PDF path missing");
}

// Optional premium gate for viewer query use
const accessType = params.get("access");
if (accessType === "premium") {
  if (typeof getAccessState === "function") {
    const state = getAccessState();
    if (!state.valid) {
      loadingBox.textContent = "This premium PDF is locked.";
      throw new Error("Premium access denied");
    }
  }
}

// GitHub Pages repo-relative path
const pdfPath = "/krisishikkha/bcs/" + pdfParam;

// pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = "/krisishikkha/vendor/pdfjs/pdf.worker.min.js";

const progressKey = "bcs-pdf-progress-" + pdfPath;

let totalPages = 0;
let renderedPages = 0;
let viewedPercent = 0;

async function renderPDF() {
  try {
    const pdf = await pdfjsLib.getDocument(pdfPath).promise;
    totalPages = pdf.numPages;
    pageCountText.textContent = totalPages;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      const viewport = page.getViewport({ scale: 1.35 });

      const wrap = document.createElement("div");
      wrap.className = "pdf-page-wrap";

      const canvas = document.createElement("canvas");
      canvas.className = "pdf-page-canvas";
      const ctx = canvas.getContext("2d", { alpha: false });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const label = document.createElement("div");
      label.className = "page-label";
      label.textContent = `Page ${pageNum}`;

      wrap.appendChild(canvas);
      wrap.appendChild(label);
      pdfContainer.appendChild(wrap);

      await page.render({
        canvasContext: ctx,
        viewport: viewport
      }).promise;

      renderedPages++;

      if (renderedPages === totalPages) {
        loadingBox.style.display = "none";
      }
    }

    const saved = localStorage.getItem(progressKey);
    if (saved) {
      progressText.textContent = saved + "%";
    }
  } catch (error) {
    loadingBox.textContent = "Failed to load PDF.";
    docMeta.textContent = "Please check the file path.";
    console.error(error);
  }
}

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (docHeight <= 0) {
    progressText.textContent = "0%";
    return;
  }

  viewedPercent = Math.min(100, Math.round((scrollTop / docHeight) * 100));
  progressText.textContent = viewedPercent + "%";
  localStorage.setItem(progressKey, viewedPercent);
}

window.addEventListener("scroll", updateScrollProgress);

window.addEventListener("beforeunload", () => {
  localStorage.setItem(progressKey, viewedPercent);
});

renderPDF();
