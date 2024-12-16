import { createClient } from '@/utils/supabase/component'
import styles from './CreateEventPage.module.css'
import EventForm from '@/components/forms/EventForm'
import ProgressSteps from '@/components/ProgressSteps'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import Link from 'next/link'
import { useAuth } from '@/pages/api/auth/authprovider'

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
  const router = useRouter()
  const { isLoggedIn, session } = useAuth()
  const [eventProgress, setEventProgress] = useState({
    currentStep: 0,
    completedSteps: [],
    steps: [
      { id: 'basicDetails', title: 'Basic Details', description: 'Provide event name, description, and location' },
      { id: 'dateTime', title: 'Date & Time', description: 'Select start and end times for your event' },
      { id: 'eventDetails', title: 'Event Details', description: 'Choose category and set event cost' },
      { id: 'imageUpload', title: 'Image Upload', description: 'Add an eye-catching image for your event' },
      { id: 'ticketing', title: 'Ticketing', description: 'Define ticket type and additional details' }
    ]
  })

 
/*   const formRef = useRef(null)

  useEffect(() => {
    const sections = formRef.current.querySelectorAll('section')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = eventProgress.steps.findIndex(step => step.id === entry.target.id)
            setEventProgress(prev => ({ ...prev, currentStep: stepIndex }))
          }
        })
      },
      { threshold: 0.5 }
    )

    sections.forEach(section => observer.observe(section))

    return () => {
      sections.forEach(section => observer.unobserve(section))
    }
  }, [eventProgress.steps]) */

  return (
    <>
      {isLoggedIn ? (
        <main className={classNames(styles.main, styles.container)}>
          <section className={styles.formSection}>
            <ProgressSteps eventProgress={eventProgress} />
            <div className={styles.formSection__main}>
              <EventForm 
              session={session} 
              />
            </div>
            {submitted && <div className={styles.feedbackToast}>Event created successfully. Redirecting to home...</div>}
          </section>
        </main>
      ) : (
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
      )}
    </>
  )
}