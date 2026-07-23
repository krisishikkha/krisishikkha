/**
 * Mixed Content Tests
 * Tests Bengali + English + Numbers mixed text
 */

import { describe, test, expect } from '@jest/globals';
import { convert } from '../convert.js';
import { segmentText, SegmentType, hasBengali, isPureBengali } from '../segmenter.js';

describe('Text Segmentation', () => {
  test('should segment pure Bengali text', () => {
    const segments = segmentText('আমি বাংলায় গান গাই');
    expect(segments.length).toBeGreaterThan(0);
    expect(segments.every(s => 
      s.type === SegmentType.BENGALI || 
      s.type === SegmentType.WHITESPACE
    )).toBe(true);
  });

  test('should segment pure English text', () => {
    const segments = segmentText('I love Bangladesh');
    expect(segments.some(s => s.type === SegmentType.ENGLISH)).toBe(true);
  });

  test('should segment mixed Bengali-English text', () => {
    const segments = segmentText('আমি Bangladesh ভালোবাসি');
    
    const bengaliSegs = segments.filter(s => s.type === SegmentType.BENGALI);
    const englishSegs = segments.filter(s => s.type === SegmentType.ENGLISH);
    
    expect(bengaliSegs.length).toBeGreaterThan(0);
    expect(englishSegs.length).toBeGreaterThan(0);
  });

  test('should detect Bengali presence', () => {
    expect(hasBengali('আমি')).toBe(true);
    expect(hasBengali('Bangladesh')).toBe(false);
    expect(hasBengali('আমি Bangladesh')).toBe(true);
  });

  test('should detect pure Bengali', () => {
    expect(isPureBengali('আমি বাংলায় গান গাই')).toBe(true);
    expect(isPureBengali('আমি Bangladesh')).toBe(false);
    expect(isPureBengali('Bangladesh')).toBe(false);
  });
});

describe('Mixed Bengali-English Conversion', () => {
  test('should preserve English in mixed text', () => {
    const result = convert('আমি love বাংলা');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('love');
  });

  test('should convert sentence with English words', () => {
    const result = convert('I love বাংলাদেশ very much!');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('I love');
    expect(result.plainText).toContain('very much!');
  });

  test('should handle multiple Bengali-English switches', () => {
    const result = convert('আমি programming করি Python এ');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('programming');
    expect(result.plainText).toContain('Python');
  });

  test('should preserve punctuation', () => {
    const result = convert('বাংলা, English, and more!');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain(',');
    expect(result.plainText).toContain('!');
  });
});

describe('Number Handling', () => {
  test('should convert Bengali digits to English', () => {
    const result = convert('২০২৪');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('2024');
  });

  test('should handle mixed Bengali-English digits', () => {
    const result = convert('২০২৪ সালে 100 টাকা');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('2024');
    expect(result.plainText).toContain('100');
  });

  test('should preserve formatted numbers', () => {
    const result = convert('১,২৩,৪৫৬.৭৮');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('1');
    expect(result.plainText).toContain('2');
    expect(result.plainText).toContain(',');
    expect(result.plainText).toContain('.');
  });
});

describe('Real-World Examples', () => {
  test('should convert typical social media post', () => {
    const text = 'আজ ২০২৪ সালের ১লা জানুয়ারি। Happy New Year! নতুন বছর শুভ হোক।';
    const result = convert(text);
    
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('2024');
    expect(result.plainText).toContain('Happy New Year!');
  });

  test('should convert news headline', () => {
    const text = 'Bangladesh জাতীয় দল World Cup এ খেলবে';
    const result = convert(text);
    
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('Bangladesh');
    expect(result.plainText).toContain('World Cup');
  });

  test('should convert mixed paragraph', () => {
    const text = `আমার নাম রহিম। I am a software engineer. 
    আমি Python এবং JavaScript শিখছি। It's fun!`;
    
    const result = convert(text);
    expect(result.success).toBe(true);
    expect(result.segments.length).toBeGreaterThan(5);
  });

  test('should handle Bengali poem with English title', () => {
    const text = '"আমার সোনার বাংলা" - Rabindranath Tagore';
    const result = convert(text);
    
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('Rabindranath Tagore');
  });
});

describe('Whitespace and Formatting', () => {
  test('should preserve single spaces', () => {
    const result = convert('আমি বাংলায় গান গাই');
    expect(result.plainText.split(' ').length).toBe(4);
  });

  test('should preserve multiple spaces', () => {
    const result = convert('আমি    Bangladesh');
    expect(result.plainText).toContain('    ');
  });

  test('should preserve newlines', () => {
    const result = convert('আমি\nবাংলায়\nগান গাই');
    expect(result.plainText).toContain('\n');
  });

  test('should preserve tabs', () => {
    const result = convert('আমি\tBangladesh');
    expect(result.plainText).toContain('\t');
  });
});

describe('HTML Output for Mixed Content', () => {
  test('should generate separate spans for different segments', () => {
    const result = convert('আমি Bangladesh');
    
    expect(result.htmlOutput).toContain('SutonnyMJ');
    expect(result.htmlOutput).toContain('Arial');
    
    // Should have at least 2 spans (Bengali + English)
    const spanCount = (result.htmlOutput.match(/<span/g) || []).length;
    expect(spanCount).toBeGreaterThanOrEqual(2);
  });

  test('should apply correct font sizes', () => {
    const result = convert('আমি Bangladesh', {
      bengaliFontSize: 14,
      englishFontSize: 12,
    });
    
    expect(result.htmlOutput).toContain('14pt');
    expect(result.htmlOutput).toContain('12pt');
  });

  test('should use custom English font', () => {
    const result = convert('আমি Bangladesh', {
      englishFont: 'Times New Roman',
    });
    
    expect(result.htmlOutput).toContain('Times New Roman');
  });
});

describe('Edge Cases', () => {
  test('should handle text with only whitespace between segments', () => {
    const result = convert('আমি   Bangladesh   ভালোবাসি');
    expect(result.success).toBe(true);
  });

  test('should handle text starting with English', () => {
    const result = convert('Bangladesh আমার দেশ');
    expect(result.success).toBe(true);
    expect(result.plainText.startsWith('Bangladesh')).toBe(true);
  });

  test('should handle text ending with English', () => {
    const result = convert('আমার দেশ Bangladesh');
    expect(result.success).toBe(true);
    expect(result.plainText.endsWith('Bangladesh')).toBe(true);
  });

  test('should handle single character segments', () => {
    const result = convert('আ a ই b উ');
    expect(result.success).toBe(true);
  });

  test('should handle special characters', () => {
    const result = convert('বাংলা (Bengali) & English!');
    expect(result.success).toBe(true);
    expect(result.plainText).toContain('&');
    expect(result.plainText).toContain('(');
    expect(result.plainText).toContain(')');
  });
});
