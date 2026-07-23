/**
 * Main Conversion Module
 * Orchestrates the complete Unicode to Bijoy conversion
 * @module convert
 */

import { UNICODE_TO_BIJOY_MAP, getBijoyChar } from './unicodeToBijoyMap.js';
import { preprocessText } from './matraReorder.js';
import { replaceConjuncts } from './conjunctRules.js';
import { normalizeDigitsForBijoy } from './numberConverter.js';
import { segmentText, SegmentType } from './segmenter.js';

/**
 * Convert Unicode Bengali text to Bijoy encoding
 * 
 * @param {string} text - Unicode Bengali text (can include English)
 * @param {Object} options - Conversion options
 * @param {string} options.englishFont - Font for English text (default: 'Arial')
 * @param {number} options.bengaliFontSize - Font size for Bengali (default: 12)
 * @param {number} options.englishFontSize - Font size for English (default: 11)
 * @returns {Object} Conversion result
 */
export function convert(text, options = {}) {
  const {
    englishFont = 'Arial',
    bengaliFontSize = 12,
    englishFontSize = 11,
  } = options;

  if (!text || text.trim().length === 0) {
    return {
      success: false,
      plainText: '',
      htmlOutput: '',
      segments: [],
      error: 'Empty input',
    };
  }

  try {
    // Step 1: Segment the text
    const segments = segmentText(text);

    // Step 2: Process each segment
    const processedSegments = segments.map(segment => {
      if (segment.type === SegmentType.BENGALI) {
        // Bengali conversion pipeline
        let processed = segment.text;
        
        // 2a: Normalize numbers
        processed = normalizeDigitsForBijoy(processed);
        
        // 2b: Replace conjuncts
        processed = replaceConjuncts(processed);
        
        // 2c: Reorder matras
        processed = preprocessText(processed);
        
        // 2d: Character-by-character mapping
        processed = convertCharacters(processed);
        
        return {
          ...segment,
          converted: processed,
          font: 'SutonnyMJ',
          fontSize: bengaliFontSize,
        };
      } else {
        // English/other - keep as-is
        return {
          ...segment,
          converted: segment.text,
          font: englishFont,
          fontSize: englishFontSize,
        };
      }
    });

    // Step 3: Generate outputs
    const plainText = processedSegments.map(s => s.converted).join('');
    const htmlOutput = generateHtmlOutput(processedSegments);

    return {
      success: true,
      plainText,
      htmlOutput,
      segments: processedSegments,
      stats: {
        totalChars: text.length,
        bengaliChars: segments.filter(s => s.type === SegmentType.BENGALI)
                              .reduce((sum, s) => sum + s.text.length, 0),
        englishChars: segments.filter(s => s.type === SegmentType.ENGLISH)
                              .reduce((sum, s) => sum + s.text.length, 0),
      },
    };
  } catch (error) {
    return {
      success: false,
      plainText: '',
      htmlOutput: '',
      segments: [],
      error: error.message,
    };
  }
}

/**
 * Convert individual characters using the mapping table
 */
function convertCharacters(text) {
  return Array.from(text)
    .map(char => getBijoyChar(char) || char)
    .join('');
}

/**
 * Generate HTML output with font tags
 */
function generateHtmlOutput(segments) {
  return segments
    .map(segment => {
      const { converted, font, fontSize } = segment;
      return `<span style="font-family: '${font}'; font-size: ${fontSize}pt;">${escapeHtml(converted)}</span>`;
    })
    .join('');
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Batch convert multiple texts
 */
export function convertBatch(texts, options = {}) {
  return texts.map(text => convert(text, options));
}

/**
 * Validate if text can be converted
 */
export function canConvert(text) {
  if (!text || text.trim().length === 0) return false;
  
  const segments = segmentText(text);
  return segments.some(s => s.type === SegmentType.BENGALI);
}

export default {
  convert,
  convertBatch,
  canConvert,
};
