/**
 * Conjunct/Ligature Conversion Tests
 * Tests যুক্তাক্ষর (conjunct) handling
 */

import { describe, test, expect } from '@jest/globals';
import { convert } from '../convert.js';
import { getConjunct, isConjunct } from '../conjunctRules.js';

describe('Conjunct Detection', () => {
  test('should detect common conjuncts', () => {
    expect(isConjunct('ক্ষ')).toBe(true);
    expect(isConjunct('জ্ঞ')).toBe(true);
    expect(isConjunct('ন্ত')).toBe(true);
    expect(isConjunct('ন্দ')).toBe(true);
    expect(isConjunct('ব্দ')).toBe(true);
  });

  test('should detect triple conjuncts', () => {
    expect(isConjunct('ন্ত্র')).toBe(true);
    expect(isConjunct('স্ত্র')).toBe(true);
    expect(isConjunct('ন্দ্র')).toBe(true);
  });

  test('should return false for non-conjuncts', () => {
    expect(isConjunct('ক')).toBe(false);
    expect(isConjunct('আ')).toBe(false);
    expect(isConjunct('abc')).toBe(false);
  });
});

describe('Common Conjunct Conversion', () => {
  test('should convert ক্ষ correctly', () => {
    const mapping = getConjunct('ক্ষ');
    expect(mapping).toBe('¶');
    
    const result = convert('ক্ষমা');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('¶');
  });

  test('should convert জ্ঞ correctly', () => {
    const mapping = getConjunct('জ্ঞ');
    expect(mapping).toBe('Á');
    
    const result = convert('জ্ঞান');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('Á');
  });

  test('should convert ন্ত correctly', () => {
    const mapping = getConjunct('ন্ত');
    expect(mapping).toBe('šÍ');
    
    const result = convert('সন্তান');
    expect(result.success).toBe(true);
  });

  test('should convert ন্দ correctly', () => {
    const mapping = getConjunct('ন্দ');
    expect(mapping).toBe('Ô');
    
    const result = convert('আনন্দ');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('Ô');
  });

  test('should convert ব্দ correctly', () => {
    const mapping = getConjunct('ব্দ');
    expect(mapping).toBe('ß');
    
    const result = convert('শব্দ');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('ß');
  });

  test('should convert চ্ছ correctly', () => {
    const mapping = getConjunct('চ্ছ');
    expect(mapping).toBe('я');
    
    const result = convert('ইচ্ছা');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('я');
  });

  test('should convert দ্ধ correctly', () => {
    const mapping = getConjunct('দ্ধ');
    expect(mapping).toBe('Ð');
    
    const result = convert('বুদ্ধ');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('Ð');
  });

  test('should convert ষ্ট correctly', () => {
    const mapping = getConjunct('ষ্ট');
    expect(mapping).toBe('ï');
    
    const result = convert('কষ্ট');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('ï');
  });

  test('should convert ষ্ণ correctly', () => {
    const mapping = getConjunct('ষ্ণ');
    expect(mapping).toBe('ò');
    
    const result = convert('কৃষ্ণ');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('ò');
  });

  test('should convert ত্র correctly', () => {
    const mapping = getConjunct('ত্র');
    expect(mapping).toBe('Í');
    
    const result = convert('ত্রিশ');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('Í');
  });
});

describe('Triple Conjunct Conversion', () => {
  test('should convert ন্ত্র correctly', () => {
    const mapping = getConjunct('ন্ত্র');
    expect(mapping).toBe('š¿');
    
    const result = convert('মন্ত্র');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('š¿');
  });

  test('should convert স্ত্র correctly', () => {
    const mapping = getConjunct('স্ত্র');
    expect(mapping).toBe('ó«');
    
    const result = convert('শাস্ত্র');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('ó«');
  });

  test('should convert ন্দ্র correctly', () => {
    const mapping = getConjunct('ন্দ্র');
    expect(mapping).toBe('Ô«');
    
    const result = convert('চন্দ্র');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('Ô«');
  });

  test('should prioritize triple over double conjuncts', () => {
    // ন্ত্র should map to triple conjunct, not ন্ত + র
    const result = convert('ন্ত্র');
    const tripleMapping = getConjunct('ন্ত্র');
    expect(result.plainText).toContain(tripleMapping);
  });
});

describe('Complex Words with Multiple Conjuncts', () => {
  test('should convert "বাংলাদেশ" correctly', () => {
    const result = convert('বাংলাদেশ');
    expect(result.success).toBe(true);
    // Contains: ব, া, ং, ল, া, দ, ে, শ
    expect(result.plainText.length).toBeGreaterThan(0);
  });

  test('should convert "প্রশ্ন" correctly', () => {
    const result = convert('প্রশ্ন');
    expect(result.success).toBe(true);
    // Contains: প্র (conjunct), শ্ন (conjunct)
  });

  test('should convert "বিদ্যালয়" correctly', () => {
    const result = convert('বিদ্যালয়');
    expect(result.success).toBe(true);
    // Contains: ব, ি, দ্য (conjunct), া, ল, য়
  });

  test('should convert "সংস্কৃতি" correctly', () => {
    const result = convert('সংস্কৃতি');
    expect(result.success).toBe(true);
    // Contains: স, ং, স্ক (conjunct), ৃ, ত, ি
  });
});

describe('Conjuncts with Matras', () => {
  test('should handle conjunct + matra correctly', () => {
    const result = convert('ক্ষী');
    expect(result.success).toBe(true);
    // ক্ষ (conjunct) + ী (matra)
  });

  test('should handle pre-base matra with conjunct', () => {
    const result = convert('ক্তি');
    expect(result.success).toBe(true);
    // ি should come before ক্ত in Bijoy
  });

  test('should convert "জ্ঞানী" correctly', () => {
    const result = convert('জ্ঞানী');
    expect(result.success).toBe(true);
    // জ্ঞ (conjunct) + া + ন + ী
  });
});
