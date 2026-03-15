const params = new URLSearchParams(window.location.search);
const pdfParam = params.get("pdf");
const titleParam = params.get("title");
const accessType = params.get("access");

const docTitle = document.getElementById("docTitle");
const docMeta = document.getElementById("docMeta");
const loadingBox = document.getElementById("loadingBox");
const pdfContainer = document.getElementById("pdfContainer");
const progressText = document.getElementById("progressPercent");
const pageCountText = document.getElementById("pageCount");

if (!pdfParam) {
  loadingBox.textContent = "PDF path not found.";
  throw new Error("Missing pdf parameter");
}

function makeTitleFromFileName(path) {
  const fileName = path.split("/").pop().replace(".pdf", "");
  return fileName
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

if (titleParam) {
  docTitle.textContent = decodeURIComponent(titleParam);
} else {
  docTitle.textContent = makeTitleFromFileName(pdfParam);
}

if (accessType === "premium") {
  if (typeof getAccessState === "function") {
    const state = getAccessState();
    if (!state.valid) {
      loadingBox.textContent = "This premium PDF is locked.";
      throw new Error("Premium access denied");
    }
  }
}

const pdfPath = "/krisishikkha/research/" + pdfParam;

pdfjsLib.GlobalWorkerOptions.workerSrc = "/krisishikkha/vendor/pdfjs/pdf.worker.min.js";

const progressKey = "research-pdf-progress-" + pdfPath;

let totalPages = 0;
let viewedPercent = 0;

function getRenderScale() {
  return window.innerWidth < 768 ? 1.0 : 1.15;
}

async function renderPage(pdf, pageNum, scale) {
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale });

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
}

async function renderPDF() {
  try {
    loadingBox.textContent = "Loading PDF...";

    const pdf = await pdfjsLib.getDocument(pdfPath).promise;
    totalPages = pdf.numPages;
    pageCountText.textContent = totalPages;

    const scale = getRenderScale();

    await renderPage(pdf, 1, scale);
    loadingBox.style.display = "none";

    for (let pageNum = 2; pageNum <= totalPages; pageNum++) {
      await renderPage(pdf, pageNum, scale);
    }

    const saved = localStorage.getItem(progressKey);
    if (saved) {
      progressText.textContent = saved + "%";
    }
  } catch (error) {
    console.error("PDF load error:", error);
    loadingBox.style.display = "block";
    loadingBox.textContent = "Failed to load PDF. Check file path.";
    docMeta.textContent = pdfPath;
    pageCountText.textContent = "0";
  }
}

function updateScrollProgress() {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (docHeight <= 0) {
    progressText.textContent = "0%";
    return;
  }

  const scrollTop = window.scrollY;
  viewedPercent = Math.min(100, Math.round((scrollTop / docHeight) * 100));
  progressText.textContent = viewedPercent + "%";
  localStorage.setItem(progressKey, viewedPercent);
}

window.addEventListener("scroll", updateScrollProgress);

window.addEventListener("beforeunload", () => {
  localStorage.setItem(progressKey, viewedPercent);
});

renderPDF();
