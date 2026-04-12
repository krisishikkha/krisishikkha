/**
 * EXPORT.JS
 * PNG এবং JPG এক্সপোর্ট - CORS ফিক্স সহ
 */

class ExportManager {
    async exportPNG() {
        try {
            const element = document.querySelector('#preview');
            
            const canvas = await html2canvas(element, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false,
                allowTaint: true,
                useCORS: true,
                imageTimeout: 5000,
                onclone: (clonedDocument) => {
                    const clonedElement = clonedDocument.querySelector('#preview');
                    clonedElement.style.margin = '0';
                    clonedElement.style.padding = '50px 45px';
                }
            });

            // Canvas কে Blob এ রূপান্তর করুন
            canvas.toBlob((blob) => {
                this.downloadFile(blob, 'note-' + Date.now() + '.png', 'image/png');
                this.showNotification('✅ PNG সফলভাবে ডাউনলোড হয়েছে!', 'success');
            }, 'image/png', 1.0);

        } catch (error) {
            console.error('PNG Export Error:', error);
            this.showNotification('❌ PNG ডাউনলোড ব্যর্থ: ' + error.message, 'error');
        }
    }

    async exportJPG() {
        try {
            const element = document.querySelector('#preview');
            
            const canvas = await html2canvas(element, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false,
                allowTaint: true,
                useCORS: true,
                imageTimeout: 5000,
                onclone: (clonedDocument) => {
                    const clonedElement = clonedDocument.querySelector('#preview');
                    clonedElement.style.margin = '0';
                    clonedElement.style.padding = '50px 45px';
                }
            });

            // Canvas কে Blob এ রূপান্তর করুন
            canvas.toBlob((blob) => {
                this.downloadFile(blob, 'note-' + Date.now() + '.jpg', 'image/jpeg');
                this.showNotification('✅ JPG সফলভাবে ডাউনলোড হয়েছে!', 'success');
            }, 'image/jpeg', 0.95);

        } catch (error) {
            console.error('JPG Export Error:', error);
            this.showNotification('❌ JPG ডাউনলোড ব্যর্থ: ' + error.message, 'error');
        }
    }

    // ফাইল ডাউনলোড হ্যান্ডলার
    downloadFile(blob, filename, mimeType) {
        // Blob থেকে URL তৈরি করুন
        const url = window.URL.createObjectURL(blob);
        
        // Anchor তৈরি করুন এবং ক্লিক করুন
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        
        // ডকুমেন্টে যোগ করুন
        document.body.appendChild(link);
        
        // ক্লিক করুন
        link.click();
        
        // পরিষ্কার করুন
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 15px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            font-family: 'Noto Sans Bengali', sans-serif;
            font-weight: 600;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

const exporter = new ExportManager();

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
