import React from 'react'
import styles from './EventCard.module.css'
import { ArrowUpCircleIcon, LocateIcon } from 'lucide-react';
import Link from 'next/link';
import classNames from 'classnames';
import AlertDialog from './AlertDialog';
import AlertModal from './AlertDialog';
import { createClient } from '@/utils/supabase/component';
import Image from 'next/image';
import { format } from 'date-fns';


function EventCard({ event, getCategoryNameById, isProfilePage, onDelete, onEdit }) {
  const supabase = createClient();  

  const handleEdit = () => {
    onEdit(event.id);
  }

  const handleDelete = async () => {
    console.log('Delete event called')
    try {
      const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', event.id);

      if (error) {
        console.error('Error deleting event:', error.message);
        alert('Error deleting event: ' + error.message);
        return;
      }

      onDelete(event.id);
    } catch(error) {
      console.error('Unexpected error:', error);
      alert('Unexpected error: ' + error.message);
    }
  }

  const formatTime = (timeString) => {
    return format(new Date(timeString), 'HH:mm');
  };

  return (
    <li 
    key={event.id}
    className={styles.eventsCard}
    >
    <Link href={`/event/${event.id}`} className={styles.eventCard__link}>
      <div className={styles.eventsCard_media}>
      {event?.images.length ?
       event.images.map((image) => (
            <Image
              key={image.id}
              width={1200}
              height={600}
              src={image.public_url}
              alt={`Event ${event.title} image`}
            />
      ))
      :
          <Image 
          key={event.id}
          width={1200}
          height={600}
          src={"https://placehold.co/1200x600/EEE/31343C"} 
          alt={`Event ${event.title} image`} 
          />

        }
         <div className={styles.eventsCard__categories}>
          <span className={`${styles.eventsCard__label} txt-medium`}>{getCategoryNameById(event.category_id)}</span>
        </div>
      </div>
      <div className={styles.eventsCard__info}>
        {
          !isProfilePage ?
          <>
          <div className={styles.left}>
            <h4 className='txt-medium'>{event.title}</h4>
            <p className={`${styles.eventCard__date} txt-small`}>{format(event.start_time,'eee, MMMM d ')} {formatTime(event.start_time)} - {formatTime(event.end_time)}</p>
          </div>
          <div className={styles.right}>
            <ArrowUpCircleIcon size={32} className={styles.eventCard__icon} />
          </div>
          </>
          :
            <div className={styles.eventCard__actions}>
               <h4 className='txt-medium'>{event.title}</h4>
               <p className={`${styles.eventCard__date} txt-small`}>{format(event.start_time,'eee, MMMM d ')} {formatTime(event.start_time)} - {formatTime(event.end_time)}</p>
               <div className={styles.buttons}>
                <button onClick={handleEdit} className={`${styles.btn__edit} btn__primary`}>Edit</button>
                <AlertModal handleDelete={handleDelete} eventId={event.id}/>
               </div>
            </div>

        }

      </div>
      {/* <div className={styles.eventsCard__inner}>
        <h4 className={styles.eventsCard__title}>
          {event.title}
        </h4>
       
        <p className={styles.eventsCard__description}>
        {event.description.length > 50 ? `${event.description.slice(0, 50)}...` : event.description}
        </p>
        <p className={styles.eventsCard__location}>
          <LocateIcon size={16} />
          {event.location}
        </p>
        {
          !isProfilePage &&
          <div className={styles.eventCard__links}>
            <Link 
            href={`/event/${event.id}`}
            className={`${styles.eventCard__link} btn__primary`}
            >
              Read more
            </Link>
            <Link href={event.ticket_link ? event.ticket_link : "#"} className={`${styles.eventCard__link} btn__primary`}>
              Get tickets
            </Link>
          </div>
        }
          {isProfilePage && (
            <div className={styles.eventCard__actions}>
              <button onClick={handleEdit} className={`${styles.btn__edit} btn__primary`}>Edit</button>
               <AlertModal handleDelete={handleDelete} eventId={event.id}/>
            </div>
      )}
      </div> */}
    </Link>
    </li>
  )
}

export default EventCard