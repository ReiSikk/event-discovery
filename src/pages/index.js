import Head from "next/head";
import Image from "next/image";
import localFont from "next/font/local";
import styles from "@/styles/Home.module.css";
import Script from "next/script";
import { supabase } from "@/utils/supabase/server-props";
import { useEffect, useState } from "react";
import SignUp from "@/components/LoginForm";
import SiteNav from "@/components/SiteNav";
import Link from "next/link";
import { ArrowTopRightIcon } from "@radix-ui/react-icons"
import placehold_image from '../../public/assets/landing_place.webp'


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function Home() {
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
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <SiteNav />
        <main className={styles.main}>
          <section className={`${styles.heroSection} ${styles.container}`}>
            <div className={styles.heroSection__main}>
              <h1 className={styles.heroSection__title}>Discover. Connect. Grow.</h1>
              <p className={styles.heroSection__text}>
              Leia is more than an event platform — it's your gateway to building genuine relationships. Whether you're seeking professional networking, friendship, or exciting experiences, we help you find your tribe.
              </p>
            <div className={styles.uspContainer}>
              <div className={styles.uspGrid}>
                <div className={styles.uspItem}>
                  <span className={styles.uspIcon}>🎭</span>
                  <h3 className={styles.uspTitle}>Event Discovery</h3>
                  <p className={styles.uspDescription}>Discover events tailored to your interests</p>
                </div>
                <div className={styles.uspItem}>
                  <span className={styles.uspIcon}>💸</span>
                  <h3 className={styles.uspTitle}>Cost-Effective</h3>
                  <p className={styles.uspDescription}>Most events are free or low-cost. Money shouldn't be the reason for staying in and couch slouching</p>
                </div>
                <div className={styles.uspItem}>
                  <span className={styles.uspIcon}>🌐</span>
                  <h3 className={styles.uspTitle}>Expand your personal and professional circles</h3>
                  <p className={styles.uspDescription}>Meet people who share your passions</p>
                </div>
              </div>
            </div>
            <div className={styles.heroSection__btns}>
                <Link href="/signup" className="btn__primary">
                Sign Up
                <ArrowTopRightIcon />
                </Link>
                <Link href="/login" className="btn__primary">
                Log In
                <ArrowTopRightIcon />
                </Link>
            </div>
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




