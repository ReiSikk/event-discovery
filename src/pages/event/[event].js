import React from 'react'
import { createClient } from '@/utils/supabase/component'
import styles from './SingleEventPage.module.css'
import classNames from 'classnames'
import Image from 'next/image'
import { format } from 'date-fns';
import { CalendarClock, MapPin, MapPinnedIcon, TicketIcon, Tickets, UserCircle2, XCircle, Heart } from 'lucide-react'
import EventSwiper from '@/components/swipers/EventSwiper'
import Link from 'next/link'
import { useCategories } from '@/pages/api/context/categoriesProvider';
import { useEventLike } from '@/utils/eventLikeService';
import { useAuth } from '../api/auth/authprovider'
import Head from 'next/head'
import Map from '@/components/Map'


export async function getServerSideProps({ params }) {
  const supabase = createClient();
  const eventId = params.event;

  // Fetch the main event
  let { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (error) {
    console.error('Error fetching event:', error);
    return {
      notFound: true,
    };
  }

  // Fetch event images
  const { data: images, error: imagesError } = await supabase
    .from('event_images')
    .select('*')
    .eq('event_id', eventId)
    .order('is_primary', { ascending: false });

  if (imagesError) {
    console.error('Error fetching event images:', imagesError);
  }

  const imagesWithUrls = images.map((image) => ({
    ...image,
    public_url: supabase.storage
      .from('event-images')
      .getPublicUrl(image.image_path).data.publicUrl,
  }));

  const eventImgUrls = imagesWithUrls.map((image) => image.public_url);

  // Fetch related events
  const { data: relatedEvents, error: relatedError } = await supabase
    .from('events')
    .select('*')
    .eq('category_id', event.category_id)
    .neq('id', eventId)
    .limit(10)
    .order('created_at', { ascending: false });

  if (relatedError) {
    console.error('Error fetching related events:', relatedError);
  }

  // Fetch images for related events using `.in()`
  const relatedEventIds = relatedEvents.map((event) => event.id);

  const { data: relatedImages, error: relatedImagesError } = await supabase
    .from('event_images')
    .select('*')
    .in('event_id', relatedEventIds) // Corrected to use `.in()`
    .order('is_primary', { ascending: false });

  if (relatedImagesError) {
    console.error('Error fetching related event images:', relatedImagesError);
  }

  // Generate public URLs for related event images correctly
  const relatedImagesWithUrls = relatedImages.map((image) => ({
    ...image,
    public_url: supabase.storage
      .from('event-images')
      .getPublicUrl(image.image_path).data.publicUrl,
  }));

  // Create a mapping from event_id to its image URLs
  const imagesByEventId = relatedImagesWithUrls.reduce((acc, image) => {
    if (!acc[image.event_id]) {
      acc[image.event_id] = [];
    }
    acc[image.event_id].push(image.public_url);
    return acc;
  }, {});



  // Enrich related events with category names and their specific images
  const enrichedRelatedEvents = relatedEvents.map((relatedEvent) => ({
    ...relatedEvent,
    images: imagesByEventId[relatedEvent.id] || [], // Assign images specific to each related event
  }));

  // Enrich the main event
  const fullyEnrichedEvent = {
    ...event,
    images: imagesWithUrls.map((img) => img.public_url) || [],
  };

  return {
    props: {
      event: fullyEnrichedEvent,
      relatedEvents: enrichedRelatedEvents || [],
      eventImgUrls: eventImgUrls || [],
    },
  };
}


function EventPage ({ event, relatedEvents, eventImgUrls }) {
  const { session } = useAuth();
  const { likeCount, isLiked, toggleLike, isProcessing } = useEventLike(event.id)
  const { categories } = useCategories();
  const category = categories.find((cat) => cat.id === event.category_id);

  const formatTime = (timeString) => {
    return format(new Date(timeString), 'HH:mm');
  };



if (!event) return <div className="center">Loading...</div>

  return (
    <>
     <Head>
        <title>Leia App - Find social activities & Create your own</title>
        <meta name="description" content="Welcome to Events Discovery" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <header className={styles.eventHeader}>
          <div className={`${styles.eventHeader__wrap} container`}>
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
            <section className={`${styles.eventContent} container`}>
              <div className={styles.contentLeft}>
                <div className={styles.contentLeft__top}>
                  <h1 className={styles.contentLeft__title}>{event.title}</h1>
                  {category && 
                  <div className={styles.contentLeft__cats}>
                      <span key={category.id} className={`${styles.contentLeft__label} txt-medium`}>
                        {category.name}
                      </span>
                      {
                        session?.user &&
                        <button
                        className="like__btn" 
                        onClick={toggleLike}
                        disabled={isProcessing}
                        >
                          <Heart size={24}  fill={isLiked ? '#ff5745' : 'none'} className={styles.eventCard__like} />
                          {isLiked ? <span>Remove</span> : <span>Like</span>}
                        </button>
                      }
                      {
                        !session?.user &&
                         <Link
                         href='/login'
                        className="like__btn" 
                        >
                          <Heart size={24}  fill={isLiked ? '#ff5745' : 'none'} className={styles.eventCard__like} />
                          <span>Sign in to like</span>
                        </Link>
                      }

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
                <div className={styles.contentRightMap}>
                {/* <Image src={"https://placehold.co/350x500/EEE/31343C"} width={350} height={500} alt={event.title} /> */}
                <Map />
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
                    <Link href={'/home'} className='btn__primary'>Browse all events</Link>
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