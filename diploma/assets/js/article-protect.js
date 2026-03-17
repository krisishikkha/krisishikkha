document.addEventListener("contextmenu", e => e.preventDefault());

document.addEventListener("keydown", function(e) {
  if (e.ctrlKey && ["c", "u", "s"].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }
});
