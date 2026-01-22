/**
 * Parses a decklist string and matches cards against a card database
 * Supports both 17lands format and MTGA export format
 * @param {string} decklistText - The decklist text to parse
 * @param {Array} cardDatabase - Array of card objects from the database
 * @returns {Object} Object containing matched cards and not found card names
 */
export const parseDecklist = (decklistText, cardDatabase) => {
  const lines = decklistText.trim().split('\n');
  const cardCounts = {};

  // Parse each line for quantity and card name
  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip section headers like "Deck" and "Sideboard"
    if (trimmedLine === 'Deck' || trimmedLine === 'Sideboard' || trimmedLine === '') {
      continue;
    }

    // Try to match MTGA format: "1 Card Name (SET) 123"
    const mtgaMatch = trimmedLine.match(/^(\d+)\s+(.+?)\s+\([A-Z0-9]+\)\s+\d+$/);
    if (mtgaMatch) {
      const quantity = parseInt(mtgaMatch[1]);
      const cardName = mtgaMatch[2].trim();
      cardCounts[cardName] = (cardCounts[cardName] || 0) + quantity;
      continue;
    }

    // Try to match simple format: "1 Card Name"
    const simpleMatch = trimmedLine.match(/^(\d+)\s+(.+)$/);
    if (simpleMatch) {
      const quantity = parseInt(simpleMatch[1]);
      const cardName = simpleMatch[2].trim();
      cardCounts[cardName] = (cardCounts[cardName] || 0) + quantity;
    }
  }

  const cardNames = Object.keys(cardCounts);

  if (cardNames.length === 0) {
    return {
      matched: [],
      notFound: [],
      error: 'No valid cards found in decklist. Format should be:\n1 Card Name\nor\n1 Card Name (SET) 123'
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