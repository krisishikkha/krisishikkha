/**
 * Number Conversion Tests
 * Tests Bengali ↔ English digit conversion
 */

import { describe, test, expect } from '@jest/globals';
import { 
  isBengaliDigit, 
  isEnglishDigit, 
  bengaliToEnglishDigits,
  englishToBengaliDigits,
  normalizeDigitsForBijoy,
} from '../numberConverter.js';
import { convert } from '../convert.js';

describe('Digit Detection', () => {
  test('should detect Bengali digits', () => {
    expect(isBengaliDigit('০')).toBe(true);
    expect(isBengaliDigit('১')).toBe(true);
    expect(isBengaliDigit('৯')).toBe(true);
    expect(isBengaliDigit('5')).toBe(false);
    expect(isBengaliDigit('a')).toBe(false);
  });

  test('should detect English digits', () => {
    expect(isEnglishDigit('0')).toBe(true);
    expect(isEnglishDigit('5')).toBe(true);
    expect(isEnglishDigit('9')).toBe(true);
    expect(isEnglishDigit('০')).toBe(false);
    expect(isEnglishDigit('a')).toBe(false);
  });
});

describe('Bengali to English Digit Conversion', () => {
  test('should convert single Bengali digit', () => {
    expect(bengaliToEnglishDigits('০')).toBe('0');
    expect(bengaliToEnglishDigits('৫')).toBe('5');
    expect(bengaliToEnglishDigits('৯')).toBe('9');
  });

  test('should convert multiple Bengali digits', () => {
    expect(bengaliToEnglishDigits('০১২৩৪৫৬৭৮৯')).toBe('0123456789');
  });

  test('should convert Bengali number in text', () => {
    expect(bengaliToEnglishDigits('২০২৪ সাল')).toBe('2024 সাল');
  });

  test('should preserve non-digit characters', () => {
    expect(bengaliToEnglishDigits('১,২৩,৪৫৬')).toBe('1,23,456');
    expect(bengaliToEnglishDigits('১২.৩৪')).toBe('12.34');
  });

  test('should handle mixed text', () => {
    expect(bengaliToEnglishDigits('আমার বয়স ২৫ বছর')).toBe('আমার বয়স 25 বছর');
  });
});

describe('English to Bengali Digit Conversion', () => {
  test('should convert single English digit', () => {
    expect(englishToBengaliDigits('0')).toBe('০');
    expect(englishToBengaliDigits('5')).toBe('৫');
    expect(englishToBengaliDigits('9')).toBe('৯');
  });

  test('should convert multiple English digits', () => {
    expect(englishToBengaliDigits('0123456789')).toBe('০১২৩৪৫৬৭৮৯');
  });

  test('should convert English number in text', () => {
    expect(englishToBengaliDigits('2024 সাল')).toBe('২০২৪ সাল');
  });

  test('should preserve formatting', () => {
    expect(englishToBengaliDigits('1,23,456')).toBe('১,২৩,৪৫৬');
    expect(englishToBengaliDigits('12.34')).toBe('১২.৩৪');
  });
});

describe('Bijoy Normalization', () => {
  test('should normalize Bengali digits to English for Bijoy', () => {
    expect(normalizeDigitsForBijoy('২০২৪')).toBe('2024');
    expect(normalizeDigitsForBijoy('১২৩')).toBe('123');
  });

  test('should keep English digits unchanged', () => {
    expect(normalizeDigitsForBijoy('2024')).toBe('2024');
  });

  test('should handle mixed digits', () => {
    expect(normalizeDigitsForBijoy('২০২৪ and 2025')).toBe('2024 and 2025');
  });
});

describe('Number Conversion in Full Text', () => {
  test('should convert year in sentence', () => {
    const result = convert('আজ ২০২৪ সাল');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('2024');
  });

  test('should convert date', () => {
    const result = convert('১লা জানুয়ারি, ২০২৪');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('1');
    expect(result.plainText).toContain('2024');
  });

  test('should convert phone number', () => {
    const result = convert('ফোন: ০১৭১২৩৪৫৬৭৮');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('01712345678');
  });

  test('should convert price', () => {
    const result = convert('মূল্য: ১,২৩,৪৫৬.৭৮ টাকা');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('1');
    expect(result.plainText).toContain(',');
    expect(result.plainText).toContain('.');
  });

  test('should handle mixed Bengali-English numbers', () => {
    const result = convert('২০২৪ সালে 100% সফল');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('2024');
    expect(result.plainText).toContain('100');
  });
});

describe('Edge Cases', () => {
  test('should handle zero', () => {
    expect(bengaliToEnglishDigits('০')).toBe('0');
    expect(englishToBengaliDigits('0')).toBe('০');
  });

  test('should handle large numbers', () => {
    const result = convert('১,২৩,৪৫,৬৭,৮৯০');
    expect(result.success).toBe(true);
  });

  test('should handle decimal numbers', () => {
    const result = convert('৩.১৪১৫৯');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('3.14159');
  });

  test('should handle negative numbers', () => {
    const result = convert('-৫০ ডিগ্রি');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('-50');
  });

  test('should handle numbers with units', () => {
    const result = convert('২৫°C');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('25');
  });
});
