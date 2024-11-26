import React, { useEffect, useState } from 'react';
import { Calendar, Users, Sparkles, TvIcon } from 'lucide-react';
import styles from "@/styles/HomePage.module.css";

// export async function getServerSideProps() {
//   try {
//     const res = await fetch('http://localhost:1337/api/home-template');
//     if (!res.ok) {
//       throw new Error('Failed to fetch data');
//     }
//     const json = await res.json();

//     return {
//       props: {
//         pageData: json.data || null,
//       },
//     };
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     return {
//       props: {
//         pageData: null,
//         error: 'Failed to load page data',
//       },
//     };
//   }
// }


const HomePage = ({ pageData, error }) => {
  const [activeCard, setActiveCard] = useState(null);

  return (
    <main className={styles.mainContainer}>
      <section className={styles.heroSection}>
        <h1 className={styles.mainHeading}>
          Where Communities <span className={styles.highlight}>Thrive</span>
        </h1>
        
        <div className={styles.actionCards}>
          <div 
            className={`${styles.card} ${activeCard === 'browse' ? styles.activeCard : ''}`}
            onMouseEnter={() => setActiveCard('browse')}
            onMouseLeave={() => setActiveCard(null)}
          >
            <Calendar size={32} />
            <h2>Discover Events</h2>
            <p className={styles.actionCard__text}>Find your next adventure</p>
            <button className={`${styles.firstButton} ${styles.btn__primary}`}>Browse Events</button>
          </div>

          <div 
            className={`${styles.card} ${activeCard === 'create' ? styles.activeCard : ''}`}
            onMouseEnter={() => setActiveCard('create')}
            onMouseLeave={() => setActiveCard(null)}
          >
            <Sparkles size={32} />
            <h2>Host an Event</h2>
            <p>Share your passion</p>
            <button className={styles.secondaryButton}>Create Event</button>
          </div>

          <div 
            className={`${styles.card} ${activeCard === 'organizer' ? styles.activeCard : ''}`}
            onMouseEnter={() => setActiveCard('organizer')}
            onMouseLeave={() => setActiveCard(null)}
          >
            <Users size={32} />
            <h2>Become an Organizer</h2>
            <p>Build your community</p>
            <button className={styles.tertiaryButton}>Get Started</button>
          </div>
        </div>
      </section>

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
  );
};

export default HomePage;