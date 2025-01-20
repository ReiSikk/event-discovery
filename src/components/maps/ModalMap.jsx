import React, { useEffect, useCallback, useState } from 'react'
import { Map, InfoWindow, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { geocodeLatLng } from '@/utils/geoCodeService';
import Link from 'next/link';

function ModalMap({ modalOpen, toggleModal, filteredEvents, isAnyFilterActive }) {

  const [infoWindowOpen, setInfoWindowOpen] = useState({
    open: false,
    position: null,
    formattedAddress: null
  });

  //TODO: REMOVE TEMP
  // Filter out mock data which has no location
  const eventsWithCoords = filteredEvents.filter(event => event.location && event.location.lat && event.location.lng);

  const locations = eventsWithCoords.map(event => {

    return {
      key: event.id,
      title: event.title,
      location: {
        lat: event.location.lat,
        lng: event.location.lng
      }
    }
  });

  // Enable closing the modal with the escape key
  const escFunction = useCallback((event) => {
    if (event.key === "Escape") {
      toggleModal();
    }
  }, [toggleModal]);

  useEffect(() => {
    document.addEventListener("keydown", escFunction);
    

    return () => {
      document.removeEventListener("keydown", escFunction);
    };
  }, [escFunction]);

  // Open marker when hovered on
  const handleMarkerHover = async (position) => {
    const formattedAddress = await geocodeLatLng(position.lat, position.lng);

    if (!formattedAddress) {
      console.error('No address found for:', position);
      return;
    }
    if (formattedAddress) {
      setInfoWindowOpen({
        open: true,
        position: position,
        formattedAddress: formattedAddress
      })
    }
  };

  // Handle InfoWindow close
  const handleMarkerClose = () => {
    setInfoWindowOpen({
      open: false,
      position: null,
      formattedAddress: null
    });
  };

  return (
    <div className={`modalMap ${modalOpen ? 'open' : 'close'}`}>
        <div className='modalMap__top fp'>
          <h4>
            {isAnyFilterActive ? 'Showing filtered events' : 'Showing all events'}
          </h4>
          <div className="modalMap__close btn__primary" onClick={toggleModal}>Close map</div>
        </div>
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
             {locations.map((poi) => (
            <div key={poi.key}>
              <AdvancedMarker
                position={poi.location}
                clickable={true}
                onMouseEnter={() => handleMarkerHover(poi.location)}
                onClick={() => handleMarkerHover(poi.location)}
              >
                <Pin background={'#7dffaf'} glyphColor={'#000'} borderColor={'#000'} />
              </AdvancedMarker>
              {infoWindowOpen.open && infoWindowOpen.position.lat === poi.location.lat && infoWindowOpen.position.lng === poi.location.lng && (
                <InfoWindow
                  position={poi.location}
                  onClose={handleMarkerClose}
                  className="autoCompleteMap__infoWindow"
                  maxWidth={300}
                  ariaLabel={`Event location description pop-up, the event address is: ${poi.location.lat}, ${poi.location.lng}`}
                  style={{
                    width: `200px`,
                    textAlign: `center`,
                  }}
                >
                  <h4>{poi.title}</h4>
                  <p>{infoWindowOpen.formattedAddress.address}</p>
                  <Link href={`/event/${poi.key}`} className='btn__primary infoWindow__btn '>Go to event page</Link>
                </InfoWindow>
              )}
            </div>
          ))}
        </Map>
    </div>
  )
}

export default ModalMap