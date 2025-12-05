import React from 'react';

export const ManaCost = ({ cost }) => {
  if (!cost || cost === '') {
    return <span className="text-gray-500">—</span>;
  }
  
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