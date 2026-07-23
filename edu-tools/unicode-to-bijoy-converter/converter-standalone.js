// ============================================================================
// UNICODE TO BIJOY CONVERTER - STANDALONE VERSION
// All converter logic + UI handling in one file
// No external dependencies
// ============================================================================

console.log('🔧 Loading Unicode to Bijoy Converter...');

// ============================================================================
// PART 1: CHARACTER MAPPING TABLES
// ============================================================================

const UNICODE_TO_BIJOY_MAP = {
    // Vowels (স্বরবর্ণ)
    'অ': 'A', 'আ': 'Av', 'ই': 'B', 'ঈ': 'C', 'উ': 'D',
    'ঊ': 'E', 'ঋ': 'F', 'এ': 'G', 'ঐ': 'H', 'ও': 'I', 'ঔ': 'J',
    
    // Consonants (ব্যঞ্জনবর্ণ)
    'ক': 'K', 'খ': 'L', 'গ': 'M', 'ঘ': 'N', 'ঙ': 'O',
    'চ': 'P', 'ছ': 'Q', 'জ': 'R', 'ঝ': 'S', 'ঞ': 'T',
    'ট': 'U', 'ঠ': 'V', 'ড': 'W', 'ঢ': 'X', 'ণ': 'Y',
    'ত': 'Z', 'থ': '_', 'দ': '`', 'ধ': 'a', 'ন': 'b',
    'প': 'c', 'ফ': 'd', 'ব': 'e', 'ভ': 'f', 'ম': 'g',
    'য': 'h', 'র': 'i', 'ল': 'j', 'শ': 'k', 'ষ': 'l',
    'স': 'm', 'হ': 'n',
    
    // Additional consonants
    'ড়': 'o', 'ঢ়': 'p', 'য়': 'q', 'ৎ': 'r',
    'ং': 's', 'ঃ': 't', 'ঁ': 'u',
    
    // Vowel signs (কার)
    'া': 'v', 'ি': 'w', 'ী': 'x', 'ু': 'y', 'ূ': 'z',
    'ৃ': '…', 'ে': '†', 'ৈ': '‡', 'ো': '†v', 'ৌ': '‡v',
    
    // Hasant
    '্': '&',
    
    // Bengali digits
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
    
    // Punctuation
    '।': '|', '॥': '||'
};

