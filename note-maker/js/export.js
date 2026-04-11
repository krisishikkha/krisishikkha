/**
 * EXPORT.JS
 * Handle image and document export functionality
 */

class ExportManager {
    constructor() {
        this.defaultFileName = 'note';
        this.quality = 0.95;
    }

    /**
     * Export preview as PNG
     */
    async exportPNG() {
        try {
            const element = document.querySelector('#preview');
            const canvas = await html2canvas(element, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false,
                useCORS: true,
            });

            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `${this.defaultFileName}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            this.showNotification('✅ PNG downloaded successfully!', 'success');
        } catch (error) {
            console.error('PNG Export Error:', error);
            this.showNotification('❌ Failed to export PNG', 'error');
        }
    }

    /**
     * Export preview as JPG
     */
    async exportJPG() {
        try {
            const element = document.querySelector('#preview');
            const canvas = await html2canvas(element, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false,
                useCORS: true,
            });

            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/jpeg', this.quality);
            link.download = `${this.defaultFileName}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            this.showNotification('✅ JPG downloaded successfully!', 'success');
        } catch (error) {
            console.error('JPG Export Error:', error);
            this.showNotification('❌ Failed to export JPG', 'error');
        }
    }

    /**
     * Export preview as PDF
     */
    async exportPDF() {
        try {
            const element = document.querySelector('#preview');
            const canvas = await html2canvas(element, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false,
                useCORS: true,
            });

            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`${this.defaultFileName}.pdf`);

            this.showNotification('✅ PDF downloaded successfully!', 'success');
        } catch (error) {
            console.error('PDF Export Error:', error);
            this.showNotification('❌ Failed to export PDF', 'error');
        }
    }

    /**
     * Show notification toast
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 15px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    /**
     * Copy preview as image to clipboard
     */
    async copyToClipboard() {
        try {
            const element = document.querySelector('#preview');
            const canvas = await html2canvas(element, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false,
            });

            canvas.toBlob(blob => {
                const item = new ClipboardItem({ 'image/png': blob });
                navigator.clipboard.write([item]);
                this.showNotification('✅ Copied to clipboard!', 'success');
            });
        } catch (error) {
            console.error('Clipboard Error:', error);
            this.showNotification('❌ Failed to copy', 'error');
        }
    }

    /**
     * Set custom filename
     */
    setFileName(name) {
        this.defaultFileName = name || 'note';
    }
}

// Export for use in other files
const exporter = new ExportManager();
