import React, { useState, useMemo } from 'react';
import cardData from './data/data.json';

function App() {
  const [decklistInput, setDecklistInput] = useState('');
  const [deckCards, setDeckCards] = useState(null);
  const [sortBy, setSortBy] = useState('winrate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [topCardsCount, setTopCardsCount] = useState(12);
  const [filters, setFilters] = useState({
    colors: { W: false, U: false, B: false, R: false, G: false, C: false },
    rarities: { common: false, uncommon: false, rare: false, mythic: false }
  });

  const parseDecklist = () => {
    // Parse the decklist
    const lines = decklistInput.trim().split('\n');
    const cardCounts = {};
    
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
      alert('No valid cards found in decklist. Format should be:\n1 Card Name\n2 Another Card');
      return;
    }

    // Match cards from decklist to database
    const matched = [];
    const notFound = [];

    for (const cardName of cardNames) {
      const found = cardData.cards.find(
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

    if (notFound.length > 0) {
      console.warn('Cards not found in database:', notFound);
      alert(`Warning: ${notFound.length} cards not found in database:\n${notFound.join('\n')}\n\nCheck console for full list.`);
    }

    if (matched.length === 0) {
      alert('No cards matched in database!');
      return;
    }

    setDeckCards(matched);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to descending for most, ascending for name
      setSortBy(column);
      setSortDirection(column === 'name' ? 'asc' : 'desc');
    }
  };

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleRowHover = (card) => {
    setHoveredCard(card);
  };

  const handleRowLeave = () => {
    setHoveredCard(null);
  };

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

  const getCardColors = (cost) => {
    if (!cost || cost === '') return ['C'];
    const colors = new Set();
    if (cost.includes('{W}')) colors.add('W');
    if (cost.includes('{U}')) colors.add('U');
    if (cost.includes('{B}')) colors.add('B');
    if (cost.includes('{R}')) colors.add('R');
    if (cost.includes('{G}')) colors.add('G');
    return colors.size > 0 ? Array.from(colors) : ['C'];
  };

  const getRarityValue = (rarity) => {
    const rarityMap = {
      'mythic': 4,
      'rare': 3,
      'uncommon': 2,
      'common': 1
    };
    return rarityMap[rarity.toLowerCase()] || 0;
  };

  // Calculate analytics for top N cards by color
  const colorAnalytics = useMemo(() => {
    if (!deckCards) return null;

    const analytics = {};
    const colorKeys = ['W', 'U', 'B', 'R', 'G', 'C'];
    const colorNames = {
      'W': 'White',
      'U': 'Blue',
      'B': 'Black',
      'R': 'Red',
      'G': 'Green',
      'C': 'Colorless'
    };

    colorKeys.forEach(color => {
      // Filter cards by color
      const colorCards = deckCards.filter(card => {
        const cardColors = getCardColors(card.CastingCost || card.Cost);
        return cardColors.includes(color);
      });

      // Sort by win rate descending and take top N
      const topN = colorCards
        .sort((a, b) => b.GihWinrate - a.GihWinrate)
        .slice(0, topCardsCount);

      // Calculate average
      const avgWinRate = topN.length > 0
        ? topN.reduce((sum, card) => sum + card.GihWinrate, 0) / topN.length
        : 0;

      analytics[color] = {
        name: colorNames[color],
        avgWinRate: avgWinRate,
        cardCount: topN.length
      };
    });

    return analytics;
  }, [deckCards, topCardsCount]);

  const filteredAndSortedCards = useMemo(() => {
    if (!deckCards) return [];

    // Check if any filters are active
    const hasActiveColorFilters = Object.values(filters.colors).some(v => v);
    const hasActiveRarityFilters = Object.values(filters.rarities).some(v => v);

    let filtered = deckCards.filter(card => {
      // Color filter - if none selected, show all
      let passesColorFilter = true;
      if (hasActiveColorFilters) {
        const cardColors = getCardColors(card.CastingCost || card.Cost);
        passesColorFilter = cardColors.some(color => filters.colors[color]);
      }

      // Rarity filter - if none selected, show all
      let passesRarityFilter = true;
      if (hasActiveRarityFilters) {
        passesRarityFilter = filters.rarities[card.Rarity.toLowerCase()];
      }

      return passesColorFilter && passesRarityFilter;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'count') {
        comparison = a.count - b.count;
      } else if (sortBy === 'name') {
        comparison = a.Name.localeCompare(b.Name);
      } else if (sortBy === 'rarity') {
        comparison = getRarityValue(a.Rarity) - getRarityValue(b.Rarity);
      } else if (sortBy === 'winrate') {
        comparison = a.GihWinrate - b.GihWinrate;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [deckCards, filters, sortBy, sortDirection]);

  const renderSortIcon = (column) => {
    if (sortBy !== column) {
      return (
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    if (sortDirection === 'asc') {
      return (
        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
  };

  const renderManaCost = (cost) => {
    if (!cost || cost === '') return <span className="text-gray-500">—</span>;
    
    const symbols = cost.match(/\{[^}]+\}/g) || [];
    
    return (
      <div className="flex gap-1 items-center">
        {symbols.map((symbol, idx) => {
          const inner = symbol.slice(1, -1).toLowerCase();
          
          // Handle different symbol types
          let className = 'ms ms-cost ms-shadow';
          
          // Single color or colorless
          if (['w', 'u', 'b', 'r', 'g', 'c'].includes(inner)) {
            className += ` ms-${inner}`;
          }
          // Generic mana (numbers)
          else if (!isNaN(inner)) {
            className += ` ms-${inner}`;
          }
          // Hybrid mana like {W/U}
          else if (inner.includes('/')) {
            const parts = inner.split('/');
            className += ` ms-${parts[0]}${parts[1]}`;
          }
          // Phyrexian mana
          else if (inner.includes('p')) {
            className += ` ms-${inner}`;
          }
          // X, Y, Z
          else {
            className += ` ms-${inner}`;
          }
          
          return <i key={idx} className={className}></i>;
        })}
      </div>
    );
  };

  if (!deckCards) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 max-w-2xl w-full">
          <h1 className="text-4xl font-bold text-white mb-2">MTG Pool Winrate Displays</h1>
          <p className="text-xl text-gray-400">Paste your decklist below</p>
          <textarea
            className="w-full min-h-[400px] p-4 bg-gray-900 border-2 border-gray-700 rounded-lg text-gray-100 font-mono text-sm resize-y focus:outline-none focus:border-blue-500"
            value={decklistInput}
            onChange={(e) => setDecklistInput(e.target.value)}
            placeholder="Paste your decklist here (format: '1 Card Name' per line)&#10;&#10;Example:&#10;1 Zuko's Exile&#10;2 Avatar Enthusiasts&#10;1 Curious Farm Animals"
          />
          <button 
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all hover:-translate-y-0.5"
            onClick={parseDecklist}
          >
            Load Cards
          </button>
        </div>
      </div>
    );
  }

  const totalCards = deckCards.reduce((sum, card) => sum + card.count, 0);

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">MTG Sealed Pool</h1>
          <p className="text-gray-400 text-sm mt-1">{totalCards} cards total</p>
        </div>
        <button 
          className="px-4 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
          onClick={() => {
            setDeckCards(null);
            setDecklistInput('');
          }}
        >
          Load New Decklist
        </button>
      </div>

      {/* Analytics Panel */}
      {colorAnalytics && (
        <div className="bg-gray-900 p-6 rounded-lg mb-6 border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Color Analytics (Top Cards Average)</h2>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-400">
                Top <span className="text-white font-semibold">{topCardsCount}</span> cards per color
              </label>
              <input
                type="range"
                min="0"
                max="14"
                value={topCardsCount}
                onChange={(e) => setTopCardsCount(parseInt(e.target.value))}
                className="w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { key: 'W', bg: 'bg-yellow-900/20', border: 'border-yellow-600/30' },
              { key: 'U', bg: 'bg-blue-900/20', border: 'border-blue-600/30' },
              { key: 'B', bg: 'bg-purple-900/20', border: 'border-purple-600/30' },
              { key: 'R', bg: 'bg-red-900/20', border: 'border-red-600/30' },
              { key: 'G', bg: 'bg-green-900/20', border: 'border-green-600/30' },
              { key: 'C', bg: 'bg-gray-800/20', border: 'border-gray-600/30' },
            ].map(({ key, bg, border }) => {
              const stats = colorAnalytics[key];
              return (
                <div 
                  key={key} 
                  className={`${bg} ${border} border-2 rounded-lg p-4 text-center`}
                >
                  <div className="text-4xl mb-2">
                    <i className={`ms ms-cost ms-${key.toLowerCase()} ms-shadow`}></i>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">
                    {stats.name}
                  </div>
                  <div className="text-xl font-semibold text-white">
                    {stats.cardCount > 0 ? `${stats.avgWinRate.toFixed(1)}%` : '—'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {stats.cardCount} card{stats.cardCount !== 1 ? 's' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-900 p-6 rounded-lg mb-6 border border-gray-800">
        <div className="flex flex-wrap gap-8">
          {/* Color Filters */}
          <div className="flex items-center gap-4">
            <label className="font-semibold text-gray-400 text-sm uppercase tracking-wide">Colors:</label>
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'W', label: 'W', color: 'text-yellow-300' },
                { key: 'U', label: 'U', color: 'text-blue-400' },
                { key: 'B', label: 'B', color: 'text-purple-400' },
                { key: 'R', label: 'R', color: 'text-red-400' },
                { key: 'G', label: 'G', color: 'text-green-400' },
                { key: 'C', label: 'C', color: 'text-gray-400' },
              ].map(({ key, label, color }) => (
                <label 
                  key={key} 
                  className="flex items-center gap-2 px-3 py-2 bg-gray-950 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.colors[key]}
                    onChange={() => toggleColorFilter(key)}
                    className="cursor-pointer"
                  />
                  <span className={`font-bold text-sm ${color}`}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rarity Filters */}
          <div className="flex items-center gap-4">
            <label className="font-semibold text-gray-400 text-sm uppercase tracking-wide">Rarity:</label>
            <div className="flex gap-2 flex-wrap">
              {['common', 'uncommon', 'rare', 'mythic'].map(rarity => (
                <label 
                  key={rarity} 
                  className="flex items-center gap-2 px-3 py-2 bg-gray-950 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.rarities[rarity]}
                    onChange={() => toggleRarityFilter(rarity)}
                    className="cursor-pointer"
                  />
                  <span className="text-sm text-gray-100">{rarity.charAt(0).toUpperCase() + rarity.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="text-gray-400 mb-4 text-sm">
        Showing {filteredAndSortedCards.length} of {deckCards.length} unique cards
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
        <table className="w-full">
          <thead className="bg-gray-950">
            <tr>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b-2 border-gray-800 cursor-pointer hover:bg-gray-900 transition-colors"
                onClick={() => handleSort('count')}
              >
                <div className="flex items-center gap-2">
                  #
                  {renderSortIcon('count')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b-2 border-gray-800 cursor-pointer hover:bg-gray-900 transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Card Name
                  {renderSortIcon('name')}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b-2 border-gray-800">
                Mana Cost
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b-2 border-gray-800 cursor-pointer hover:bg-gray-900 transition-colors"
                onClick={() => handleSort('rarity')}
              >
                <div className="flex items-center gap-2">
                  Rarity
                  {renderSortIcon('rarity')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b-2 border-gray-800 cursor-pointer hover:bg-gray-900 transition-colors"
                onClick={() => handleSort('winrate')}
              >
                <div className="flex items-center gap-2">
                  Win Rate
                  {renderSortIcon('winrate')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedCards.map((card, idx) => (
              <tr 
                key={idx} 
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                onMouseEnter={() => handleRowHover(card)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleRowLeave}
              >
                <td className="px-4 py-3 text-gray-100 font-semibold">{card.count}</td>
                <td className="px-4 py-3 text-gray-100 font-medium">{card.Name}</td>
                <td className="px-4 py-3">{renderManaCost(card.CastingCost || card.Cost)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block w-6 h-6 leading-6 text-center rounded font-bold text-xs ${
                    card.Rarity.toLowerCase() === 'mythic' ? 'bg-orange-600 text-white' :
                    card.Rarity.toLowerCase() === 'rare' ? 'bg-yellow-600 text-white' :
                    card.Rarity.toLowerCase() === 'uncommon' ? 'bg-gray-500 text-white' :
                    'bg-gray-700 text-white'
                  }`}>
                    {card.Rarity.charAt(0).toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-100">{card.GihWinrate.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card Image Tooltip */}
      {hoveredCard && hoveredCard.ImageUrl && (
        <div 
          className="fixed pointer-events-none z-50"
          style={{
            left: `${mousePosition.x + 20}px`,
            top: `${mousePosition.y + 20}px`,
          }}
        >
          <div className="bg-gray-950 border-2 border-gray-700 rounded-lg shadow-2xl overflow-hidden">
            <img 
              src={hoveredCard.ImageUrl} 
              alt={hoveredCard.Name}
              className="w-64 h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;