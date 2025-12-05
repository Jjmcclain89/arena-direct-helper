import { RARITY_VALUES } from '../constants/rarities';

/**
 * Extracts color identity from a mana cost string
 * @param {string} cost - The mana cost string (e.g., "{W}{U}{2}")
 * @returns {string[]} Array of color codes (W, U, B, R, G, C)
 */
export const getCardColors = (cost) => {
  if (!cost || cost === '') return ['C'];
  
  const colors = new Set();
  
  // Single colors
  if (cost.includes('{W}')) colors.add('W');
  if (cost.includes('{U}')) colors.add('U');
  if (cost.includes('{B}')) colors.add('B');
  if (cost.includes('{R}')) colors.add('R');
  if (cost.includes('{G}')) colors.add('G');
  
  // Hybrid mana combinations
  const hybridPairs = [
    ['{G/W}', ['W', 'G']],
    ['{W/U}', ['W', 'U']],
    ['{W/B}', ['W', 'B']],
    ['{R/W}', ['W', 'R']],
    ['{G/U}', ['G', 'U']],
    ['{U/R}', ['R', 'U']],
    ['{U/B}', ['U', 'B']],
    ['{B/G}', ['G', 'B']],
    ['{B/R}', ['R', 'B']],
    ['{R/G}', ['R', 'G']]
  ];
  
  hybridPairs.forEach(([symbol, colorPair]) => {
    if (cost.includes(symbol)) {
      colorPair.forEach(color => colors.add(color));
    }
  });
  
  return colors.size > 0 ? Array.from(colors) : ['C'];
};

/**
 * Converts rarity string to numeric value for sorting
 * @param {string} rarity - The rarity string (mythic, rare, uncommon, common)
 * @returns {number} Numeric value for sorting
 */
export const getRarityValue = (rarity) => {
  return RARITY_VALUES[rarity.toLowerCase()] || 0;
};