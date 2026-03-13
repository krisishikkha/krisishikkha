document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("backBtn");

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      history.back();
    });
  }

  // Right click block
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  // Copy / Print / Save shortcuts block
  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();

    if ((e.ctrlKey || e.metaKey) && ["c", "p", "s", "u"].includes(key)) {
      e.preventDefault();
    }

    if (key === "printscreen") {
      e.preventDefault();
    }
  });

  // Drag block
  document.addEventListener("dragstart", (e) => {
    e.preventDefault();
  });

  // Text selection block
  document.addEventListener("selectstart", (e) => {
    e.preventDefault();
  });
});
