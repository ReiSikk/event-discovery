import React, { useState, useEffect, useRef } from "react";
import {
  APIProvider,
  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map,
  Pin,
  useMap,
  InfoWindow,
  useMapsLibrary,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import styles from "../forms/EventForm.module.css";
import classNames from "classnames";


const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const PlaceAutocomplete = ({ onPlaceSelect, handleInputChange, setAddress, setInfoWindowOpen, onLocationChange, setMarkerPosition, required, formErrors }) => {
    const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
    const inputRef = useRef(null);
    const places = useMapsLibrary("places");

    const estoniaBounds = {
        north: 59.676224,
        south: 57.509319,
        east: 28.210026,
        west: 21.832199,
      };

    useEffect(() => {
      if (!places || !inputRef.current) return;
  
      const options = {
        bounds: estoniaBounds,
        fields: ["geometry", "name", "formatted_address"],
        componentRestrictions: { country: "ee" },
      };
  
      setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
    }, [places]);
    

    useEffect(() => {
      if (!placeAutocomplete) return;
  
      placeAutocomplete.addListener("place_changed", () => {
          onPlaceSelect(placeAutocomplete.getPlace());
          const place = placeAutocomplete.getPlace();

          if (place.geometry) {
            setAddress(place.formatted_address);
            setInfoWindowOpen(true);
            onLocationChange(`POINT(${place.geometry.location.lng()} ${place.geometry.location.lat()})`);
            setMarkerPosition(place.geometry.location);
          } else {
            alert("No details available for input: '" + place.name + "'");
          }

      });
    }, [onPlaceSelect, placeAutocomplete, setAddress, setInfoWindowOpen]);

    return (
            <div className="autocomplete-container">
                <input
                type="text" 
                placeholder='Where your event is happening'  
                className={classNames(styles.formField__input, styles.autoCompleteMap__input)} 
                required={required}
                onChange={handleInputChange}
                ref={inputRef} 
                />
                {formErrors.location && <p className="input__message">{formErrors.location}</p>}

            </div>
    );
  };

const MapHandler = ({ place, marker }) => {
const map = useMap();

useEffect(() => {
    if (!map || !place || !marker) return;

    if (place.geometry?.viewport) {
    map.fitBounds(place.geometry?.viewport);
    }

    marker.position = place.geometry?.location;
}, [map, place, marker]);
return null;
};




function AutoCompleteMap({ handleInputChange, formErrors, onLocationChange, setSelectedPlace, selectedPlace, address, setAddress, infoWindowOpen, setInfoWindowOpen, markerPosition, setMarkerPosition, required }) {

    const [markerRef, marker] = useAdvancedMarkerRef();

     // Open marker when click on
      const handleMarkerClick = () => {
        setInfoWindowOpen(!infoWindowOpen);
      };

    // Close marker info windown
      const handleMarkerClose = () => {
        setInfoWindowOpen(!infoWindowOpen);
      };

    return (
      <APIProvider
        apiKey={API_KEY}
        solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
      >
        <Map
          mapId={"DEMO_MAP_ID"}
          defaultZoom={12}
          defaultCenter={ { 
            lat: 59.4370,
            lng: 24.7535  
        } }
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          className={styles.autoCompleteMap}
        >
          {markerPosition && (
            <>
                <AdvancedMarker ref={markerRef} position={markerPosition} onClick={handleMarkerClick}>
                    <Pin background={'#7dffaf'} glyphColor={'#000'} borderColor={'#000'} />
                </AdvancedMarker>
                {infoWindowOpen &&
                    <InfoWindow 
                    position={markerPosition} 
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
          </>
        )}
        </Map>
        <MapControl position={ControlPosition.TOP_LEFT} className={styles.autoCompleteMap__wrap}>
          <div className={`autocomplete-control ${styles.autoCompleteMap__control}`}>
            <PlaceAutocomplete onPlaceSelect={setSelectedPlace} handleInputChange={handleInputChange} formErrors={formErrors} setAddress={setAddress} setInfoWindowOpen={setInfoWindowOpen} onLocationChange={onLocationChange} setMarkerPosition={setMarkerPosition} address={address} required={required}/>
          </div>
        </MapControl>
        <MapHandler place={selectedPlace}  marker={marker}/>
      </APIProvider>
    );
}

export default AutoCompleteMap