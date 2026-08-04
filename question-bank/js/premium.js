/* ===========================
   PREMIUM ACCESS MODAL SYSTEM
   Modern SaaS-Style Design
   =========================== */

// Check if user has premium access
function checkPremiumAccess() {
  const user = localStorage.getItem('qbank_premium_user');
  
  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData.isPremium === true;
    } catch(e) {
      return false;
    }
  }
  
  return false;
}

// Get current logged in user
function getCurrentUser() {
  try {
    const user = localStorage.getItem('qbank_premium_user');
    return user ? JSON.parse(user) : null;
  } catch(e) {
    return null;
  }
}

// Show Premium Modal - Modern Design
function showPremiumModal() {
  // Remove existing modal if any
  const existingModal = document.getElementById('premiumModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // Disable page scrolling
  document.body.style.overflow = 'hidden';
  
  // Create modal overlay
  const modal = document.createElement('div');
  modal.id = 'premiumModal';
  modal.className = 'premium-modal-overlay';
  
  modal.innerHTML = `
    <div class="premium-modal-container">
      <div class="premium-modal-content">
        
        <!-- Lock Icon -->
        <div class="premium-lock-icon">🔒</div>
        
        <!-- Title -->
        <h2 class="premium-title">Premium Content</h2>
        
        <!-- Description -->
        <p class="premium-description">
          This content is available only for Premium Members.<br>
          Please login if you already have access or contact us on WhatsApp to activate your Premium account.
        </p>
        
        <!-- Buttons -->
        <div class="premium-buttons">
          <button class="premium-btn premium-btn-primary" onclick="goToLogin()">
            Login
          </button>
          
          <button class="premium-btn premium-btn-success" onclick="openWhatsAppContact()">
            Contact on WhatsApp
          </button>
          
          <button class="premium-btn premium-btn-secondary" onclick="closePremiumModal()">
            Close
          </button>
        </div>
        
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Trigger animation
  requestAnimationFrame(() => {
    modal.classList.add('show');
  });
  
  // Close on overlay click
  modal.addEventListener('click', function(e) {
    if (e.target === modal || e.target.classList.contains('premium-modal-container')) {
      closePremiumModal();
    }
  });
  
  // Close on Escape key
  const escapeHandler = function(e) {
    if (e.key === 'Escape') {
      closePremiumModal();
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

// Close Premium Modal
function closePremiumModal() {
  const modal = document.getElementById('premiumModal');
  if (modal) {
    modal.classList.remove('show');
    
    setTimeout(() => {
      modal.remove();
      // Re-enable page scrolling
      document.body.style.overflow = '';
    }, 250);
  }
}

// Go to Login Page
function goToLogin() {
  // Close modal first
  closePremiumModal();
  
  // Navigate to login page after animation
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 300);
}

// Open WhatsApp Contact
function openWhatsAppContact() {
  const number = '8801516013089';
  const message = 'Hello! I want to activate my Premium account for Question Bank SO/AD on www.krisishikkha.com';
  const encodedMsg = encodeURIComponent(message);
  const url = `https://wa.me/${number}?text=${encodedMsg}`;
  
  window.open(url, '_blank');
  
  // Optionally close modal after opening WhatsApp
  // closePremiumModal();
}

// Logout Function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('qbank_premium_user');
    
    // Show notification
    showNotification('✅ Logged out successfully', 'success');
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }
}

// Show Notification (for success messages)
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(-100px);
    background: ${type === 'success' ? '#16A34A' : '#DC2626'};
    color: white;
    padding: 16px 32px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    z-index: 99999;
    font-weight: 600;
    font-size: 15px;
    transition: transform 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Slide in
  setTimeout(() => {
    notification.style.transform = 'translateX(-50%) translateY(0)';
  }, 10);
  
  // Slide out and remove
  setTimeout(() => {
    notification.style.transform = 'translateX(-50%) translateY(-100px)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  const user = getCurrentUser();
  if (user && user.isPremium) {
    console.log('✅ Premium user logged in:', user.username);
  }
});
