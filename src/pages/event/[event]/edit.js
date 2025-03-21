import React, { useEffect } from 'react'
import EditEventForm from '@/components/forms/EditEventForm'
import { useAuth } from '@/pages/api/auth/authprovider'
import { useRouter } from 'next/router'
import { createClient } from '@/utils/supabase/component'
import Head from 'next/head'


export async function getServerSideProps({ params }) {
    const supabase = createClient()
    const eventId = params.event
    
    let { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single()
    return {
        props: {
            event: event || {},
        },
    };
}

function EditEventPage({ event }) {
  const { session } = useAuth()
  const router = useRouter()


  useEffect(() => {
    if (!session) {
      router.push('/login')
    }
  }
, [session, router])


  return (
    <>
      <Head>
        <title>Leia App - Find social activities & Create your own</title>
        <meta name="description" content="Welcome to Events Discovery" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className='container block'>
          <header className='editEvent__header container'>
              <h1>Make changes to your event</h1>
          </header>
          <EditEventForm  eventToEdit={event} session={session} />
      </section>
    </>
  )
}

export default EditEventPage