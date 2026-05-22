// ===============================================
// ARTICLE LOADING SYSTEM
// ===============================================

let allArticles = [];

// Load all articles from JSON files
async function loadAllArticles() {
    try {
        showLoading('articlesGrid');
        showLoading('featuredPremium');
        
        allArticles = [];
        
        // Define topics
        const topics = ['soil-science', 'plant-pathology', 'agronomy', 'genetics', 'entomology'];
        
        // Load articles from each topic
        for (const topic of topics) {
            try {
                // Try to load multiple articles (article-001.json, article-002.json, etc.)
                for (let i = 1; i <= 10; i++) {
                    const articleNum = String(i).padStart(3, '0');
                    const articlePath = `${CONFIG.dataPath}articles/${topic}/article-${articleNum}.json`;
                    
                    try {
                        const response = await fetch(articlePath);
                        if (response.ok) {
                            const article = await response.json();
                            article.topic = topic; // Ensure topic is set
                            allArticles.push(article);
                        }
                    } catch (e) {
                        // Article doesn't exist, continue
                        break;
                    }
                }
            } catch (error) {
                console.log(`No articles found for topic: ${topic}`);
            }
        }
        
        // Display articles
        displayAllArticles(allArticles);
        displayFeaturedPremium(allArticles);
        
    } catch (error) {
        console.error('Error loading articles:', error);
        document.getElementById('articlesGrid').innerHTML = 
            '<p class="error-message">আর্টিকেল লোড করতে সমস্যা হয়েছে</p>';
    }
}

// Display all articles
function displayAllArticles(articles) {
    const container = document.getElementById('articlesGrid');
    
    if (!container) return;
    
    if (articles.length === 0) {
        container.innerHTML = '<p class="no-results">কোনো আর্টিকেল পাওয়া যায়নি</p>';
        return;
    }
    
    const articlesHTML = articles.map(article => createArticleCard(article)).join('');
    container.innerHTML = articlesHTML;
}

// Display featured premium articles
function displayFeaturedPremium(articles) {
    const container = document.getElementById('featuredPremium');
    
    if (!container) return;
    
    const premiumArticles = articles
        .filter(article => article.isPremium)
        .slice(0, 3); // Show only first 3
    
    if (premiumArticles.length === 0) {
        container.innerHTML = '<p class="no-results">কোনো প্রিমিয়াম আর্টিকেল নেই</p>';
        return;
    }
    
    const articlesHTML = premiumArticles.map(article => createArticleCard(article)).join('');
    container.innerHTML = articlesHTML;
}
// ===============================================
// SINGLE ARTICLE LOADER (for article.html)
// ===============================================

async function loadArticleFromURL() {
    const slug = getUrlParameter('slug');
    
    if (!slug) {
        document.querySelector('.article-content').innerHTML = 
            '<p class="error-message">আর্টিকেল খুঁজে পাওয়া যায়নি</p>';
        return;
    }
    
    try {
        showLoading('articleHeader');
        
        // Search for article in all topics
        const topics = ['soil-science', 'plant-pathology', 'agronomy', 'genetics', 'entomology'];
        let foundArticle = null;
        
        for (const topic of topics) {
            for (let i = 1; i <= 50; i++) {
                const articleNum = String(i).padStart(3, '0');
                const articlePath = `${CONFIG.dataPath}articles/${topic}/article-${articleNum}.json`;
                
                try {
                    const response = await fetch(articlePath);
                    if (response.ok) {
                        const article = await response.json();
                        if (article.slug === slug) {
                            article.topic = topic;
                            foundArticle = article;
                            break;
                        }
                    }
                } catch (e) {
                    break;
                }
            }
            if (foundArticle) break;
        }
        
        if (!foundArticle) {
            document.querySelector('.article-content').innerHTML = 
                '<p class="error-message">আর্টিকেল খুঁজে পাওয়া যায়নি</p>';
            return;
        }
        
        // Check if premium and user not logged in
        if (foundArticle.isPremium && !isUserLoggedIn()) {
            showLoginModal();
            return;
        }
        
        // Display article
        displayArticle(foundArticle);
        loadRelatedArticles(foundArticle);
        
    } catch (error) {
        console.error('Error loading article:', error);
        document.querySelector('.article-content').innerHTML = 
            '<p class="error-message">আর্টিকেল লোড করতে সমস্যা হয়েছে</p>';
    }
}

// Display single article
function displayArticle(article) {
    const topicName = CONFIG.articleTopics[article.topic] || article.topic;
    
    // Update page title and meta
    document.title = article.seoTitle || article.title;
    updateSEO({
        title: article.seoTitle || article.title,
        description: article.seoDescription || article.content.substring(0, 160),
        url: window.location.href,
        image: article.featuredImage
    });
    
    // Update breadcrumb
    const breadcrumb = document.getElementById('articleBreadcrumb');
    if (breadcrumb) {
        breadcrumb.innerHTML = `
            <a href="/">হোম</a>
            <span class="separator">›</span>
            <a href="index.html">Important Job Topic</a>
            <span class="separator">›</span>
            <a href="index.html?topic=${article.topic}">${topicName}</a>
            <span class="separator">›</span>
            <span class="current">${article.title}</span>
        `;
    }
    
    // Article header
    document.getElementById('articleHeader').innerHTML = `
        <h1>${article.title}</h1>
        <div class="article-meta">
            <span class="article-meta-item">📁 ${topicName}</span>
            <span class="article-meta-item">📅 ${formatDate(article.publishDate)}</span>
            ${article.isPremium ? '<span class="article-meta-item">🔒 Premium</span>' : '<span class="article-meta-item">✅ Free</span>'}
        </div>
    `;
    
    // Article image
    if (article.featuredImage) {
        document.getElementById('articleImage').innerHTML = `
            <img src="${article.featuredImage}" alt="${article.title}">
        `;
    }
    
    // Article body (convert markdown-style to HTML)
    const contentHTML = convertMarkdownToHTML(article.content);
    document.getElementById('articleBody').innerHTML = contentHTML;
    
    // Article tags
    if (article.tags && article.tags.length > 0) {
        document.getElementById('articleTags').innerHTML = `
            <h3>🏷️ Tags:</h3>
            <div class="tag-list">
                ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;
    }
}

// Simple Markdown to HTML converter
function convertMarkdownToHTML(markdown) {
    let html = markdown;
    
    // Headers
    html = html.replace(/### (.*)/g, '<h3>$1</h3>');
    html = html.replace(/## (.*)/g, '<h2>$1</h2>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Lists
    html = html.replace(/^\- (.*)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Paragraphs
    html = html.split('\n\n').map(p => {
        if (!p.startsWith('<')) {
            return `<p>${p}</p>`;
        }
        return p;
    }).join('');
    
    return html;
}

// Load related articles
async function loadRelatedArticles(currentArticle) {
    const container = document.getElementById('relatedArticles');
    if (!container) return;
    
    // Find articles from same topic
    const relatedArticles = allArticles
        .filter(article => 
            article.topic === currentArticle.topic && 
            article.slug !== currentArticle.slug
        )
        .slice(0, 3);
    
    if (relatedArticles.length === 0) {
        container.innerHTML = '<p class="no-results">কোনো সম্পর্কিত আর্টিকেল নেই</p>';
        return;
    }
    
    const articlesHTML = relatedArticles.map(article => createArticleCard(article)).join('');
    container.innerHTML = articlesHTML;
}
