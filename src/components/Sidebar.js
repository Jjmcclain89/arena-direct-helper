import React, { useState } from 'react';
import { FilterPanel } from './FilterPanel';
import { ColorAnalytics } from './ColorAnalytics';

export const Sidebar = ({ 
  totalCards,
  filters,
  colorMatchMode,
  onToggleColor,
  onToggleRarity,
  onColorMatchModeChange,
  colorAnalytics,
  topCardsCount,
  onTopCardsCountChange
}) => {
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [analyticsCollapsed, setAnalyticsCollapsed] = useState(false);

  return (
    <div className="w-80 flex-shrink-0 space-y-6">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">MTG Sealed Pool</h1>
        <p className="text-gray-400 text-sm mt-1">{totalCards} cards total</p>
      </div>

      {/* Filters */}
      <FilterPanel
        filters={filters}
        colorMatchMode={colorMatchMode}
        onToggleColor={onToggleColor}
        onToggleRarity={onToggleRarity}
        onColorMatchModeChange={onColorMatchModeChange}
        isCollapsed={filtersCollapsed}
        onToggleCollapse={() => setFiltersCollapsed(!filtersCollapsed)}
      />

      {/* Analytics Panel */}
      <ColorAnalytics
        analytics={colorAnalytics}
        topCardsCount={topCardsCount}
        onTopCardsCountChange={onTopCardsCountChange}
        isCollapsed={analyticsCollapsed}
        onToggleCollapse={() => setAnalyticsCollapsed(!analyticsCollapsed)}
      />
    </div>
  );
};