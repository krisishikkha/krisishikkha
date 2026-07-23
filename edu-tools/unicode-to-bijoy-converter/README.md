# Unicode to Bijoy Converter

A production-grade, client-side Bengali Unicode to Bijoy (SutonnyMJ) font converter.

## Features

✅ **Accurate Conversion**
- Proper matra repositioning (ি, ী, ে, ৈ come before consonant in Bijoy)
- Conjunct/ligature handling (যুক্তাক্ষর)
- Reph and Ya-phala positioning
- Preserves English, numbers, and symbols

✅ **100% Client-Side**
- No server required
- Privacy-friendly (text never leaves browser)
- Works offline after first load

✅ **Smart Mixed Content**
- Automatically detects Bengali vs English text
- Applies appropriate fonts to each segment
- Balanced font sizing

## Installation

```bash
npm install
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
import { convert } from './src/converter/convert.js';

const input = "আমি বাংলায় গান গাই। I love Bangladesh!";
const result = convert(input);

console.log(result.plainText);  // Bijoy encoded text
console.log(result.htmlOutput); // HTML with font tags
import { convert } from './src/converter/convert.js';

const input = "আমি বাংলায় গান গাই। I love Bangladesh!";
const result = convert(input);

console.log(result.plainText);  // Bijoy encoded text
console.log(result.htmlOutput); // HTML with font tags
