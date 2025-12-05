import { getRarityValue } from './cardUtils';

/**
 * Sort cards based on specified column and direction
 * @param {Array} cards - Array of card objects to sort
 * @param {string} sortBy - Column to sort by (count, name, rarity, winrate)
 * @param {string} sortDirection - Direction to sort (asc, desc)
 * @returns {Array} Sorted array of cards
 */
export const sortCards = (cards, sortBy, sortDirection) => {
  const sorted = [...cards];
  
  sorted.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'count':
        comparison = a.count - b.count;
        break;
      case 'name':
        comparison = a.Name.localeCompare(b.Name);
        break;
      case 'rarity':
        comparison = getRarityValue(a.Rarity) - getRarityValue(b.Rarity);
        break;
      case 'winrate':
        comparison = a.GihWinrate - b.GihWinrate;
        break;
      default:
        comparison = 0;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return sorted;
};