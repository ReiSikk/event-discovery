import React from 'react'
import { Map } from "@vis.gl/react-google-maps";
import PoiMarkers from './PoiMarkers';
import { useFilters } from '@/components/filters/useFilters';
import { XCircle } from 'lucide-react';

function ModalMap({ modalOpen, toggleModal, filteredEvents }) {

  //TODO: REMOVE TEMP
  // Filter out mock data which has no location
  const eventsWithCoords = filteredEvents.filter(event => event.location && event.location.lat && event.location.lng);

  const locations = eventsWithCoords.map(event => {

    return {
      key: event.id,
      location: {
        lat: event.location.lat,
        lng: event.location.lng
      }
    }
  });

  return (
    <div className={`modalMap ${modalOpen ? 'open' : 'close'}`}>
      <XCircle 
        size={36}
        className="modal__close"
        onClick={toggleModal}
      />
        <Map
            defaultZoom={13}
            disableDefaultUI={true}
            defaultCenter={ { 
                lat: 59.4370,
                lng: 24.7476  
            } }
            className="map"
            mapId='DEMO_MAP_ID'
            >
         <PoiMarkers pois={locations} />
        </Map>
    </div>
  )
}

export default ModalMap