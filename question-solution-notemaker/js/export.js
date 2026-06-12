/**
 * EXPORT.JS
 * PNG/JPG এক্সপোর্ট ম্যানেজার (সম্পূর্ণ কার্যকর)
 */

class MultiPageExporter {
    constructor() {
        // হাই কোয়ালিটি এক্সপোর্ট
        this.SCALE = 3;
    }

    async exportPNG() {
        try {
            const pages = document.querySelectorAll('.a4-page');

            if (pages.length === 0) {
                this.showNotification('❌ কোনো পেজ নেই! প্রথমে প্রিভিউ তৈরি করুন।', 'error');
                return;
            }

            this.showNotification(`⏳ ${pages.length}টি পেজ প্রসেস হচ্ছে...`, 'info');

            for (let i = 0; i < pages.length; i++) {
                // ডিবাগ মোড সাময়িকভাবে বন্ধ করুন
                const wasDebug = pages[i].classList.contains('debug-mode');
                if (wasDebug) {
                    pages[i].classList.remove('debug-mode');
                }

                const canvas = await html2canvas(pages[i], {
                    backgroundColor: '#ffffff',
                    scale: this.SCALE,
                    logging: false,
                    allowTaint: true,
                    useCORS: true,
                    imageTimeout: 5000,
                    width: pages[i].offsetWidth,
                    height: pages[i].offsetHeight
                });

                // ডিবাগ মোড ফিরিয়ে দিন
                if (wasDebug) {
                    pages[i].classList.add('debug-mode');
                }

                // Canvas কে Blob এ রূপান্তর
                canvas.toBlob((blob) => {
                    const timestamp = Date.now();
                    const pageNum = String(i + 1).padStart(2, '0');
                    const filename = `question-note-page-${pageNum}-${timestamp}.png`;
                    this.downloadFile(blob, filename);

                    if (i === pages.length - 1) {
                        this.showNotification(`✅ ${pages.length}টি PNG পেজ সফলভাবে ডাউনলোড হয়েছে!`, 'success');
                    }
                }, 'image/png', 1.0);

                // একটু বিরতি
                await this.sleep(400);
            }

        } catch (error) {
            console.error('PNG Export Error:', error);
            this.showNotification('❌ PNG ডাউনলোড ব্যর্থ: ' + error.message, 'error');
        }
    }

    async exportJPG() {
        try {
            const pages = document.querySelectorAll('.a4-page');

            if (pages.length === 0) {
                this.showNotification('❌ কোনো পেজ নেই! প্রথমে প্রিভিউ তৈরি করুন।', 'error');
                return;
            }

            this.showNotification(`⏳ ${pages.length}টি পেজ প্রসেস হচ্ছে...`, 'info');

            for (let i = 0; i < pages.length; i++) {
                // ডিবাগ মোড সাময়িকভাবে বন্ধ করুন
                const wasDebug = pages[i].classList.contains('debug-mode');
                if (wasDebug) {
                    pages[i].classList.remove('debug-mode');
                }

                const canvas = await html2canvas(pages[i], {
                    backgroundColor: '#ffffff',
                    scale: this.SCALE,
                    logging: false,
                    allowTaint: true,
                    useCORS: true,
                    imageTimeout: 5000,
                    width: pages[i].offsetWidth,
                    height: pages[i].offsetHeight
                });

                // ডিবাগ মোড ফিরিয়ে দিন
                if (wasDebug) {
                    pages[i].classList.add('debug-mode');
                }

                canvas.toBlob((blob) => {
                    const timestamp = Date.now();
                    const pageNum = String(i + 1).padStart(2, '0');
                    const filename = `question-note-page-${pageNum}-${timestamp}.jpg`;
                    this.downloadFile(blob, filename);

                    if (i === pages.length - 1) {
                        this.showNotification(`✅ ${pages.length}টি JPG পেজ সফলভাবে ডাউনলোড হয়েছে!`, 'success');
                    }
                }, 'image/jpeg', 0.95);

                // একটু বিরতি
                await this.sleep(400);
            }

        } catch (error) {
            console.error('JPG Export Error:', error);
            this.showNotification('❌ JPG ডাউনলোড ব্যর্থ: ' + error.message, 'error');
        }
    }

    downloadFile(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        let bgColor = '#3b82f6';
        if (type === 'success') bgColor = '#10b981';
        if (type === 'error') bgColor = '#ef4444';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 16px 22px;
            border-radius: 8px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            font-family: 'Noto Sans Bengali', sans-serif;
            font-weight: 600;
            font-size: 14px;
            animation: slideIn 0.3s ease;
            max-width: 400px;
            line-height: 1.5;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, type === 'info' ? 2000 : 4000);
    }
}

const exporter = new MultiPageExporter();

// CSS এনিমেশন
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
