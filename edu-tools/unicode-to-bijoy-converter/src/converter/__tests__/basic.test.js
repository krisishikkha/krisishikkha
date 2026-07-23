/**
 * Basic Conversion Tests
 * Tests fundamental character mapping
 */

import { describe, test, expect } from '@jest/globals';
import { convert } from '../convert.js';
import { getBijoyChar } from '../unicodeToBijoyMap.js';

describe('Basic Character Mapping', () => {
  test('should convert single vowels correctly', () => {
    expect(getBijoyChar('অ')).toBe('A');
    expect(getBijoyChar('আ')).toBe('Av');
    expect(getBijoyChar('ই')).toBe('B');
    expect(getBijoyChar('ঈ')).toBe('C');
    expect(getBijoyChar('উ')).toBe('D');
    expect(getBijoyChar('ঊ')).toBe('E');
    expect(getBijoyChar('এ')).toBe('G');
    expect(getBijoyChar('ঐ')).toBe('H');
    expect(getBijoyChar('ও')).toBe('I');
    expect(getBijoyChar('ঔ')).toBe('J');
  });

  test('should convert single consonants correctly', () => {
    expect(getBijoyChar('ক')).toBe('K');
    expect(getBijoyChar('খ')).toBe('L');
    expect(getBijoyChar('গ')).toBe('M');
    expect(getBijoyChar('ঘ')).toBe('N');
    expect(getBijoyChar('ঙ')).toBe('O');
  });

  test('should convert vowel signs (matras) correctly', () => {
    expect(getBijoyChar('া')).toBe('v');
    expect(getBijoyChar('ি')).toBe('w');
    expect(getBijoyChar('ী')).toBe('x');
    expect(getBijoyChar('ু')).toBe('y');
    expect(getBijoyChar('ূ')).toBe('z');
    expect(getBijoyChar('ে')).toBe('†');
    expect(getBijoyChar('ৈ')).toBe('‡');
  });

  test('should convert Bengali digits correctly', () => {
    expect(getBijoyChar('০')).toBe('0');
    expect(getBijoyChar('১')).toBe('1');
    expect(getBijoyChar('৯')).toBe('9');
  });

  test('should convert hasant correctly', () => {
    expect(getBijoyChar('্')).toBe('&');
  });

  test('should return null for unmapped characters', () => {
    expect(getBijoyChar('A')).toBe(null);
    expect(getBijoyChar('1')).toBe(null);
    expect(getBijoyChar('!')).toBe(null);
  });
});

describe('Simple Word Conversion', () => {
  test('should convert "আমি" correctly', () => {
    const result = convert('আমি');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('Av'); // আ
    expect(result.plainText).toContain('g');  // ম
    expect(result.plainText).toContain('w');  // ি (will be reordered)
  });

  test('should convert "বাংলা" correctly', () => {
    const result = convert('বাংলা');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('e');  // ব
    expect(result.plainText).toContain('v');  // া
    expect(result.plainText).toContain('s');  // ং
    expect(result.plainText).toContain('j');  // ল
  });

  test('should convert "Bangladesh" (English) unchanged', () => {
    const result = convert('Bangladesh');
    expect(result.success).toBe(true);
    expect(result.plainText).toBe('Bangladesh');
  });

  test('should handle empty input', () => {
    const result = convert('');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Empty input');
  });

  test('should handle whitespace-only input', () => {
    const result = convert('   ');
    expect(result.success).toBe(false);
  });
});

describe('Mixed Content', () => {
  test('should convert mixed Bengali and English', () => {
    const result = convert('আমি Bangladesh ভালোবাসি।');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('Bangladesh'); // English preserved
    expect(result.segments.length).toBeGreaterThan(1);
  });

  test('should preserve English words', () => {
    const result = convert('I love বাংলা');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('I love');
  });

  test('should convert numbers correctly', () => {
    const result = convert('২০২৪ সাল');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('2024'); // Bengali digits → English
  });
});

describe('HTML Output Generation', () => {
  test('should generate HTML with font tags', () => {
    const result = convert('আমি');
    expect(result.success).toBe(true);
    expect(result.htmlOutput).toContain('SutonnyMJ');
    expect(result.htmlOutput).toContain('<span');
    expect(result.htmlOutput).toContain('</span>');
  });

  test('should use different fonts for Bengali and English', () => {
    const result = convert('আমি Bangladesh', { englishFont: 'Arial' });
    expect(result.success).toBe(true);
    expect(result.htmlOutput).toContain('SutonnyMJ');
    expect(result.htmlOutput).toContain('Arial');
  });

  test('should escape HTML special characters', () => {
    const result = convert('<test>');
    expect(result.htmlOutput).toContain('&lt;');
    expect(result.htmlOutput).toContain('&gt;');
  });
});

describe('Conversion Statistics', () => {
  test('should provide accurate character counts', () => {
    const result = convert('আমি বাংলায় গান গাই');
    expect(result.success).toBe(true);
    expect(result.stats.totalChars).toBeGreaterThan(0);
    expect(result.stats.bengaliChars).toBeGreaterThan(0);
  });

  test('should count mixed content correctly', () => {
    const result = convert('আমি Bangladesh ভালোবাসি');
    expect(result.success).toBe(true);
    expect(result.stats.bengaliChars).toBeGreaterThan(0);
    expect(result.stats.englishChars).toBeGreaterThan(0);
  });
});
