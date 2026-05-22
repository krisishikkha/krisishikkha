// ===============================================
// SEARCH AND FILTER SYSTEM
// ===============================================

let filteredArticles = [];

// Apply filters
function applyFilters() {
    const topicFilter = document.getElementById('topicFilter')?.value || 'all';
    const typeFilter = document.getElementById('typeFilter')?.value || 'all';
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    
    filteredArticles = allArticles.filter(article => {
        // Topic filter
        if (topicFilter !== 'all' && article.topic !== topicFilter) {
            return false;
        }
        
        // Type filter (premium/free)
        if (typeFilter === 'premium' && !article.isPremium) {
            return false;
        }
        if (typeFilter === 'free' && article.isPremium) {
            return false;
        }
        
        // Search filter
        if (searchTerm) {
            const titleMatch = article.title.toLowerCase().includes(searchTerm);
            const tagsMatch = article.tags?.some(tag => 
                tag.toLowerCase().includes(searchTerm)
            );
            const contentMatch = article.content.toLowerCase().includes(searchTerm);
            
            if (!titleMatch && !tagsMatch && !contentMatch) {
                return false;
            }
        }
        
        return true;
    });
    
    // Display filtered articles
    displayFilteredArticles();
}

// Display filtered articles
function displayFilteredArticles() {
    const container = document.getElementById('articlesGrid');
    const noResults = document.getElementById('noResults');
    
    if (!container) return;
    
    if (filteredArticles.length === 0) {
        container.style.display = 'none';
        if (noResults) noResults.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    if (noResults) noResults.style.display = 'none';
    
    const articlesHTML = filteredArticles.map(article => createArticleCard(article)).join('');
    container.innerHTML = articlesHTML;
}

// Perform search
function performSearch() {
    applyFilters();
}

// Real-time search (optional - debounced)
let searchTimeout;
function setupRealtimeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                applyFilters();
            }, 500); // Wait 500ms after user stops typing
        });
    }
}

// Initialize filters
document.addEventListener('DOMContentLoaded', function() {
    setupRealtimeSearch();
});
