document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("autoList");
  if (!container) return;

  const mode = container.dataset.mode; // notes / articles / question-bank / syllabus
  const jsonFile = container.dataset.json || "files.json";

  function formatTitleFromFileName(fileName) {
    const clean = fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]+/g, " ")
      .trim();

    return clean.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function getAutoSubtitle(isPremium, mode) {
    if (mode === "notes") {
      return isPremium
        ? "Premium PDF note for this topic."
        : "Free PDF note for this topic.";
    }

    if (mode === "question-bank") {
      return isPremium
        ? "Premium question set PDF."
        : "Free question set PDF.";
    }

    if (mode === "syllabus") {
      return isPremium
        ? "Premium syllabus PDF."
        : "Free syllabus PDF.";
    }

    if (mode === "articles") {
      return isPremium
        ? "Premium article for this topic."
        : "Free article for this topic.";
    }

    return "";
  }

  function getCurrentSectionPath() {
    const path = window.location.pathname;
    const marker = "/research/";
    const idx = path.indexOf(marker);

    if (idx === -1) return "";
    const afterResearch = path.substring(idx + marker.length);
    return afterResearch.replace(/index\.html$/, "");
  }

  function buildPdfHref(file, isPremium) {
    const sectionPath = getCurrentSectionPath();
    const accessPart = isPremium ? "&access=premium" : "";
    return `../../viewer/index.html?pdf=${sectionPath}${encodeURIComponent(file).replace(/%2F/g, "/")}${accessPart}`;
  }

  function buildQuestionBankHref(file, isPremium) {
    const sectionPath = getCurrentSectionPath();
    const accessPart = isPremium ? "&access=premium" : "";
    return `../../viewer/index.html?pdf=${sectionPath}${encodeURIComponent(file).replace(/%2F/g, "/")}${accessPart}`;
  }

  function buildSyllabusHref(file, isPremium) {
    const sectionPath = getCurrentSectionPath();
    const accessPart = isPremium ? "&access=premium" : "";
    return `../viewer/index.html?pdf=${sectionPath}${encodeURIComponent(file).replace(/%2F/g, "/")}${accessPart}`;
  }

  function buildArticlesHref(file) {
    return file;
  }

  function createCard(item) {
    const file = item.file;
    const isPremium = !!item.premium;
    const title = item.title || formatTitleFromFileName(file);
    const subtitle = item.subtitle || getAutoSubtitle(isPremium, mode);

    const a = document.createElement("a");
    a.className = isPremium ? "list-card premium-item" : "list-card";

    if (mode === "notes") {
      a.href = buildPdfHref(file, isPremium);
      a.dataset.type = "pdf";
      a.dataset.title = title;
    } else if (mode === "question-bank") {
      a.href = buildQuestionBankHref(file, isPremium);
      a.dataset.type = "pdf";
      a.dataset.title = title;
    } else if (mode === "syllabus") {
      a.href = buildSyllabusHref(file, isPremium);
      a.dataset.type = "pdf";
      a.dataset.title = title;
    } else if (mode === "articles") {
      a.href = buildArticlesHref(file);
      a.dataset.type = "article";
      a.dataset.title = title;
    }

    a.innerHTML = `
      <div class="list-card-left">
        <span class="list-icon">${isPremium ? "🔒" : (mode === "articles" ? "📘" : "📄")}</span>
        <div class="list-content">
          <span class="list-title">${title}</span>
          <span class="list-subtitle">${subtitle}</span>
        </div>
      </div>
      <span class="badge ${isPremium ? "premium-badge" : "free-badge"}">
        ${isPremium ? "Premium" : "Free"}
      </span>
    `;

    return a;
  }

  try {
    const response = await fetch(jsonFile, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("JSON file not found");
    }

    const items = await response.json();
    container.innerHTML = "";

    if (!Array.isArray(items) || items.length === 0) {
      container.innerHTML = `
        <div class="page-box">
          <p class="empty-note">No files found for this section yet.</p>
        </div>
      `;
      return;
    }

    items.forEach((item) => {
      if (!item.file) return;
      container.appendChild(createCard(item));
    });
  } catch (error) {
    console.error(error);
    container.innerHTML = `
      <div class="page-box">
        <p class="empty-note">Failed to load section items.</p>
      </div>
    `;
  }
});
