import { createClient } from '@/utils/supabase/component'
import styles from './CreateEventPage.module.css'
import EventForm from '@/components/forms/EventForm'
import { useState, useEffect } from 'react'
import EventCard from '@/components/EventCard'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import { useAuth } from '@/pages/api/auth/authprovider'
import Link from 'next/link'


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
  const [submitted, setSubmitted] = useState(false)
  const supabase = createClient()
  const router = useRouter();
  const { isLoggedIn, session } = useAuth()

  const refreshEvents = async () => {
    const { data: updatedEvents } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
    
    setEvents(updatedEvents)
    setSubmitted(true)
    setTimeout(() => {
      router.push('/home')
    }, 2000)
  }
  
  return (
    <>
    {isLoggedIn ? (
       <main className={classNames(styles.main, styles.container)}>
       <h1>Create your event here</h1>
         <section className={styles.formSection}>
           <div className={styles.formProgress}>
             <h3>Side content here</h3>
           </div>
           <div className={styles.formSection__main}>
             <EventForm onSuccess={refreshEvents} session={session}/>
           </div>
         {submitted && <div className={styles.feedbackToast}>Event created successfully. Redirecting to home...</div>}
         </section>
       </main>
    )
    : (
      <main className={classNames(styles.mainError, styles.container)}>
        <h3>Whoops! You need to be logged in to publish events</h3>
        <p>Please sign in or create a profile to continue.</p>
        <div className="buttons__flex">
          <Link href="/login?id=login" className="btn btn__primary">
            Sign In
          </Link>
          <Link href="/login?id=signup" className="btn btn__primary btn__secondary">
            Sign Up
          </Link>
        </div>
      </main>
    )
    }
    </>
   
  )
}