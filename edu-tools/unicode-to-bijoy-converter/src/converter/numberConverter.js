/**
 * Number Converter Module
 * Bengali ↔ English digit conversion
 * @module numberConverter
 */

import { BENGALI_DIGITS } from './unicodeToBijoyMap.js';

const BENGALI_TO_ENGLISH = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
};

const ENGLISH_TO_BENGALI = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
};

export function isBengaliDigit(char) {
  return char in BENGALI_TO_ENGLISH;
}

export function isEnglishDigit(char) {
  return /[0-9]/.test(char);
}

export function isDigit(char) {
  return isBengaliDigit(char) || isEnglishDigit(char);
}

export function bengaliToEnglishDigits(text) {
  return text.replace(/[০-৯]/g, (match) => BENGALI_TO_ENGLISH[match]);
}

export function englishToBengaliDigits(text) {
  return text.replace(/[0-9]/g, (match) => ENGLISH_TO_BENGALI[match]);
}

export function normalizeDigitsForBijoy(text) {
  return bengaliToEnglishDigits(text);
}

export function smartNumberConversion(text, options = {}) {
  const { keepBengaliDigits = false } = options;
  
  if (keepBengaliDigits) {
    return text.replace(/[০-৯]/g, (match) => BENGALI_DIGITS[match] || match);
  }
  
  return normalizeDigitsForBijoy(text);
}

export default {
  isBengaliDigit,
  isEnglishDigit,
  isDigit,
  bengaliToEnglishDigits,
  englishToBengaliDigits,
  normalizeDigitsForBijoy,
  smartNumberConversion,
};
