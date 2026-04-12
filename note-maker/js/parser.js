/**
 * PARSER.JS
 * বাংলা কন্টেন্ট পার্সিং লজিক
 */

class ContentParser {
    parse(rawText) {
        if (!rawText || rawText.trim() === '') {
            return { html: '', isEmpty: true };
        }

        const lines = rawText.split('\n');
        let html = '';
        let inList = false;
        let listType = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();

            // খালি লাইন
            if (trimmedLine === '') {
                if (inList) {
                    html += listType === 'ul' ? '</ul>' : '</ol>';
                    inList = false;
                    listType = null;
                }
                continue;
            }

            // বুলেট ডিটেক্ট
            if (this.isBullet(trimmedLine)) {
                const content = this.extractBulletContent(trimmedLine);
                
                if (!inList || listType !== 'ul') {
                    if (inList) {
                        html += listType === 'ul' ? '</ul>' : '</ol>';
                    }
                    html += '<ul>';
                    inList = true;
                    listType = 'ul';
                }
                html += `<li>${content}</li>`;
            }
            // নম্বার ডিটেক্ট
            else if (this.isNumbered(trimmedLine)) {
                const content = this.extractNumberContent(trimmedLine);
                
                if (!inList || listType !== 'ol') {
                    if (inList) {
                        html += listType === 'ul' ? '</ul>' : '</ol>';
                    }
                    html += '<ol>';
                    inList = true;
                    listType = 'ol';
                }
                html += `<li>${content}</li>`;
            }
            // প্যারাগ্রাফ
            else {
                if (inList) {
                    html += listType === 'ul' ? '</ul>' : '</ol>';
                    inList = false;
                    listType = null;
                }
                html += `<p>${trimmedLine}</p>`;
            }
        }

        // শেষ লিস্ট বন্ধ করুন
        if (inList) {
            html += listType === 'ul' ? '</ul>' : '</ol>';
        }

        return { html, isEmpty: false };
    }

    isBullet(line) {
        return /^[-•*\s]\s/.test(line) || /^[-•*]\s/.test(line);
    }

    extractBulletContent(line) {
        return line.replace(/^[-•*\s]\s+/, '').trim();
    }

    isNumbered(line) {
        return /^\d+[.)]\s/.test(line);
    }

    extractNumberContent(line) {
        return line.replace(/^\d+[.)]\s+/, '').trim();
    }
}

const parser = new ContentParser();
