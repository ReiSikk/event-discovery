import React from 'react'
import styles from '@/styles/OrganiserPage.module.css'
import Link from 'next/link';
import * as Accordion from "@radix-ui/react-accordion";
import classNames from 'classnames';
import { ChevronDownIcon } from "@radix-ui/react-icons";

export async function getServerSideProps() {
    const url = process.env.NEXT_PUBLIC_CMS_URL + 'for-organiser?populate=*'
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

function OrganiserPage({ pageData }) {
    console.log(pageData, "pageData");
    console.log(pageData?.faqRepeater[0], "faqRepeater");
  return (
    <>
    <header className={`${styles.hero} container`}>
        <div className={styles.heroSection__main}>
            <h1 className={styles.heroSection__title}>
            {pageData?.title}
            </h1>
            <p className={styles.heroSection__lead}>
            {pageData?.lead}
            </p>
            <Link href="/event/create" className="btn btn__primary btn__secondary">
                Create an event
            </Link>
        </div>
        <div className={styles.heroSection__side}>
            <img src={`http://localhost:1337${pageData?.hero_image.formats.large.url}`} alt={pageData?.title} className={styles.heroSection__image} />
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

export default OrganiserPage