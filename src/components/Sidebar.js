// src/components/Sidebar.js
import React from 'react';
import { FilterPanel } from './FilterPanel';
import { ColorAnalytics } from './ColorAnalytics';

export const Sidebar = ({
  totalCards,
  filteredCards,
  filters,
  colorMatchMode,
  onToggleColor,
  onToggleRarity,
  onColorMatchModeChange,
  colorAnalytics,
  topCardsCount,
  onTopCardsCountChange
}) => {
  return (
    <div className="w-64 flex-shrink-0 space-y-4">
      {/* Filters */}
      <FilterPanel
        filters={filters}
        colorMatchMode={colorMatchMode}
        onToggleColor={onToggleColor}
        onToggleRarity={onToggleRarity}
        onColorMatchModeChange={onColorMatchModeChange}
        filteredCards={filteredCards}
        totalCards={totalCards}
      />

      {/* Analytics Panel */}
      <ColorAnalytics
        analytics={colorAnalytics}
        topCardsCount={topCardsCount}
        onTopCardsCountChange={onTopCardsCountChange}
      />
    </div>
  );
};