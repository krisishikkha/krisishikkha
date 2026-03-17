function showPremiumPopup() {
  const popup = document.createElement("div");
  popup.className = "premium-popup-overlay";

  popup.innerHTML = `
    <div class="premium-popup-box">
      <h3>Premium Content</h3>
      <p>
        This is a premium resource. Please contact us on WhatsApp to get login access and unlock the content.
      </p>

      <div class="premium-popup-actions">
        <a href="https://wa.me/8801516013089" target="_blank" class="popup-btn popup-whatsapp-btn">
          WhatsApp
        </a>

        <button class="popup-btn popup-close-btn">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  popup.querySelector(".popup-close-btn").onclick = () => {
    popup.remove();
  };
}
