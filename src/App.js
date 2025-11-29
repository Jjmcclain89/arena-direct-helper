import React, { useState, useMemo } from 'react';
import cardData from './data/data.json';

function App() {
  const [decklistInput, setDecklistInput] = useState('');
  const [deckCards, setDeckCards] = useState(null);
  const [sortBy, setSortBy] = useState('winrate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [topCardsCount, setTopCardsCount] = useState(5);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [analyticsCollapsed, setAnalyticsCollapsed] = useState(false);
  const [colorMatchMode, setColorMatchMode] = useState('any');
  const [deckList, setDeckList] = useState([]);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [modalDecklistInput, setModalDecklistInput] = useState('');
  const [deckCollapsed, setDeckCollapsed] = useState(false);
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

  const loadNewDecklist = () => {
    // Parse the modal decklist input
    const lines = modalDecklistInput.trim().split('\n');
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

    // Clear current deck and load new cards
    setDeckCards(matched);
    setDeckList([]);
    setModalDecklistInput('');
    setShowLoadModal(false);
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

  const addToDeck = (card) => {
    // Count how many copies of this card are already in the deck
    const copiesInDeck = deckList.filter(c => c.Name === card.Name).length;
    
    // Only add if we haven't reached the max count from pool
    if (copiesInDeck < card.count) {
      setDeckList(prev => [...prev, card]);
    }
  };

  const removeFromDeck = (index) => {
    setDeckList(prev => prev.filter((_, i) => i !== index));
  };

  const clearDeck = () => {
    setDeckList([]);
  };

  const getCardColors = (cost) => {
    if (!cost || cost === '') return ['C'];
    const colors = new Set();
    if (cost.includes('{W}')) colors.add('W');
    if (cost.includes('{G/W}')){
      colors.add('W');
      colors.add('G');
    } 
    if (cost.includes('{W/U}')){
      colors.add('W');
      colors.add('U');
    } 
    if (cost.includes('{W/B}')){
      colors.add('W');
      colors.add('B');
    } 
    if (cost.includes('{R/W}')){
      colors.add('W');
      colors.add('R');
    } 

    if (cost.includes('{U}')) colors.add('U');
    if (cost.includes('{G/U}')){
      colors.add('G');
      colors.add('U');
    } 
    if (cost.includes('{U/R}')){
      colors.add('R');
      colors.add('U');
    } 
    if (cost.includes('{U/B}')){
      colors.add('U');
      colors.add('B');
    } 

    if (cost.includes('{B}')) colors.add('B');
    if (cost.includes('{B/G}')){
      colors.add('G');
      colors.add('B');
    } 
    if (cost.includes('{B/R}')){
      colors.add('R');
      colors.add('B');
    }
    
    if (cost.includes('{R}')) colors.add('R');
    if (cost.includes('{R/G}')){
      colors.add('R');
      colors.add('G');
    }

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
        const selectedColors = Object.keys(filters.colors).filter(c => filters.colors[c]);
        
        if (colorMatchMode === 'only') {
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
  }, [deckCards, filters, sortBy, sortDirection, colorMatchMode]);

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
          <h1 className="text-4xl font-bold text-white mb-2">MTG Avatar Arena Direct Helper</h1>
          <p className="text-xl text-gray-400">Paste your decklist below</p>
          <textarea
            className="w-full min-h-[400px] p-4 bg-gray-900 border-2 border-gray-700 rounded-lg text-gray-100 font-mono text-sm resize-y focus:outline-none focus:border-blue-500"
            value={decklistInput}
            onChange={(e) => setDecklistInput(e.target.value)}
            placeholder="Paste your decklist here. You can export this from 17lands deck export-> copy as plain text&#10;(format: '1 Card Name' per line)&#10;&#10;Example:&#10;1 Zuko's Exile&#10;2 Avatar Enthusiasts&#10;1 Curious Farm Animals"
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
    <div className="min-h-screen p-8">
      {/* Main Layout with Sidebar */}
      <div className="flex gap-6 max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 space-y-6">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">MTG Sealed Pool</h1>
            <p className="text-gray-400 text-sm mt-1">{totalCards} cards total</p>
          </div>

          {/* Filters */}
          <div className="bg-gray-900 rounded-lg border border-gray-800">
            <div 
              className="p-6 cursor-pointer flex items-center justify-between hover:bg-gray-800/50 transition-colors"
              onClick={() => setFiltersCollapsed(!filtersCollapsed)}
            >
              <h2 className="text-lg font-semibold text-white">Filters</h2>
              <svg 
                className={`w-5 h-5 text-gray-400 transition-transform ${filtersCollapsed ? '' : 'rotate-180'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {!filtersCollapsed && (
              <div className="px-6 pb-6">
                {/* Color Filters */}
                <div className="mb-6">
                  <label className="font-semibold text-gray-400 text-xs uppercase tracking-wide mb-3 block">Colors</label>
                  <div className="grid grid-cols-2 gap-2 mb-3">
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
                  
                  {/* Color Match Mode */}
                  <div className="flex gap-4 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="colorMatchMode"
                        value="any"
                        checked={colorMatchMode === 'any'}
                        onChange={(e) => setColorMatchMode(e.target.value)}
                        className="cursor-pointer"
                      />
                      <span className="text-gray-300">Match Any</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="colorMatchMode"
                        value="only"
                        checked={colorMatchMode === 'only'}
                        onChange={(e) => setColorMatchMode(e.target.value)}
                        className="cursor-pointer"
                      />
                      <span className="text-gray-300">Match Only</span>
                    </label>
                  </div>
                </div>

                {/* Rarity Filters */}
                <div>
                  <label className="font-semibold text-gray-400 text-xs uppercase tracking-wide mb-3 block">Rarity</label>
                  <div className="space-y-2">
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
            )}
          </div>

          {/* Analytics Panel */}
          {colorAnalytics && (
            <div className="bg-gray-900 rounded-lg border border-gray-800">
              <div 
                className="p-6 cursor-pointer flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                onClick={() => setAnalyticsCollapsed(!analyticsCollapsed)}
              >
                <h2 className="text-lg font-semibold text-white">Color Analytics</h2>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${analyticsCollapsed ? '' : 'rotate-180'}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {!analyticsCollapsed && (
                <div className="px-6 pb-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <label>Top {topCardsCount} cards</label>
                      <input
                        type="range"
                        min="0"
                        max="14"
                        value={topCardsCount}
                        onChange={(e) => setTopCardsCount(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
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
                          className={`${bg} ${border} border-2 rounded-lg p-3 flex items-center justify-between`}
                        >
                          <div className="flex items-center gap-3">
                            <i className={`ms ms-cost ms-${key.toLowerCase()} ms-shadow text-2xl`}></i>
                            <div>
                              <div className="text-sm text-gray-400">{stats.name}</div>
                              <div className="text-xs text-gray-500">{stats.cardCount} card{stats.cardCount !== 1 ? 's' : ''}</div>
                            </div>
                          </div>
                          <div className="text-lg font-semibold text-white">
                            {stats.cardCount > 0 ? `${stats.avgWinRate?.toFixed(1)}%` : '—'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 flex gap-6">
          {/* Pool Section */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">Pool</h2>
                <button 
                  className="px-3 py-1 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  onClick={() => setShowLoadModal(true)}
                >
                  Load New Decklist
                </button>
              </div>
              
              {/* Collapsed Deck Button */}
              {deckCollapsed && (
                <button
                  onClick={() => setDeckCollapsed(false)}
                  className="px-4 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <span className="font-semibold">Deck ({deckList.length})</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Results Info */}
            <div className="text-gray-400 mb-4 text-sm">
              Showing {filteredAndSortedCards.length} of {deckCards.length} unique cards
            </div>

            {/* Table */}
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 w-fit">
              <table>
                <thead className="bg-gray-950">
                  <tr>
                    <th 
                      className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b-2 border-gray-800 cursor-pointer hover:bg-gray-900 transition-colors"
                      onClick={() => handleSort('count')}
                    >
                      <div className="flex items-center gap-2">
                        #
                        {renderSortIcon('count')}
                      </div>
                    </th>
                    <th 
                      className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b-2 border-gray-800 cursor-pointer hover:bg-gray-900 transition-colors"
                      onClick={() => handleSort('rarity')}
                    >
                      <div className="flex items-center gap-2">
                        Rarity
                        {renderSortIcon('rarity')}
                      </div>
                    </th>
                    <th 
                      className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b-2 border-gray-800 cursor-pointer hover:bg-gray-900 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Card Name
                        {renderSortIcon('name')}
                      </div>
                    </th>
                    <th 
                      className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b-2 border-gray-800 cursor-pointer hover:bg-gray-900 transition-colors"
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
                  {filteredAndSortedCards.map((card, idx) => {
                    const copiesInDeck = deckList.filter(c => c.Name === card.Name).length;
                    const canAddMore = copiesInDeck < card.count;
                    
                    return (
                      <tr 
                        key={idx} 
                        className={`border-b border-gray-800 transition-colors ${
                          canAddMore ? 'hover:bg-green-900/20 cursor-pointer' : 'hover:bg-gray-800/50 cursor-not-allowed opacity-60'
                        }`}
                        onClick={() => canAddMore && addToDeck(card)}
                        onMouseEnter={() => handleRowHover(card)}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleRowLeave}
                      >
                        <td className="px-3 py-2 text-gray-100 font-semibold">{card.count}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-block w-6 h-6 leading-6 text-center rounded font-bold text-xs ${
                            card.Rarity.toLowerCase() === 'mythic' ? 'bg-orange-600 text-white' :
                            card.Rarity.toLowerCase() === 'rare' ? 'bg-yellow-600 text-white' :
                            card.Rarity.toLowerCase() === 'uncommon' ? 'bg-gray-500 text-white' :
                            'bg-gray-700 text-white'
                          }`}>
                            {card.Rarity.charAt(0).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-100 font-medium">{card.Name}</span>
                            {renderManaCost(card.CastingCost || card.Cost)}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-gray-100">{card.GihWinrate?.toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Deck Section */}
          {!deckCollapsed && (
            <div className="w-96 flex-shrink-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Deck</h2>
                <div className="flex gap-2">
                  <button
                    onClick={clearDeck}
                    className="px-3 py-1 bg-red-900/30 text-red-400 border border-red-700 rounded-lg hover:bg-red-900/50 transition-colors text-sm"
                    disabled={deckList.length === 0}
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setDeckCollapsed(true)}
                    className="px-2 py-1 bg-gray-800 text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Deck Info */}
              <div className="text-gray-400 mb-4 text-sm">
                {deckList.length} cards in deck
              </div>
              
              <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                <table className="w-full">
                  <thead className="bg-gray-950">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b-2 border-gray-800">
                        #
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b-2 border-gray-800">
                        Rarity
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b-2 border-gray-800">
                        Card Name
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b-2 border-gray-800">
                        Win Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {deckList.map((card, idx) => (
                      <tr 
                        key={idx} 
                        className="border-b border-gray-800 hover:bg-red-900/20 transition-colors cursor-pointer"
                        onClick={() => removeFromDeck(idx)}
                        onMouseEnter={() => handleRowHover(card)}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleRowLeave}
                      >
                        <td className="px-3 py-2 text-gray-100 font-semibold">{idx + 1}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-block w-6 h-6 leading-6 text-center rounded font-bold text-xs ${
                            card.Rarity.toLowerCase() === 'mythic' ? 'bg-orange-600 text-white' :
                            card.Rarity.toLowerCase() === 'rare' ? 'bg-yellow-600 text-white' :
                            card.Rarity.toLowerCase() === 'uncommon' ? 'bg-gray-500 text-white' :
                            'bg-gray-700 text-white'
                          }`}>
                            {card.Rarity.charAt(0).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-100 font-medium">{card.Name}</span>
                            {renderManaCost(card.CastingCost || card.Cost)}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-gray-100">{card.GihWinrate?.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Load New Decklist Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-8 max-w-2xl w-full mx-4 relative">
            {/* Close button */}
            <button
              onClick={() => {
                setShowLoadModal(false);
                setModalDecklistInput('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-white mb-4">Load New Decklist</h2>
            <p className="text-gray-400 mb-4">Paste your decklist below. This will replace your current pool and clear your deck.</p>
            
            <textarea
              className="w-full min-h-[400px] p-4 bg-gray-950 border-2 border-gray-700 rounded-lg text-gray-100 font-mono text-sm resize-y focus:outline-none focus:border-blue-500"
              value={modalDecklistInput}
              onChange={(e) => setModalDecklistInput(e.target.value)}
              placeholder="Paste your decklist here. You can export this from 17lands deck export-> copy as plain text&#10;(format: '1 Card Name' per line)&#10;&#10;Example:&#10;1 Zuko's Exile&#10;2 Avatar Enthusiasts&#10;1 Curious Farm Animals"
            />
            
            <div className="flex gap-3 mt-6">
              <button 
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all hover:-translate-y-0.5"
                onClick={loadNewDecklist}
              >
                Load Cards
              </button>
              <button 
                className="px-6 py-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                onClick={() => {
                  setShowLoadModal(false);
                  setModalDecklistInput('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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