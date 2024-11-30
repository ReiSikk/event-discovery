import { useState, useCallback } from 'react';
import { FILTER_TYPES } from '@/utils/constants/constants';

export const useFilters = (events) => {
  const [filterState, setFilterState] = useState({
    categories: [],
    dateRange: null,
    location: null
  });

  const updateFilter = useCallback((type, value) => {
    setFilterState(prev => ({
      ...prev,
      [type]: value
    }));
  }, []);

  const getFilteredEvents = useCallback(() => {
    return events.filter(event => {
      if (filterState.categories.length && !filterState.categories.includes(event.categoryId)) {
        return false;
      }
      return true;
    });
  }, [events, filterState]);

  return {
    filterState,
    updateFilter,
    getFilteredEvents
  };
};