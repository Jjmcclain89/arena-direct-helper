import React from 'react';
import { TableHeader } from './TableHeader';
import { CardRow } from './CardRow';

export const CardTable = ({ 
  cards, 
  sortBy, 
  sortDirection, 
  onSort,
  onCardHover,
  onMouseMove,
  onCardLeave
}) => {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 w-fit">
      <table>
        <TableHeader 
          sortBy={sortBy} 
          sortDirection={sortDirection} 
          onSort={onSort} 
        />
        <tbody>
          {cards.map((card, idx) => (
            <CardRow
              key={idx}
              card={card}
              onMouseEnter={onCardHover}
              onMouseMove={onMouseMove}
              onMouseLeave={onCardLeave}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};