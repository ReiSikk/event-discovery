import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Script from "next/script";
import { supabase } from "@/utils/supabase/server-props";
import { useEffect, useState } from "react";
import Link from "next/link";
import placehold_image from '../../public/assets/landing_place.webp'


export async function getServerSideProps() {
  const url = process.env.NEXT_PUBLIC_CMS_URL + 'landing?populate=*'
  console.log(url, "url");
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


export default function Home({ pageData, error}) {
  const [data, setData] = useState([])

  useEffect(() => {

    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select()
  
        if (error) throw error
        setData(data)
        console.log(data,"Data")
      } catch (error) {
        console.log(error.message)
      } finally {
        console.log("done")
      }
    }

      fetchEvents()
  }, [])
  return (
    <>
      <Head>
        <title>Leia App - Find social activities & Create your own</title>
        <meta name="description" content="Welcome to Events Discovery" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      </Head>
      <div
      >
        <main className={styles.main}>
          <section className={`${styles.heroSection} ${styles.container}`}>
            <div className={styles.heroSection__main}>
              <h1 className={styles.heroSection__title}>
                {pageData.title}
              </h1>
              <p className={styles.heroSection__text}>
                {pageData.lead}
              </p>
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




