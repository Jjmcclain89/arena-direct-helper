import React from 'react';

export const DecklistInput = ({ decklistInput, onDecklistChange, onLoadCards }) => {
  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-white mb-2">MTG Arena Sealed Pool Helper</h1>
        <p className="text-xl text-gray-400">Paste your decklist below</p>
        <textarea
          className="w-full min-h-[400px] p-4 bg-gray-900 border-2 border-gray-700 rounded-lg text-gray-100 font-mono text-sm resize-y focus:outline-none focus:border-blue-500"
          value={decklistInput}
          onChange={(e) => onDecklistChange(e.target.value)}
          placeholder="Paste your decklist here. You can export this from 17lands deck export-> copy as plain text&#10;(format: '1 Card Name' per line)&#10;&#10;Example:&#10;1 Zuko's Exile&#10;2 Avatar Enthusiasts&#10;1 Curious Farm Animals"
        />
        <button 
          className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all hover:-translate-y-0.5"
          onClick={onLoadCards}
        >
          Load Cards
        </button>
      </div>
    </div>
  );
};