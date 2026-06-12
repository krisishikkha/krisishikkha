/**
 * APP.JS
 * প্রশ্ন সমাধান নোট মেকার - EXACT A4 পেজ ব্রেক
 */

class QuestionSolutionApp {
    constructor() {
        this.initElements();
        this.setupEventListeners();
        this.loadFromLocalStorage();
        
        // Debounce timer
        this.debounceTimer = null;
        this.debounceDelay = 500;
        
        // A4 সাইজ কনস্ট্যান্ট (mm)
        this.A4_HEIGHT_MM = 297;
        this.A4_WIDTH_MM = 210;
        this.PAGE_PADDING_TOP_MM = 15;
        this.PAGE_PADDING_BOTTOM_MM = 15;
        this.FOOTER_HEIGHT_MM = 10;
        
        // Max content height (mm)
        this.MAX_CONTENT_HEIGHT_MM = this.A4_HEIGHT_MM - 
                                      this.PAGE_PADDING_TOP_MM - 
                                      this.PAGE_PADDING_BOTTOM_MM - 
                                      this.FOOTER_HEIGHT_MM - 5; // 252mm
    }

    initElements() {
        // টাইটেল ইনপুট (৫টি)
        this.title1Input = document.getElementById('title1');
        this.title2Input = document.getElementById('title2');
        this.title3Input = document.getElementById('title3');
        this.title4Input = document.getElementById('title4');
        this.title5Input = document.getElementById('title5');

        // কন্টেন্ট ইনপুট
        this.contentInput = document.getElementById('content');
        this.watermarkInput = document.getElementById('watermark');
        this.footerInput = document.getElementById('footer');

        // ফন্ট সাইজ স্লাইডার
        this.titleFontSize = document.getElementById('titleFontSize');
        this.contentFontSize = document.getElementById('contentFontSize');
        this.watermarkFontSize = document.getElementById('watermarkFontSize');
        this.footerFontSize = document.getElementById('footerFontSize');
        this.lineHeightSlider = document.getElementById('lineHeight');

        // ভ্যালু ডিসপ্লে
        this.titleSizeValue = document.getElementById('titleSizeValue');
        this.contentSizeValue = document.getElementById('contentSizeValue');
        this.watermarkSizeValue = document.getElementById('watermarkSizeValue');
        this.footerSizeValue = document.getElementById('footerSizeValue');
        this.lineHeightValue = document.getElementById('lineHeightValue');

        // বাটন
        this.previewBtn = document.getElementById('previewBtn');
        this.downloadPNGBtn = document.getElementById('downloadPNG');
        this.downloadJPGBtn = document.getElementById('downloadJPG');

        // প্রিভিউ
        this.previewContainer = document.getElementById('previewContainer');
        this.noteForm = document.getElementById('noteForm');
    }

