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

export async function createUser(previousState, formData) {
    const supabase = createClient();

    // Log all formData entries for debugging
    if (!formData || typeof formData.entries !== 'function') {
        console.error('Invalid formData:', formData);
        throw new Error('Invalid formData');
    }

    // Log all entries in formData
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    try {
        const userData = {
            email: formData.get('email')?.trim(), // Trim any whitespace
            password: formData.get('password')?.trim(), // Trim any whitespace
        };

        // Log the user data before sign up
        console.log('User data for sign up:', userData);

        // Check if email and password are valid
        if (!userData.email || !userData.password) {
            return {
                success: false,
                message: 'Email and password are required',
            }
        }

        // Step 1: Sign up the user
        const { user, error: signUpError } = await supabase.auth.signUp(userData);

        // Log the full error object for debugging
        if (signUpError) {
            console.error('Sign up error:', signUpError);
            throw new Error('Failed to create user. Please try again.');
        }

        // Check if user is created successfully
        if (!user) {
            throw new Error('User creation failed. No user object returned.');
        }

        // Step 2: Insert the profile
        const profileData = {
            id: user.id, // Use the user's ID from the sign-up response
            email: userData.email, // Ensure this is set correctly
            // Add other profile fields as necessary
        };

        // Log the profile data before inserting
        console.log('Profile data for insertion:', profileData);

        const { data, error: insertError } = await supabase
            .from('profiles')
            .insert([profileData])
            .select()
            .single();

        if (insertError) {
            console.error('Insert error:', insertError.message);
            throw new Error('Failed to create profile. Please try again.');
        }

        return {
            success: true,
            message: 'User created successfully',
            data: data,
        };

    } catch (error) {
        console.error('Form submission error:', error);
        return { 
            success: false, 
            message: error.message 
        };
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