/**
 * Conjunct/Ligature Rules for Bijoy Conversion
 * যুক্তাক্ষর (Conjuncts) handling
 * @module conjunctRules
 */

// Three-consonant conjuncts (check these first)
export const TRIPLE_CONJUNCTS = {
  'ক্ষ্ম': '¶¥',
  'ক্ষ্য': '¶¨',
  'ঙ্ক্ষ': '•¶',
  'ঙ্ক্য': '•K¨',
  'ন্ত্র': 'š¿',
  'ন্ত্য': 'šZ¨',
  'ন্দ্র': 'Ô«',
  'ন্দ্য': 'Ô¨',
  'ন্ধ্র': 'Õ«',
  'স্ক্র': '¯Œ',
  'স্ত্র': 'ó«',
};

// Two-consonant conjuncts
export const COMMON_CONJUNCTS = {
  // ক-based
  'ক্ক': '°',
  'ক্ট': '±',
  'ক্ত': '²',
  'ক্ব': 'K¡',
  'ক্ম': '³',
  'ক্য': 'K¨',
  'ক্র': 'µ',
  'ক্ল': 'K­',
  'ক্ষ': '¶',
  'ক্স': '·',

  // গ-based
  'গ্ধ': '»',
  'গ্ন': 'M§',
  'গ্ম': 'M¥',
  'গ্য': 'M¨',
  'গ্র': '¸',
  'গ্ল': 'M­',

  // ঙ-based
  'ঙ্ক': '¼',
  'ঙ্খ': '•¶',
  'ঙ্গ': '½',
  'ঙ্ঘ': '•¡',
  'ঙ্ম': '•¥',

  // চ-based
  'চ্চ': '¾',
  'চ্ছ': 'я',
  'চ্ঞ': 'P¤',
  'চ্য': 'P¨',
  'চ্ব': 'P¡',

  // জ-based
  'জ্জ': 'À',
  'জ্ঝ': 'R¡',
  'জ্ঞ': 'Á',
  'জ্ব': 'R¡',
  'জ্য': 'R¨',
  'জ্র': 'Â',

  // ঞ-based
  'ঞ্চ': 'Ã',
  'ঞ্ছ': 'T¡',
  'ঞ্জ': 'Ä',
  'ঞ্ঝ': 'T¡',

  // ট-based
  'ট্ট': 'Å',
  'ট্ব': 'U¡',
  'ট্ম': 'U¥',
  'ট্য': 'U¨',
  'ট্র': 'Æ',

  // ড-based
  'ড্ড': 'Ç',
  'ড্ঢ': 'W¡',
  'ড্ম': 'W¥',
  'ড্য': 'W¨',
  'ড্র': 'Ø',

  // ণ-based
  'ণ্ট': 'É',
  'ণ্ঠ': 'Y¡',
  'ণ্ড': 'Ê',
  'ণ্ঢ': 'Y¢',
  'ণ্ণ': 'Ë',
  'ণ্ব': 'Y¡',
  'ণ্ম': 'Y¥',
  'ণ্য': 'Y¨',

  // ত-based
  'ত্ত': 'Ì',
  'ত্থ': 'Z¡',
  'ত্ন': 'Zœ',
  'ত্ব': 'Z¡',
  'ত্ম': 'Z¥',
  'ত্য': 'Z¨',
  'ত্র': 'Í',

  // থ-based
  'থ্ব': '_¡',
  'থ্য': '_¨',
  'থ্র': '_«',

  // দ-based
  'দ্দ': 'Ï',
  'দ্ধ': 'Ð',
  'দ্ব': '`¡',
  'দ্ভ': '`¢',
  'দ্ম': '`¥',
  'দ্য': '`¨',
  'দ্র': 'Ñ',

  // ধ-based
  'ধ্ন': 'aœ',
  'ধ্ব': 'a¡',
  'ধ্ম': 'a¥',
  'ধ্য': 'a¨',
  'ধ্র': 'a«',

  // ন-based
  'ন্ট': 'Ò',
  'ন্ঠ': 'b¡',
  'ন্ড': 'Ó',
  'ন্ত': 'šÍ',
  'ন্থ': 'š'',
  'ন্দ': 'Ô',
  'ন্ধ': 'Õ',
  'ন্ন': 'bœ',
  'ন্ব': 'b¡',
  'ন্ম': 'b¥',
  'ন্য': 'b¨',

  // প-based
  'প্ট': 'Ö',
  'প্ত': 'ç',
  'প্ন': 'cœ',
  'প্প': '¤Ú',
  'প্য': 'c¨',
  'প্র': 'Û',
  'প্ল': 'c­',
  'প্স': 'Ü',

  // ফ-based
  'ফ্র': 'd«',
  'ফ্ল': 'd­',

  // ব-based
  'ব্জ': 'eR',
  'ব্দ': 'ß',
  'ব্ধ': 'à',
  'ব্ব': 'eŸ',
  'ব্য': 'e¨',
  'ব্র': 'eª',
  'ব্ল': 'e­',

  // ভ-based
  'ভ্র': 'f«',
  'ভ্য': 'f¨',
  'ভ্ল': 'f­',

  // ম-based
  'ম্ন': 'gœ',
  'ম্প': 'á',
  'ম্ফ': 'â',
  'ম্ব': 'ã',
  'ম্ভ': 'ä',
  'ম্ম': 'å',
  'ম্য': 'g¨',
  'ম্র': 'g«',
  'ম্ল': 'g­',

  // য-based
  'য্য': 'æ',
  'র্য': 'i¨',

  // ল-based
  'ল্ক': 'é',
  'ল্গ': 'ê',
  'ল্ট': 'jU',
  'ল্ড': 'jW',
  'ল্প': 'ë',
  'ল্ব': 'í',
  'ল্ম': 'jg',
  'ল্য': 'j¨',
  'ল্ল': 'ì',

  // শ-based
  'শ্চ': 'î',
  'শ্ছ': 'kQ',
  'শ্ন': 'kœ',
  'শ্ব': 'k¡',
  'শ্ম': 'k¥',
  'শ্য': 'k¨',
  'শ্র': 'k«',
  'শ্ল': 'k­',

  // ষ-based
  'ষ্ক': '®‹',
  'ষ্ট': 'ï',
  'ষ্ঠ': 'ð',
  'ষ্ণ': 'ò',
  'ষ্প': 'ó',
  'ষ্ব': 'l¡',
  'ষ্ম': 'l¥',
  'ষ্য': 'l¨',

  // স-based
  'স্ক': '¯‹',
  'স্ট': 'ô',
  'স্খ': 'm‡',
  'স্ত': 'ö',
  'স্থ': '¯'',
  'স্ন': 'mœ',
  'স্প': '÷',
  'স্ব': 'm¡',
  'স্ম': '¯§',
  'স্য': 'm¨',
  'স্র': 'ù',
  'স্ল': 'm­',

  // হ-based
  'হ্ণ': 'nY',
  'হ্ন': 'nœ',
  'হ্ব': 'û',
  'হ্ম': 'ý',
  'হ্য': 'n¨',
  'হ্র': 'þ',
  'হ্ল': 'n­',
};

export function getConjunct(sequence) {
  if (TRIPLE_CONJUNCTS[sequence]) {
    return TRIPLE_CONJUNCTS[sequence];
  }
  if (COMMON_CONJUNCTS[sequence]) {
    return COMMON_CONJUNCTS[sequence];
  }
  return null;
}

export function replaceConjuncts(text) {
  let result = text;
  
  // Replace triple conjuncts first
  for (const [unicode, bijoy] of Object.entries(TRIPLE_CONJUNCTS)) {
    result = result.replaceAll(unicode, bijoy);
  }
  
  // Then replace double conjuncts
  for (const [unicode, bijoy] of Object.entries(COMMON_CONJUNCTS)) {
    result = result.replaceAll(unicode, bijoy);
  }
  
  return result;
}

export function isConjunct(sequence) {
  return TRIPLE_CONJUNCTS[sequence] !== undefined || 
         COMMON_CONJUNCTS[sequence] !== undefined;
}

export default {
  COMMON_CONJUNCTS,
  TRIPLE_CONJUNCTS,
  getConjunct,
  replaceConjuncts,
  isConjunct,
};
