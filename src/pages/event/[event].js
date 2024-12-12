import React from 'react'
import { createClient } from '@/utils/supabase/component'
import styles from './SingleEventPage.module.css'
import classNames from 'classnames'
import placehold_image from '../../../public/assets/landing_place.webp'
import Image from 'next/image'
import { format } from 'date-fns';
import { CalendarClock, MapPin, TicketIcon } from 'lucide-react'
import EventSwiper from '@/components/swipers/EventSwiper'


export async function getServerSideProps({ params }) {
    const supabase = createClient()
    const eventId = params.event
    
    let { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single()

    // Related events
    const { data: relatedEvents, error: relatedError } = await supabase
    .from('events')
    .select('*')
    .eq('category_id', event.category_id)
    .neq('id', eventId)
    .limit(10)
    .order('created_at', { ascending: false })

      // Fetch category data
      let { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError)
        return {
          notFound: true,
        }
      }

        // Match category ID with event's category ID
      const eventCategory = categories.find(category => category.id === event.category_id)
    

      return {
        props: {
            event,
            relatedEvents: relatedEvents || [],
            category: eventCategory || null,
        },
      };
    } 


const formatTime = (timeString) => {
      return format(new Date(timeString), 'HH:mm');
    };

function EventPage ({ event, relatedEvents, category }) {
  console.log(event)
if (!event) return <div>Loading...</div>

  return (
    <>
        <header className={styles.eventHeader}>
          <div className={classNames(styles.eventHeader__wrap, styles.container)}>
            <div className={styles.eventHeader__media}>
              <Image src={"https://placehold.co/1200x600/EEE/31343C"} width={1200} height={600} alt={event.title} className={styles.eventHeader__img} />
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
                <div className={styles.contentLeft__top}>
                  <h1 className={styles.contentLeft__title}>{event.title}</h1>
                  {category && 
                  <div className={styles.contentLeft__cats}>
                      <span key={category.id} className={`${styles.contentLeft__label} txt-medium`}>
                        {category.name}
                      </span>
                      <div className={`${styles.contentLeft__cost} txt-medium`}>
                          <TicketIcon size={24} />
                          <p>
                          {event.cost ? `Cost: ${event.cost}` : "This event is free" }    
                          </p>
                      </div>
                  </div>
                }
                </div>
                <div className={styles.contentLeft__main}>
                  <p className={styles.contentLeft__location}></p>
                  <p className={styles.contentLeft__text}>{event.description}</p>
                </div>
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
                    <p className={styles.contentStats__lead}>Off our entire brunch menu for attendees</p>
                    <p className={styles.contentStats__text}>Some text describing the offer here</p>
                  </div>
                </div>
              </div>
            </section>
            {relatedEvents?.length > 0 && (
              <section className={`${styles.recommendedSection} container block`}>
                <div className={styles.recommendedSection__wrap}>
                  <div className={`${styles.recommendedSection__top} fp`}>
                    <h2 className={styles.recommendedSection__title}>
                      Explore similar events
                    </h2>
                    <div className='btn btn__primary'>See all events</div>
                  </div>
                  <div className={styles.swiperWrap}>
                    <EventSwiper relatedEvents={relatedEvents}/>
                  </div>
                </div>
              </section>
            )}
        </main>
    </>
  )
}

export default EventPage