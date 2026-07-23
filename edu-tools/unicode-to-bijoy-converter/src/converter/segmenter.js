/**
 * Text Segmenter Module
 * Separates Bengali text from English/Latin text
 * @module segmenter
 */

import { isBengaliChar } from './unicodeToBijoyMap.js';
import { isDigit } from './numberConverter.js';

/**
 * Segment types
 */
export const SegmentType = {
  BENGALI: 'bengali',
  ENGLISH: 'english',
  NUMBER: 'number',
  WHITESPACE: 'whitespace',
  PUNCTUATION: 'punctuation',
};

/**
 * Check if character is English/Latin
 */
export function isEnglishChar(char) {
  const code = char.charCodeAt(0);
  return (code >= 0x0041 && code <= 0x005A) || // A-Z
         (code >= 0x0061 && code <= 0x007A);   // a-z
}

/**
 * Check if character is whitespace
 */
export function isWhitespace(char) {
  return /\s/.test(char);
}

/**
 * Check if character is punctuation
 */
export function isPunctuation(char) {
  return /[.,;:!?'"()\-—–]/.test(char);
}

/**
 * Determine character type
 */
export function getCharType(char) {
  if (isWhitespace(char)) return SegmentType.WHITESPACE;
  if (isBengaliChar(char)) return SegmentType.BENGALI;
  if (isDigit(char)) return SegmentType.NUMBER;
  if (isEnglishChar(char)) return SegmentType.ENGLISH;
  if (isPunctuation(char)) return SegmentType.PUNCTUATION;
  return SegmentType.ENGLISH; // Default fallback
}

/**
 * Segment text into Bengali and non-Bengali runs
 * 
 * Example:
 * Input: "আমি বাংলায় গান গাই। I love Bangladesh!"
 * Output: [
 *   { type: 'bengali', text: 'আমি বাংলায় গান গাই।', start: 0, end: 20 },
 *   { type: 'whitespace', text: ' ', start: 20, end: 21 },
 *   { type: 'english', text: 'I love Bangladesh!', start: 21, end: 39 }
 * ]
 */
export function segmentText(text) {
  if (!text || text.length === 0) return [];

  const segments = [];
  let currentType = null;
  let currentText = '';
  let startIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const charType = getCharType(char);

    // Bengali and numbers are treated as same segment
    const normalizedType = (charType === SegmentType.NUMBER && currentType === SegmentType.BENGALI) 
      ? SegmentType.BENGALI 
      : charType;

    if (currentType === null) {
      // Start first segment
      currentType = normalizedType;
      currentText = char;
      startIndex = i;
    } else if (normalizedType === currentType) {
      // Continue current segment
      currentText += char;
    } else {
      // New segment starts
      segments.push({
        type: currentType,
        text: currentText,
        start: startIndex,
        end: i,
      });
      
      currentType = charType;
      currentText = char;
      startIndex = i;
    }
  }

  // Push last segment
  if (currentText) {
    segments.push({
      type: currentType,
      text: currentText,
      start: startIndex,
      end: text.length,
    });
  }

  return segments;
}

/**
 * Get only Bengali segments
 */
export function getBengaliSegments(text) {
  return segmentText(text).filter(seg => seg.type === SegmentType.BENGALI);
}

/**
 * Get only English segments
 */
export function getEnglishSegments(text) {
  return segmentText(text).filter(seg => seg.type === SegmentType.ENGLISH);
}

/**
 * Check if text contains Bengali
 */
export function hasBengali(text) {
  return Array.from(text).some(char => isBengaliChar(char));
}

/**
 * Check if text is pure Bengali (no English)
 */
export function isPureBengali(text) {
  const cleaned = text.replace(/[\s\d.,;:!?'"()\-—–।॥]/g, '');
  return Array.from(cleaned).every(char => isBengaliChar(char));
}

export default {
  SegmentType,
  segmentText,
  getBengaliSegments,
  getEnglishSegments,
  hasBengali,
  isPureBengali,
  isEnglishChar,
  isWhitespace,
  isPunctuation,
};
