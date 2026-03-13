function buildWhatsAppLink() {
  const number = BCS_CONFIG.whatsappNumber;
  const text = encodeURIComponent(BCS_CONFIG.whatsappMessage);
  return `https://wa.me/${number}?text=${text}`;
}

function getLoginPath() {
  const currentPath = window.location.pathname;
  const bcsIndex = currentPath.indexOf("/bcs/");

  if (bcsIndex !== -1) {
    const basePath = currentPath.substring(0, bcsIndex + 5); // includes /bcs/
    return basePath + "login.html";
  }

  return "login.html";
}

function removePremiumPopup() {
  const existing = document.getElementById("premiumPopupOverlay");
  if (existing) existing.remove();
}

function showPremiumPopup(title, message, showLoginButton = true) {
  removePremiumPopup();

  const overlay = document.createElement("div");
  overlay.id = "premiumPopupOverlay";
  overlay.className = "premium-popup-overlay";

  overlay.innerHTML = `
    <div class="premium-popup-box">
      <h3>${title}</h3>
      <p>${message}</p>

      <div class="premium-popup-actions">
        ${showLoginButton ? `<button class="popup-btn popup-login-btn" id="premiumLoginBtn" type="button">Login</button>` : ""}
        <a href="${buildWhatsAppLink()}" target="_blank" class="popup-btn popup-whatsapp-btn">Contact on WhatsApp</a>
        <button class="popup-btn popup-close-btn" id="premiumPopupCloseBtn" type="button">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeBtn = document.getElementById("premiumPopupCloseBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", removePremiumPopup);
  }

  const loginBtn = document.getElementById("premiumLoginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = getLoginPath();
    });
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      removePremiumPopup();
    }
  });
}

function handlePremiumClick(event) {
  const accessState =
    typeof getAccessState === "function"
      ? getAccessState()
      : { loggedIn: false, valid: false, reason: "not_logged_in" };

  if (accessState.valid) {
    return;
  }

  event.preventDefault();

  if (accessState.reason === "not_logged_in") {
    showPremiumPopup(
      BCS_CONFIG.lockedTitle,
      BCS_CONFIG.loginText,
      true
    );
    return;
  }

  if (accessState.reason === "expired" || accessState.reason === "inactive") {
    showPremiumPopup(
      BCS_CONFIG.lockedTitle,
      BCS_CONFIG.expiredText,
      false
    );
    return;
  }

  showPremiumPopup(
    BCS_CONFIG.lockedTitle,
    BCS_CONFIG.lockedText,
    true
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const premiumItems = document.querySelectorAll(".premium-item");

  premiumItems.forEach((item) => {
    item.addEventListener("click", handlePremiumClick);
  });
});
