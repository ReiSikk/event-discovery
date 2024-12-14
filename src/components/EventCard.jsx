import React from 'react'
import styles from './EventCard.module.css'
import { LocateIcon } from 'lucide-react';
import Link from 'next/link';
import classNames from 'classnames';

function EventCard({ event, getCategoryNameById, isProfilePage }) {

  const handleEdit = () => {
    console.log('Edit event')
  }

  const handleDelete = () => {
    console.log('Delete event')
  }

  return (
    <li 
    key={event.id}
    className={styles.eventsCard}
    >
      <div className={styles.eventsCard_media}>
      {event?.images && event.images.map((image) => (
              <img
                key={image.id}
                src={image.public_url}
                alt={`Event ${event.title} image`}
              />
            ))}
      </div>
      <div className={styles.eventsCard__inner}>
        <h4 className={styles.eventsCard__title}>
          {event.title}
        </h4>
        <div className={styles.eventsCard__categories}>
          <span className={`${styles.eventsCard__label} txt-medium`}>{getCategoryNameById(event.category_id)}</span>
        </div>
        <p className={styles.eventsCard__description}>
          {event.description}
        </p>
        <p className={styles.eventsCard__location}>
          <LocateIcon size={16} />
          {event.location}
        </p>
        {
          !isProfilePage &&
          <>
            <Link 
            href={`/event/${event.id}`}
            className={classNames(styles.eventsCard__link, styles.btn__primary)}
            >
              Read more
            </Link>
            <Link href={event.ticket_link ? event.ticket_link : "#"} className={classNames(styles.eventsCard__link, styles.btn__primary)}>
              Get tickets
            </Link>
          </>
        }
          {isProfilePage && (
            <div className={styles.eventCard__actions}>
              <button onClick={handleEdit} className={`${styles.btn__edit} btn__primary`}>Edit</button>
              <button onClick={handleDelete} className={`${styles.btn__delete} btn__primary`}>Delete</button>
            </div>
      )}
      </div>
    </li>
  )
}

export default EventCard