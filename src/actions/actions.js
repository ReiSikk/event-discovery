"use server"

import { createClient } from '@/utils/supabase/component'

export async function createEvent(previousState, formData) {
    const supabase = createClient()
    

    try {
        const eventData = {
            title: formData.get('title'),
            description: formData.get('description'),
            location: formData.get('location'),
            start_time: formData.get('start_time'),
            end_time: formData.get('end_time'),
            category: formData.get('category'),
        }

        const { data, error: insertError } = await supabase
            .from('events')
            .insert(eventData)
            .select()
            .single()

        if (insertError) {
            console.error('Insert error:', insertError)
            throw new Error('Failed to create event. Please try again.')
        }

        return {
            success: true,
            message: 'Event created successfully',
            data: data
        }

    } catch (error) {
        console.error('Form submission error:', error)
        return { 
            success: false, 
            message: error.message 
        }
    }
    

}