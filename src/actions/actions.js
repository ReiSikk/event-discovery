"use server"

import { createClient } from '@/utils/supabase/component'
import { revalidatePath } from 'next/cache'

export async function createEvent(session, formData) {
    const supabase = createClient()
    const userId = session.user.id

    try {
        const eventData = {
            title: formData.get('title'),
            description: formData.get('description'),
            start_time: formData.get('start_time'),
            end_time: formData.get('end_time'),
            cost: formData.get('cost') === '' ? null : parseFloat(formData.get('cost')),
            location: formData.get('location'),
            category_id: formData.get('category'),
            ticket_link: formData.get('ticket_link'),
        }
        console.log(eventData, "eventData before inserting")


        const { data: eventInsertData, error: insertError } = await supabase
            .from('events')
            .insert(eventData)
            .select()
            .single()

        if (insertError) {
            console.error('Insert error:', insertError)
            throw new Error('Failed to create event. Please try again.')
        }

        // Handle image upload
        const file = formData.get('event_image')
        
        if (file && file.size > 0) {
            // Generate unique filename
            const fileExt = file.name.split('.').pop()
            const fileName = `${eventInsertData.id}_${Date.now()}.${fileExt}`
            const filePath = `${userId}/${fileName}`
            console.log(filePath, "filePath")

            // Upload to Supabase storage
            const { data, error: uploadError } = await supabase.storage
                .from('event-images')
                .upload(filePath, file)
            
                if(data) {
                    console.log("data", data)
                } else {
                    console.log("upload error in line 52", uploadError)
                }

            // Insert image record in event_images table
            const { error: imageError } = await supabase
            .from('event_images')
            .insert({
                event_id: eventInsertData.id,
                user_id: userId,
                image_path: filePath,
                is_primary: true,
            })

        if (imageError) {
            console.error('Image record insert error:', imageError)
            throw imageError
        }
        }

        return {
            success: true,
            message: 'Event created successfully',
            data: eventInsertData
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