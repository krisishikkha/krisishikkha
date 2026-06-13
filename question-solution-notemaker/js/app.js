/**
 * APP.JS
 * মূল বিষয়বস্তু ফন্ট: 20px FIXED
 * বাকি সব আগের মতোই
 */

class QuestionSolutionApp {
    constructor() {
        // Page dimensions (pixels)
        this.PAGE_WIDTH = 794;
        this.PAGE_HEIGHT = 1123;
        this.MARGIN_TOP = 24;
        this.MARGIN_LEFT = 24;
        this.MARGIN_RIGHT = 24;
        this.MARGIN_BOTTOM = 50;
        this.CONTENT_WIDTH = this.PAGE_WIDTH - this.MARGIN_LEFT - this.MARGIN_RIGHT;
        this.USABLE_HEIGHT = this.PAGE_HEIGHT - this.MARGIN_TOP - this.MARGIN_BOTTOM;
        this.QUESTION_GAP = 20;
        
        // মূল বিষয়বস্তু ফন্ট FIXED
        this.CONTENT_FONT_SIZE = '20px';
        
        // Debounce
        this.debounceTimer = null;
        this.debounceDelay = 500;
        
        // Debug mode
        this.debugMode = false;
        
        // Measurement container
        this.measureContainer = null;
        
        this.initElements();
        this.createMeasureContainer();
        this.setupEventListeners();
        this.loadFromLocalStorage();
        
        console.log('✅ App Initialized');
        console.log(`📐 Content Font Size: ${this.CONTENT_FONT_SIZE} (FIXED)`);
    }

    initElements() {
        this.title1Input = document.getElementById('title1');
        this.title2Input = document.getElementById('title2');
        this.title3Input = document.getElementById('title3');
        this.title4Input = document.getElementById('title4');
        this.title5Input = document.getElementById('title5');
        this.contentInput = document.getElementById('content');
        this.watermarkInput = document.getElementById('watermark');
        this.footerInput = document.getElementById('footer');
        this.titleFontSize = document.getElementById('titleFontSize');
        this.watermarkFontSize = document.getElementById('watermarkFontSize');
        this.footerFontSize = document.getElementById('footerFontSize');
        this.lineHeightSlider = document.getElementById('lineHeight');
        this.titleSizeValue = document.getElementById('titleSizeValue');
        this.watermarkSizeValue = document.getElementById('watermarkSizeValue');
        this.footerSizeValue = document.getElementById('footerSizeValue');
        this.lineHeightValue = document.getElementById('lineHeightValue');
        this.previewBtn = document.getElementById('previewBtn');
        this.downloadPNGBtn = document.getElementById('downloadPNG');
        this.downloadJPGBtn = document.getElementById('downloadJPG');
        this.previewContainer = document.getElementById('previewContainer');
        this.noteForm = document.getElementById('noteForm');
    }

    createMeasureContainer() {
        this.measureContainer = document.createElement('div');
        this.measureContainer.className = 'measure-container';
        document.body.appendChild(this.measureContainer);
    }

