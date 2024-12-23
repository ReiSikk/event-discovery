import { createClient } from '@/utils/supabase/component';

const supabase = createClient();

export async function fetchEventImages(events) {
  const eventImages = await Promise.all(
    events?.map(async (event) => {
      const { data: images, error: imagesError } = await supabase
        .from('event_images')
        .select('*')
        .eq('event_id', event.id)
        .order('is_primary', { ascending: false });

      if (imagesError) {
        console.error('Error fetching event images:', imagesError);
        return { ...event, images: [] };
      }

      // Generate public URLs for images
      const imagesWithUrls = images.map((image) =>
        supabase.storage.from('event-images').getPublicUrl(image.image_path).data.publicUrl
      );

      return { ...event, images: imagesWithUrls };
    }) || []
  );

  return eventImages;
}


export async function fetchLikedEvents(userId) {
    const { data, error } = await supabase
      .from('event_likes')
      .select('event_id')
      .eq('user_id', userId);
  
    if (error) {
      console.error('Error fetching liked events:', error);
      return [];
    }
  
    const likedEventIds = data.map((like) => like.event_id);
    if (likedEventIds.length === 0) {
      return [];
    }
  
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .in('id', likedEventIds);
  
    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      return [];
    }
  
    const eventImages = await fetchEventImages(events);
    return eventImages;
  }
  
  export async function getEventsByUserId(userId) {
    try {
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('publisher_id', userId);
  
      if (eventsError) {
        console.error('Error fetching events:', eventsError.message);
        return [];
      }
  
      const eventImages = await fetchEventImages(events);
      return eventImages;
    } catch (error) {
      console.error('Unexpected error:', error);
      return [];
    }
  }