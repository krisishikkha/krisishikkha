// Topic Names
const topics = {
    'soil-science': '🌱 Soil Science - মৃত্তিকা বিজ্ঞান',
    'plant-pathology': '🦠 Plant Pathology - উদ্ভিদ রোগতত্ত্ব',
    'agronomy': '🌾 Agronomy - শস্যবিজ্ঞান',
    'genetics': '🧬 Genetics - জিনতত্ত্ব',
    'entomology': '🐛 Entomology - কীটতত্ত্ব'
};

// Load Articles for a Topic
async function loadArticles(topic) {
    document.getElementById('pageTitle').textContent = topics[topic] || topic;
    document.getElementById('topicName').textContent = topics[topic] || topic;
    
    const container = document.getElementById('articlesList');
    const articles = [];
    
    // Try to load article files
    for (let i = 1; i <= 100; i++) {
        const num = String(i).padStart(3, '0');
        const path = `data/articles/${topic}/article-${num}.json`;
        
        try {
            const res = await fetch(path);
            if (res.ok) {
                const data = await res.json();
                data.file = `article-${num}.json`;
                articles.push(data);
            } else {
                break;
            }
        } catch (e) {
            break;
        }
    }
    
    if (articles.length === 0) {
        container.innerHTML = '<p class="loading">কোনো আর্টিকেল নেই</p>';
        return;
    }
    
    container.innerHTML = articles.map(a => `
        <div class="article-card" onclick="openArticle('${topic}', '${a.file}', ${a.isPremium})">
            <span class="badge ${a.isPremium ? 'badge-premium' : 'badge-free'}">
                ${a.isPremium ? '🔒 Premium' : '✅ Free'}
            </span>
            <h3>${a.title}</h3>
        </div>
    `).join('');
}

// Open Article
function openArticle(topic, file, isPremium) {
    if (isPremium && !isLoggedIn()) {
        showModal();
        return;
    }
    window.location.href = `article.html?topic=${topic}&file=${file}`;
}

// Load Single Article
async function loadArticle(topic, file) {
    try {
        const res = await fetch(`data/articles/${topic}/${file}`);
        const article = await res.json();
        
        if (article.isPremium && !isLoggedIn()) {
            window.location.href = `topic.html?topic=${topic}`;
            return;
        }
        
        document.getElementById('articleTitle').textContent = article.title;
        document.getElementById('breadTitle').textContent = article.title;
        document.getElementById('topicLink').textContent = topics[topic];
        document.getElementById('topicLink').href = `topic.html?topic=${topic}`;
        document.title = article.title;
        
        document.getElementById('articleContent').innerHTML = formatContent(article.content);
    } catch (e) {
        document.getElementById('articleContent').innerHTML = '<p class="loading">আর্টিকেল লোড করতে সমস্যা</p>';
    }
}

// Format Content
function formatContent(text) {
    let html = text;
    html = html.replace(/### (.*?)(\n|$)/g, '<h3>$1</h3>');
    html = html.replace(/## (.*?)(\n|$)/g, '<h2>$1</h2>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    html = html.replace(/^- (.*?)(<br>|$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>');
    html = '<p>' + html + '</p>';
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p><h/g, '<h');
    html = html.replace(/<\/h2><\/p>/g, '</h2>');
    html = html.replace(/<\/h3><\/p>/g, '</h3>');
    return html;
}

// Modal
function showModal() {
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

window.onclick = function(e) {
    if (e.target.id === 'modal') closeModal();
}

// Login
function isLoggedIn() {
    return localStorage.getItem('loggedIn') === 'true';
}

async function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('user').value;
    const pass = document.getElementById('pass').value;
    
    try {
        const res = await fetch('data/users.json');
        const users = await res.json();
        
        const found = users.find(u => u.username === user && u.password === pass);
        
        if (found) {
            localStorage.setItem('loggedIn', 'true');
            alert('✅ Login সফল!');
            closeModal();
            location.reload();
        } else {
            alert('❌ ভুল Username/Password');
        }
    } catch (e) {
        alert('Login করতে সমস্যা');
    }
    return false;
          }