// Conjuncts (যুক্তাক্ষর) - Common combinations
const CONJUNCT_MAP = {
    // Triple conjuncts (check first)
    'ক্ষ্ম': '¶¥', 'ন্ত্র': 'š¿', 'ন্দ্র': 'Ô«', 'স্ত্র': 'ó«',
    
    // Double conjuncts (most common)
    'ক্ক': '°', 'ক্ট': '±', 'ক্ত': '²', 'ক্ম': '³', 'ক্য': 'K¨',
    'ক্র': 'µ', 'ক্ষ': '¶', 'ক্স': '·',
    'গ্ধ': '»', 'গ্ন': 'M§', 'গ্ম': 'M¥', 'গ্য': 'M¨', 'গ্র': '¸',
    'ঙ্ক': '¼', 'ঙ্গ': '½',
    'চ্চ': '¾', 'চ্ছ': 'я', 'চ্ঞ': 'P¤', 'চ্য': 'P¨',
    'জ্জ': 'À', 'জ্ঞ': 'Á', 'জ্য': 'R¨', 'জ্র': 'Â',
    'ঞ্চ': 'Ã', 'ঞ্জ': 'Ä',
    'ট্ট': 'Å', 'ট্য': 'U¨', 'ট্র': 'Æ',
    'ড্ড': 'Ç', 'ড্য': 'W¨', 'ড্র': 'Ø',
    'ণ্ট': 'É', 'ণ্ড': 'Ê', 'ণ্ণ': 'Ë', 'ণ্য': 'Y¨',
    'ত্ত': 'Ì', 'ত্ন': 'Zœ', 'ত্ম': 'Z¥', 'ত্য': 'Z¨', 'ত্র': 'Í',
    'থ্য': '_¨', 'থ্র': '_«',
    'দ্দ': 'Ï', 'দ্ধ': 'Ð', 'দ্ব': '`¡', 'দ্ম': '`¥', 'দ্য': '`¨', 'দ্র': 'Ñ',
    'ধ্ন': 'aœ', 'ধ্য': 'a¨', 'ধ্র': 'a«',
    'ন্ট': 'Ò', 'ন্ড': 'Ó', 'ন্ত': 'šÍ', 'ন্থ': 'š'', 'ন্দ': 'Ô',
    'ন্ধ': 'Õ', 'ন্ন': 'bœ', 'ন্ব': 'b¡', 'ন্ম': 'b¥', 'ন্য': 'b¨',
    'প্ট': 'Ö', 'প্ত': 'ç', 'প্ন': 'cœ', 'প্প': '¤Ú', 'প্য': 'c¨',
    'প্র': 'Û', 'প্ল': 'c­', 'প্স': 'Ü',
    'ফ্র': 'd«', 'ফ্ল': 'd­',
    'ব্জ': 'eR', 'ব্দ': 'ß', 'ব্ধ': 'à', 'ব্ব': 'eŸ', 'ব্য': 'e¨',
    'ব্র': 'eª', 'ব্ল': 'e­',
    'ভ্র': 'f«', 'ভ্য': 'f¨', 'ভ্ল': 'f­',
    'ম্ন': 'gœ', 'ম্প': 'á', 'ম্ফ': 'â', 'ম্ব': 'ã', 'ম্ভ': 'ä',
    'ম্ম': 'å', 'ম্য': 'g¨', 'ম্র': 'g«', 'ম্ল': 'g­',
    'য্য': 'æ',
    'র্য': 'i¨',
    'ল্ক': 'é', 'ল্গ': 'ê', 'ল্প': 'ë', 'ল্ব': 'í', 'ল্ম': 'jg',
    'ল্য': 'j¨', 'ল্ল': 'ì',
    'শ্চ': 'î', 'শ্ছ': 'kQ', 'শ্ন': 'kœ', 'শ্ব': 'k¡', 'শ্ম': 'k¥',
    'শ্য': 'k¨', 'শ্র': 'k«', 'শ্ল': 'k­',
    'ষ্ক': '®‹', 'ষ্ট': 'ï', 'ষ্ঠ': 'ð', 'ষ্ণ': 'ò', 'ষ্প': 'ó',
    'ষ্ব': 'l¡', 'ষ্ম': 'l¥', 'ষ্য': 'l¨',
    'স্ক': '¯‹', 'স্ট': 'ô', 'স্ত': 'ö', 'স্থ': '¯'', 'স্ন': 'mœ',
    'স্প': '÷', 'স্ব': 'm¡', 'স্ম': '¯§', 'স্য': 'm¨', 'স্র': 'ù', 'স্ল': 'm­',
    'হ্ণ': 'nY', 'হ্ন': 'nœ', 'হ্ব': 'û', 'হ্ম': 'ý', 'হ্য': 'n¨',
    'হ্র': 'þ', 'হ্ল': 'n­'
};

// Pre-base matras (need to move before consonant)
const PRE_BASE_MATRAS = new Set(['ি', 'ী', 'ে', 'ৈ']);

// ============================================================================
// PART 2: HELPER FUNCTIONS
// ============================================================================

function isBengaliChar(char) {
    const code = char.charCodeAt(0);
    return (code >= 0x0980 && code <= 0x09FF);
}

function isEnglishChar(char) {
    return /[a-zA-Z]/.test(char);
}

function isWhitespace(char) {
    return /\s/.test(char);
}

function isConsonant(char) {
    return 'কখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহড়ঢ়য়'.includes(char);
}

function isVowelSign(char) {
    return 'ািীুূৃেৈোৌ'.includes(char);
}

function isHasant(char) {
    return char === '্';
}

// ============================================================================
// PART 3: TEXT SEGMENTATION
// ============================================================================

function segmentText(text) {
    const segments = [];
    let currentType = null;
    let currentText = '';
    let startIndex = 0;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        let charType;

        if (isWhitespace(char)) {
            charType = 'whitespace';
        } else if (isBengaliChar(char)) {
            charType = 'bengali';
        } else {
            charType = 'english';
        }

        if (currentType === null) {
            currentType = charType;
            currentText = char;
            startIndex = i;
        } else if (charType === currentType || (currentType === 'bengali' && charType === 'bengali')) {
            currentText += char;
        } else {
            segments.push({
                type: currentType,
                text: currentText,
                start: startIndex,
                end: i
            });
            currentType = charType;
            currentText = char;
            startIndex = i;
        }
    }

    if (currentText) {
        segments.push({
            type: currentType,
            text: currentText,
            start: startIndex,
            end: text.length
        });
    }

    return segments;
}

// ============================================================================
// PART 4: MATRA REORDERING
// ============================================================================

