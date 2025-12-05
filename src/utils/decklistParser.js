/**
 * Parses a decklist string and matches cards against a card database
 * @param {string} decklistText - The decklist text to parse
 * @param {Array} cardDatabase - Array of card objects from the database
 * @returns {Object} Object containing matched cards and not found card names
 */
export const parseDecklist = (decklistText, cardDatabase) => {
  const lines = decklistText.trim().split('\n');
  const cardCounts = {};
  
  // Parse each line for quantity and card name
  for (const line of lines) {
    const match = line.trim().match(/^(\d+)\s+(.+)$/);
    if (match) {
      const quantity = parseInt(match[1]);
      const cardName = match[2].trim();
      cardCounts[cardName] = quantity;
    }
  }

  const cardNames = Object.keys(cardCounts);

  if (cardNames.length === 0) {
    return {
      matched: [],
      notFound: [],
      error: 'No valid cards found in decklist. Format should be:\n1 Card Name\n2 Another Card'
    };
  }

  // Match cards from decklist to database
  const matched = [];
  const notFound = [];

  for (const cardName of cardNames) {
    const found = cardDatabase.find(
      card => card.Name.toLowerCase() === cardName.toLowerCase()
    );
    if (found) {
      matched.push({
        ...found,
        count: cardCounts[cardName]
      });
    } else {
      notFound.push(cardName);
    }
  }

  return {
    matched,
    notFound,
    error: null
  };
};