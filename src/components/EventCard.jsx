import React from 'react'
import styles from './EventCard.module.css'
import { ArrowUpCircleIcon, CalendarClock } from 'lucide-react';
import Link from 'next/link';
import AlertModal from './AlertDialog';
import { createClient } from '@/utils/supabase/component';
import Image from 'next/image';
import { format } from 'date-fns';
import { useCategories } from '@/pages/api/context/categoriesProvider';
import { useEventLike } from '@/utils/eventLikeService';


function EventCard({ event, isProfilePage, onDelete, onEdit }) {
  const supabase = createClient();  
  const { likeCount, isLiked, toggleLike, isLoading } = useEventLike(event.id)
  const { categories } = useCategories();
  const category = categories.find((cat) => cat.id === event.category_id);
  const eventCategory = category ? category.name : 'No category';


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
    return format(new Date(timeString), 'HH:mm');
  };

  return (
    <li 
    key={event.id}
    className={styles.eventsCard}
    >
    <Link href={`/event/${event.id}`} className={styles.eventCard__link}>
      <div className={styles.eventsCard_media}>
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
               <div className={`${styles.eventCard__date} txt-small`}><CalendarClock size={16}/>{format(event.start_time,'eee, MMMM d ')} {formatTime(event.start_time)} - {formatTime(event.end_time)}</div>
               <div className={styles.buttons}>
                <button onClick={handleEdit} className={`${styles.btn__edit} btn__primary`}>Edit</button>
                <AlertModal handleDelete={handleDelete} eventId={event.id}/>
               </div>
            </div>

        }

      </div>
    </Link>
    </li>
  )
}

export default EventCard