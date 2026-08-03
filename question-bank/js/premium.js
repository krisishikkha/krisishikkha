/* ===========================
   PREMIUM ACCESS MANAGEMENT
   Updated Version with Login Modal
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

// Show Premium Modal with Login + WhatsApp options
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
        </ul>
      </div>
      
      <div class="premium-actions">
        <button class="action-btn login-btn" onclick="showLoginModal(); closePremiumModal();">
          <span class="btn-icon">🔐</span>
          <span class="btn-text">Login করুন</span>
          <small>Already have premium access?</small>
        </button>
        
        <button class="action-btn whatsapp-btn" onclick="contactForPremium()">
          <span class="btn-icon">💬</span>
          <span class="btn-text">WhatsApp করুন</span>
          <small>01516013089</small>
        </button>
      </div>
      
      <p class="note">Premium নিতে WhatsApp করুন অথবা আপনার account থাকলে Login করুন</p>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Show modal with animation
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  
  // Close on outside click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closePremiumModal();
    }
  });
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

// Contact for Premium via WhatsApp
function contactForPremium() {
  const number = '8801516013089';
  const message = 'I want to access premium subscription of Question Bank-SO/AD from www.krisishikkha.com';
  const encodedMsg = encodeURIComponent(message);
  const url = `https://wa.me/${number}?text=${encodedMsg}`;
  window.open(url, '_blank');
  closePremiumModal();
}

// Show Login Modal
function showLoginModal() {
  // Remove existing modal if any
  const existingModal = document.getElementById('loginModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // Create modal
  const modal = document.createElement('div');
  modal.id = 'loginModal';
  modal.className = 'login-overlay';
  
  modal.innerHTML = `
    <div class="login-box">
      <button class="close-btn" onclick="closeLoginModal()">×</button>
      
      <h2>🔐 Premium Login</h2>
      
      <div id="loginError" class="login-error">
        Invalid username or password
      </div>
      
      <form id="loginForm" onsubmit="handleLogin(event)">
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            required 
            autocomplete="username"
            placeholder="Enter your username"
          >
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required 
            autocomplete="current-password"
            placeholder="Enter your password"
          >
        </div>
        
        <button type="submit" class="login-submit-btn">Login</button>
      </form>
      
      <p class="login-help">
        Premium account নেই? 
        <a href="#" onclick="showPremiumModal(); closeLoginModal(); return false;">
          এখনই নিন
        </a>
      </p>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Show modal with animation
  setTimeout(() => {
    modal.classList.add('show');
    document.getElementById('username').focus();
  }, 10);
  
  // Close on outside click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeLoginModal();
    }
  });
}

// Close Login Modal
function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

// Handle Login Form Submit
async function handleLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('loginError');
  
  errorDiv.classList.remove('show');
  
  // Show loading
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Logging in...';
  submitBtn.disabled = true;
  
  try {
    // Load users from JSON
    const response = await fetch('data/users.json');
    const data = await response.json();
    
    // Find user
    const user = data.users.find(u => 
      u.username === username && u.password === password
    );
    
    if (user) {
      // Login successful
      const userData = {
        username: user.username,
        isPremium: user.premium,
        name: user.name,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('qbank_premium_user', JSON.stringify(userData));
      
      // Close modal
      closeLoginModal();
      
      // Show success message
      showSuccessMessage('✅ Login successful! Premium content unlocked.');
      
      // Reload page after 1 second
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } else {
      // Login failed
      errorDiv.textContent = '❌ Invalid username or password';
      errorDiv.classList.add('show');
      
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
    
  } catch (error) {
    console.error('Login error:', error);
    errorDiv.textContent = '❌ Login failed. Please try again.';
    errorDiv.classList.add('show');
    
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// Show Success Message
function showSuccessMessage(message) {
  const popup = document.createElement('div');
  popup.className = 'success-popup';
  popup.textContent = message;
  popup.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #2e7d32, #66bb6a);
    color: white;
    padding: 15px 30px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    z-index: 99999;
    font-weight: bold;
    animation: slideDown 0.3s ease;
  `;
  
  document.body.appendChild(popup);
  
  setTimeout(() => {
    popup.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => popup.remove(), 300);
  }, 2000);
}

// Logout Function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('qbank_premium_user');
    showSuccessMessage('Logged out successfully');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }
}

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
  const user = getCurrentUser();
  if (user && user.isPremium) {
    console.log('Premium user logged in:', user.username);
  }
});
