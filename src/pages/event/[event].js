import React from 'react'
import { createClient } from '@/utils/supabase/component'
import styles from './SingleEventPage.module.css'



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


function EventPage ({ event }) {
    console.log(event, "event")
if (!event) return <div>Loading...</div>

  return (
    <>
        <header className={styles.eventHeader}>
            <h1 className={styles.eventHeader__title}>{event.title}</h1>
            <img src={event.image} alt={event.title} className={styles.eventHeader__img} />
            <div className={styles.eventDetails}>
                <h2>Details</h2>
                <p className={styles.eventHeader__text}>{event.cost ? `Cost: ${event.cost}` : "The event is free" }</p>
                <p className={styles.eventHeader__text}>{event.description}</p>
            </div>
        </header>
        <main className={styles.eventMain}>
            <section>
            </section>
        </main>
    </>
  )
}

export default EventPage