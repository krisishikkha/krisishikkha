/**
 * APP.JS
 * প্রশ্ন সমাধান নোট মেকার - সম্পূর্ণ কার্যকর সংস্করণ
 */

class QuestionSolutionApp {
    constructor() {
        this.initElements();
        this.setupEventListeners();
        this.loadFromLocalStorage();
        
        // Debounce timer
        this.debounceTimer = null;
        this.debounceDelay = 500;
        
        // A4 Page Dimensions (mm)
        this.A4_HEIGHT_MM = 297;
        this.A4_WIDTH_MM = 210;
        
        // Reduced Margins (50% smaller)
        this.PAGE_MARGIN_TOP_MM = 10;
        this.PAGE_MARGIN_BOTTOM_MM = 10;
        this.PAGE_MARGIN_LEFT_MM = 10;
        this.PAGE_MARGIN_RIGHT_MM = 10;
        this.FOOTER_SPACE_MM = 8;
        
        // Usable Height
        this.USABLE_HEIGHT_MM = this.A4_HEIGHT_MM - 
                                 this.PAGE_MARGIN_TOP_MM - 
                                 this.PAGE_MARGIN_BOTTOM_MM - 
                                 this.FOOTER_SPACE_MM;
        
        // Conversion factor
        this.MM_TO_PX = 3.7795275591;
        
        // Debug mode
        this.debugMode = false;
        
        console.log(`✅ App Initialized`);
        console.log(`📐 Usable Height: ${this.USABLE_HEIGHT_MM}mm`);
    }

    initElements() {
        // Title inputs
        this.title1Input = document.getElementById('title1');
        this.title2Input = document.getElementById('title2');
        this.title3Input = document.getElementById('title3');
        this.title4Input = document.getElementById('title4');
        this.title5Input = document.getElementById('title5');

        // Content inputs
        this.contentInput = document.getElementById('content');
        this.watermarkInput = document.getElementById('watermark');
        this.footerInput = document.getElementById('footer');

        // Font size sliders
        this.titleFontSize = document.getElementById('titleFontSize');
        this.contentFontSize = document.getElementById('contentFontSize');
        this.watermarkFontSize = document.getElementById('watermarkFontSize');
        this.footerFontSize = document.getElementById('footerFontSize');
        this.lineHeightSlider = document.getElementById('lineHeight');

        // Value displays
        this.titleSizeValue = document.getElementById('titleSizeValue');
        this.contentSizeValue = document.getElementById('contentSizeValue');
        this.watermarkSizeValue = document.getElementById('watermarkSizeValue');
        this.footerSizeValue = document.getElementById('footerSizeValue');
        this.lineHeightValue = document.getElementById('lineHeightValue');

        // Buttons
        this.previewBtn = document.getElementById('previewBtn');
        this.downloadPNGBtn = document.getElementById('downloadPNG');
        this.downloadJPGBtn = document.getElementById('downloadJPG');

        // Preview
        this.previewContainer = document.getElementById('previewContainer');
        this.noteForm = document.getElementById('noteForm');
    }

