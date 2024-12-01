import React from 'react'
import { createClient } from '@/utils/supabase/component'
import styles from './SingleEventPage.module.css'
import classNames from 'classnames'
import placehold_image from '../../../public/assets/landing_place.webp'
import Image from 'next/image'
import { format } from 'date-fns';
import { CalendarClock, MapPin } from 'lucide-react'


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
            <section className={classNames(styles.eventContent, styles.container)}>
              <div className={styles.contentLeft}>
                <p className={styles.contentLeft__lead}>What?</p>
                <h1 className={styles.contentLeft__title}>{event.title}</h1>
                <p className={styles.contentLeft__location}></p>
                <p className={styles.contentLeft__text}>{event.description}</p>
                <p className={styles.contentLeft__cost}>{event.cost ? `Cost: ${event.cost}` : "This event is free" }</p>
              </div>
              <div className={styles.contentRight}>
                <div className={styles.contentRight__top}>
                  <div className={styles.contentRight__item}>
                    <h3 className={styles.contentRight__title}><CalendarClock />Time & Date</h3>
                    <p className={styles.contentRight__subtitle}>December 12</p>
                    <p className={styles.contentRight__text}>2024</p>
                    <a href="#" className={styles.contentRight__link} >Mark in my calendar</a>
                  </div>
                  <div className={styles.contentRight__item}>
                    <h3 className={styles.contentRight__title}><MapPin />{event.location}</h3>
                    <p className={styles.contentRight__subtitle}>Name of the place</p>
                    <p className={styles.contentRight__text}>Exact address here</p>
                    <a href="#" className={styles.contentRight__link} >Show on the map</a>
                  </div>
                </div>
                <div className={styles.contentStats}>
                  <div className={styles.contentStats__top}>
                    <h3 className={styles.contentStats__title}>NB!</h3>
                    <p className={styles.contentStats__date}>A piece of important information for th event goers</p>
                  </div>
                  <div className={styles.contentStats__bottom}>
                    <h3 className={styles.contentStats__number}>15%</h3>
                    <h3 className={styles.contentStats__lead}>Off our entire brunch menu for attendees</h3>
                    <h3 className={styles.contentStats__text}>Some text describing the offer here</h3>
                  </div>
                </div>
              </div>
            </section>
        </main>
    </>
  )
}

export default EventPage