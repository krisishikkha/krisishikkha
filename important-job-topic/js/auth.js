// ===============================================
// AUTHENTICATION SYSTEM
// ===============================================

// Check if user is logged in
function isUserLoggedIn() {
    const loginData = localStorage.getItem('userLogin');
    if (!loginData) return false;
    
    try {
        const data = JSON.parse(loginData);
        
        // Check if login is expired
        if (data.expiryDate && new Date(data.expiryDate) < new Date()) {
            logout();
            return false;
        }
        
        return data.isLoggedIn && data.isPremium;
    } catch (error) {
        console.error('Login data parse error:', error);
        return false;
    }
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!username || !password) {
        alert('Username এবং Password দিন');
        return;
    }
    
    try {
        // Fetch users data
        const response = await fetch(CONFIG.dataPath + 'users.json');
        const data = await response.json();
        
        // Find matching user
        const user = data.users.find(u => 
            u.username === username && u.password === password
        );
        
        if (user) {
            // Check if user has premium access
            if (!user.isPremium) {
                alert('আপনার Premium Access নেই। WhatsApp এ যোগাযোগ করুন।');
                return;
            }
            
            // Check if access expired
            if (user.expiryDate && new Date(user.expiryDate) < new Date()) {
                alert('আপনার Premium Access মেয়াদ শেষ হয়ে গেছে। WhatsApp এ যোগাযোগ করুন।');
                return;
            }
            
            // Save login state
            const loginData = {
                isLoggedIn: true,
                username: user.username,
                isPremium: user.isPremium,
                expiryDate: user.expiryDate,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('userLogin', JSON.stringify(loginData));
            
            alert('✅ Login সফল হয়েছে!');
            closeLoginModal();
            
            // Reload page to show premium content
            location.reload();
            
        } else {
            alert('❌ ভুল Username অথবা Password');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        alert('Login করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('userLogin');
    alert('Logout সফল হয়েছে');
    location.reload();
}

// Show user info in header (if logged in)
function updateUserUI() {
    if (isUserLoggedIn()) {
        const loginData = JSON.parse(localStorage.getItem('userLogin'));
        
        // You can add user info display in header here
        console.log('User logged in:', loginData.username);
        
        // Example: Add logout button to header
        // This would need to be implemented in your header component
    }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
    updateUserUI();
});