    setupEventListeners() {
        const textInputs = [
            this.title1Input, this.title2Input, this.title3Input,
            this.title4Input, this.title5Input,
            this.watermarkInput, this.footerInput
        ];

        textInputs.forEach(input => {
            input.addEventListener('input', () => this.debouncedSave());
        });

        this.contentInput.addEventListener('input', () => this.debouncedSave());

        this.titleFontSize.addEventListener('input', (e) => {
            this.titleSizeValue.textContent = e.target.value + 'px';
            this.debouncedSave();
        });

        this.watermarkFontSize.addEventListener('input', (e) => {
            this.watermarkSizeValue.textContent = e.target.value + 'px';
            this.debouncedSave();
        });

        this.footerFontSize.addEventListener('input', (e) => {
            this.footerSizeValue.textContent = e.target.value + 'px';
            this.debouncedSave();
        });

        this.lineHeightSlider.addEventListener('input', (e) => {
            this.lineHeightValue.textContent = e.target.value;
            this.debouncedSave();
        });

        this.previewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.updatePreview();
        });

        this.downloadPNGBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            this.downloadPNGBtn.disabled = true;
            this.downloadPNGBtn.textContent = '⏳ প্রসেসিং...';
            await exporter.exportPNG();
            this.downloadPNGBtn.disabled = false;
            this.downloadPNGBtn.innerHTML = '📥 PNG ডাউনলোড';
        });

        this.downloadJPGBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            this.downloadJPGBtn.disabled = true;
            this.downloadJPGBtn.textContent = '⏳ প্রসেসিং...';
            await exporter.exportJPG();
            this.downloadJPGBtn.disabled = false;
            this.downloadJPGBtn.innerHTML = '📥 JPG ডাউনলোড';
        });

        this.noteForm.addEventListener('reset', () => {
            setTimeout(() => {
                this.showPlaceholder();
                this.clearLocalStorage();
            }, 0);
        });

        this.noteForm.addEventListener('change', () => this.saveToLocalStorage());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'd' || e.key === 'D') {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                this.toggleDebugMode();
            }
        });
    }

    debouncedSave() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.saveToLocalStorage();
        }, this.debounceDelay);
    }

    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        const pages = this.previewContainer.querySelectorAll('.a4-page');
        pages.forEach(page => {
            page.classList.toggle('debug-mode', this.debugMode);
        });
        this.showToast(`🐛 Debug Mode: ${this.debugMode ? 'ON' : 'OFF'}`);
              }
      updatePreview() {
        const content = this.contentInput.value.trim();
        if (!content) {
            this.showPlaceholder();
            return;
        }

        const titles = [
            this.title1Input.value.trim(),
            this.title2Input.value.trim(),
            this.title3Input.value.trim(),
            this.title4Input.value.trim(),
            this.title5Input.value.trim()
        ].filter(t => t !== '');

        const watermark = this.watermarkInput.value.trim();
        const footer = this.footerInput.value.trim();
        const { html: contentHTML } = parser.parse(content);

        const styles = {
            titleFontSize: this.titleFontSize.value + 'px',
            contentFontSize: this.CONTENT_FONT_SIZE,  // 20px FIXED
            lineHeight: this.lineHeightSlider.value,
            watermarkFontSize: this.watermarkFontSize.value + 'px',
            footerFontSize: this.footerFontSize.value + 'px'
        };

        this.renderPages(titles, contentHTML, watermark, footer, styles);
        this.saveToLocalStorage();
    }

    measureBlockHeight(htmlContent, styles) {
        this.measureContainer.style.width = this.CONTENT_WIDTH + 'px';
        this.measureContainer.style.fontSize = styles.contentFontSize;
        this.measureContainer.style.lineHeight = styles.lineHeight;
        this.measureContainer.style.fontFamily = "'Noto Sans Bengali', sans-serif";
        this.measureContainer.innerHTML = htmlContent;
        const height = this.measureContainer.offsetHeight;
        this.measureContainer.innerHTML = '';
        return height;
    }

    measureTitleHeight(titles, styles) {
        let html = '<div class="titles-container">';
        titles.forEach((title, index) => {
            const lastClass = index === titles.length - 1 ? ' last-title' : '';
            html += `<div class="page-title${lastClass}" style="font-size:${styles.titleFontSize}">${title}</div>`;
        });
        html += '</div>';

        this.measureContainer.style.width = this.CONTENT_WIDTH + 'px';
        this.measureContainer.innerHTML = html;
        const height = this.measureContainer.offsetHeight;
        this.measureContainer.innerHTML = '';
        return height;
    }

    splitIntoBlocks(contentHTML) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = contentHTML;
        
        const blocks = [];
        let currentBlock = [];

        const children = Array.from(tempDiv.children);

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const tag = child.tagName.toLowerCase();

            if (tag === 'ul' || tag === 'ol') {
                if (currentBlock.length > 0) {
                    blocks.push(currentBlock.join(''));
                    currentBlock = [];
                }
                blocks.push(child.outerHTML);
            } else if (tag === 'p') {
                const text = child.textContent.trim();
                
                if (text === '' || child.style.height) {
                    if (currentBlock.length > 0) {
                        blocks.push(currentBlock.join(''));
                        currentBlock = [];
                    }
                    blocks.push(child.outerHTML);
                } else {
                    currentBlock.push(child.outerHTML);
                    
                    if (currentBlock.length >= 5) {
                        blocks.push(currentBlock.join(''));
                        currentBlock = [];
                    }
                }
            } else {
                currentBlock.push(child.outerHTML);
            }
        }
        
        if (currentBlock.length > 0) {
            blocks.push(currentBlock.join(''));
        }
        
        return blocks;
          }
      renderPages(titles, contentHTML, watermark, footer, styles) {
        this.previewContainer.innerHTML = '';

        const blocks = this.splitIntoBlocks(contentHTML);

        let pages = [];
        let currentPageBlocks = [];
        let currentY = 0;
        let isFirstPage = true;

        let titleHeight = 0;
        if (titles.length > 0) {
            titleHeight = this.measureTitleHeight(titles, styles);
            currentY = titleHeight;
        }

        for (let i = 0; i < blocks.length; i++) {
            const blockHTML = `<div class="content-block">${blocks[i]}</div>`;
            const blockHeight = this.measureBlockHeight(blockHTML, styles);
            const totalBlockHeight = blockHeight + this.QUESTION_GAP;

            if (currentY + totalBlockHeight > this.USABLE_HEIGHT) {
                pages.push({
                    blocks: currentPageBlocks,
                    isFirstPage: isFirstPage
                });

                currentPageBlocks = [];
                currentY = 0;
                isFirstPage = false;
            }

            currentPageBlocks.push(blocks[i]);
            currentY += totalBlockHeight;
        }

        if (currentPageBlocks.length > 0) {
            pages.push({
                blocks: currentPageBlocks,
                isFirstPage: isFirstPage
            });
        }

        if (pages.length === 0) {
            pages.push({
                blocks: [],
                isFirstPage: true
            });
        }

        pages.forEach((pageData, pageIndex) => {
            const pageEl = this.buildPage(
                pageData, titles, watermark, footer, styles, pageIndex + 1
            );
            this.previewContainer.appendChild(pageEl);
        });

        console.log(`📄 Total pages: ${pages.length}`);
    }

    buildPage(pageData, titles, watermark, footer, styles, pageNum) {
        const page = document.createElement('div');
        page.className = 'a4-page';
        
        if (this.debugMode) {
            page.classList.add('debug-mode');
        }

        if (watermark) {
            const watermarkEl = document.createElement('div');
            watermarkEl.className = 'watermark';
            watermarkEl.textContent = watermark;
            watermarkEl.style.fontSize = styles.watermarkFontSize;
            page.appendChild(watermarkEl);
        }

        const contentArea = document.createElement('div');
        contentArea.className = 'content-area';
        contentArea.setAttribute('data-page', `Page ${pageNum}`);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'page-content';
        contentDiv.style.fontSize = styles.contentFontSize;  // 20px FIXED
        contentDiv.style.lineHeight = styles.lineHeight;

        if (pageData.isFirstPage && titles.length > 0) {
            const titlesContainer = document.createElement('div');
            titlesContainer.className = 'titles-container';

            titles.forEach((title, index) => {
                const titleEl = document.createElement('div');
                titleEl.className = 'page-title';
                titleEl.style.fontSize = styles.titleFontSize;

                if (index === titles.length - 1) {
                    titleEl.classList.add('last-title');
                }

                titleEl.textContent = title;
                titlesContainer.appendChild(titleEl);
            });

            contentDiv.appendChild(titlesContainer);
        }

        pageData.blocks.forEach(blockHTML => {
            const blockEl = document.createElement('div');
            blockEl.className = 'content-block';
            blockEl.innerHTML = blockHTML;

            const ps = blockEl.querySelectorAll('p');
            ps.forEach(p => { p.style.lineHeight = styles.lineHeight; });
            const lis = blockEl.querySelectorAll('li');
            lis.forEach(li => { li.style.lineHeight = styles.lineHeight; });

            contentDiv.appendChild(blockEl);
        });

        contentArea.appendChild(contentDiv);
        page.appendChild(contentArea);

        if (footer) {
            const footerEl = document.createElement('div');
            footerEl.className = 'page-footer';
            footerEl.style.fontSize = styles.footerFontSize;
            footerEl.textContent = footer;
            page.appendChild(footerEl);
        }

        return page;
    }

    showPlaceholder() {
        this.previewContainer.innerHTML = `
            <div class="placeholder-message">
                <p>👈 বিষয়বস্তু লিখে "প্রিভিউ দেখান" ক্লিক করুন</p>
                <p style="margin-top: 10px; font-size: 11px; color: #9ca3af;">
                    💡 Debug mode: 'D' key (input field এ না থাকা অবস্থায়)
                </p>
            </div>
        `;
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            background: #3b82f6; color: white;
            padding: 12px 18px; border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 9999; font-family: 'Noto Sans Bengali', sans-serif;
            font-weight: 600; font-size: 13px;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 2000);
          }
      saveToLocalStorage() {
        const data = {
            title1: this.title1Input.value,
            title2: this.title2Input.value,
            title3: this.title3Input.value,
            title4: this.title4Input.value,
            title5: this.title5Input.value,
            content: this.contentInput.value,
            watermark: this.watermarkInput.value,
            footer: this.footerInput.value,
            titleFontSize: this.titleFontSize.value,
            watermarkFontSize: this.watermarkFontSize.value,
            footerFontSize: this.footerFontSize.value,
            lineHeight: this.lineHeightSlider.value,
        };
        localStorage.setItem('questionSolutionData', JSON.stringify(data));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('questionSolutionData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.title1Input.value = data.title1 || '';
                this.title2Input.value = data.title2 || '';
                this.title3Input.value = data.title3 || '';
                this.title4Input.value = data.title4 || '';
                this.title5Input.value = data.title5 || '';
                this.contentInput.value = data.content || '';
                this.watermarkInput.value = data.watermark || '';
                this.footerInput.value = data.footer || '';
                this.titleFontSize.value = data.titleFontSize || '24';
                this.watermarkFontSize.value = data.watermarkFontSize || '60';
                this.footerFontSize.value = data.footerFontSize || '10';
                this.lineHeightSlider.value = data.lineHeight || '1.2';
                this.titleSizeValue.textContent = (data.titleFontSize || '24') + 'px';
                this.watermarkSizeValue.textContent = (data.watermarkFontSize || '60') + 'px';
                this.footerSizeValue.textContent = (data.footerFontSize || '10') + 'px';
                this.lineHeightValue.textContent = data.lineHeight || '1.2';
                if (data.content) {
                    this.updatePreview();
                }
            } catch (error) {
                console.error('LocalStorage Error:', error);
            }
        } else {
            this.titleFontSize.value = '24';
            this.watermarkFontSize.value = '60';
            this.footerFontSize.value = '10';
            this.lineHeightSlider.value = '1.2';
            this.titleSizeValue.textContent = '24px';
            this.watermarkSizeValue.textContent = '60px';
            this.footerSizeValue.textContent = '10px';
            this.lineHeightValue.textContent = '1.2';
        }
    }

    clearLocalStorage() {
        localStorage.removeItem('questionSolutionData');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.app = new QuestionSolutionApp();
    console.log('💡 Press "D" key to toggle debug mode');
});