function reorderMatras(text) {
    const chars = Array.from(text);
    const result = [];
    let i = 0;

    while (i < chars.length) {
        const char = chars[i];

        if (isConsonant(char)) {
            const cluster = extractCluster(chars, i);
            const reordered = reorderCluster(cluster);
            result.push(...reordered);
            i += cluster.length;
        } else {
            result.push(char);
            i++;
        }
    }

    return result.join('');
}

function extractCluster(chars, start) {
    const cluster = [chars[start]];
    let i = start + 1;

    while (i < chars.length) {
        const char = chars[i];
        if (isHasant(char)) {
            cluster.push(char);
            i++;
            if (i < chars.length && isConsonant(chars[i])) {
                cluster.push(chars[i]);
                i++;
            }
        } else if (isVowelSign(char)) {
            cluster.push(char);
            i++;
        } else {
            break;
        }
    }

    return cluster;
}

function reorderCluster(cluster) {
    const preBase = [];
    const consonants = [];
    const postBase = [];

    for (const char of cluster) {
        if (PRE_BASE_MATRAS.has(char)) {
            preBase.push(char);
        } else if (isVowelSign(char)) {
            postBase.push(char);
        } else {
            consonants.push(char);
        }
    }

    return [...preBase, ...consonants, ...postBase];
}

// ============================================================================
// PART 5: MAIN CONVERSION FUNCTION
// ============================================================================

