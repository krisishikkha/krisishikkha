/* ===========================
   GLOBAL CONFIGURATION
   =========================== */

const CONFIG = {
  // Site Info
  siteName: 'Krisishikkha',
  siteUrl: 'https://krisishikkha.com',
  
  // WhatsApp Configuration
  whatsapp: {
    number: '8801516013089',
    message: 'I want to access premium subscription of Question Bank-SO/AD from www.krisishikkha.com'
  },
  
  // Pagination
  questionsPerPage: 20,
  
  // Premium Users Storage Key
  storageKey: 'qbank_premium_user',
  
  // API Endpoints (Future Ready)
  api: {
    baseUrl: '', // For future backend integration
    endpoints: {
      login: '/api/auth/login',
      institutes: '/api/institutes',
      questions: '/api/questions'
    }
  },
  
  // Feature Flags
  features: {
    premiumEnabled: true,
    loginEnabled: true,
    pdfViewerEnabled: true,
    searchEnabled: false // Future feature
  }
};

// Utility Functions
const Utils = {
  // Format phone number
  formatPhone(number) {
    return number.replace(/[^0-9+]/g, '');
  },
  
  // Open WhatsApp
  openWhatsApp(message = CONFIG.whatsapp.message) {
    const number = Utils.formatPhone(CONFIG.whatsapp.number);
    const encodedMsg = encodeURIComponent(message);
    const url = `https://wa.me/${number}?text=${encodedMsg}`;
    window.open(url, '_blank');
  },
  
  // Local Storage Helpers
  storage: {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error('Storage error:', e);
        return false;
      }
    },
    
    get(key) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.error('Storage error:', e);
        return null;
      }
    },
    
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.error('Storage error:', e);
        return false;
      }
    }
  },
  
  // Show notification (simple alert, can be enhanced)
  notify(message, type = 'info') {
    alert(message);
  }
};

// Export for ES6 modules (future ready)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, Utils };
    }
