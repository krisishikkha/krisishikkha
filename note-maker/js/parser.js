/**
 * PARSER.JS
 * বাংলা কন্টেন্ট পার্সিং লজিক - সব সমস্যা সমাধান সহ
 */

class ContentParser {
    parse(rawText) {
        if (!rawText || rawText === '') {
            return { html: '', isEmpty: true };
        }

        const lines = rawText.split('\n');
        let html = '';
        let inList = false;
        let listType = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();

            // খালি লাইন - স্পেস সংরক্ষণ
            if (trimmedLine === '') {
                if (inList) {
                    html += listType === 'ul' ? '</ul>' : '</ol>';
                    inList = false;
                    listType = null;
                }
                // খালি লাইনের জন্য স্পেস রাখুন
                html += '<p style="margin: 0 0 6px 0; padding: 0; height: 10px;"></p>';
                continue;
            }

            // বুলেট ডিটেক্ট
            if (this.isBullet(trimmedLine)) {
                const content = this.extractBulletContent(trimmedLine);
                const processedContent = this.processBold(content);
                
                if (!inList || listType !== 'ul') {
                    if (inList) {
                        html += listType === 'ul' ? '</ul>' : '</ol>';
                    }
                    html += '<ul>';
                    inList = true;
                    listType = 'ul';
                }
                html += `<li>${processedContent}</li>`;
            }
            // নম্বার ডিটেক্ট
            else if (this.isNumbered(trimmedLine)) {
                const content = this.extractNumberContent(trimmedLine);
                const processedContent = this.processBold(content);
                
                if (!inList || listType !== 'ol') {
                    if (inList) {
                        html += listType === 'ul' ? '</ul>' : '</ol>';
                    }
                    html += '<ol>';
                    inList = true;
                    listType = 'ol';
                }
                html += `<li>${processedContent}</li>`;
            }
            // প্যারাগ্রাফ
            else {
                if (inList) {
                    html += listType === 'ul' ? '</ul>' : '</ol>';
                    inList = false;
                    listType = null;
                }
                // শুরু এবং শেষের স্পেস সংরক্ষণ + বোল্ড প্রসেস করুন
                const processedLine = this.processBold(line);
                html += `<p>${processedLine}</p>`;
            }
        }

        // শেষ লিস্ট বন্ধ করুন
        if (inList) {
            html += listType === 'ul' ? '</ul>' : '</ol>';
        }

        return { html, isEmpty: false };
    }

    // বোল্ড টেক্সট প্রসেস করার ফাংশন
    // ফরম্যাট: **টেক্সট** → <strong>টেক্সট</strong>
    processBold(text) {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
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
