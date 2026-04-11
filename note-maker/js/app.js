/**
 * APP.JS
 * Main application logic and event handlers
 */

class NoteApp {
    constructor() {
        this.initElements();
        this.setupEventListeners();
        this.loadFromLocalStorage();
    }

    /**
     * Initialize DOM elements
     */
    initElements() {
        // Form inputs
        this.promoInput = document.getElementById('promoTag');
        this.titleInput = document.getElementById('title');
        this.subtitleInput = document.getElementById('subtitle');
        this.contentInput = document.getElementById('content');
        this.footerInput = document.getElementById('footer');

        // Font selectors
        this.promoFontSelect = document.getElementById('promoFont');
        this.titleFontSelect = document.getElementById('titleFont');
        this.contentFontSelect = document.getElementById('contentFont');
        this.footerFontSelect = document.getElementById('footerFont');

        // Layout & styling
        this.templateSelect = document.getElementById('template');
        this.lineSpacingInput = document.getElementById('lineSpacing');
        this.spacingValue = document.getElementById('spacingValue');
        this.logoCheckbox = document.getElementById('showLogo');

        // Buttons
        this.previewBtn = document.getElementById('previewBtn');
        this.downloadPNGBtn = document.getElementById('downloadPNG');
        this.downloadJPGBtn = document.getElementById('downloadJPG');
        this.downloadPDFBtn = document.getElementById('downloadPDF');

        // Preview
        this.preview = document.getElementById('preview');
        this.noteForm = document.getElementById('noteForm');

        // Alignment buttons
        this.alignButtons = document.querySelectorAll('.align-btn');
        this.currentAlignment = 'center';
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Form inputs - Real-time preview
        this.titleInput.addEventListener('input', () => this.updatePreview());
        this.subtitleInput.addEventListener('input', () => this.updatePreview());
        this.contentInput.addEventListener('input', () => this.updatePreview());
        this.promoInput.addEventListener('input', () => this.updatePreview());
        this.footerInput.addEventListener('input', () => this.updatePreview());

        // Font changes
        this.promoFontSelect.addEventListener('change', () => this.updatePreview());
        this.titleFontSelect.addEventListener('change', () => this.updatePreview());
        this.contentFontSelect.addEventListener('change', () => this.updatePreview());
        this.footerFontSelect.addEventListener('change', () => this.updatePreview());

        // Template and styling
        this.templateSelect.addEventListener('change', () => this.updateTemplate());
        this.lineSpacingInput.addEventListener('input', () => this.updateLineSpacing());
        this.logoCheckbox.addEventListener('change', () => this.updatePreview());

        // Alignment buttons
        this.alignButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setAlignment(btn.dataset.align);
            });
        });

        // Preview button
        this.previewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.updatePreview();
        });

        // Export buttons
        this.downloadPNGBtn.addEventListener('click', async () => {
            this.downloadPNGBtn.disabled = true;
            await exporter.exportPNG();
            this.downloadPNGBtn.disabled = false;
        });

        this.downloadJPGBtn.addEventListener('click', async () => {
            this.downloadJPGBtn.disabled = true;
            await exporter.exportJPG();
            this.downloadJPGBtn.disabled = false;
        });

        this.downloadPDFBtn.addEventListener('click', async () => {
            this.downloadPDFBtn.disabled = true;
            await exporter.exportPDF();
            this.downloadPDFBtn.disabled = false;
        });

        // Clear form
        this.noteForm.addEventListener('reset', () => {
            setTimeout(() => {
                this.preview.innerHTML =
                    '<p class="placeholder">👈 Fill the form and click "Update Preview"</p>';
                this.currentAlignment = 'center';
                this.alignButtons.forEach(btn => btn.classList.remove('active'));
                this.clearLocalStorage();
            }, 0);
        });

        // Auto-save to localStorage
        this.noteForm.addEventListener('change', () => this.saveToLocalStorage());
        this.contentInput.addEventListener('change', () => this.saveToLocalStorage());
    }

    /**
     * Main preview update function
     */
    updatePreview() {
        const title = this.titleInput.value.trim();
        const subtitle = this.subtitleInput.value.trim();
        const content = this.contentInput.value.trim();
        const promo = this.promoInput.value.trim();
        const footer = this.footerInput.value.trim();

        // Validate required fields
        if (!title || !content) {
            this.preview.innerHTML =
                '<p class="placeholder">⚠️ Please fill Title and Content fields</p>';
            return;
        }

        // Parse content
        const { html: contentHTML } = parser.parse(content);

        // Build preview HTML
        let previewHTML = '';

        // Promo tag
        if (promo) {
            previewHTML += `<div class="promo-tag">${this.escapeHtml(promo)}</div>`;
        }

        // Title
        previewHTML += `<div class="preview-title">${this.escapeHtml(title)}</div>`;

        // Subtitle
        if (subtitle) {
            previewHTML += `<div class="preview-subtitle">${this.escapeHtml(subtitle)}</div>`;
        }

        // Content
        previewHTML += `<div class="preview-body">${contentHTML}</div>`;

        // Footer
        if (footer) {
            previewHTML += `<div class="preview-footer">${this.escapeHtml(footer)}</div>`;
        }

        // Update preview
        this.preview.innerHTML = previewHTML;

        // Apply fonts
        this.applyFonts();

        // Apply alignment
        this.applyAlignment();

        // Save to localStorage
        this.saveToLocalStorage();
    }

    /**
     * Apply font styles
     */
    applyFonts() {
        const promoTag = this.preview.querySelector('.promo-tag');
        const titleEl = this.preview.querySelector('.preview-title');
        const bodyEl = this.preview.querySelector('.preview-body');
        const footerEl = this.preview.querySelector('.preview-footer');

        if (promoTag) {
            promoTag.style.fontFamily = this.promoFontSelect.value;
        }

        if (titleEl) {
            titleEl.style.fontFamily = this.titleFontSelect.value;
        }

        if (bodyEl) {
            bodyEl.style.fontFamily = this.contentFontSelect.value;
        }

        if (footerEl) {
            footerEl.style.fontFamily = this.footerFontSelect.value;
        }
    }

    /**
     * Update template style
     */
    updateTemplate() {
        const template = this.templateSelect.value;
        this.preview.classList.remove('minimal', 'boxed', 'highlight');
        this.preview.classList.add(template);
    }

    /**
     * Update line spacing
     */
    updateLineSpacing() {
        const spacing = this.lineSpacingInput.value;
        this.spacingValue.textContent = spacing;
        this.preview.style.lineHeight = spacing;
    }

    /**
     * Set text alignment
     */
    setAlignment(align) {
        this.currentAlignment = align;

        // Update active button
        this.alignButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.align === align) {
                btn.classList.add('active');
            }
        });

        // Apply alignment
        this.applyAlignment();
    }

    /**
     * Apply alignment to preview
     */
    applyAlignment() {
        const titleEl = this.preview.querySelector('.preview-title');
        const bodyEl = this.preview.querySelector('.preview-body');

        if (titleEl) {
            titleEl.style.textAlign = this.currentAlignment;
        }

        if (bodyEl) {
            bodyEl.style.textAlign = this.currentAlignment;
        }
    }

    /**
     * Escape HTML special characters
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Save form data to localStorage
     */
    saveToLocalStorage() {
        const formData = {
            promo: this.promoInput.value,
            title: this.titleInput.value,
            subtitle: this.subtitleInput.value,
            content: this.contentInput.value,
            footer: this.footerInput.value,
            promoFont: this.promoFontSelect.value,
            titleFont: this.titleFontSelect.value,
            contentFont: this.contentFontSelect.value,
            footerFont: this.footerFontSelect.value,
            template: this.templateSelect.value,
            lineSpacing: this.lineSpacingInput.value,
            showLogo: this.logoCheckbox.checked,
            alignment: this.currentAlignment,
        };

        localStorage.setItem('noteData', JSON.stringify(formData));
    }

    /**
     * Load form data from localStorage
     */
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

                this.promoFontSelect.value = data.promoFont || 'Arial';
                this.titleFontSelect.value = data.titleFont || 'Arial';
                this.contentFontSelect.value = data.contentFont || 'Arial';
                this.footerFontSelect.value = data.footerFont || 'Arial';

                this.templateSelect.value = data.template || 'minimal';
                this.lineSpacingInput.value = data.lineSpacing || '1.6';
                this.spacingValue.textContent = data.lineSpacing || '1.6';
                this.logoCheckbox.checked = data.showLogo !== false;

                if (data.alignment) {
                    this.setAlignment(data.alignment);
                }

                // Trigger preview update
                this.updatePreview();
            } catch (error) {
                console.error('Error loading from localStorage:', error);
            }
        }
    }

    /**
     * Clear all localStorage data
     */
    clearLocalStorage() {
        localStorage.removeItem('noteData');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new NoteApp();

    // Initial preview
    app.updatePreview();

    // Log initialization
    console.log('✅ Note Maker App Initialized');
});
