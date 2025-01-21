import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade } from 'swiper/modules';
import './EventSwiper.module.css'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import EventCard from '../EventCard';

function EventSwiper({ relatedEvents }) {
  return (
    <Swiper
        slidesPerView={1.2}
        spaceBetween={12}
        breakpoints={{
          625: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          899: {
            slidesPerView: 3,
          },
          1260: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
        className="eventSwiper"
        modules={[Navigation]}
        navigation
        >
        {relatedEvents.map((event) => (
                  <SwiperSlide key={event.id} className='eventSwiper__slide'>
                    <EventCard event={event} isSwiperCard/>
                  </SwiperSlide>
        ))}
    </Swiper>
  )
}

export default EventSwiper