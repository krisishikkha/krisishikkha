/**
 * EXPORT.JS
 * মাল্টি-পেজ PNG/JPG এক্সপোর্ট ম্যানেজার (প্রতিটি পেজ আলাদা ফাইল)
 */

class MultiPageExporter {
    async exportPNG() {
        try {
            const pages = document.querySelectorAll('.a4-page');

            if (pages.length === 0) {
                this.showNotification('❌ কোনো পেজ নেই! প্রথমে প্রিভিউ তৈরি করুন।', 'error');
                return;
            }

            this.showNotification(`⏳ ${pages.length}টি পেজ প্রসেস হচ্ছে...`, 'info');

            for (let i = 0; i < pages.length; i++) {
                const canvas = await html2canvas(pages[i], {
                    backgroundColor: '#ffffff',
                    scale: 2,
                    logging: false,
                    allowTaint: true,
                    useCORS: true,
                    imageTimeout: 5000
                });

                // ডাউনলোড
                canvas.toBlob((blob) => {
                    const timestamp = Date.now();
                    const filename = `question-note-page-${i + 1}-${timestamp}.png`;
                    this.downloadFile(blob, filename);

                    if (i === pages.length - 1) {
                        this.showNotification(`✅ ${pages.length}টি PNG পেজ সফলভাবে ডাউনলোড হয়েছে!`, 'success');
                    }
                }, 'image/png', 1.0);

                // একটু বিরতি দিন (ব্রাউজার ক্র্যাশ এড়াতে)
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
                const canvas = await html2canvas(pages[i], {
                    backgroundColor: '#ffffff',
                    scale: 2,
                    logging: false,
                    allowTaint: true,
                    useCORS: true,
                    imageTimeout: 5000
                });

                // ডাউনলোড
                canvas.toBlob((blob) => {
                    const timestamp = Date.now();
                    const filename = `question-note-page-${i + 1}-${timestamp}.jpg`;
                    this.downloadFile(blob, filename);

                    if (i === pages.length - 1) {
                        this.showNotification(`✅ ${pages.length}টি JPG পেজ সফলভাবে ডাউনলোড হয়েছে!`, 'success');
                    }
                }, 'image/jpeg', 0.95);

                // একটু বিরতি দিন
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
