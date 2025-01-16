import React, { useEffect, useState } from 'react';
import Head from "next/head";
import styles from "@/styles/HomePage.module.css";
import FilterCard from '@/components/filters/FilterCard';
import { createClient } from '@/utils/supabase/component'
import { FILTER_TYPES } from '@/utils/constants/constants';
import { useFilters } from '@/components/filters/useFilters';
import ModalMap from '@/components/maps/ModalMap';
import EventCard from '@/components/EventCard';
import SearchBar from '@/components/SearchBar';
import { X } from 'lucide-react';
import CustomDateRangePicker from '@/components/filters/DateRangePicker';
import { useCategories } from '@/pages/api/context/categoriesProvider';
import { fetchEventLocation } from '@/utils/geoCodeService';



export async function getServerSideProps() {
  const supabase = createClient();

  // Fetch user location
  const userLocation = await fetch(`https://api.ipregistry.co/?key=${process.env.NEXT_PUBLIC_IPREGISTRY_API_KEY}`)
    .then((res) => res.json())
    .catch((error) => {
      console.error('Error fetching user location:', error);
      return null;
    });

  // Fetch events from Supabase
  let { data: events, error: eventsError } = await supabase
    .from('events')
    .select('*');

  if (eventsError) {
    console.error('Error fetching events:', eventsError);
    events = [];
  }

  // Fetch event images
  const eventImages = await Promise.all(
    events?.map(async (event) => {
      const { data: images, error: imagesError } = await supabase
        .from('event_images')
        .select('*')
        .eq('event_id', event.id)
        .order('is_primary', { ascending: false });

      if (imagesError) {
        console.error('Error fetching event images:', imagesError);
        return { ...event, images: [] };
      }

      // Generate public URLs for images
      const imagesWithUrls = images.map((image) =>
        supabase.storage.from('event-images').getPublicUrl(image.image_path).data.publicUrl
      );

      return { ...event, images: imagesWithUrls };
    }) || []
  );

  // Fetch data from CMS
  const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL + 'home?populate=*';
  const CMS_TOKEN = process.env.NEXT_PUBLIC_CMS_READ_TOKEN;

  let pageData = null;
  try {
    const res = await fetch(`${CMS_URL}`, {
      headers: {
        'Authorization': `Bearer ${CMS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const json = await res.json();
    pageData = json.data || null;
    console.log('pageData:', pageData);
  } catch (error) {
    console.error('Error fetching data from CMS:', error);
  }

  return {
    props: {
      pageData,
      events: eventImages || [],
      location: userLocation?.location || null,
    },
  };
}

const HomePage = ({ pageData, events, location }) => {
  const { filterState, updateFilter, getFilteredEvents } = useFilters(events);
  const { categories } = useCategories();
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [filteredEventsIds, setFilteredEventsIds] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const handleCategorySelect = (categoryId) => {
    const current = filterState.categories;
    const updated = current.includes(categoryId)
      ? current.filter(id => id !== categoryId)
      : [...current, categoryId];
    updateFilter(FILTER_TYPES.CATEGORY, updated);
  };

  const handleCategoryClick = (categoryId) => {
    handleCategorySelect(categoryId);
  };

 
  // Search Events
  const [query, setQuery] = useState('');
  // Handle Search bar input change
  const handleSearchQuery = (e) => {
      setQuery(e.target.value?.trimEnd());
    updateFilter(FILTER_TYPES.QUERY, query?.toLowerCase());
    }

  const getCategoryNameById = (id) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.name : '';
  };

  // Date Range Filter
  const handleDateRangeChange = (newValue) => {
    updateFilter(FILTER_TYPES.DATE, {
      start: newValue.start ? new Date(newValue.start.year, newValue.start.month - 1, newValue.start.day).toISOString() : null,
      end: newValue.end ? new Date(newValue.end.year, newValue.end.month - 1, newValue.end.day).toISOString() : null
    });
  };

  // Clear all filters
  const isAnyFilterActive = filterState.categories.length > 0 || filterState.dateRange.start && filterState.dateRange.end  || filterState.location || filterState.query;

  const clearFilters = () => {
    updateFilter(FILTER_TYPES.CATEGORY, []);
    updateFilter(FILTER_TYPES.DATE, { start: null, end: null });
    updateFilter(FILTER_TYPES.LOCATION, null);
    updateFilter(FILTER_TYPES.QUERY, '');
  };

  const filters = [
    { 
      id: 1, 
      text: "Select categories",
      type: FILTER_TYPES.CATEGORY 
    },
  ];


  // Toggle map modal
  const toggleModal = () => {
    setModalOpen(!modalOpen);
    console.log('modalOpen called');
  };

  // Filter events when filters change
  useEffect(() => {
    async function fetchFilteredEvents() {
      try {
        const events = await getFilteredEvents(filterState);
        setFilteredEvents(events);

        const filteredEventIds = events.map(event => event.id); 
        setFilteredEventsIds(filteredEventIds);

        // convert strings to an array of lat & lng objects
        const eventLocations = await fetchEventLocation([filteredEventIds]);

          // Enrich events with lat and lng values
          const enrichedEvents = events.map((event) => {
            const coordinates = eventLocations.find((location) => location.event_id === event.id);
            return {
              ...event,
              location: {
                lat: coordinates?.lat || null,
                lng: coordinates?.lng || null,
              } || null,
            };
          }
          );

          setFilteredEvents(enrichedEvents);


      } catch (error) {
        console.error('Error fetching filtered events:', error);
      }
    }

    fetchFilteredEvents();
  }, [filterState, events]);


  return (
    <>
      <Head>
        <title>Leia App - Find social activities & Create your own</title>
        <meta name="description" content="Welcome to Events Discovery" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <header className={`${styles.heroSection} container block`}>
      <h1 className={styles.header__title}>
        {pageData ? pageData?.title : 'Let\'s make it personal.'}
      </h1>
      <p className={styles.header__text}>
        {pageData ? pageData?.lead : 'Select your interests to get event suggestions based on what you love'}
      </p>
      <ul className={styles.filterCards}>
        <CustomDateRangePicker handleDateRangeChange={handleDateRangeChange} filterState={filterState} />
        {filters.map((filter) => (
          <FilterCard
            key={filter.id}
            filter={filter}
            filterState={filterState}
            onCategorySelect={handleCategorySelect}
            handleDateRangeChange={handleDateRangeChange}
            categories={filter.type === FILTER_TYPES.CATEGORY ? categories : null}
          />
        ))}
      </ul>
      {events && <SearchBar handleSearchQuery={handleSearchQuery} /> }
    </header>
    <main className={`${styles.mainContainer} container`}>
        <div className={styles.mainContainer__header}>
        <h2 className={`${styles.sidebar__title} h4`}>
          Browsing events in {location ? `${location.city}, ${location.country.code}` : 'your area'}
        </h2>
            <button className={`${styles.mapBtn} btn__primary`} onClick={() => toggleModal()}>View on the map</button>
            {modalOpen && 
            <ModalMap modalOpen={modalOpen} toggleModal={toggleModal} filteredEvents={filteredEvents} filterState={filterState} isAnyFilterActive={isAnyFilterActive}/>
            }
        </div>
      <section className={styles.content}>
        <div className={styles.content_sidebar}>
          <div className={styles.sidebar__filters}>
            <div className={styles.sidebar__header}>
              <h4>
                {isAnyFilterActive ? 'Active filters' : 'No active filters'}
              </h4>
              {isAnyFilterActive  && (
                <div className={`${styles.clear} txt-small`} onClick={clearFilters}>Clear filters<X size={12} /></div>
              )}
            </div>
            {
              isAnyFilterActive &&
              <ul className={styles.sidebarList}>
              {filterState.dateRange.start && filterState.dateRange.end && (
                <li
                  className={`${styles.sidebar__filter} btn__primary`}
                  onClick={() => updateFilter(FILTER_TYPES.DATE, { start: null, end: null })}
                >
                  {new Date(filterState.dateRange.start).toLocaleDateString()} - {new Date(filterState.dateRange.end).toLocaleDateString()}
                  <X size={16} />
                </li>
              )
              }
              {filterState.categories.length > 0 && (
                <>
                  {filterState.categories.map((categoryId) => (
                     <li 
                     className={`${styles.sidebar__filter} btn__primary`}
                      key={categoryId}
                      onClick={() => handleCategoryClick(categoryId)}
                     >
                        {getCategoryNameById(categoryId)}
                        <X size={16} />
                    </li>
                  ))}
                </>
              )}
            </ul>
            }
          </div>
        </div>{/* content_sidebar */}
        <div className={styles.content_main}>

        { filteredEvents.length > 0 ? (
          <ul className={styles.eventsList}>
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} categories={categories}/>
            ))}
          </ul>
        ) : (
          <div className={`${styles.eventsList__error} h2`}>
            <p className='h3'>No results found</p>
            <p className='txt-medium'>Try adjusting your search or filters to find what you are looking for.</p>
          </div>
        )
        }
        </div>
      </section>
    </main>
    </>
  );
};

export default HomePage;