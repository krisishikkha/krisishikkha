/**
 * PARSER.JS
 * Content parsing logic for different content types
 */

class ContentParser {
    constructor() {
        this.content = '';
    }

    /**
     * Parse raw text into structured content
     * Detects bullets, numbers, and paragraphs
     */
    parse(rawText) {
        if (!rawText || rawText.trim() === '') {
            return { html: '', isEmpty: true };
        }

        const lines = rawText.split('\n');
        let html = '';
        let currentList = null;
        let listType = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Empty lines
            if (line === '') {
                if (currentList) {
                    html += currentList;
                    currentList = null;
                    listType = null;
                }
                continue;
            }

            // Detect bullet points
            if (this.isBullet(line)) {
                const bulletContent = this.extractBulletContent(line);

                if (currentList && listType === 'bullet') {
                    currentList += `<li>${this.highlightKeywords(bulletContent)}</li>`;
                } else {
                    if (currentList) {
                        html += currentList;
                    }
                    currentList = `<ul><li>${this.highlightKeywords(bulletContent)}</li>`;
                    listType = 'bullet';
                }
            }
            // Detect numbered lists
            else if (this.isNumbered(line)) {
                const numberContent = this.extractNumberContent(line);

                if (currentList && listType === 'number') {
                    currentList += `<li>${this.highlightKeywords(numberContent)}</li>`;
                } else {
                    if (currentList) {
                        html += currentList;
                    }
                    currentList = `<ol><li>${this.highlightKeywords(numberContent)}</li>`;
                    listType = 'number';
                }
            }
            // Regular paragraph
            else {
                if (currentList) {
                    html += currentList;
                    currentList = null;
                    listType = null;
                }
                html += `<p>${this.highlightKeywords(line)}</p>`;
            }
        }

        // Close any remaining list
        if (currentList) {
            html += currentList;
            currentList = null;
        }

        // Close list tags
        html = html.replace(/<ul>/g, '</ul><ul>').replace(/<ol>/g, '</ol><ol>');
        html = html.replace(/^<\/ul>/, '').replace(/^<\/ol>/, '');
        html += currentList ? (listType === 'bullet' ? '</ul>' : '</ol>') : '';

        return { html, isEmpty: false };
    }

    /**
     * Check if line is a bullet point
     */
    isBullet(line) {
        return /^[-•*]\s/.test(line);
    }

    /**
     * Extract bullet content
     */
    extractBulletContent(line) {
        return line.replace(/^[-•*]\s+/, '');
    }

    /**
     * Check if line is numbered
     */
    isNumbered(line) {
        return /^\d+\.\s/.test(line);
    }

    /**
     * Extract numbered content
     */
    extractNumberContent(line) {
        return line.replace(/^\d+\.\s+/, '');
    }

    /**
     * Highlight important keywords
     * Make common keywords bold
     */
    highlightKeywords(text) {
        const keywords = [
            'important',
            'must',
            'must know',
            'remember',
            'note',
            'warning',
            'key',
            'essential',
            'critical',
        ];

        let highlighted = text;

        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            highlighted = highlighted.replace(regex, `<strong>$&</strong>`);
        });

        return highlighted;
    }

    /**
     * Count lines for statistics
     */
    getStats(rawText) {
        const lines = rawText.split('\n').filter(l => l.trim() !== '');
        const words = rawText.split(/\s+/).length;
        const chars = rawText.length;

        return { lines, words, chars };
    }
}

// Export for use in other files
const parser = new ContentParser();
