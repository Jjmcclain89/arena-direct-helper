import { useState } from 'react';

export const useCardHover = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleRowHover = (card) => {
    setHoveredCard(card);
  };

  const handleRowLeave = () => {
    setHoveredCard(null);
  };

  return {
    hoveredCard,
    mousePosition,
    handleMouseMove,
    handleRowHover,
    handleRowLeave
  };
};