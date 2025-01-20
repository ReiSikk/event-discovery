import React from 'react'
import styles from '@/styles/OrganiserPage.module.css'
import Link from 'next/link';
import * as Accordion from "@radix-ui/react-accordion";
import classNames from 'classnames';
import { ChevronDownIcon } from "@radix-ui/react-icons";
import Image from 'next/image';
import Head from 'next/head';

export async function getServerSideProps() {
    const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL + 'for-organiser?populate=*'
    const CMS_TOKEN = process.env.NEXT_PUBLIC_CMS_READ_TOKEN;
  
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

function OrganiserPage({ pageData }) {
  return (
    <>
     <Head>
        <title>Leia App - Find social activities & Create your own</title>
        <meta name="description" content="Welcome to Events Discovery" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <header className={`${styles.hero} container`}>
        <div className={styles.heroSection__main}>
            <h1 className={styles.heroSection__title}>
            {pageData ? pageData?.title : 'Make your event ideas come to life.'}
            </h1>
            <p className={styles.heroSection__lead}>
            {pageData ? pageData?.lead : 'Leia is more than an event platform — it\'s a place where communities are formed, friends are made and experiences are lived.'}
            </p>
            <Link href="/event/create" className="btn btn__primary btn__secondary">
                Create an event
            </Link>
        </div>
        <div className={styles.heroSection__side}>
          {pageData?.hero_image &&
            <Image src={`${pageData?.hero_image.formats.large.url}`} alt={pageData?.title} className={styles.heroSection__image} width={1200} height={800} />
          }
        </div>
    </header>
    <main>
        {pageData?.faqRepeater &&
            <section className={`${styles.faqSection} container`}>
            <h2>FAQ</h2>
            <Accordion.Root
            className={styles.Root}
            type="multiple"
            collapsible
        >
            {pageData.faqRepeater.map((faq, index) => (
                <>
                <Accordion.Item 
                className={styles.Item} 
                key={index}
                value={faq.id}
                >
                    <AccordionTrigger>{faq.title}</AccordionTrigger>
                    <AccordionContent>
                        {faq.text}
                    </AccordionContent>
                </Accordion.Item>
                </>
               ))}
        </Accordion.Root>
        </section>
        }
    </main>
    </>
  )
}

const AccordionTrigger = React.forwardRef(
	({ children, className, ...props }, forwardedRef) => (
		<Accordion.Header className={styles.Header}>
			<Accordion.Trigger
				className={classNames(styles.Trigger, className)}
				{...props}
				ref={forwardedRef}
			>
				{children}
				<ChevronDownIcon className={styles.Chevron} aria-hidden />
			</Accordion.Trigger>
		</Accordion.Header>
	),
);
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = React.forwardRef(
	({ children, className, ...props }, forwardedRef) => (
		<Accordion.Content
			className={classNames(styles.Content, className)}
			{...props}
			ref={forwardedRef}
		>
			<div className={styles.ContentText}>{children}</div>
		</Accordion.Content>
	),
);
AccordionContent.displayName = 'AccordionContent';

export default OrganiserPage