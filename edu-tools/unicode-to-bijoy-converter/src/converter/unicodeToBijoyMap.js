/**
 * Unicode to Bijoy (SutonnyMJ) Character Mapping Table
 * @module unicodeToBijoyMap
 */

// Vowels (স্বরবর্ণ)
export const VOWELS = {
  'অ': 'A',
  'আ': 'Av',
  'ই': 'B',
  'ঈ': 'C',
  'উ': 'D',
  'ঊ': 'E',
  'ঋ': 'F',
  'এ': 'G',
  'ঐ': 'H',
  'ও': 'I',
  'ঔ': 'J',
};

// Consonants (ব্যঞ্জনবর্ণ)
export const CONSONANTS = {
  'ক': 'K',
  'খ': 'L',
  'গ': 'M',
  'ঘ': 'N',
  'ঙ': 'O',
  'চ': 'P',
  'ছ': 'Q',
  'জ': 'R',
  'ঝ': 'S',
  'ঞ': 'T',
  'ট': 'U',
  'ঠ': 'V',
  'ড': 'W',
  'ঢ': 'X',
  'ণ': 'Y',
  'ত': 'Z',
  'থ': '_',
  'দ': '`',
  'ধ': 'a',
  'ন': 'b',
  'প': 'c',
  'ফ': 'd',
  'ব': 'e',
  'ভ': 'f',
  'ম': 'g',
  'য': 'h',
  'র': 'i',
  'ল': 'j',
  'শ': 'k',
  'ষ': 'l',
  'স': 'm',
  'হ': 'n',
};

// Additional consonants
export const ADDITIONAL_CONSONANTS = {
  'ড়': 'o',
  'ঢ়': 'p',
  'য়': 'q',
  'ৎ': 'r',
  'ং': 's',
  'ঃ': 't',
  'ঁ': 'u',
};

// Vowel Signs (কার)
export const VOWEL_SIGNS = {
  'া': 'v',
  'ি': 'w',
  'ী': 'x',
  'ু': 'y',
  'ূ': 'z',
  'ৃ': '…',
  'ে': '†',
  'ৈ': '‡',
  'ো': '†v',
  'ৌ': '‡v',
};

// Hasant
export const HASANT = {
  '্': '&',
};

// Bengali Digits
export const BENGALI_DIGITS = {
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9',
};

// Punctuation
export const PUNCTUATION = {
  '।': '|',
  '॥': '||',
  '৳': '৳',
};

// Combined mapping
export const UNICODE_TO_BIJOY_MAP = {
  ...VOWELS,
  ...CONSONANTS,
  ...ADDITIONAL_CONSONANTS,
  ...VOWEL_SIGNS,
  ...HASANT,
  ...BENGALI_DIGITS,
  ...PUNCTUATION,
};

// Pre-base matras
export const PRE_BASE_MATRAS = new Set(['ি', 'ী', 'ে', 'ৈ']);

// Helper functions
export function isBengaliChar(char) {
  const code = char.charCodeAt(0);
  return (code >= 0x0980 && code <= 0x09FF);
}

export function isVowelSign(char) {
  return char in VOWEL_SIGNS;
}

export function isConsonant(char) {
  return char in CONSONANTS || char in ADDITIONAL_CONSONANTS;
}

export function isHasant(char) {
  return char === '্';
}

export function getBijoyChar(char) {
  return UNICODE_TO_BIJOY_MAP[char] || null;
}

export default UNICODE_TO_BIJOY_MAP;
