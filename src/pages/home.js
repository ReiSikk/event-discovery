import React, { useEffect, useState } from 'react';
import { Calendar, Users, Sparkles, TvIcon } from 'lucide-react';
import styles from "@/styles/HomePage.module.css";
import CategoriesList from '@/components/CategoriesList';

export async function getServerSideProps() {
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


const HomePage = ({ pageData, error }) => {
  const [activeCard, setActiveCard] = useState(null);

  return (
    <>
    <header className={styles.heroSection}>
      <h1 className={styles.header__title}>
        {pageData.title}
      </h1>
      <p className={styles.header__text}>
        {pageData.lead}
      </p>
      <ul className={styles.actionCards}>
        {pageData.headerSlider.map((card) => (
            <li
            key={card.id} 
            className={`${styles.card} ${activeCard === card.id ? styles.activeCard : ''}`}
            onMouseEnter={() => setActiveCard(card.id)}
            onMouseLeave={() => setActiveCard(null)}
          >
            <Calendar size={32} />
            <h2>{card.title}</h2>
            <p className={styles.actionCard__text}>{card.text}</p>
            <button className={`${styles.firstButton} ${styles.btn__primary}`}>{card.link}</button>
          </li>
        ))}
      </ul>
    </header>
    <main className={styles.mainContainer}>

      <CategoriesList />

      <section className={styles.dynamicSection}>
        <div className={styles.contentWrapper}>
          {activeCard === 'browse' && (
            <div className={styles.previewContent}>
              <h3>Trending Events</h3>
              {/* //TODO REMOVE TEMP!!! */}
              <ul className={styles.previewContentList}>
                <li className={styles.previewContent__card}>
                    <TvIcon />
                    <span className="txt_small"></span>
                </li>
                <li className={styles.previewContent__card}>
                    <TvIcon />
                    <span className="txt_small"></span>
                </li>
                <li className={styles.previewContent__card}>
                    <TvIcon />
                    <span className="txt_small"></span>
                </li>
                <li className={styles.previewContent__card}>
                    <TvIcon />
                    <span className="txt_small"></span>
                </li>
                <li className={styles.previewContent__card}>
                    <TvIcon />
                    <span className="txt_small"></span>
                </li>
              </ul>
            </div>
          )}
          
          {activeCard === 'create' && (
            <div className={styles.previewContent}>
              <h3>Event Creation Tools</h3>
              <ul className={styles.previewContentList}>
                <li className={styles.previewContent__card}>
                    <TvIcon />
                    <span className="txt_small"></span>
                </li>
                <li className={styles.previewContent__card}>
                    <TvIcon />
                    <span className="txt_small"></span>
                </li>
                <li className={styles.previewContent__card}>
                    <TvIcon />
                    <span className="txt_small"></span>
                </li>
              </ul>
            </div>
          )}
          
          {activeCard === 'organizer' && (
            <div className={styles.previewContent}>
              <h3>Organizer Benefits</h3>
              <ul className={styles.previewContentList}>
                <li className={styles.previewContent__card}>
                    <TvIcon />
                    <span className="txt_small"></span>
                </li>
                <li className={styles.previewContent__card}>
                    <TvIcon />
                    <span className="txt_small"></span>
                </li>
                <li className={styles.previewContent__card}>
                    <TvIcon />
                    <span className="txt_small"></span>
                </li>
                <li className={styles.previewContent__card}>
                    <TvIcon />
                    <span className="txt_small"></span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Featured Events Grid */}
      <section className={styles.featuredSection}>
        <div className={styles.sectionHeader}>
          <h2>Happening Near You</h2>
          <button className={styles.viewAllButton}>View All</button>
        </div>
        <div className={styles.eventGrid}>
          {/* Event cards will go here */}
        </div>
      </section>
    </main>
    </>
  );
};

export default HomePage;