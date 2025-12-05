export const COLOR_KEYS = ['W', 'U', 'B', 'R', 'G', 'C'];

export const COLOR_NAMES = {
  W: 'White',
  U: 'Blue',
  B: 'Black',
  R: 'Red',
  G: 'Green',
  C: 'Colorless'
};

export const COLOR_FILTERS = [
  { key: 'W', label: 'W', color: 'text-yellow-300' },
  { key: 'U', label: 'U', color: 'text-blue-400' },
  { key: 'B', label: 'B', color: 'text-purple-400' },
  { key: 'R', label: 'R', color: 'text-red-400' },
  { key: 'G', label: 'G', color: 'text-green-400' },
  { key: 'C', label: 'C', color: 'text-gray-400' }
];

export const COLOR_ANALYTICS_STYLES = [
  { key: 'W', bg: 'bg-yellow-900/20', border: 'border-yellow-600/30' },
  { key: 'U', bg: 'bg-blue-900/20', border: 'border-blue-600/30' },
  { key: 'B', bg: 'bg-purple-900/20', border: 'border-purple-600/30' },
  { key: 'R', bg: 'bg-red-900/20', border: 'border-red-600/30' },
  { key: 'G', bg: 'bg-green-900/20', border: 'border-green-600/30' },
  { key: 'C', bg: 'bg-gray-800/20', border: 'border-gray-600/30' }
];

export const COLOR_MATCH_MODES = {
  ANY: 'any',
  ONLY: 'only'
};