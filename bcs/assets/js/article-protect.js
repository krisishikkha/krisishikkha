document.addEventListener("contextmenu", function(e) {
  e.preventDefault();
});

document.addEventListener("keydown", function(e) {

  const key = e.key.toLowerCase();

  // Block copy, save, print, view-source
  if ((e.ctrlKey || e.metaKey) &&
      (key === "c" || key === "s" || key === "p" || key === "u")) {
    e.preventDefault();
  }

  // Block F12 (basic devtools open)
  if (e.key === "F12") {
    e.preventDefault();
  }

});

document.addEventListener("selectstart", function(e) {
  e.preventDefault();
});

document.addEventListener("dragstart", function(e) {
  e.preventDefault();
});
