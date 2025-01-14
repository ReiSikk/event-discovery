import React, { useState, useCallback } from 'react'
import { AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

function PoiMarkers({ pois, map, handleMarkerClick }) {
    const [selectedPoi, setSelectedPoi] = useState(null)


  return (
    <ul>
      {pois.map((poi) => (
        <li
          key={poi.key}
        >
            <AdvancedMarker
            position={poi.location}
            clickable={true}
            onClick={handleMarkerClick}
            >
            <Pin background={'#7dffaf'} glyphColor={'#000'} borderColor={'#000'} />
            </AdvancedMarker>
            {selectedPoi && selectedPoi.key === poi.key && (
            <div className="poiInfo open">
              <h3>{poi.key}</h3>
              <p>{poi.location.lat}, {poi.location.lng}</p>
            </div>
          )}
        </li>
      ))
      }
    </ul>
  )
}

export default PoiMarkers