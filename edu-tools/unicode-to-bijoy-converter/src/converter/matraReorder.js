/**
 * Matra Reordering Module
 * @module matraReorder
 */

import { PRE_BASE_MATRAS, isConsonant, isHasant, isVowelSign } from './unicodeToBijoyMap.js';

export function reorderMatras(text) {
  if (!text || text.length === 0) return text;

  const chars = Array.from(text);
  const result = [];
  let i = 0;

  while (i < chars.length) {
    const char = chars[i];

    if (isConsonant(char)) {
      const cluster = extractConsonantCluster(chars, i);
      const reordered = reorderCluster(cluster);
      result.push(...reordered);
      i += cluster.length;
    } else {
      result.push(char);
      i++;
    }
  }

  return result.join('');
}

function extractConsonantCluster(chars, startIndex) {
  const cluster = [chars[startIndex]];
  let i = startIndex + 1;

  while (i < chars.length) {
    const char = chars[i];

    if (isHasant(char)) {
      cluster.push(char);
      i++;
      if (i < chars.length && isConsonant(chars[i])) {
        cluster.push(chars[i]);
        i++;
      }
    } else if (isVowelSign(char)) {
      cluster.push(char);
      i++;
    } else {
      break;
    }
  }

  return cluster;
}

function reorderCluster(cluster) {
  const preBaseMatras = [];
  const consonantPart = [];
  const postBaseMatras = [];

  for (const char of cluster) {
    if (PRE_BASE_MATRAS.has(char)) {
      preBaseMatras.push(char);
    } else if (isVowelSign(char)) {
      postBaseMatras.push(char);
    } else {
      consonantPart.push(char);
    }
  }

  return [...preBaseMatras, ...consonantPart, ...postBaseMatras];
}

export function preprocessText(text) {
  let processed = text;
  processed = processed.normalize('NFD');
  processed = reorderMatras(processed);
  return processed;
}

export default {
  reorderMatras,
  preprocessText,
};
