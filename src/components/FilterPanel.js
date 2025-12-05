import React from 'react';
import { COLOR_FILTERS, COLOR_MATCH_MODES } from '../constants/colors';
import { RARITY_TYPES, getRarityLabel } from '../constants/rarities';

export const FilterPanel = ({ 
  filters, 
  colorMatchMode, 
  onToggleColor, 
  onToggleRarity, 
  onColorMatchModeChange,
  isCollapsed,
  onToggleCollapse
}) => {
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800">
      <div 
        className="p-6 cursor-pointer flex items-center justify-between hover:bg-gray-800/50 transition-colors"
        onClick={onToggleCollapse}
      >
        <h2 className="text-lg font-semibold text-white">Filters</h2>
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
        <div className="px-6 pb-6">
          {/* Color Filters */}
          <div className="mb-6">
            <label className="font-semibold text-gray-400 text-xs uppercase tracking-wide mb-3 block">Colors</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {COLOR_FILTERS.map(({ key, label, color }) => (
                <label 
                  key={key} 
                  className="flex items-center gap-2 px-3 py-2 bg-gray-950 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.colors[key]}
                    onChange={() => onToggleColor(key)}
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
          <div>
            <label className="font-semibold text-gray-400 text-xs uppercase tracking-wide mb-3 block">Rarity</label>
            <div className="space-y-2">
              {RARITY_TYPES.map(rarity => (
                <label 
                  key={rarity} 
                  className="flex items-center gap-2 px-3 py-2 bg-gray-950 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.rarities[rarity]}
                    onChange={() => onToggleRarity(rarity)}
                    className="cursor-pointer"
                  />
                  <span className="text-sm text-gray-100">{getRarityLabel(rarity)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};