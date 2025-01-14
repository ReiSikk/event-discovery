import React, { useEffect, useCallback, useState } from 'react'
import { Map, InfoWindow } from "@vis.gl/react-google-maps";
import PoiMarkers from './PoiMarkers';

function ModalMap({ modalOpen, toggleModal, filteredEvents }) {
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

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

  // Open marker when click on
  const handleMarkerClick = () => {
    setInfoWindowOpen(!infoWindowOpen);
  };

  // Close marker info windown
  const handleMarkerClose = () => {
    setInfoWindowOpen(!infoWindowOpen);
  };

  return (
    <div className={`modalMap ${modalOpen ? 'open' : 'close'}`}>
      <div className="modalMap__close btn__primary" onClick={toggleModal}>Close map</div>
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
         <PoiMarkers pois={locations} handleMarkerClick={handleMarkerClick}/>
          {infoWindowOpen &&
                <InfoWindow 
                className="autoCompleteMap__infoWindow"
                maxWidth={300}
                onClose={handleMarkerClose}
                ariaLabel={`Event location description pop-up, the event address is: ${address}`}
                style={{
                    width: `200px`,
                    textAlign: `center`,
                }}
                >
                    <h4>Event address</h4>
                    {address ? <p>{address}</p> : <p>Click on the map to set the location</p>}
                </InfoWindow>
            }
        </Map>
    </div>
  )
}

export default ModalMap