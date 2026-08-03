/* ===========================
   PREMIUM ACCESS MANAGEMENT
   =========================== */

// Check if user has premium access
function checkPremiumAccess() {
  const user = Utils.storage.get(CONFIG.storageKey);
  
  if (user && user.isPremium) {
    return true;
  }
  
  return false;
}

// Get current logged in user
function getCurrentUser() {
  return Utils.storage.get(CONFIG.storageKey);
}

// Show Premium Modal
function showPremiumModal() {
  // Remove existing modal if any
  const existingModal = document.getElementById('premiumModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // Create modal
  const modal = document.createElement('div');
  modal.id = 'premiumModal';
  modal.className = 'premium-overlay';
  
  modal.innerHTML = `
    <div class="premium-box">
      <button class="close-btn" onclick="closePremiumModal()">×</button>
      
      <div class="premium-icon">🔒</div>
      
      <h2>Premium Content</h2>
      
      <p>এই প্রশ্নগুলো শুধুমাত্র Premium Subscribers দের জন্য উপলব্ধ।</p>
      
      <div class="premium-features">
        <h3>⭐ Premium এ যা পাবেন:</h3>
        <ul>
          <li>সকল Institute এর Question Access</li>
          <li>বিগত বছরের সকল প্রশ্ন</li>
          <li>বিস্তারিত Answer ও Explanation</li>
          <li>PDF Download সুবিধা</li>
          <li>নতুন Question এর Instant Access</li>
          <li>Lifetime Support</li>
        </ul>
      </div>
      
      <p style="margin-top: 20px;"><strong>Premium Access নিতে WhatsApp করুন:</strong></p>
      
      <div class="whatsapp-number">📱 ${CONFIG.whatsapp.number}</div>
      
      <button class="whatsapp-btn" onclick="contactForPremium()">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .9.9-2.9-.2-.3a8.2 8.2 0 1 1 6.8 3.6z"/>
        </svg>
        WhatsApp এ যোগাযোগ করুন
      </button>
      
      <p style="margin-top: 20px; font-size: 13px; color: #999;">
        অথবা <a href="#" onclick="showLoginModal(); return false;" style="color: #d84315; font-weight: bold;">Login করুন</a> যদি ইতিমধ্যে Premium নিয়ে থাকেন
      </p>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add CSS if not already added
  if (!document.getElementById('premiumCSS')) {
    const link = document.createElement('link');
    link.id = 'premiumCSS';
    link.rel = 'stylesheet';
    link.href = 'css/premium.css';
    document.head.appendChild(link);
  }
  
  // Show modal
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
}

// Close Premium Modal
function closePremiumModal() {
  const modal = document.getElementById('premiumModal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

// Contact for Premium
function contactForPremium() {
  Utils.openWhatsApp();
  closePremiumModal();
}

// Close modal on outside click
document.addEventListener('click', function(e) {
  const modal = document.getElementById('premiumModal');
  if (modal && e.target === modal) {
    closePremiumModal();
  }
});
