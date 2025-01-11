import React, { useState, useEffect, useRef } from "react";
import * as Form from "@radix-ui/react-form";
import { createRoot } from "react-dom/client";
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
import geocodeLatLng  from "../../utils/geoCodeService";


const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const PlaceAutocomplete = ({ onPlaceSelect, handleInputChange, formErrors }) => {
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
      });
    }, [onPlaceSelect, placeAutocomplete]);

    return (
            <div className="autocomplete-container">
                <input
                type="text" 
                placeholder='Where your event is happening'  
                className={classNames(styles.formField__input, styles.autoCompleteMap__input)} 
                required
                onChange={handleInputChange}
                ref={inputRef} 
                />
            {/* {
            formErrors.location && <p match="valueMissing" className="input__message">
            {formErrors.location}
            </p>
            } */}
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




function AutoCompleteMap({ handleInputChange, formErrors}) {
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [markerPosition, setMarkerPosition] = useState(null);
    const [address, setAddress] = useState('');
    console.log('selectedPlace:', selectedPlace);

    const handleMapClick = async (ev) => {
        const latLng = ev.detail.latLng;
        console.log('map clicked:', latLng);
        setMarkerPosition(ev.detail.latLng);

        // Get the address for the clicked location
        try {
            const address = await geocodeLatLng(latLng.lat, latLng.lng);
            setAddress(address);
          } catch (error) {
            console.error('Error geocoding lat/lng:', error);
          }

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
          onClick={handleMapClick}
        >
          {markerPosition && (
            <>
                <AdvancedMarker ref={markerRef} position={markerPosition}>
                    <Pin background={'#7dffaf'} glyphColor={'#000'} borderColor={'#000'} />
                </AdvancedMarker>
                <InfoWindow 
                position={markerPosition} 
                className={styles.autoCompleteMap__infoWindow}
                style={{
                    width: `200px`,
                    textAlign: `center`,
                }}
                >

                    <h4>Event location</h4>
                    <p>{address}</p>
                </InfoWindow>
          </>
        )}
        </Map>
        <MapControl position={ControlPosition.TOP_LEFT} className={styles.autoCompleteMap__wrap}>
          <div className={`autocomplete-control ${styles.autoCompleteMap__control}`}>
            <PlaceAutocomplete onPlaceSelect={setSelectedPlace} handleInputChange={handleInputChange} formErrors={formErrors} />
          </div>
        </MapControl>
        <MapHandler place={selectedPlace} marker={marker} />
      </APIProvider>
    );
}

export default AutoCompleteMap