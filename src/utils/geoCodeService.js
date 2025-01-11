const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

async function geocodeLatLng(lat, lng) {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`);
    const data = await response.json();
    console.log('geocodeLatLng called and responded with:', data);
    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
        return 'Address not found';
    }
    console.log('geocodeLatLng called and responded with:', data);
  };
  
export default geocodeLatLng;