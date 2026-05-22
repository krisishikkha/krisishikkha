// ===============================================
// GLOBAL CONFIGURATION
// ===============================================

const CONFIG = {
    basePath: '/important-job-topic/',
    dataPath: '/important-job-topic/data/',
    componentsPath: '/important-job-topic/components/',
    articleTopics: {
        'soil-science': 'Soil Science',
        'plant-pathology': 'Plant Pathology',
        'agronomy': 'Agronomy',
        'genetics': 'Genetics',
        'entomology': 'Entomology'
    }
};

// ===============================================
// COMPONENT LOADER
// ===============================================

async function loadComponents() {
    try {
        // Load Header
        const headerResponse = await fetch(CONFIG.componentsPath + 'header.html');
        const headerHTML = await headerResponse.text();
        document.getElementById('header-container').innerHTML = headerHTML;

        // Load Footer
        const footerResponse = await fetch(CONFIG.componentsPath + 'footer.html');
        const footerHTML = await footerResponse.text();
        document.getElementById('footer-container').innerHTML = footerHTML;

        // Load Sidebar
        const sidebarResponse = await fetch(CONFIG.componentsPath + 'sidebar.html');
        const sidebarHTML = await sidebarResponse.text();
        document.getElementById('sidebar-container').innerHTML = sidebarHTML;

    } catch (error) {
        console.error('Component loading error:', error);
    }
}

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function createSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('bn-BD', options);
}

function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="loading-spinner">Loading...</div>';
    }
}

function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const loader = element.querySelector('.loading-spinner');
        if (loader) loader.remove();
    }
}
// ===============================================
// ARTICLE CARD GENERATOR
// ===============================================

function createArticleCard(article) {
    const topicName = CONFIG.articleTopics[article.topic] || article.topic;
    
    return `
        <div class="article-card" onclick="openArticle('${article.slug}', ${article.isPremium})">
            ${article.isPremium ? '<span class="premium-badge">🔒 Premium</span>' : ''}
            ${article.featuredImage ? 
                `<img src="${article.featuredImage}" alt="${article.title}" class="article-card-image">` 
                : '<div class="article-card-image" style="background: linear-gradient(135deg, #2E7D32, #1B5E20);"></div>'}
            <div class="article-card-content">
                <span class="article-card-topic">${topicName}</span>
                <h3 class="article-card-title">${article.title}</h3>
                <p class="article-card-excerpt">${article.excerpt || article.content.substring(0, 120) + '...'}</p>
                <div class="article-card-meta">
                    <span>📅 ${formatDate(article.publishDate)}</span>
                    ${article.isPremium ? '<span>🔒 Premium</span>' : '<span>✅ Free</span>'}
                </div>
            </div>
        </div>
    `;
}

// ===============================================
// ARTICLE NAVIGATION
// ===============================================

function openArticle(slug, isPremium) {
    if (isPremium && !isUserLoggedIn()) {
        showLoginModal();
        return;
    }
    window.location.href = `article.html?slug=${slug}`;
}

// ===============================================
// LOGIN MODAL FUNCTIONS
// ===============================================

function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        closeLoginModal();
    }
}

// ===============================================
// PAGE INITIALIZATION
// ===============================================

function initializePage() {
    console.log('Page initialized');
    // Add any global initialization code here
}

// ===============================================
// ERROR HANDLING
// ===============================================

window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// ===============================================
// EXPORTS (for use in other files)
// ===============================================

window.AppUtils = {
    CONFIG,
    getUrlParameter,
    createSlug,
    formatDate,
    showLoading,
    hideLoading,
    createArticleCard,
    openArticle
};
