import React from 'react';
import { ManaCost } from './ManaCost';
import { RARITY_STYLES } from '../constants/rarities';

export const CardRow = ({ card, onMouseEnter, onMouseMove, onMouseLeave }) => {
  const rarityStyle = RARITY_STYLES[card.Rarity.toLowerCase()] || RARITY_STYLES.common;
  
  return (
    <tr 
      className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
      onMouseEnter={() => onMouseEnter(card)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <td className="px-3 py-2 text-gray-100 font-semibold">{card.count}</td>
      <td className="px-3 py-2">
        <span className={`inline-block w-6 h-6 leading-6 text-center rounded font-bold text-xs ${rarityStyle}`}>
          {card.Rarity.charAt(0).toUpperCase()}
        </span>
      </td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-100 font-medium">{card.Name}</span>
          <ManaCost cost={card.CastingCost || card.Cost} />
        </div>
      </td>
      <td className="px-3 py-2 text-gray-100">{card.GihWinrate?.toFixed(1)}%</td>
    </tr>
  );
};