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
    completedSteps: [],
    steps: [
      { id: 'basicDetails', title: 'Basic Details', description: 'Provide event name, description, and location' },
      { id: 'dateTime', title: 'Date & Time', description: 'Select start and end times for your event' },
      { id: 'eventDetails', title: 'Event Details', description: 'Choose category and set event cost' },
      { id: 'imageUpload', title: 'Image Upload', description: 'Add an eye-catching image for your event' },
      { id: 'ticketing', title: 'Ticketing', description: 'Define ticket type and additional details' }
    ]
  })



    // Handle form navigation
    const [formStep, setFormStep] = useState(0);

    const handleNext = () => {
      if (formStep < 4) {
        setFormStep(prev => prev + 1)
        setEventProgress(prev => {
          return {
            ...prev,
            completedSteps: [...prev.completedSteps, prev.steps[formStep].id]
          }
        }
        )
      } 
    }
    const handlePrevious = () => {
      if (formStep > 0) {
        setFormStep(prev => prev - 1)
        setEventProgress(prev => {
          return {
            ...prev,
            completedSteps: prev.completedSteps.filter(step => step !== prev.steps[formStep].id)
          }
        }
        )
      }
    }


  return (
    <>
      {isLoggedIn ? (
        <main className={`${styles.main} container`}>
          <section className={styles.formSection}>
            <ProgressSteps formStep={formStep} eventProgress={eventProgress} />
            <div className={styles.formSection__main}>
              <EventForm 
              session={session} 
              formStep={formStep}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              />
            </div>
            {submitted && <div className={styles.feedbackToast}>Event created successfully. Redirecting to home...</div>}
          </section>
        </main>
      ) : (
        <main className={`${styles.mainError} container`}>
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