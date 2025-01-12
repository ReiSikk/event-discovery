const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

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
    console.log('geocodeLatLng called and responded with:', data);
  };

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
  
export  { geocodeLatLng, geocodeAddress };