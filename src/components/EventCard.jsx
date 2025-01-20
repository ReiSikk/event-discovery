import React from 'react'
import styles from './EventCard.module.css'
import { ArrowUpCircleIcon, CalendarClock } from 'lucide-react';
import Link from 'next/link';
import AlertModal from './modals/AlertDialog';
import { createClient } from '@/utils/supabase/component';
import Image from 'next/image';
import { format } from 'date-fns';
import { useCategories } from '@/pages/api/context/categoriesProvider';
import { useEventLike } from '@/utils/eventLikeService';
import { Heart } from 'lucide-react';


function EventCard({ event, isProfilePage, removeEventBtn, onDelete, onEdit }) {
  const supabase = createClient();  
  const { categories } = useCategories();
  const category = categories.find((cat) => cat.id === event.category_id);
  const eventCategory = category ? category.name : 'No category';

  // Event likes state
  const { likeCount, isLiked, toggleLike, isProcessing } = useEventLike(event.id);

  const handleEdit = () => {
    onEdit(event.id);
  }

  const handleDelete = async () => {
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
    const date = new Date(timeString);
    return format(date, date.getMinutes() === 0 ? 'h a' : 'h:mm a');
  };

  return (
    <li 
    key={event.id}
    className={`${styles.eventsCard} fp-col`}
    >
      {
        !isProfilePage ?
      <Link href={`/event/${event.id}`} className={styles.eventCard__link}>
        <div className={styles.eventsCard__media}>
        {event.images.length > 0 ?
              <Image
                key={event.id}
                width={1200}
                height={600}
                src={event.images[0]}
                alt={`Event ${event.title} image`}
              />
        :
            <Image 
            key={event.id}
            width={1200}
            height={600}
            src={"https://placehold.co/1200x600/EEE/31343C"} 
            alt={`Event ${event.title} image`} 
            />

          }
          {
            eventCategory && 
          <div className={styles.eventsCard__categories}>
            <span className={`${styles.eventsCard__label} txt-medium`}>
              {eventCategory}
              </span>
          </div>
          }
        </div>
        <div className={styles.eventsCard__info}>
            <div className={styles.left}>
              <h4 className='txt-medium'>{event.title}</h4>
              <div className={`${styles.eventCard__date} txt-medium`}><CalendarClock size={16}/>{format(event.start_time,'eee, MMM d ')} {formatTime(event.start_time)} - {formatTime(event.end_time)}</div>
            </div>
            <div className={styles.right}>
              <ArrowUpCircleIcon size={32} className={styles.eventCard__icon} />
            </div>
        </div>
      </Link>
      : 
      <>
      <div className={styles.eventsCard__media}>
      {event.images.length > 0 ?
            <Image
              key={event.id}
              width={1200}
              height={600}
              src={event.images[0]}
              alt={`Event ${event.title} image`}
            />
      :
          <Image 
          key={event.id}
          width={1200}
          height={600}
          src={"https://placehold.co/1200x600/EEE/31343C"} 
          alt={`Event ${event.title} image`} 
          />

        }
        {
          eventCategory && 
        <div className={styles.eventsCard__categories}>
          <span className={`${styles.eventsCard__label} txt-medium`}>
            {eventCategory}
            </span>
        </div>
        }
      </div>
      <div className={styles.eventsCard__info}>
      <div className={styles.eventCard__actions}>
      <h4 className='txt-medium'>{event.title}</h4>
      <div className={`${styles.eventCard__date} txt-small`}><CalendarClock size={16}/>{format(event.start_time,'eee, MMMM d ')} {formatTime(event.start_time)} - {formatTime(event.end_time)}</div>
        {
          isProfilePage && !removeEventBtn &&
          <div className={styles.buttons}>
          <button onClick={handleEdit} className={`${styles.btn__edit} btn__primary`}>Edit</button>
          <AlertModal handleDelete={handleDelete} eventId={event.id}/>
        </div>
        }
        </div>
      {/* {
        removeEventBtn && isProfilePage &&
        <div className={styles.buttons}>
        <button className="like__btn" onClick={toggleLike} disabled={isProcessing}>
            <Heart size={24} fill={isLiked ? "#ff5745" : "none"} className={styles.eventCard__like} />
            {isLiked ? <span>Remove</span> : <span>Like</span>}
          </button>
        </div>
      } */}
      </div>
      </>
      }
    </li>
  )
}

export default EventCard