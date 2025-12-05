import { useState } from 'react';

export const useTableSort = (defaultSortBy = 'winrate', defaultDirection = 'desc') => {
  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [sortDirection, setSortDirection] = useState(defaultDirection);

  const handleSort = (column) => {
    if (sortBy === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to descending for most, ascending for name
      setSortBy(column);
      setSortDirection(column === 'name' ? 'asc' : 'desc');
    }
  };

  return {
    sortBy,
    sortDirection,
    handleSort
  };
};