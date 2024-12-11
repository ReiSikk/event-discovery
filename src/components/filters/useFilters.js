import { useState, useCallback } from 'react';
import { FILTER_TYPES } from '@/utils/constants/constants';

export const useFilters = (events) => {
  const [filterState, setFilterState] = useState({
    categories: [],
    dateRange: null,
    location: null,
    query: ''
  });

  const updateFilter = useCallback((type, value) => {
    setFilterState(prev => ({
      ...prev,
      [type]: value
    }));
  }, []);

  const getFilteredEvents = useCallback(() => {
    return events.filter(event => {

      // Categories Filter - exclude the event if it doesn't match any selected categories
      if (filterState.categories.length && !filterState.categories.includes(event.category_id)) {
        return false;
      }
      
      // Search query filter - exclude the event if it doesn't match the search query
      if (filterState.query && !(
        event.title.toLowerCase().includes(filterState.query.toLowerCase()) ||
        event.description.toLowerCase().includes(filterState.query.toLowerCase())
        || event.location.toLowerCase().includes(filterState.query.toLowerCase())
      )) {
        return false;
      }
      // Include the events that pass all filters
      return true;
    });
  }, [events, filterState]);

  return {
    filterState,
    updateFilter,
    getFilteredEvents
  };
};