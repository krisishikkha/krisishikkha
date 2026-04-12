/**
 * APP.JS
 * মূল অ্যাপ্লিকেশন লজিক
 */

class NoteApp {
    constructor() {
        this.initElements();
        this.setupEventListeners();
        this.loadFromLocalStorage();
    }

    initElements() {
        // ফর্ম ইনপুট
        this.promoInput = document.getElementById('promoTag');
        this.titleInput = document.getElementById('title');
        this.subtitleInput = document.getElementById('subtitle');
        this.contentInput = document.getElementById('content');
        this.footerInput = document.getElementById('footer');

        // ফন্ট সাইজ স্লাইডার
        this.promoFontSize = document.getElementById('promoFontSize');
        this.titleFontSize = document.getElementById('titleFontSize');
        this.subtitleFontSize = document.getElementById('subtitleFontSize');
        this.contentFontSize = document.getElementById('contentFontSize');
        this.footerFontSize = document.getElementById('footerFontSize');
        this.lineHeightSlider = document.getElementById('lineHeight');

        // ভ্যালু ডিসপ্লে
        this.promoSizeValue = document.getElementById('promoSizeValue');
        this.titleSizeValue = document.getElementById('titleSizeValue');
        this.subtitleSizeValue = document.getElementById('subtitleSizeValue');
        this.contentSizeValue = document.getElementById('contentSizeValue');
        this.footerSizeValue = document.getElementById('footerSizeValue');
        this.lineHeightValue = document.getElementById('lineHeightValue');

        // বাটন
        this.previewBtn = document.getElementById('previewBtn');
        this.downloadPNGBtn = document.getElementById('downloadPNG');
        this.downloadJPGBtn = document.getElementById('downloadJPG');

        // প্রিভিউ
        this.preview = document.getElementById('preview');
        this.noteForm = document.getElementById('noteForm');
    }

