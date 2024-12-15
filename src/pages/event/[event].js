import React from 'react'
import { createClient } from '@/utils/supabase/component'
import styles from './SingleEventPage.module.css'
import classNames from 'classnames'
import placehold_image from '../../../public/assets/landing_place.webp'
import Image from 'next/image'
import { format } from 'date-fns';
import { CalendarClock, MapPin, TicketIcon } from 'lucide-react'
import EventSwiper from '@/components/swipers/EventSwiper'
import Link from 'next/link'


export async function getServerSideProps({ params }) {
    const supabase = createClient()
    const eventId = params.event
    
    let { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single()

    // Fetch event images
    const { data: images, error: imagesError } = await supabase
    .from('event_images')
    .select('*')
    .eq('event_id', eventId)
    .order('is_primary', { ascending: false });
    //get public url
    if (imagesError) {
      console.error('Error fetching event images:', imagesError)
    }
    const imagesWithUrls = await Promise.all(
      images.map(async (image) => ({
        ...image,
        public_url: supabase.storage
          .from('event-images')
          .getPublicUrl(image.image_path).data.publicUrl,
      }))
    );
    const eventImgUrls = imagesWithUrls.map(image => image.public_url)
    console.log(eventImgUrls, "eventImgUrls");

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
            eventImgUrls: eventImgUrls || [],
        },
      };
    } 


const formatTime = (timeString) => {
      return format(new Date(timeString), 'HH:mm');
    };

function EventPage ({ event, relatedEvents, category, eventImgUrls }) {
if (!event) return <div>Loading...</div>

  return (
    <>
        <header className={styles.eventHeader}>
          <div className={classNames(styles.eventHeader__wrap, styles.container)}>
            <div className={styles.eventHeader__media}>
              {eventImgUrls && eventImgUrls[0] ?
                <Image src={eventImgUrls[0]} width={1200} height={600} alt={event.title} className={styles.eventHeader__img} />
                : 
                <Image src={"https://placehold.co/1200x600/EEE/31343C"} width={1200} height={600} alt={event.title} className={styles.eventHeader__img} />
              }
              <div className={styles.eventHeader__meta}>
                <p className={styles.eventHeader__date}>{format(event.start_time,'eeee, MMMM d ')} {formatTime(event.start_time)} - {formatTime(event.end_time)}</p>
                <p className={`${styles.eventHeader__location} h4`}>{event.location}</p>
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
                          {event.cost ? `Cost: ${event.cost} €` : "Free" }    
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
                    <h4 className={styles.contentRight__title}><CalendarClock />Date & Time</h4>
                    <p className={styles.contentRight__subtitle}>{format(event.start_time,'eeee, MMMM d ')} {formatTime(event.start_time)} - {formatTime(event.end_time)}</p>
                    <a href="#" className={styles.contentRight__link} >Mark in my calendar</a>
                  </div>
                  <div className={styles.contentRight__item}>
                    <h4 className={styles.contentRight__title}><MapPin />{event.location}</h4>
                    <p className={styles.contentRight__subtitle}>Exact address here</p>
                    <a href="#" className={styles.contentRight__link} >Show on the map</a>
                  </div>
                </div>
                <div className={styles.contentMain}>
                  <div className={styles.contentMain__top}>
                    <h3 className={styles.contentMain__title}>About the event</h3>
                    <p className={styles.contentMain__text}>{event.description}</p>
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
                    <Link href={'/home'} className='btn btn__primary'>Browse all events</Link>
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