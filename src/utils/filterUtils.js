import { getCardColors } from './cardUtils';
import { COLOR_MATCH_MODES } from '../constants/colors';

/**
 * Filters cards based on color and rarity filters
 * @param {Array} cards - Array of card objects to filter
 * @param {Object} filters - Filter object with colors and rarities
 * @param {string} colorMatchMode - 'any' or 'only' for color matching
 * @returns {Array} Filtered array of cards
 */
export const filterCards = (cards, filters, colorMatchMode) => {
  // Check if any filters are active
  const hasActiveColorFilters = Object.values(filters.colors).some(v => v);
  const hasActiveRarityFilters = Object.values(filters.rarities).some(v => v);

  return cards.filter(card => {
    // Color filter - if none selected, show all
    let passesColorFilter = true;
    if (hasActiveColorFilters) {
      const cardColors = getCardColors(card.CastingCost || card.Cost);
      const selectedColors = Object.keys(filters.colors).filter(c => filters.colors[c]);
      
      if (colorMatchMode === COLOR_MATCH_MODES.ONLY) {
        // Match Only: card colors must exactly match selected colors
        const cardColorSet = new Set(cardColors);
        const selectedColorSet = new Set(selectedColors);
        
        // Check if sets are equal (same size and all elements match)
        passesColorFilter = cardColorSet.size === selectedColorSet.size && 
                           [...cardColorSet].every(c => selectedColorSet.has(c));
      } else {
        // Match Any: card must have at least one of the selected colors
        passesColorFilter = cardColors.some(color => filters.colors[color]);
      }
    }

    // Rarity filter - if none selected, show all
    let passesRarityFilter = true;
    if (hasActiveRarityFilters) {
      passesRarityFilter = filters.rarities[card.Rarity.toLowerCase()];
    }

    return passesColorFilter && passesRarityFilter;
  });
};