// src/components/FilterPanel.js
import React, { useState } from 'react';
import { COLOR_FILTERS, COLOR_MATCH_MODES } from '../constants/colors';
import { RARITY_TYPES, getRarityLabel } from '../constants/rarities';

export const FilterPanel = ({
  filters,
  colorMatchMode,
  onToggleColor,
  onToggleRarity,
  onColorMatchModeChange,
  filteredCards,
  totalCards
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800">
      <div
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-gray-800/50 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h2 className="text-sm font-semibold text-white">Filters</h2>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {!isCollapsed && (
        <div className="px-4 pb-4">
          {/* Color Filters */}
          <div className="mb-4">
            <label className="font-semibold text-gray-400 text-xs uppercase tracking-wide mb-2 block">Colors</label>
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              {COLOR_FILTERS.map(({ key, label, color }) => (
                <label
                  key={key}
                  className="flex items-center gap-1.5 px-2 py-1 bg-gray-950 rounded cursor-pointer hover:bg-gray-800 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.colors[key]}
                    onChange={() => onToggleColor(key)}
                    className="cursor-pointer w-3 h-3"
                  />
                  <span className={`font-bold text-xs ${color}`}>{label[0]}</span>
                </label>
              ))}
            </div>

            {/* Color Match Mode */}
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="colorMatchMode"
                  value={COLOR_MATCH_MODES.ANY}
                  checked={colorMatchMode === COLOR_MATCH_MODES.ANY}
                  onChange={(e) => onColorMatchModeChange(e.target.value)}
                  className="cursor-pointer"
                />
                <span className="text-gray-300">Match Any</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="colorMatchMode"
                  value={COLOR_MATCH_MODES.ONLY}
                  checked={colorMatchMode === COLOR_MATCH_MODES.ONLY}
                  onChange={(e) => onColorMatchModeChange(e.target.value)}
                  className="cursor-pointer"
                />
                <span className="text-gray-300">Match Only</span>
              </label>
            </div>
          </div>

          {/* Rarity Filters */}
          <div className="mb-4">
            <label className="font-semibold text-gray-400 text-xs uppercase tracking-wide mb-2 block">Rarity</label>
            <div className="grid grid-cols-2 gap-1.5">
              {RARITY_TYPES.map(rarity => (
                <label
                  key={rarity}
                  className="flex items-center gap-1.5 px-2 py-1 bg-gray-950 rounded cursor-pointer hover:bg-gray-800 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.rarities[rarity]}
                    onChange={() => onToggleRarity(rarity)}
                    className="cursor-pointer w-3 h-3"
                  />
                  <span className="text-xs text-gray-100">{getRarityLabel(rarity)[0]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Card Count */}
          <div className="text-gray-400 text-xs pt-2 border-t border-gray-800">
            Showing {filteredCards} cards out of {totalCards} total
          </div>
        </div>
      )}
    </div>
  );
};