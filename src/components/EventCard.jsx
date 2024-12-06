import React from 'react'
import styles from './EventCard.module.css'
import { LocateIcon } from 'lucide-react';
import Link from 'next/link';
import classNames from 'classnames';

function EventCard({ event}) {
  return (
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
        <Link 
         href={`/event/${event.id}`}
        className={classNames(styles.eventsCard__link, styles.btn__primary)}
        >
          Read more
        </Link>
        <Link href={event.ticket_link ? event.ticket_link : "#"} className={classNames(styles.eventsCard__link, styles.btn__primary)}>
          Get tickets
        </Link>
      </div>
    </li>
  )
}

export default EventCard