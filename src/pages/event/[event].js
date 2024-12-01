import React from 'react'
import { createClient } from '@/utils/supabase/component'
import styles from './SingleEventPage.module.css'
import classNames from 'classnames'
import placehold_image from '../../../public/assets/landing_place.webp'
import Image from 'next/image'
import { format } from 'date-fns';


export async function getServerSideProps({ params }) {
    const supabase = createClient()
    const eventId = params.event
    console.log(eventId, "id of event")
    
    let { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single()
    

      return {
        props: {
            event
        },
      };
    } 


  const formatTime = (timeString) => {
      return format(new Date(timeString), 'HH:mm');
    };

function EventPage ({ event }) {
    console.log(event, "event")
if (!event) return <div>Loading...</div>

  return (
    <>
        <header className={styles.eventHeader}>
          <div className={classNames(styles.eventHeader__wrap, styles.container)}>
            <div className={styles.eventHeader__media}>
              <Image src={placehold_image} alt={event.title} className={styles.eventHeader__img} />
              <div className={styles.eventHeader__meta}>
                <p className={styles.eventHeader__date}>December 12th, Thursday</p>
                <p className={styles.eventHeader_time}>
                {formatTime(event.start_time)} until {formatTime(event.end_time)}
                </p>
                <p className={styles.eventHeader__location}>{event.location}</p>
                <div className={styles.eventHeader__gradient}>

                </div>
              </div>
            </div>
          </div>
        </header>
        <main className={styles.eventMain}>
            <section>
            {/* <h1 className={styles.eventHeader__title}>{event.title}</h1>
            <img src={event.image} alt={event.title} className={styles.eventHeader__img} />
            <div className={styles.eventDetails}>
                <h2>Details</h2>
                <p className={styles.eventHeader__text}>{event.cost ? `Cost: ${event.cost}` : "The event is free" }</p>
                <p className={styles.eventHeader__text}>{event.description}</p>
            </div> */}
            </section>
        </main>
    </>
  )
}

export default EventPage