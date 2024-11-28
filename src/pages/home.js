import React, { useEffect, useState } from 'react';
import { Calendar, Users, Sparkles, TvIcon, Plus, LocateIcon } from 'lucide-react';
import styles from "@/styles/HomePage.module.css";
import CategoriesList from '@/components/CategoriesList';
import FilterCard from '@/components/FilterCard';
import classNames from 'classnames';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/component'

export async function getServerSideProps() {
  const supabase = createClient()

  let { data: events, error } = await supabase
  .from('events')
  .select('*')


  const url = process.env.NEXT_PUBLIC_CMS_URL + 'home?populate=*'
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const json = await res.json();

    return {
      props: {
        pageData: json.data || null,
        events: events || [],
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        pageData: null,
        error: 'Failed to load page data',
      },
    };
  }
}


const HomePage = ({ pageData, error, events }) => {
  const [activeCard, setActiveCard] = useState(null);
  const [activeFilterId, setActiveFilterId] = useState(null);

  const toggleFilter = (filterId) => {
    console.log("toggle called");
    setActiveFilterId(activeFilterId === filterId ? null : filterId);
  };

  const filters = [
    { id: 1, text: "Select categories" },
    { id: 2, text: "Filter by date" },
    { id: 3, text: "View on the map" }
  ];

  return (
    <>
    <header className={styles.heroSection}>
      <h1 className={styles.header__title}>
        {pageData.title}
      </h1>
      <p className={styles.header__text}>
        {pageData.lead}
      </p>
      <ul className={styles.filterCards}>
      {filters.map((filter) => (
          <FilterCard
            key={filter.id}
            id={filter.id}
            isActive={activeFilterId === filter.id}
            onClick={toggleFilter}
            filter={filter.text}
          />
        ))}
      </ul>
    </header>
    <main className={classNames(styles.mainContainer, styles.container)}>
        <div className={styles.mainContainer__header}>
            <h2 className={styles.sidebar__title}>Browsing events in "location here"</h2>
            <button className={classNames(styles.btn__primary, styles.mapBtn)}>View on the map</button>
        </div>
      <section className={styles.content}>
        <div className={styles.content_sidebar}>
          <div className={styles.sidebar__filters}>
            <ul className={styles.sidebarList}>
              <li className={classNames(styles.btn__primary, styles.sidebar__filter)}>
                Filter
              </li>

            </ul>
          </div>
        </div>{/* content_sidebar */}
        <div className={styles.content_main}>
          <ul className={styles.eventsList}>
          {events && events.map((event) => (
              <li 
              key={event.id}
              className={styles.eventsCard}
              >
                <div className={styles.eventsCard_media}>
                  <img src="/images/event.jpg" alt="Event" width={300} height={200} />
                  <span className={styles.eventsCard__label}>Label</span>
                </div>
                <div className={styles.eventsCard__inner}>
                  <h4 className={styles.eventsCard__title}>
                    {event.title}
                  </h4>
                  <p className={styles.eventsCard__description}>
                    {event.description}
                  </p>
                  <p className={styles.eventsCard__location}>
                    <LocateIcon size={16} />
                    {event.location}
                  </p>
                  <Link href={event.ticket_link ? event.ticket_link : "#"} className={classNames(styles.eventsCard__link, styles.btn__primary)}>
                    Read more
                  </Link>
                </div>
              </li>
          ))}
          </ul>
        </div>
      </section>
    </main>
    </>
  );
};

export default HomePage;