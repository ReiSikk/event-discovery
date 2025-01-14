import { useState, useCallback } from 'react';
import { FILTER_TYPES } from '@/utils/constants/constants';

export const useFilters = (events) => {
  const [filterState, setFilterState] = useState({
    categories: [],
    dateRange: { start: null, end: null },
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
    console.log('getFilteredEvents called');
    return events.filter(event => {

      // Categories Filter - exclude the event if it doesn't match any selected categories
      if (filterState.categories.length && !filterState.categories.includes(event.category_id)) {
        return false;
      }
      
      // Search query filter - exclude the event if it doesn't match the search query
      if (filterState.query && !(
        event.title.toLowerCase().includes(filterState.query.toLowerCase()) ||
        event.description.toLowerCase().includes(filterState.query.toLowerCase())
      )) {
        return false;
      }

      // Date Range Filter
      if (filterState.dateRange.start && filterState.dateRange.end) {
        const eventStart = new Date(event.start_time).getTime();
        const eventEnd = new Date(event.end_time).getTime();
        const filterStart = new Date(filterState.dateRange.start).getTime();
        const filterEnd = new Date(filterState.dateRange.end).getTime();

        if (eventStart < filterStart || eventEnd > filterEnd) {
          return false;
        }
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