import React from 'react'
import styles from './EventSwiper.module.css'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import classNames from 'classnames'
import Image from 'next/image';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import EventCard from '../EventCard';

function EventSwiper({ relatedEvents }) {
  return (
    <Swiper
        spaceBetween={24}
        slidesPerView={3}
        className="eventSwiper"
        modules={[Navigation]}
        navigation
        >
        {relatedEvents.map((event) => (
                  <SwiperSlide>
                    <EventCard event={event} />
                  {/* <div className={styles.eventSlide}>
                      <Image 
                      src={event.images.length > 0 ? event.images[0] : 'https://placehold.co/800x699/EEE/31343C'} 
                      width={400} 
                      height={350} 
                      alt={event.title} 
                      className={styles.eventSlide__img} 
                      />
                      <div className={styles.eventSlide__main}>
                      <h3 className={styles.eventSlide__title}>{event.title}</h3>
                      <p className={styles.eventSlide__text}>{event.description}</p>
                      </div>
                      <Link 
                          href={`/event/${event.id}`}
                          className={classNames(styles.eventCard__link, styles.btn__primary)}
                          >
                          Read more
                      </Link>
                  </div> */}
                  </SwiperSlide>
        ))}
        </Swiper>
  )
}

export default EventSwiper