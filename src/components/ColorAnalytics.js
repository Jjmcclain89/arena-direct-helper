// src/components/ColorAnalytics.js
import React, { useState } from 'react';
import { COLOR_ANALYTICS_STYLES } from '../constants/colors';

export const ColorAnalytics = ({
  analytics,
  topCardsCount,
  onTopCardsCountChange
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!analytics) return null;

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800">
      <div
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-gray-800/50 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h2 className="text-sm font-semibold text-white">Color Analytics</h2>
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
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <label>Top {topCardsCount} cards</label>
              <input
                type="range"
                min="0"
                max="14"
                value={topCardsCount}
                onChange={(e) => onTopCardsCountChange(parseInt(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
          <div className="space-y-3">
            {COLOR_ANALYTICS_STYLES.map(({ key, bg, border }) => {
              const stats = analytics[key];
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
  );
};