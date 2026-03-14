document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("backBtn");

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      history.back();
    });
  }

  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();

    if ((e.ctrlKey || e.metaKey) && ["c", "p", "s", "u"].includes(key)) {
      e.preventDefault();
    }

    if (key === "printscreen") {
      e.preventDefault();
    }
  });

  document.addEventListener("dragstart", (e) => {
    e.preventDefault();
  });

  document.addEventListener("selectstart", (e) => {
    e.preventDefault();
  });
});
