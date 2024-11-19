import Head from "next/head";
import Image from "next/image";
import localFont from "next/font/local";
import styles from "@/styles/Home.module.css";
import Script from "next/script";
import { supabase } from "@/utils/supabase/server-props";
import { useEffect, useState } from "react";
import SignUp from "@/components/SignupForm";

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
        <title>Landing page</title>
        <meta name="description" content="Welcome to Events Discovery" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      </Head>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <main className={styles.main}>
          <section className="heroSection">
            <div className="heroSection__main">
              <h1 className="heroSection__title">Start exploring events!</h1>
              <p className="heroSection__text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.
              </p>
              <div className="stats">
                "Some stats will go here"
              </div>
              <div className="heroSection__btns">
                <h2>Sign up to get started</h2>
                <SignUp />
              </div>
            </div>
            <div className="heroSection__side">
              <Image
                src="https://placehold.co/600x400"
                unoptimized
                alt="Hero image"
                width={500}
                height={500}
              />
            </div>
          </section>
        </main>
      </div>
    </>
  );
}




