import React from 'react';

export const LoadDecklistModal = ({ 
  isOpen, 
  decklistInput, 
  onDecklistChange, 
  onLoadCards, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-8 max-w-2xl w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-white mb-4">Load New Decklist</h2>
        <p className="text-gray-400 mb-4">Paste your decklist below. This will replace your current pool.</p>
        
        <textarea
          className="w-full min-h-[400px] p-4 bg-gray-950 border-2 border-gray-700 rounded-lg text-gray-100 font-mono text-sm resize-y focus:outline-none focus:border-blue-500"
          value={decklistInput}
          onChange={(e) => onDecklistChange(e.target.value)}
          placeholder="Paste your decklist here. You can export this from 17lands deck export-> copy as plain text&#10;(format: '1 Card Name' per line)&#10;&#10;Example:&#10;1 Zuko's Exile&#10;2 Avatar Enthusiasts&#10;1 Curious Farm Animals"
        />
        
        <div className="flex gap-3 mt-6">
          <button 
            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all hover:-translate-y-0.5"
            onClick={onLoadCards}
          >
            Load Cards
          </button>
          <button 
            className="px-6 py-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};