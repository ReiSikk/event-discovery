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


export async function editProfile(previousState, formData) {
    const supabase = createClient()
    

    try {
        const profileData = {
            email: formData.get('email'),
            password: formData.get('password'),
            phone_nr: formData.get('phone_nr'),
        }

        const { data, error: updateError } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', previousState.user.id)
            .select()
                      

        if (updateError) {
            console.error('Update error:', updateError)
            throw new Error('Failed to create event. Please try again.')
        }

        return {
            success: true,
            message: 'Profile edited successfully',
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