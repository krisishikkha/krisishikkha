/* ===========================
   LOGIN SYSTEM (Frontend)
   Future Ready for Backend
   =========================== */

// Show Login Modal
function showLoginModal() {
  // Close premium modal if open
  closePremiumModal();
  
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
        
        <button type="submit" class="login-btn">Login</button>
      </form>
      
      <p style="margin-top: 20px; font-size: 13px; color: #666; text-align: center;">
        Premium account নেই? 
        <a href="#" onclick="showPremiumModal(); closeLoginModal(); return false;" 
           style="color: #d84315; font-weight: bold;">
          এখনই নিন
        </a>
      </p>
      
      <p style="margin-top: 10px; font-size: 12px; color: #999; text-align: center;">
        <a href="#" onclick="closeLoginModal(); return false;" style="color: #999;">
          Close
        </a>
      </p>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Show modal
  setTimeout(() => {
    modal.classList.add('show');
    document.getElementById('username').focus();
  }, 10);
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
    // Load users from JSON (Frontend validation)
    // In production, this will be backend API call
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
        loginTime: new Date().toISOString()
      };
      
      Utils.storage.set(CONFIG.storageKey, userData);
      
      // Close modal and reload page
      closeLoginModal();
      Utils.notify('✅ Login successful! Redirecting...');
      
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
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

// Logout Function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    Utils.storage.remove(CONFIG.storageKey);
    Utils.notify('Logged out successfully');
    window.location.href = 'index.html';
  }
}

// Check Login Status on Page Load
function checkLoginStatus() {
  const user = getCurrentUser();
  
  if (user && user.isPremium) {
    // User is logged in and has premium access
    console.log('Premium user logged in:', user.username);
    return true;
  }
  
  return false;
}

// Close modal on outside click
document.addEventListener('click', function(e) {
  const modal = document.getElementById('loginModal');
  if (modal && e.target === modal) {
    closeLoginModal();
  }
});
