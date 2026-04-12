/**
 * EXPORT.JS
 * PNG এবং JPG এক্সপোর্ট
 */

class ExportManager {
    async exportPNG() {
        try {
            const element = document.querySelector('#preview');
            const canvas = await html2canvas(element, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true,
            });

            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'note-' + new Date().getTime() + '.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            this.showNotification('✅ PNG সফলভাবে ডাউনলোড হয়েছে!', 'success');
        } catch (error) {
            console.error('PNG Export Error:', error);
            this.showNotification('❌ PNG ডাউনলোড ব্যর্থ', 'error');
        }
    }

    async exportJPG() {
        try {
            const element = document.querySelector('#preview');
            const canvas = await html2canvas(element, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true,
            });

            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/jpeg', 0.95);
            link.download = 'note-' + new Date().getTime() + '.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            this.showNotification('✅ JPG সফলভাবে ডাউনলোড হয়েছে!', 'success');
        } catch (error) {
            console.error('JPG Export Error:', error);
            this.showNotification('❌ JPG ডাউনলোড ব্যর্থ', 'error');
        }
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
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
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
