/**
 * Main Application Logic
 * Connects UI with the converter engine
 */

import { convert } from './src/converter/convert.js';

// ========================================
// DOM Elements
// ========================================
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const convertBtn = document.getElementById('convertBtn');
const copyPlainBtn = document.getElementById('copyPlainBtn');
const copyRichBtn = document.getElementById('copyRichBtn');
const clearInputBtn = document.getElementById('clearInputBtn');
const inputCharCount = document.getElementById('inputCharCount');
const outputCharCount = document.getElementById('outputCharCount');
const statusMessage = document.getElementById('statusMessage');

// Settings
const englishFontSelect = document.getElementById('englishFont');
const bengaliSizeInput = document.getElementById('bengaliSize');
const englishSizeInput = document.getElementById('englishSize');

// ========================================
// State
// ========================================
let lastConversionResult = null;

// ========================================
// Event Listeners
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Convert button
    convertBtn.addEventListener('click', handleConvert);
    
    // Copy buttons
    copyPlainBtn.addEventListener('click', () => handleCopy('plain'));
    copyRichBtn.addEventListener('click', () => handleCopy('rich'));
    
    // Clear button
    clearInputBtn.addEventListener('click', handleClear);
    
    // Input character count
    inputText.addEventListener('input', updateInputCharCount);
    
    // Settings changes trigger re-conversion if there's output
    englishFontSelect.addEventListener('change', reconvertIfNeeded);
    bengaliSizeInput.addEventListener('change', reconvertIfNeeded);
    englishSizeInput.addEventListener('change', reconvertIfNeeded);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
});

// ========================================
// Main Conversion Handler
// ========================================
function handleConvert() {
    const input = inputText.value.trim();
    
    if (!input) {
        showStatus('Please enter some text to convert!', 'error');
        return;
    }
    
    // Show loading state
    convertBtn.classList.add('loading');
    convertBtn.disabled = true;
    
    // Get settings
    const options = {
        englishFont: englishFontSelect.value,
        bengaliFontSize: parseInt(bengaliSizeInput.value) || 12,
        englishFontSize: parseInt(englishSizeInput.value) || 11,
    };
    
    try {
        // Perform conversion
        const result = convert(input, options);
        
        if (result.success) {
            // Store result
            lastConversionResult = result;
            
            // Display output
            displayOutput(result);
            
            // Show success message
            const bengaliChars = result.stats.bengaliChars;
            const englishChars = result.stats.englishChars;
            showStatus(
                `✅ Converted successfully! Bengali: ${bengaliChars} chars, English: ${englishChars} chars`,
                'success'
            );
        } else {
            showStatus(`❌ Conversion failed: ${result.error}`, 'error');
        }
    } catch (error) {
        console.error('Conversion error:', error);
        showStatus(`❌ An error occurred: ${error.message}`, 'error');
    } finally {
        // Remove loading state
        convertBtn.classList.remove('loading');
        convertBtn.disabled = false;
    }
}

// ========================================
// Display Output
// ========================================
function displayOutput(result) {
    // Clear placeholder
    outputText.innerHTML = result.htmlOutput;
    
    // Update character count
    outputCharCount.textContent = result.plainText.length;
    
    // Scroll output into view on mobile
    if (window.innerWidth < 768) {
        outputText.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// ========================================
// Copy Handlers
// ========================================
async function handleCopy(type) {
    if (!lastConversionResult) {
        showStatus('Nothing to copy! Please convert some text first.', 'error');
        return;
    }
    
    try {
        if (type === 'plain') {
            await copyPlainText(lastConversionResult.plainText);
            showStatus('📋 Plain text copied to clipboard!', 'success');
        } else if (type === 'rich') {
            await copyRichText(lastConversionResult.htmlOutput, lastConversionResult.plainText);
            showStatus('📄 Rich text copied! You can paste it in MS Word with formatting.', 'success');
        }
    } catch (error) {
        console.error('Copy error:', error);
        showStatus('❌ Failed to copy. Please try manual selection.', 'error');
    }
}

// Copy plain text
async function copyPlainText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        fallbackCopyText(text);
    }
}

// Copy rich text (HTML + plain text)
async function copyRichText(html, plainText) {
    if (navigator.clipboard && window.ClipboardItem) {
        // Modern Clipboard API
        const htmlBlob = new Blob([html], { type: 'text/html' });
        const textBlob = new Blob([plainText], { type: 'text/plain' });
        
        const clipboardItem = new ClipboardItem({
            'text/html': htmlBlob,
            'text/plain': textBlob,
        });
        
        await navigator.clipboard.write([clipboardItem]);
    } else {
        // Fallback: copy plain text only
        await copyPlainText(plainText);
        showStatus('⚠️ Your browser doesn\'t support rich copy. Plain text copied instead.', 'error');
    }
}

// Fallback copy method for older browsers
function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// ========================================
// Clear Handler
// ========================================
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
}

// ========================================
// Character Count Update
// ========================================
function updateInputCharCount() {
    inputCharCount.textContent = inputText.value.length;
}

// ========================================
// Re-convert on Settings Change
// ========================================
function reconvertIfNeeded() {
    if (lastConversionResult && inputText.value.trim()) {
        handleConvert();
    }
}

// ========================================
// Status Message
// ========================================
function showStatus(message, type = 'success') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        statusMessage.classList.add('hidden');
    }, 5000);
}

// ========================================
// Keyboard Shortcuts
// ========================================
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + Enter: Convert
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleConvert();
    }
    
    // Ctrl/Cmd + Shift + C: Copy Rich
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        handleCopy('rich');
    }
}

// ========================================
// Initialize
// ========================================
console.log('✅ Unicode to Bijoy Converter loaded successfully!');
console.log('💡 Keyboard shortcuts:');
console.log('   - Ctrl/Cmd + Enter: Convert');
console.log('   - Ctrl/Cmd + Shift + C: Copy Rich Text');
