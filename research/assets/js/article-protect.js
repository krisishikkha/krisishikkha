document.addEventListener("contextmenu", function(e) {
  e.preventDefault();
});

document.addEventListener("keydown", function(e) {
  const key = e.key.toLowerCase();

  if ((e.ctrlKey || e.metaKey) && (key === "c" || key === "p" || key === "s" || key === "u")) {
    e.preventDefault();
  }
});

document.addEventListener("selectstart", function(e) {
  e.preventDefault();
});

document.addEventListener("dragstart", function(e) {
  e.preventDefault();
});
