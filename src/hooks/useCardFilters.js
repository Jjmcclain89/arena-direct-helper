import { useState } from 'react';
import { COLOR_MATCH_MODES } from '../constants/colors';

export const useCardFilters = () => {
  const [filters, setFilters] = useState({
    colors: { W: false, U: false, B: false, R: false, G: false, C: false },
    rarities: { common: false, uncommon: false, rare: false, mythic: false }
  });
  const [colorMatchMode, setColorMatchMode] = useState(COLOR_MATCH_MODES.ANY);

  const toggleColorFilter = (color) => {
    setFilters(prev => ({
      ...prev,
      colors: { ...prev.colors, [color]: !prev.colors[color] }
    }));
  };

  const toggleRarityFilter = (rarity) => {
    setFilters(prev => ({
      ...prev,
      rarities: { ...prev.rarities, [rarity]: !prev.rarities[rarity] }
    }));
  };

  return {
    filters,
    colorMatchMode,
    setColorMatchMode,
    toggleColorFilter,
    toggleRarityFilter
  };
};