import { createClient } from '@/utils/supabase/component'
import styles from './CreateEventPage.module.css'
import EventForm from '@/components/forms/EventForm'
import { useState } from 'react'
import EventCard from '@/components/EventCard'
import { useRouter } from 'next/router'

export async function getServerSideProps() {
  const supabase = createClient()
  
  let { data: events, error } = await supabase
  .from('events')
  .select('*')


  return {
    props: {
      events: events || [],
    },
  };

}


export default function CreateEventPage({ events: initialEvents }) {
  const [events, setEvents] = useState(initialEvents)
  const supabase = createClient()
  const router = useRouter();

  const refreshEvents = async () => {
    const { data: updatedEvents } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
    
    setEvents(updatedEvents)
    setTimeout(() => {
      router.push('/home')
    }, 2000)
  }

  return (
    <>
      <h1>Create your event here</h1>
      <main className={styles.main}>
        <section className={styles.formSection}>
          <EventForm onSuccess={refreshEvents} />
        </section>
      </main>
    </>
   
  )
}