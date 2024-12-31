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
                  <SwiperSlide key={event.id}>
                    <EventCard event={event}/>
                  </SwiperSlide>
        ))}
        </Swiper>
  )
}

export default EventSwiper