    setupEventListeners() {
        // টেক্সট ইনপুট (ডিবাউন্স সহ)
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

        // কন্টেন্ট ইনপুট
        this.contentInput.addEventListener('input', () => this.debouncedUpdate());

        // ফন্ট সাইজ স্লাইডার
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

        // প্রিভিউ বাটন
        this.previewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.updatePreview();
        });

        // ডাউনলোড বাটন
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

        // ফর্ম রিসেট
        this.noteForm.addEventListener('reset', () => {
            setTimeout(() => {
                this.showPlaceholder();
                this.clearLocalStorage();
            }, 0);
        });

        // অটো সেভ
        this.noteForm.addEventListener('change', () => this.saveToLocalStorage());
    }

    // Debounce ফাংশন
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

        // টাইটেল সংগ্রহ
        const titles = [
            this.title1Input.value.trim(),
            this.title2Input.value.trim(),
            this.title3Input.value.trim(),
            this.title4Input.value.trim(),
            this.title5Input.value.trim()
        ].filter(t => t !== '');

        const watermark = this.watermarkInput.value.trim();
        const footer = this.footerInput.value.trim();

        // কন্টেন্ট পার্স
        const { html: contentHTML } = parser.parse(content);

        // পেজ তৈরি করুন
        this.createPagesWithPagination(titles, contentHTML, watermark, footer);

        // স্টাইল প্রয়োগ
        this.applyStyles();

        // সংরক্ষণ
        this.saveToLocalStorage();
    }

    createPagesWithPagination(titles, contentHTML, watermark, footer) {
        // প্রিভিউ ক্লিয়ার
        this.previewContainer.innerHTML = '';

        // টেম্পোরারি কন্টেইনার তৈরি
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = contentHTML;
        
        // প্রথম পেজ তৈরি
        let currentPage = this.createNewPage(watermark, footer);
        this.previewContainer.appendChild(currentPage);
        let currentContent = currentPage.querySelector('.page-content');

        // টাইটেল যোগ (শুধু প্রথম পেজে)
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
        }

        // কন্টেন্ট এলিমেন্ট যোগ করুন
        const allElements = Array.from(tempDiv.childNodes);

        for (let node of allElements) {
            // টেক্সট নোড skip করুন যদি খালি হয়
            if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
                continue;
            }

            // এলিমেন্ট ক্লোন করুন
            const clonedNode = node.cloneNode(true);
            currentContent.appendChild(clonedNode);

            // ওভারফ্লো চেক করুন
            if (this.isPageOverflowing(currentPage)) {
                // শেষ এলিমেন্ট সরান
                currentContent.removeChild(clonedNode);

                // নতুন পেজ তৈরি
                currentPage = this.createNewPage(watermark, footer);
                this.previewContainer.appendChild(currentPage);
                currentContent = currentPage.querySelector('.page-content');

                // এলিমেন্ট নতুন পেজে যোগ
                currentContent.appendChild(clonedNode);
            }
        }
    }

    createNewPage(watermark, footer) {
        const page = document.createElement('div');
        page.className = 'a4-page';

        // ওয়াটারমার্ক
        if (watermark) {
            const watermarkEl = document.createElement('div');
            watermarkEl.className = 'watermark';
            watermarkEl.textContent = watermark;
            page.appendChild(watermarkEl);
        }

        // কন্টেন্ট কন্টেইনার
        const contentDiv = document.createElement('div');
        contentDiv.className = 'page-content';
        page.appendChild(contentDiv);

        // ফুটার
        if (footer) {
            const footerEl = document.createElement('div');
            footerEl.className = 'page-footer';
            footerEl.textContent = footer;
            page.appendChild(footerEl);
        }

        return page;
    }

    isPageOverflowing(page) {
        // পেজের বর্তমান scrollHeight চেক করুন
        const contentDiv = page.querySelector('.page-content');
        const footer = page.querySelector('.page-footer');
        
        // মোট কন্টেন্ট হাইট (px)
        const contentHeight = contentDiv.scrollHeight;
        const footerHeight = footer ? footer.offsetHeight : 0;
        
        // A4 পেজ হাইট: 297mm
        // Padding: 15mm top + 15mm bottom = 30mm
        // Available: 267mm
        // Footer space: ~15mm
        // Max content: 252mm
        
        // mm থেকে px কনভার্সন (96 DPI)
        // 1mm = 3.7795275591 px
        const maxContentHeightPx = this.MAX_CONTENT_HEIGHT_MM * 3.7795275591;
        
        // চেক করুন
        return (contentHeight + footerHeight) > maxContentHeightPx;
    }

    showPlaceholder() {
        this.previewContainer.innerHTML = `
            <div class="placeholder-message">
                <p>👈 অনুগ্রহ করে মূল বিষয়বস্তু পূরণ করুন এবং "প্রিভিউ দেখান" ক্লিক করুন</p>
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
            // টাইটেল স্টাইল
            const titles = page.querySelectorAll('.page-title');
            titles.forEach(title => {
                title.style.fontSize = titleFontSize;
            });

            // কন্টেন্ট স্টাইল
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

            // ওয়াটারমার্ক স্টাইল
            const watermarkEl = page.querySelector('.watermark');
            if (watermarkEl) {
                watermarkEl.style.fontSize = watermarkFontSize;
            }

            // ফুটার স্টাইল
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

// অ্যাপ ইনিশিয়ালাইজ
document.addEventListener('DOMContentLoaded', () => {
    const app = new QuestionSolutionApp();
    console.log('✅ প্রশ্ন সমাধান নোট মেকার চালু হয়েছে');
});
