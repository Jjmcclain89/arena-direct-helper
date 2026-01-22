import { useMemo } from 'react';
import { getCardColors } from '../utils/cardUtils';
import { COLOR_KEYS, COLOR_NAMES } from '../constants/colors';

export const useColorAnalytics = (deckCards, topCardsCount) => {
  const colorAnalytics = useMemo(() => {
    if (!deckCards) return null;

    const analytics = {};

    COLOR_KEYS.forEach(color => {
      // Filter cards by color
      const colorCards = deckCards.filter(card => {
        const cardColors = getCardColors(card.CastingCost || card.Cost);
        return cardColors.includes(color);
      });

      // Sort by win rate descending and take top N
      const topN = colorCards
        .sort((a, b) => (b.GihWinrate || 0) - (a.GihWinrate || 0))
        .slice(0, topCardsCount);

      // Calculate average, excluding cards with null winrates
      const cardsWithWinrate = topN.filter(card => card.GihWinrate !== null && card.GihWinrate !== undefined);
      const avgWinRate = cardsWithWinrate.length > 0
        ? cardsWithWinrate.reduce((sum, card) => sum + card.GihWinrate, 0) / cardsWithWinrate.length
        : 0;

      analytics[color] = {
        name: COLOR_NAMES[color],
        avgWinRate: avgWinRate,
        cardCount: topN.length
      };
    });

    return analytics;
  }, [deckCards, topCardsCount]);

  return colorAnalytics;
};