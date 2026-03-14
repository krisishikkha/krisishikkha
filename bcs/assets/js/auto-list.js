document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("autoList");
  if (!container) return;

  const mode = container.dataset.mode; // notes or articles
  const jsonFile = container.dataset.json || "files.json";

  function formatTitleFromFileName(fileName) {
    const clean = fileName
      .replace(/\.[^/.]+$/, "")        // remove extension
      .replace(/[-_]+/g, " ")          // replace - and _ with spaces
      .trim();

    return clean.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function getAutoSubtitle(isPremium, mode) {
    if (mode === "notes") {
      return isPremium
        ? "Premium PDF note for this topic."
        : "Free PDF note for this topic.";
    }

    if (mode === "articles") {
      return isPremium
        ? "Premium article for this topic."
        : "Free article for this topic.";
    }

    return "";
  }

  function getCurrentTopicPath() {
    const path = window.location.pathname;
    const marker = "/bcs/";
    const idx = path.indexOf(marker);

    if (idx === -1) return "";
    const afterBcs = path.substring(idx + marker.length); // notes/topic-01/index.html
    return afterBcs.replace(/index\.html$/, "");          // notes/topic-01/
  }

  function buildNotesHref(file, isPremium) {
    const topicPath = getCurrentTopicPath(); // notes/topic-01/
    const accessPart = isPremium ? "&access=premium" : "";
    return `../../viewer/index.html?pdf=${topicPath}${encodeURIComponent(file).replace(/%2F/g, "/")}${accessPart}`;
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
      a.href = buildNotesHref(file, isPremium);
      a.dataset.type = "pdf";
      a.dataset.title = title;
    } else if (mode === "articles") {
      a.href = buildArticlesHref(file);
      a.dataset.type = "article";
      a.dataset.title = title;
    }

    a.innerHTML = `
      <div class="list-card-left">
        <span class="list-icon">${isPremium ? "🔒" : (mode === "notes" ? "📄" : "📘")}</span>
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
          <p class="empty-note">No files found for this topic yet.</p>
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
        <p class="empty-note">Failed to load topic items.</p>
      </div>
    `;
  }
});
