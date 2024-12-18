import React from 'react'
import { createClient } from '@/utils/supabase/component'
import styles from './SingleEventPage.module.css'
import classNames from 'classnames'
import Image from 'next/image'
import { format } from 'date-fns';
import { CalendarClock, MapPin, MapPinnedIcon, TicketIcon, Tickets, UserCircle2, XCircle } from 'lucide-react'
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
  console.log(event, "event");
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
              <div className={`${styles.eventHeader__meta} col-m-none`}>
                <p className={`${styles.eventHeader__date} h3`}>{format(event.start_time,'eee, MMMM d ')} {formatTime(event.start_time)} - {formatTime(event.end_time)}</p>
                <p className={`${styles.eventHeader__location} txt-medium`}>{event.location}</p>
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
                  </div>
                }
                </div>
                <div className={styles.contentLeft__main}>
                    <h3 className={styles.contentLeft__title}>About the event</h3>
                  <p className={styles.contentLeft__location}></p>
                    <p className={styles.contentLeft__text}>{event.description}</p>
                </div>
                <div className={styles.contentLeft__items}>
                  <div>
                    <h2 className={styles.contentRight__title}>
                      Date & Time
                    </h2>
                    <p className={styles.contentRight__subtitle}>{format(event.start_time,'eee, MMMM d ')} {formatTime(event.start_time)} - {formatTime(event.end_time)}</p>
                    <a href="#" className={styles.contentRight__link} >Mark in my calendar</a>
                  </div>
                  <div>
                  <h2 className={styles.contentRight__title}>
                      Event Location
                    </h2>
                    <p className={styles.contentRight__subtitle}>{event.location}</p>
                    <a href="#" className={styles.contentRight__link} >Show on the map</a>
                  </div>
                </div>
              </div>

              <div className={styles.contentRight}>
                <div className={`${styles.contentRight__cost} txt-medium`}>
                  <div className={styles.contentRight__cost_top}>
                    <h4>Ticket Price</h4>
                    {
                      event.cost ?
                      <p className={`${styles.contentRight__cost_price} h3`}>{event.cost} €</p> 
                      : 
                      <p className={`${styles.contentRight__cost_price} h3`}>Free</p>
                    }
                  </div>
                  <div className={styles.contentRight__cost_main}>
                    {event.cost && event.ticket_link &&
                      <a href={event.ticket_link} rel="noopener noreferrer" className="btn__primary">Get tickets</a>
                    }
                    {event.cost && !event.ticket_link &&
                     <span>Pay on site</span>
                    }
                    {event.cost === null || event.cost === 0 && event.ticket_link ?
                    <>
                      <span className={styles.free}>Free Entry</span>
                      <a href={event.ticket_link} 
                      rel="noopener noreferrer" className="btn__primary">Register</a>
                    </>
                    : null
                    }
                  </div>
                </div>
                <div className={classNames(styles.contentRight__organiser, styles.content__item)}>
                  <div className={styles.organiser}>
                    <UserCircle2 size={32} />
                    <p className={`${styles.title}`}>Blue Moon Events</p>
                  </div>
                  <ul className={styles.benefitsList}>
                    <li className={styles.benefitsList__item}>
                      <XCircle size={24} />
                      <div>
                        <p className={`${styles.title} txt-medium`}>Free Cancellation</p>
                        <p className={`${styles.text} txt-small`}>Cancel up to 24 hours in advance to receive a full refund</p>
                      </div>
                    </li>
                    <li className={styles.benefitsList__item}>
                      <Tickets size={24} />
                      <div>
                        <p className={`${styles.title} txt-medium`}>15% Discount</p>
                        <p className={`${styles.text} txt-small`}>Receive a discount on all organiser products</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className={classNames(styles.content__item, styles.contentRight__loc)}>
                <p className={`${styles.title} h4`}>Event Location</p>
                <div className={styles.contentRight__map}>
                <Image src={"https://placehold.co/350x500/EEE/31343C"} width={350} height={500} alt={event.title} />
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