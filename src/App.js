import React, { useState, useMemo } from 'react';
import cardData from './data/ecl-data.json';

// Components
import { DecklistInput } from './components/DecklistInput';
import { Sidebar } from './components/Sidebar';
import { CardTable } from './components/CardTable';
import { LoadDecklistModal } from './components/LoadDecklistModal';
import { CardImageTooltip } from './components/CardImageTooltip';

// Hooks
import { useCardFilters } from './hooks/useCardFilters';
import { useTableSort } from './hooks/useTableSort';
import { useCardHover } from './hooks/useCardHover';
import { useColorAnalytics } from './hooks/useColorAnalytics';

// Utils
import { parseDecklist } from './utils/decklistParser';
import { filterCards } from './utils/filterUtils';
import { sortCards } from './utils/sortUtils';

function App() {
  const [decklistInput, setDecklistInput] = useState('');
  const [deckCards, setDeckCards] = useState(null);
  const [topCardsCount, setTopCardsCount] = useState(5);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [modalDecklistInput, setModalDecklistInput] = useState('');

  // Custom hooks
  const { 
    filters, 
    colorMatchMode, 
    setColorMatchMode, 
    toggleColorFilter, 
    toggleRarityFilter 
  } = useCardFilters();

  const { sortBy, sortDirection, handleSort } = useTableSort('winrate', 'desc');

  const {
    hoveredCard,
    mousePosition,
    handleMouseMove,
    handleRowHover,
    handleRowLeave
  } = useCardHover();

  const colorAnalytics = useColorAnalytics(deckCards, topCardsCount);

  // Parse and load initial decklist
  const handleLoadDecklist = () => {
    const result = parseDecklist(decklistInput, cardData.cards);

    if (result.error) {
      alert(result.error);
      return;
    }

    if (result.notFound.length > 0) {
      console.warn('Cards not found in database:', result.notFound);
      alert(`Warning: ${result.notFound.length} cards not found in database:\n${result.notFound.join('\n')}\n\nCheck console for full list.`);
    }

    if (result.matched.length === 0) {
      alert('No cards matched in database!');
      return;
    }

    setDeckCards(result.matched);
  };

  // Load new decklist from modal
  const handleLoadNewDecklist = () => {
    const result = parseDecklist(modalDecklistInput, cardData.cards);

    if (result.error) {
      alert(result.error);
      return;
    }

    if (result.notFound.length > 0) {
      console.warn('Cards not found in database:', result.notFound);
      alert(`Warning: ${result.notFound.length} cards not found in database:\n${result.notFound.join('\n')}\n\nCheck console for full list.`);
    }

    if (result.matched.length === 0) {
      alert('No cards matched in database!');
      return;
    }

    setDeckCards(result.matched);
    setModalDecklistInput('');
    setShowLoadModal(false);
  };

  const handleCloseModal = () => {
    setShowLoadModal(false);
    setModalDecklistInput('');
  };

  // Calculate filtered and sorted cards
  const filteredAndSortedCards = useMemo(() => {
    if (!deckCards) return [];

    const filtered = filterCards(deckCards, filters, colorMatchMode);
    const sorted = sortCards(filtered, sortBy, sortDirection);

    return sorted;
  }, [deckCards, filters, colorMatchMode, sortBy, sortDirection]);

  // If no deck is loaded, show the input screen
  if (!deckCards) {
    return (
      <DecklistInput
        decklistInput={decklistInput}
        onDecklistChange={setDecklistInput}
        onLoadCards={handleLoadDecklist}
      />
    );
  }

  const totalCards = deckCards.reduce((sum, card) => sum + card.count, 0);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">MTG Sealed Pool</h1>
          <button
            className="px-4 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            onClick={() => setShowLoadModal(true)}
          >
            Load New Decklist
          </button>
        </div>

        {/* Main Layout with Sidebar */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <Sidebar
            totalCards={totalCards}
            filteredCards={filteredAndSortedCards.reduce((sum, card) => sum + card.count, 0)}
            filters={filters}
            colorMatchMode={colorMatchMode}
            onToggleColor={toggleColorFilter}
            onToggleRarity={toggleRarityFilter}
            onColorMatchModeChange={setColorMatchMode}
            colorAnalytics={colorAnalytics}
            topCardsCount={topCardsCount}
            onTopCardsCountChange={setTopCardsCount}
          />

          {/* Pool Section */}
          <div className="flex-1 min-w-0">
            {/* Table */}
            <CardTable
              cards={filteredAndSortedCards}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={handleSort}
              onCardHover={handleRowHover}
              onMouseMove={handleMouseMove}
              onCardLeave={handleRowLeave}
            />
          </div>
        </div>
      </div>

      {/* Load New Decklist Modal */}
      <LoadDecklistModal
        isOpen={showLoadModal}
        decklistInput={modalDecklistInput}
        onDecklistChange={setModalDecklistInput}
        onLoadCards={handleLoadNewDecklist}
        onClose={handleCloseModal}
      />

      {/* Card Image Tooltip */}
      <CardImageTooltip card={hoveredCard} position={mousePosition} />
    </div>
  );
}

export default App;