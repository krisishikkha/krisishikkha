document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("autoList");
  if (!container) return;

  const mode = container.dataset.mode;
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
      return isPremium ? "Premium note" : "Free note";
    }

    if (mode === "question-bank") {
      return isPremium ? "Premium question set" : "Free question set";
    }

    if (mode === "syllabus") {
      return isPremium ? "Premium syllabus" : "Free syllabus";
    }

    if (mode === "articles") {
      return isPremium ? "Premium article" : "Free article";
    }

    return "";
  }

  function getCurrentSectionPath() {
    const path = window.location.pathname;
    const marker = "/diploma/";
    const idx = path.indexOf(marker);

    if (idx === -1) return "";
    const after = path.substring(idx + marker.length);
    return after.replace(/index\.html$/, "");
  }

  function buildPdfHref(file, isPremium) {
    const sectionPath = getCurrentSectionPath();
    const accessPart = isPremium ? "&access=premium" : "";
    return `../../viewer/index.html?pdf=${sectionPath}${encodeURIComponent(file).replace(/%2F/g, "/")}${accessPart}`;
  }

  function createCard(item) {
    if (item.hidden === true) return null;

    const file = item.file;
    const isPremium = !!item.premium;
    const title = item.title || formatTitleFromFileName(file);
    const subtitle = item.subtitle || getAutoSubtitle(isPremium, mode);

    const a = document.createElement("a");
    a.className = isPremium ? "list-card premium-item" : "list-card";

    if (mode === "articles") {
      a.href = file;
    } else {
      a.href = buildPdfHref(file, isPremium);
    }

    a.innerHTML = `
      <div class="list-card-left">
        <span class="list-icon">${isPremium ? "🔒" : "📄"}</span>
        <div class="list-content">
          <span class="list-title">${title}</span>
          <span class="list-subtitle">${subtitle}</span>
        </div>
      </div>
      <span class="badge ${isPremium ? "premium-badge" : "free-badge"}">
        ${isPremium ? "Premium" : "Free"}
      </span>
    `;

    if (isPremium) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        if (typeof showPremiumPopup === "function") {
          showPremiumPopup();
        }
      });
    }

    return a;
  }

  try {
    const response = await fetch(jsonFile, { cache: "no-store" });
    if (!response.ok) throw new Error("JSON not found");

    const items = await response.json();
    container.innerHTML = "";

    if (!Array.isArray(items) || items.length === 0) {
      container.innerHTML = `<p class="empty-note">No content found.</p>`;
      return;
    }

    items.forEach((item) => {
      const card = createCard(item);
      if (card) container.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    container.innerHTML = `<p class="empty-note">Failed to load content.</p>`;
  }
});
