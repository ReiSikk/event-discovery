import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Script from "next/script";
import Link from "next/link";
import placehold_image from '../../public/assets/landing_place.webp'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/component'
import { useRouter } from "next/router";


export async function getServerSideProps() {
  const url = process.env.NEXT_PUBLIC_CMS_URL + 'landing?populate=*'

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


export default function Home({ pageData, error, user}) {
  const [session, setSession] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    async function getSession() {
      const { data, error } = await createClient().auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      } else {
        setSession(data.session);
      }
    }
    getSession();
  }, []);

  return (
    <>
      <Head>
        <title>Leia App - Find social activities & Create your own</title>
        <meta name="description" content="Welcome to Events Discovery" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
      >
        <main className={styles.main}>
          <section className={`${styles.heroSection} ${styles.container}`}>
            <div className={styles.heroSection__main}>
              <h1 className={styles.heroSection__title}>
                {pageData? pageData?.title : 'Discover. Connect. Grow.'}
              </h1>
              <p className={styles.heroSection__text}>
              {pageData ? pageData?.lead : 'Leia is more than an event platform — it\'s your gateway to building genuine relationships. Whether you\'re seeking professional networking, friendship, or exciting experiences, we help you find your tribe.'}
              </p>
              <div className={styles.heroSection__cta}>
                <Link href="/login?id=signup" className="btn btn__primary">
                  Sign Up
                </Link>
                <Link href="/home" className="btn btn__primary btn__secondary">
                  Start browsing
                </Link>
              </div>
              {!pageData ? (
                 <div className={styles.uspContainer}>
                 <div className={styles.uspGrid}>
                     <div className={styles.uspItem}>
                       <span className={styles.uspIcon}>
                       🎭
                       </span>
                       <h3 className={styles.uspTitle}>
                         Event Discovery
                       </h3>
                       <p className={styles.uspDescription}>
                        Discover events tailored to your interests.
                       </p>
                     </div>
                     <div className={styles.uspItem}>
                       <span className={styles.uspIcon}>
                       💸
                       </span>
                       <h3 className={styles.uspTitle}>
                       Cost-Effective
                       </h3>
                       <p className={styles.uspDescription}>
                       Most events are free or low-cost. Money shouldn&apos;the reason for staying in and couch slouching.
                       </p>
                     </div>
                     <div className={styles.uspItem}>
                       <span className={styles.uspIcon}>
                       🌍
                       </span>
                       <h3 className={styles.uspTitle}>
                       Expand your personal and professional circles
                       </h3>
                       <p className={styles.uspDescription}>
                        Meet people who share your passions and interests.
                       </p>
                     </div>
                 </div>
               </div>
              ) : null
                }
              {pageData?.cardsRepeater ? (
                  <div className={styles.uspContainer}>
                    <div className={styles.uspGrid}>
                      {pageData.cardsRepeater.map((card, index) => (
                        <div key={card.id || index} className={styles.uspItem}>
                          {card.icon ? 
                          <span className={styles.uspIcon}>
                            {card.icon}
                          </span>
                          : null}
                          <h3 className={styles.uspTitle}>
                            {card.title}
                          </h3>
                          <p className={styles.uspDescription}>
                            {card.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
            </div>
            <div className={styles.heroSection__side}>
              <Image
                src={placehold_image} // Placeholder image,  
                unoptimized
                alt="Hero image"
                width={500}
                height={500}
                className={styles.heroSection__img}
              />
            </div>
          </section>
        </main>
      </div>
    </>
  );
}




