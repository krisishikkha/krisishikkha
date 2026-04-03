/* =============================================
   🔐 কৃষিশিক্ষা - Authentication System
   ============================================= */

// ========== Global Variables ==========
let usersData = null;

// ========== Initialize Auth ==========
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    checkLoginStatus();
    setupAuthEvents();
});

// ========== Load Users Data ==========
async function loadUsers() {
    try {
        const response = await fetch('data/users.json');
        usersData = await response.json();
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// ========== Setup Auth Events ==========
function setupAuthEvents() {
    // Login Button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', showLoginModal);
    }
    
    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Close modal on outside click
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideLoginModal();
            }
        });
    }
}

// ========== Check Login Status ==========
function checkLoginStatus() {
    const session = localStorage.getItem('krishi_user');
    
    if (session) {
        try {
            const user = JSON.parse(session);
            
            // Check session expiry (24 hours)
            const now = Date.now();
            const loginTime = user.loginTime || 0;
            const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
            
            if (now - loginTime > sessionDuration) {
                logout();
                showToast('সেশন শেষ হয়েছে। আবার লগইন করুন।', 'warning');
                return;
            }
            
            // Check account expiry
            const expiryDate = new Date(user.expiryDate);
            if (expiryDate < new Date()) {
                logout();
                showToast('আপনার অ্যাকাউন্টের মেয়াদ শেষ।', 'error');
                return;
            }
            
            // Valid session - update UI
            updateUIForLogin(user);
            
        } catch (error) {
            logout();
        }
    } else {
        updateUIForLogout();
    }
}

// ========== Handle Login ==========
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorMsg = document.getElementById('loginError');
    
    // Clear previous error
    errorMsg.textContent = '';
    
    // Validate
    if (!username || !password) {
        errorMsg.textContent = 'ইউজারনেম ও পাসওয়ার্ড দিন।';
        return;
    }
    
    // Check if users loaded
    if (!usersData) {
        await loadUsers();
    }
    
    if (!usersData || !usersData.users) {
        errorMsg.textContent = 'সার্ভার সমস্যা। পরে চেষ্টা করুন।';
        return;
    }
    
    // Find user
    const user = usersData.users.find(u => 
        u.username === username && 
        u.password === password
    );
    
    if (!user) {
        errorMsg.textContent = 'ইউজারনেম বা পাসওয়ার্ড ভুল!';
        return;
    }
    
    // Check status
    if (user.status !== 'active') {
        errorMsg.textContent = 'আপনার অ্যাকাউন্ট নিষ্ক্রিয়।';
        return;
    }
    
    // Check expiry
    const expiryDate = new Date(user.expiryDate);
    if (expiryDate < new Date()) {
        errorMsg.textContent = 'আপনার অ্যাকাউন্টের মেয়াদ শেষ।';
        return;
    }
    
    // Success - Save session
    const sessionData = {
        id: user.id,
        username: user.username,
        name: user.name,
        expiryDate: user.expiryDate,
        loginTime: Date.now()
    };
    
    localStorage.setItem('krishi_user', JSON.stringify(sessionData));
    
    // Update UI
    hideLoginModal();
    updateUIForLogin(sessionData);
    showToast('স্বাগতম, ' + user.name + '! 🎉', 'success');
    
    // Clear form
    document.getElementById('loginForm').reset();
}

// ========== Logout ==========
function logout() {
    localStorage.removeItem('krishi_user');
    updateUIForLogout();
    showToast('সফলভাবে লগআউট হয়েছে।', 'info');
}

// ========== Update UI for Login ==========
function updateUIForLogin(user) {
    // Hide login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.style.display = 'none';
    }
    
    // Show user info
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
        userInfo.style.display = 'flex';
    }
    
    // Set user name
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = user.name;
    }
    
    // Hide login notice
    const loginNotice = document.getElementById('loginNotice');
    if (loginNotice) {
        loginNotice.style.display = 'none';
    }
    
    // Enable download buttons
    const downloadBtns = document.querySelectorAll('.download-btn');
    downloadBtns.forEach(btn => {
        btn.classList.remove('disabled');
        btn.disabled = false;
    });
}

// ========== Update UI for Logout ==========
function updateUIForLogout() {
    // Show login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.style.display = 'block';
    }
    
    // Hide user info
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
        userInfo.style.display = 'none';
    }
    
    // Show login notice
    const loginNotice = document.getElementById('loginNotice');
    if (loginNotice) {
        loginNotice.style.display = 'flex';
    }
    
    // Disable download buttons
    const downloadBtns = document.querySelectorAll('.download-btn');
    downloadBtns.forEach(btn => {
        btn.classList.add('disabled');
        btn.disabled = true;
    });
}

// ========== Check if Logged In ==========
function isLoggedIn() {
    const session = localStorage.getItem('krishi_user');
    if (!session) return false;
    
    try {
        const user = JSON.parse(session);
        
        // Check session expiry
        const now = Date.now();
        const loginTime = user.loginTime || 0;
        if (now - loginTime > 24 * 60 * 60 * 1000) {
            return false;
        }
        
        // Check account expiry
        const expiryDate = new Date(user.expiryDate);
        if (expiryDate < new Date()) {
            return false;
        }
        
        return true;
    } catch {
        return false;
    }
}

// ========== Get Current User ==========
function getCurrentUser() {
    const session = localStorage.getItem('krishi_user');
    if (!session) return null;
    
    try {
        return JSON.parse(session);
    } catch {
        return null;
    }
}

// ========== Show Login Modal ==========
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on username field
        setTimeout(() => {
            const usernameField = document.getElementById('loginUsername');
            if (usernameField) usernameField.focus();
        }, 100);
    }
}

// ========== Hide Login Modal ==========
function hideLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Clear error
    const errorMsg = document.getElementById('loginError');
    if (errorMsg) errorMsg.textContent = '';
}

// ========== Show Premium Modal ==========
function showPremiumModal() {
    const modal = document.getElementById('premiumModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// ========== Hide Premium Modal ==========
function hidePremiumModal() {
    const modal = document.getElementById('premiumModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ========== Protected Action ==========
function requireLogin(callback) {
    if (isLoggedIn()) {
        callback();
    } else {
        showLoginModal();
        showToast('এই কাজের জন্য লগইন করুন।', 'warning');
    }
}

// ========== Toast Notification ==========
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Icon based on type
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';
    
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
