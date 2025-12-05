export const RARITY_TYPES = ['common', 'uncommon', 'rare', 'mythic'];

export const RARITY_VALUES = {
  mythic: 4,
  rare: 3,
  uncommon: 2,
  common: 1
};

export const RARITY_STYLES = {
  mythic: 'bg-orange-600 text-white',
  rare: 'bg-yellow-600 text-white',
  uncommon: 'bg-gray-500 text-white',
  common: 'bg-gray-700 text-white'
};

export const getRarityLabel = (rarity) => {
  return rarity.charAt(0).toUpperCase() + rarity.slice(1);
};