    setupEventListeners() {
        // টেক্সট ইনপুট
        this.titleInput.addEventListener('input', () => this.updatePreview());
        this.subtitleInput.addEventListener('input', () => this.updatePreview());
        this.contentInput.addEventListener('input', () => this.updatePreview());
        this.promoInput.addEventListener('input', () => this.updatePreview());
        this.footerInput.addEventListener('input', () => this.updatePreview());

        // ফন্ট সাইজ স্লাইডার
        this.promoFontSize.addEventListener('input', (e) => {
            this.promoSizeValue.textContent = e.target.value + 'px';
            this.updatePreview();
        });

        this.titleFontSize.addEventListener('input', (e) => {
            this.titleSizeValue.textContent = e.target.value + 'px';
            this.updatePreview();
        });

        this.subtitleFontSize.addEventListener('input', (e) => {
            this.subtitleSizeValue.textContent = e.target.value + 'px';
            this.updatePreview();
        });

        this.contentFontSize.addEventListener('input', (e) => {
            this.contentSizeValue.textContent = e.target.value + 'px';
            this.updatePreview();
        });

        this.footerFontSize.addEventListener('input', (e) => {
            this.footerSizeValue.textContent = e.target.value + 'px';
            this.updatePreview();
        });

        this.lineHeightSlider.addEventListener('input', (e) => {
            this.lineHeightValue.textContent = e.target.value;
            this.updatePreview();
        });

        // প্রিভিউ বাটন
        this.previewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.updatePreview();
        });

        // ডাউনলোড বাটন
        this.downloadPNGBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            this.downloadPNGBtn.disabled = true;
            await exporter.exportPNG();
            this.downloadPNGBtn.disabled = false;
        });

        this.downloadJPGBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            this.downloadJPGBtn.disabled = true;
            await exporter.exportJPG();
            this.downloadJPGBtn.disabled = false;
        });

        // ফর্ম রিসেট
        this.noteForm.addEventListener('reset', () => {
            setTimeout(() => {
                this.preview.innerHTML = '<p class="placeholder">👈 ফর্ম পূরণ করুন এবং প্রিভিউ দেখান ক্লিক করুন</p>';
                this.clearLocalStorage();
            }, 0);
        });

        // অটো সেভ
        this.noteForm.addEventListener('change', () => this.saveToLocalStorage());
        this.contentInput.addEventListener('change', () => this.saveToLocalStorage());
    }

    updatePreview() {
        const title = this.titleInput.value.trim();
        const subtitle = this.subtitleInput.value.trim();
        const content = this.contentInput.value.trim();
        const promo = this.promoInput.value.trim();
        const footer = this.footerInput.value.trim();

        // ভ্যালিডেশন
        if (!title || !content) {
            this.preview.innerHTML = '<p class="placeholder">⚠️ অনুগ্রহ করে শিরোনাম এবং বিষয়বস্তু পূরণ করুন</p>';
            return;
        }

        // কন্টেন্ট পার্স
        const { html: contentHTML } = parser.parse(content);

        // HTML বিল্ড
        let previewHTML = '';

        if (promo) {
            previewHTML += `<div class="promo-tag">${promo}</div>`;
        }

        previewHTML += `<div class="preview-title">${title}</div>`;

        if (subtitle) {
            previewHTML += `<div class="preview-subtitle">${subtitle}</div>`;
        }

        previewHTML += `<div class="preview-body">${contentHTML}</div>`;

        if (footer) {
            previewHTML += `<div class="preview-footer">${footer}</div>`;
        }

        this.preview.innerHTML = previewHTML;

        // স্টাইল প্রয়োগ
        this.applyStyles();

        // সংরক্ষণ
        this.saveToLocalStorage();
    }

    applyStyles() {
        const promoTag = this.preview.querySelector('.promo-tag');
        const titleEl = this.preview.querySelector('.preview-title');
        const subtitleEl = this.preview.querySelector('.preview-subtitle');
        const bodyEl = this.preview.querySelector('.preview-body');
        const footerEl = this.preview.querySelector('.preview-footer');

        const lineHeight = this.lineHeightSlider.value;
        this.preview.style.lineHeight = lineHeight;

        if (promoTag) {
            promoTag.style.fontSize = this.promoFontSize.value + 'px';
        }

        if (titleEl) {
            titleEl.style.fontSize = this.titleFontSize.value + 'px';
        }

        if (subtitleEl) {
            subtitleEl.style.fontSize = this.subtitleFontSize.value + 'px';
        }

        if (bodyEl) {
            bodyEl.style.fontSize = this.contentFontSize.value + 'px';
            bodyEl.style.lineHeight = lineHeight;
        }

        if (footerEl) {
            footerEl.style.fontSize = this.footerFontSize.value + 'px';
        }

        // সব li এর জন্য line-height সেট করুন
        const listItems = this.preview.querySelectorAll('li');
        listItems.forEach(li => {
            li.style.lineHeight = lineHeight;
        });
    }

    saveToLocalStorage() {
        const data = {
            promo: this.promoInput.value,
            title: this.titleInput.value,
            subtitle: this.subtitleInput.value,
            content: this.contentInput.value,
            footer: this.footerInput.value,
            promoFontSize: this.promoFontSize.value,
            titleFontSize: this.titleFontSize.value,
            subtitleFontSize: this.subtitleFontSize.value,
            contentFontSize: this.contentFontSize.value,
            footerFontSize: this.footerFontSize.value,
            lineHeight: this.lineHeightSlider.value,
        };

        localStorage.setItem('noteData', JSON.stringify(data));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('noteData');

        if (saved) {
            try {
                const data = JSON.parse(saved);

                this.promoInput.value = data.promo || '';
                this.titleInput.value = data.title || '';
                this.subtitleInput.value = data.subtitle || '';
                this.contentInput.value = data.content || '';
                this.footerInput.value = data.footer || '';

                // নতুন ডিফল্ট ভ্যালু
                this.promoFontSize.value = data.promoFontSize || '11';
                this.titleFontSize.value = data.titleFontSize || '28';
                this.subtitleFontSize.value = data.subtitleFontSize || '14';
                this.contentFontSize.value = data.contentFontSize || '13';
                this.footerFontSize.value = data.footerFontSize || '10';
                this.lineHeightSlider.value = data.lineHeight || '1.1';

                // ভ্যালু ডিসপ্লে আপডেট করুন
                this.promoSizeValue.textContent = (data.promoFontSize || '11') + 'px';
                this.titleSizeValue.textContent = (data.titleFontSize || '28') + 'px';
                this.subtitleSizeValue.textContent = (data.subtitleFontSize || '14') + 'px';
                this.contentSizeValue.textContent = (data.contentFontSize || '13') + 'px';
                this.footerSizeValue.textContent = (data.footerFontSize || '10') + 'px';
                this.lineHeightValue.textContent = data.lineHeight || '1.1';

                this.updatePreview();
            } catch (error) {
                console.error('Error loading from localStorage:', error);
            }
        } else {
            // প্রথমবার লোড হওয়ার সময় ডিফল্ট ভ্যালু সেট করুন
            this.promoFontSize.value = '11';
            this.titleFontSize.value = '28';
            this.subtitleFontSize.value = '14';
            this.contentFontSize.value = '13';
            this.footerFontSize.value = '10';
            this.lineHeightSlider.value = '1.1';

            this.promoSizeValue.textContent = '11px';
            this.titleSizeValue.textContent = '28px';
            this.subtitleSizeValue.textContent = '14px';
            this.contentSizeValue.textContent = '13px';
            this.footerSizeValue.textContent = '10px';
            this.lineHeightValue.textContent = '1.1';
        }
    }

    clearLocalStorage() {
        localStorage.removeItem('noteData');
    }
}

// অ্যাপ ইনিশিয়ালাইজ
document.addEventListener('DOMContentLoaded', () => {
    const app = new NoteApp();
    console.log('✅ নোট মেকার অ্যাপ চালু হয়েছে');
});