    setupEventListeners() {
        // Text inputs
        const textInputs = [
            this.title1Input,
            this.title2Input,
            this.title3Input,
            this.title4Input,
            this.title5Input,
            this.watermarkInput,
            this.footerInput
        ];

        textInputs.forEach(input => {
            input.addEventListener('input', () => this.debouncedUpdate());
        });

        this.contentInput.addEventListener('input', () => this.debouncedUpdate());

        // Font size sliders
        this.titleFontSize.addEventListener('input', (e) => {
            this.titleSizeValue.textContent = e.target.value + 'px';
            this.debouncedUpdate();
        });

        this.contentFontSize.addEventListener('input', (e) => {
            this.contentSizeValue.textContent = e.target.value + 'px';
            this.debouncedUpdate();
        });

        this.watermarkFontSize.addEventListener('input', (e) => {
            this.watermarkSizeValue.textContent = e.target.value + 'px';
            this.debouncedUpdate();
        });

        this.footerFontSize.addEventListener('input', (e) => {
            this.footerSizeValue.textContent = e.target.value + 'px';
            this.debouncedUpdate();
        });

        this.lineHeightSlider.addEventListener('input', (e) => {
            this.lineHeightValue.textContent = e.target.value;
            this.debouncedUpdate();
        });

        // Preview button
        this.previewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.updatePreview();
        });

        // Download buttons
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

        // Form reset
        this.noteForm.addEventListener('reset', () => {
            setTimeout(() => {
                this.showPlaceholder();
                this.clearLocalStorage();
            }, 0);
        });

        // Auto save
        this.noteForm.addEventListener('change', () => this.saveToLocalStorage());
        
        // Debug mode toggle (press 'D' key)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'D' || e.key === 'd') {
                this.toggleDebugMode();
            }
        });
    }

    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        const pages = this.previewContainer.querySelectorAll('.a4-page');
        pages.forEach(page => {
            if (this.debugMode) {
                page.classList.add('debug-mode');
            } else {
                page.classList.remove('debug-mode');
            }
        });
        
        const mode = this.debugMode ? 'ON' : 'OFF';
        console.log(`🐛 Debug Mode: ${mode}`);
        
        // নোটিফিকেশন দেখান
        const notification = document.createElement('div');
        notification.textContent = `🐛 Debug Mode: ${mode}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #3b82f6;
            color: white;
            padding: 12px 18px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            font-family: 'Noto Sans Bengali', sans-serif;
            font-weight: 600;
            font-size: 13px;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 2000);
    }

    debouncedUpdate() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.saveToLocalStorage();
        }, this.debounceDelay);
}
      updatePreview() {
        const content = this.contentInput.value.trim();

        if (!content) {
            this.showPlaceholder();
            return;
        }

        // Collect titles
        const titles = [
            this.title1Input.value.trim(),
            this.title2Input.value.trim(),
            this.title3Input.value.trim(),
            this.title4Input.value.trim(),
            this.title5Input.value.trim()
        ].filter(t => t !== '');

        const watermark = this.watermarkInput.value.trim();
        const footer = this.footerInput.value.trim();

        // Parse content
        const { html: contentHTML } = parser.parse(content);

        // Create pages
        this.createSmartPages(titles, contentHTML, watermark, footer);

        // Apply styles
        this.applyStyles();

        // Save
        this.saveToLocalStorage();
    }

    createSmartPages(titles, contentHTML, watermark, footer) {
        // Clear preview
        this.previewContainer.innerHTML = '';

        // Parse content into blocks
        const contentBlocks = this.parseContentBlocks(contentHTML);

        // Create first page
        let currentPage = this.createNewPage(watermark, footer);
        this.previewContainer.appendChild(currentPage);
        
        let currentContent = currentPage.querySelector('.page-content');
        let currentY = 0;

        // Add titles (only on first page)
        if (titles.length > 0) {
            const titlesContainer = document.createElement('div');
            titlesContainer.className = 'titles-container';
            
            titles.forEach((title, index) => {
                const titleEl = document.createElement('div');
                titleEl.className = 'page-title';
                
                if (index === titles.length - 1) {
                    titleEl.classList.add('last-title');
                }
                
                titleEl.textContent = title;
                titlesContainer.appendChild(titleEl);
            });

            currentContent.appendChild(titlesContainer);
            
            // Measure title height
            const titleHeight = this.getElementHeightMM(titlesContainer);
            currentY += titleHeight;
        }

        // Add content blocks
        for (let i = 0; i < contentBlocks.length; i++) {
            const block = contentBlocks[i];
            
            // Create temporary element to measure height
            const tempBlock = document.createElement('div');
            tempBlock.className = 'content-block';
            tempBlock.innerHTML = block;
            tempBlock.style.visibility = 'hidden';
            tempBlock.style.position = 'absolute';
            currentContent.appendChild(tempBlock);
            
            const blockHeight = this.getElementHeightMM(tempBlock);
            currentContent.removeChild(tempBlock);
            
            // Check if block fits
            if (currentY + blockHeight > this.USABLE_HEIGHT_MM) {
                // Create new page
                currentPage = this.createNewPage(watermark, footer);
                this.previewContainer.appendChild(currentPage);
                currentContent = currentPage.querySelector('.page-content');
                currentY = 0;
            }
            
            // Add block
            const blockEl = document.createElement('div');
            blockEl.className = 'content-block';
            blockEl.innerHTML = block;
            currentContent.appendChild(blockEl);
            
            currentY += blockHeight;
        }
        
        const pageCount = this.previewContainer.querySelectorAll('.a4-page').length;
        console.log(`📄 Created ${pageCount} page(s)`);
    }

    parseContentBlocks(contentHTML) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = contentHTML;
        
        const blocks = [];
        let currentBlock = [];
        
        const children = Array.from(tempDiv.children);
        
        for (let child of children) {
            const tagName = child.tagName.toLowerCase();
            
            if (tagName === 'ul' || tagName === 'ol') {
                if (currentBlock.length > 0) {
                    blocks.push(currentBlock.join(''));
                    currentBlock = [];
                }
                blocks.push(child.outerHTML);
            } else if (tagName === 'p') {
                currentBlock.push(child.outerHTML);
                
                if (currentBlock.length >= 3) {
                    blocks.push(currentBlock.join(''));
                    currentBlock = [];
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

    getElementHeightMM(element) {
        const heightPx = element.scrollHeight;
        const heightMM = heightPx / this.MM_TO_PX;
        return heightMM;
    }

    createNewPage(watermark, footer) {
        const page = document.createElement('div');
        page.className = 'a4-page';
        
        if (this.debugMode) {
            page.classList.add('debug-mode');
        }

        // Watermark
        if (watermark) {
            const watermarkEl = document.createElement('div');
            watermarkEl.className = 'watermark';
            watermarkEl.textContent = watermark;
            page.appendChild(watermarkEl);
        }

        // Content wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'page-content-wrapper';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'page-content';
        contentWrapper.appendChild(contentDiv);
        
        page.appendChild(contentWrapper);

        // Footer
        if (footer) {
            const footerEl = document.createElement('div');
            footerEl.className = 'page-footer';
            footerEl.textContent = footer;
            page.appendChild(footerEl);
        }

        return page;
    }

    showPlaceholder() {
        this.previewContainer.innerHTML = `
            <div class="placeholder-message">
                <p>👈 অনুগ্রহ করে মূল বিষয়বস্তু পূরণ করুন এবং "প্রিভিউ দেখান" ক্লিক করুন</p>
                <p style="margin-top: 10px; font-size: 12px; color: #9ca3af;">💡 Press 'D' to toggle debug mode</p>
            </div>
        `;
              }
      applyStyles() {
        const pages = this.previewContainer.querySelectorAll('.a4-page');
        const titleFontSize = this.titleFontSize.value + 'px';
        const contentFontSize = this.contentFontSize.value + 'px';
        const watermarkFontSize = this.watermarkFontSize.value + 'px';
        const footerFontSize = this.footerFontSize.value + 'px';
        const lineHeight = this.lineHeightSlider.value;

        pages.forEach(page => {
            // Title style
            const titles = page.querySelectorAll('.page-title');
            titles.forEach(title => {
                title.style.fontSize = titleFontSize;
            });

            // Content style
            const contentDiv = page.querySelector('.page-content');
            if (contentDiv) {
                contentDiv.style.fontSize = contentFontSize;
                contentDiv.style.lineHeight = lineHeight;

                const paragraphs = contentDiv.querySelectorAll('p');
                paragraphs.forEach(p => {
                    p.style.lineHeight = lineHeight;
                });

                const listItems = contentDiv.querySelectorAll('li');
                listItems.forEach(li => {
                    li.style.lineHeight = lineHeight;
                });
            }

            // Watermark style
            const watermarkEl = page.querySelector('.watermark');
            if (watermarkEl) {
                watermarkEl.style.fontSize = watermarkFontSize;
            }

            // Footer style
            const footerEl = page.querySelector('.page-footer');
            if (footerEl) {
                footerEl.style.fontSize = footerFontSize;
            }
        });
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
            contentFontSize: this.contentFontSize.value,
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
                this.contentFontSize.value = data.contentFontSize || '13';
                this.watermarkFontSize.value = data.watermarkFontSize || '60';
                this.footerFontSize.value = data.footerFontSize || '10';
                this.lineHeightSlider.value = data.lineHeight || '1.2';

                this.titleSizeValue.textContent = (data.titleFontSize || '24') + 'px';
                this.contentSizeValue.textContent = (data.contentFontSize || '13') + 'px';
                this.watermarkSizeValue.textContent = (data.watermarkFontSize || '60') + 'px';
                this.footerSizeValue.textContent = (data.footerFontSize || '10') + 'px';
                this.lineHeightValue.textContent = data.lineHeight || '1.2';

                if (data.content) {
                    this.updatePreview();
                }
            } catch (error) {
                console.error('Error loading from localStorage:', error);
            }
        } else {
            this.titleFontSize.value = '24';
            this.contentFontSize.value = '13';
            this.watermarkFontSize.value = '60';
            this.footerFontSize.value = '10';
            this.lineHeightSlider.value = '1.2';

            this.titleSizeValue.textContent = '24px';
            this.contentSizeValue.textContent = '13px';
            this.watermarkSizeValue.textContent = '60px';
            this.footerSizeValue.textContent = '10px';
            this.lineHeightValue.textContent = '1.2';
        }
    }

    clearLocalStorage() {
        localStorage.removeItem('questionSolutionData');
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    const app = new QuestionSolutionApp();
    console.log('✅ প্রশ্ন সমাধান নোট মেকার চালু হয়েছে');
    console.log('💡 Press "D" key to toggle debug mode');
});
