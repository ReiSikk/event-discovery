// src/utils/eventLikeService.js
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/component'
import { useAuth } from '@/pages/api/auth/authprovider'


// Service Functions
export async function addEventLike(userId, eventId) {
    const supabase = createClient();

    if (!userId) {
        console.error('No user ID provided')
        return { success: false, message: 'User not logged in' }
      }

    try {
        const { data, error } = await supabase
        .from('event_likes')
        .insert({ 
            user_id: userId, 
            event_id: eventId 
        })
        .select()

        if (error) {
        // Handle unique constraint violation
        if (error.code === '23505') {
            return { success: false, message: 'Already liked' }
        }
        throw error
        }

        return { 
        success: true, 
        like: data[0] 
        }
    } catch (error) {
        console.error('Error adding like:', error)
        throw error
    }
}

export async function removeEventLike(userId, eventId) {
    const supabase = createClient();

    if (!userId) {
        console.error('No user ID provided')
        return { success: false, message: 'User not authenticated' }
        }

    try {
        const { data, error } = await supabase
        .from('event_likes')
        .delete()
        .match({ 
            user_id: userId, 
            event_id: eventId 
        })
        .select()

        if (error) {
            console.error('Error removing like:', error)
        throw error
        }

        return { 
        success: data.length > 0, 
        removedLike: data[0] 
        }
    } catch (error) {
        console.error('Error removing like:', error)
        throw error
    }
}

export async function hasUserLikedEvent(userId, eventId) {
    const supabase = createClient();

    if (!userId) {
        return false
      }

    try {
        const { data, error } = await supabase
        .from('event_likes')
        .select('id')
        .match({ 
            user_id: userId, 
            event_id: eventId 
        })
        .single()

        if (error) {
        // No like found is not an error
        if (error.code === 'PGRST116') {
            return false
        }
        throw error
        }

        // Convert data to boolean
        // If user has liked the event return truthy value
        return !!data
    } catch (error) {
        console.error('Error checking like status:', error)
        throw error
    }
}

export async function getEventLikeCount(eventId) {
    const supabase = createClient();

  try {
    const { count, error } = await supabase
      .from('event_likes')
      .select('*', { count: 'exact' })
      .eq('event_id', eventId)

    if (error) {
      throw error
    }

    return count || 0
  } catch (error) {
    console.error('Error getting like count:', error)
    throw error
  }
}

// Custom Hook
export function useEventLike(eventId) {
    // Use the UserContext to get the user ID
    const { session } = useAuth()
    const userId = session?.user?.id
  
    const [likeCount, setLikeCount] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false);
  
    useEffect(() => {
      async function fetchLikeData() {
        if (!userId || !eventId) return
  
        try {
          setIsProcessing(true)
          // const count = await getEventLikeCount(eventId)
          const liked = await hasUserLikedEvent(userId, eventId)
          
          // setLikeCount(count)
          setIsLiked(liked)
        } catch (error) {
          console.error('Error fetching like data:', error)
        } finally {
            setIsProcessing(false)
        }
      }
  
      fetchLikeData()
    }, [eventId, userId])
  
    const toggleLike = async () => {
      if (!userId || !eventId) return

      if (isProcessing) {
        return;
      }
  
      try {
        setIsProcessing(true)
        if (isLiked) {
          await removeEventLike(userId, eventId)
          setLikeCount(prev => prev - 1)
        } else {
          await addEventLike(userId, eventId)
          setLikeCount(prev => prev + 1)
        }
        setIsLiked(!isLiked)
      } catch (error) {
        console.error('Error toggling like:', error)
      } finally {
        setIsProcessing(false)
      }
    }
  
    return { 
      // likeCount, 
      isLiked, 
      toggleLike,
      isProcessing
    }
}