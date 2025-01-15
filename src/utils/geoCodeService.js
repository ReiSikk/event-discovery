import { createClient } from '@/utils/supabase/component';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Geocode the latitude and longitude into a human readable address
async function geocodeLatLng(lat, lng) {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`);
    const data = await response.json();
    console.log('geocodeLatLng called and responded with:', data);
    if (data.status === 'OK' && data.results.length > 0) {
        return {
            address: data.results[0].formatted_address,
            location: { lat, lng }
        }
    } else {
        return { address: 'Address not found', location: null}
    }
  };

// Geocode the address into latitude and longitude coordinates
  async function geocodeAddress(address) {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`);
    const data = await response.json();
    console.log('geocodeAddress called and responded with:', data);
    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { 
        lat: location.lat, 
        lng: location.lng 
    };
    } else {
      return null;
    }
  }

// Fetch the location of the event by calling a Supabase database function. Convert the long location string into latitude and longitude coordinates
async function fetchEventLocation(eventIds) {
    const supabase = createClient();
    // Filter out null or empty values
  
    try {
      const { data, error } = await supabase.rpc("fetch_event_location", { event_ids: eventIds });
  
      if (error) {
        console.error("Error fetching event location:", error);
        return null;
      }
  
      return data;
    } catch (error) {
      console.error("Error fetching event location:", error);
      return null;
    }
  }

  
export  { geocodeLatLng, geocodeAddress, fetchEventLocation };