// ===============================================
// SEO META TAGS MANAGER
// ===============================================

function updateSEO(params) {
    const {
        title,
        description,
        url,
        image,
        type = 'article',
        author = 'Krishi Shikkha',
        publishDate
    } = params;
    
    // Update title
    if (title) {
        document.title = title;
        updateMetaTag('og:title', title);
        updateMetaTag('twitter:title', title);
    }
    
    // Update description
    if (description) {
        updateMetaTag('description', description);
        updateMetaTag('og:description', description);
        updateMetaTag('twitter:description', description);
    }
    
    // Update URL
    if (url) {
        updateMetaTag('og:url', url);
        updateMetaTag('twitter:url', url);
    }
    
    // Update image
    if (image) {
        updateMetaTag('og:image', image);
        updateMetaTag('twitter:image', image);
    }
    
    // Update type
    updateMetaTag('og:type', type);
    
    // Update author
    if (author) {
        updateMetaTag('author', author);
        updateMetaTag('article:author', author);
    }
    
    // Update publish date
    if (publishDate) {
        updateMetaTag('article:published_time', publishDate);
    }
    
    // Add structured data
    addStructuredData(params);
}

// Update or create meta tag
function updateMetaTag(property, content) {
    if (!content) return;
    
    let selector = `meta[property="${property}"]`;
    let meta = document.querySelector(selector);
    
    if (!meta) {
        selector = `meta[name="${property}"]`;
        meta = document.querySelector(selector);
    }
    
    if (meta) {
        meta.setAttribute('content', content);
    } else {
        meta = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('article:')) {
            meta.setAttribute('property', property);
        } else {
            meta.setAttribute('name', property);
        }
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
    }
}

// Add JSON-LD structured data
function addStructuredData(params) {
    const {
        title,
        description,
        url,
        image,
        author,
        publishDate
    } = params;
    
    // Remove existing structured data
    const existing = document.getElementById('structured-data');
    if (existing) existing.remove();
    
    // Create new structured data
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "url": url,
        "author": {
            "@type": "Person",
            "name": author || "Krishi Shikkha"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Krishi Shikkha",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.krisishikkha.com/logo.png"
            }
        },
        "datePublished": publishDate,
        "image": image
    };
    
    const script = document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
}

// Generate sitemap (for static site)
function generateSitemapData() {
    // This would need to be run manually to generate sitemap.xml
    const urls = allArticles.map(article => ({
        loc: `https://www.krisishikkha.com/important-job-topic/article.html?slug=${article.slug}`,
        lastmod: article.publishDate,
        changefreq: 'weekly',
        priority: article.isPremium ? '0.8' : '0.6'
    }));
    
    console.log('Sitemap URLs:', urls);
    return urls;
      }
