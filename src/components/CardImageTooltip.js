import React from 'react';

export const CardImageTooltip = ({ card, position }) => {
  if (!card || !card.ImageUrl) return null;

  return (
    <div 
      className="fixed pointer-events-none z-50"
      style={{
        left: `${position.x + 20}px`,
        top: `${position.y + 20}px`,
      }}
    >
      <div className="bg-gray-950 border-2 border-gray-700 rounded-lg shadow-2xl overflow-hidden">
        <img 
          src={card.ImageUrl} 
          alt={card.Name}
          className="w-64 h-auto"
        />
      </div>
    </div>
  );
};