function convertToBijoy(text, options = {}) {
    const {
        englishFont = 'Arial',
        bengaliFontSize = 12,
        englishFontSize = 11
    } = options;

    console.log('🔄 Converting text:', text.substring(0, 50) + '...');

    if (!text || text.trim().length === 0) {
        return {
            success: false,
            plainText: '',
            htmlOutput: '',
            error: 'Empty input'
        };
    }

    try {
        const segments = segmentText(text);
        console.log('📊 Segments found:', segments.length);

        const processedSegments = segments.map(segment => {
            if (segment.type === 'bengali') {
                let processed = segment.text;
                
                // Replace conjuncts first (triple, then double)
                for (const [unicode, bijoy] of Object.entries(CONJUNCT_MAP)) {
                    processed = processed.split(unicode).join(bijoy);
                }
                
                // Reorder matras
                processed = reorderMatras(processed);
                
                // Character mapping
                processed = Array.from(processed)
                    .map(char => UNICODE_TO_BIJOY_MAP[char] || char)
                    .join('');

                return {
                    ...segment,
                    converted: processed,
                    font: 'SutonnyMJ',
                    fontSize: bengaliFontSize
                };
            } else {
                return {
                    ...segment,
                    converted: segment.text,
                    font: englishFont,
                    fontSize: englishFontSize
                };
            }
        });

        const plainText = processedSegments.map(s => s.converted).join('');
        const htmlOutput = processedSegments
            .map(seg => {
                const escaped = escapeHtml(seg.converted);
                return `<span style="font-family: '${seg.font}'; font-size: ${seg.fontSize}pt;">${escaped}</span>`;
            })
            .join('');

        console.log('✅ Conversion successful!');

        return {
            success: true,
            plainText,
            htmlOutput,
            segments: processedSegments,
            stats: {
                totalChars: text.length,
                bengaliChars: segments.filter(s => s.type === 'bengali')
                    .reduce((sum, s) => sum + s.text.length, 0),
                englishChars: segments.filter(s => s.type === 'english')
                    .reduce((sum, s) => sum + s.text.length, 0)
            }
        };
    } catch (error) {
        console.error('❌ Conversion error:', error);
        return {
            success: false,
            plainText: '',
            htmlOutput: '',
            error: error.message
        };
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================================================
// PART 6: UI LOGIC
// ============================================================================

let lastConversionResult = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, initializing UI...');

    // Get DOM elements
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const convertBtn = document.getElementById('convertBtn');
    const copyPlainBtn = document.getElementById('copyPlainBtn');
    const copyRichBtn = document.getElementById('copyRichBtn');
    const clearInputBtn = document.getElementById('clearInputBtn');
    const inputCharCount = document.getElementById('inputCharCount');
    const outputCharCount = document.getElementById('outputCharCount');
    const statusMessage = document.getElementById('statusMessage');
    const englishFontSelect = document.getElementById('englishFont');
    const bengaliSizeInput = document.getElementById('bengaliSize');
    const englishSizeInput = document.getElementById('englishSize');

    // Check if all elements exist
    if (!inputText || !outputText || !convertBtn) {
        console.error('❌ Required DOM elements not found!');
        return;
    }

    console.log('✅ All DOM elements found');

    // --- EVENT LISTENERS ---

    // Convert button
    convertBtn.addEventListener('click', function() {
        console.log('🖱️ Convert button clicked');
        handleConvert();
    });

    // Clear button
    clearInputBtn.addEventListener('click', function() {
        console.log('🖱️ Clear button clicked');
        handleClear();
    });

    // Copy buttons
    copyPlainBtn.addEventListener('click', function() {
        console.log('🖱️ Copy plain button clicked');
        handleCopy('plain');
    });

    copyRichBtn.addEventListener('click', function() {
        console.log('🖱️ Copy rich button clicked');
        handleCopy('rich');
    });

    // Character counter
    inputText.addEventListener('input', function() {
        updateInputCharCount();
    });

    // Settings change
    englishFontSelect.addEventListener('change', reconvertIfNeeded);
    bengaliSizeInput.addEventListener('change', reconvertIfNeeded);
    englishSizeInput.addEventListener('change', reconvertIfNeeded);

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleConvert();
        }
    });

    console.log('✅ All event listeners attached');

    // --- HANDLER FUNCTIONS ---

    function handleConvert() {
        const input = inputText.value.trim();
        console.log('📝 Input text length:', input.length);

        if (!input) {
            showStatus('Please enter some text to convert!', 'error');
            return;
        }

        convertBtn.classList.add('loading');
        convertBtn.disabled = true;

        const options = {
            englishFont: englishFontSelect.value,
            bengaliFontSize: parseInt(bengaliSizeInput.value) || 12,
            englishFontSize: parseInt(englishSizeInput.value) || 11
        };

        try {
            const result = convertToBijoy(input, options);

            if (result.success) {
                lastConversionResult = result;
                displayOutput(result);
                
                const bengaliChars = result.stats.bengaliChars;
                const englishChars = result.stats.englishChars;
                showStatus(
                    `✅ Converted! Bengali: ${bengaliChars} chars, English: ${englishChars} chars`,
                    'success'
                );
            } else {
                showStatus(`❌ Conversion failed: ${result.error}`, 'error');
            }
        } catch (error) {
            console.error('❌ Error:', error);
            showStatus(`❌ Error: ${error.message}`, 'error');
        } finally {
            convertBtn.classList.remove('loading');
            convertBtn.disabled = false;
        }
    }

    function displayOutput(result) {
        outputText.innerHTML = result.htmlOutput;
        outputCharCount.textContent = result.plainText.length;
        console.log('✅ Output displayed');
    }

    function handleClear() {
        inputText.value = '';
        outputText.innerHTML = `
            <div class="placeholder-text">
                Converted text will appear here...<br>
                রূপান্তরিত টেক্সট এখানে দেখাবে...
            </div>
        `;
        lastConversionResult = null;
        inputCharCount.textContent = '0';
        outputCharCount.textContent = '0';
        statusMessage.classList.add('hidden');
        inputText.focus();
        console.log('🧹 Cleared all fields');
    }

    function updateInputCharCount() {
        inputCharCount.textContent = inputText.value.length;
    }

    async function handleCopy(type) {
        if (!lastConversionResult) {
            showStatus('Nothing to copy! Convert some text first.', 'error');
            return;
        }

        try {
            if (type === 'plain') {
                await copyToClipboard(lastConversionResult.plainText);
                showStatus('📋 Plain text copied!', 'success');
            } else {
                await copyRichText(lastConversionResult.htmlOutput, lastConversionResult.plainText);
                showStatus('📄 Rich text copied! Paste in MS Word.', 'success');
            }
        } catch (error) {
            console.error('Copy error:', error);
            showStatus('❌ Copy failed. Try manual selection.', 'error');
        }
    }

    async function copyToClipboard(text) {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
        } else {
            fallbackCopy(text);
        }
    }

    async function copyRichText(html, plainText) {
        if (navigator.clipboard && window.ClipboardItem) {
            const htmlBlob = new Blob([html], { type: 'text/html' });
            const textBlob = new Blob([plainText], { type: 'text/plain' });
            const item = new ClipboardItem({
                'text/html': htmlBlob,
                'text/plain': textBlob
            });
            await navigator.clipboard.write([item]);
        } else {
            await copyToClipboard(plainText);
        }
    }

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    function reconvertIfNeeded() {
        if (lastConversionResult && inputText.value.trim()) {
            handleConvert();
        }
    }

    function showStatus(message, type = 'success') {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.classList.remove('hidden');
        
        setTimeout(() => {
            statusMessage.classList.add('hidden');
        }, 5000);
    }

    console.log('✅ Unicode to Bijoy Converter initialized successfully!');
});
