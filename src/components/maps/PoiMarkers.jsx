import React, { useState, useCallback } from 'react'
import { AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

function PoiMarkers({ pois, map }) {
    const [selectedPoi, setSelectedPoi] = useState(null)

    const handleClick = useCallback((ev, poi) => {
        console.log('marker clicked:', poi.key);
        if(!map) return;
        if(!ev.latLng) return;
        console.log('marker clicked:', ev.latLng.toString());
        map.panTo(ev.latLng);
        setSelectedPoi(poi)
      });
    

  return (
    <>
      {pois.map((poi) => (
        <>
            <AdvancedMarker
            key={poi.key}
            position={poi.location}
            clickable={true}
            onClick={(ev) => handleClick(ev, poi)}
            >
            <Pin background={'#7dffaf'} glyphColor={'#000'} borderColor={'#000'} />
            </AdvancedMarker>
            {selectedPoi && selectedPoi.key === poi.key && (
            <div className="poiInfo open">
              <h3>{poi.key}</h3>
              <p>{poi.location.lat}, {poi.location.lng}</p>
            </div>
          )}
        </>
      ))
      }
    </>
  )
}

export default PoiMarkers