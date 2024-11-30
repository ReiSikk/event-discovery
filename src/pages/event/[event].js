import React from 'react'
import { createClient } from '@/utils/supabase/component'



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
if (!event) return <div>Loading...</div>

  return (
    <h1>{event.title}</h1>
  )
}

export default EventPage