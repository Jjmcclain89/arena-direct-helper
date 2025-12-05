import React from 'react';
import { SortIcon } from './SortIcon';

export const TableHeader = ({ sortBy, sortDirection, onSort }) => {
  const columns = [
    { key: 'count', label: '#' },
    { key: 'rarity', label: 'Rarity' },
    { key: 'name', label: 'Card Name' },
    { key: 'winrate', label: 'Win Rate' }
  ];

  return (
    <thead className="bg-gray-950">
      <tr>
        {columns.map(column => (
          <th 
            key={column.key}
            className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b-2 border-gray-800 cursor-pointer hover:bg-gray-900 transition-colors"
            onClick={() => onSort(column.key)}
          >
            <div className="flex items-center gap-2">
              {column.label}
              <SortIcon column={column.key} currentSortBy={sortBy} sortDirection={sortDirection} />
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};