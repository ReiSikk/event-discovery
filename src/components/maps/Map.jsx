import React from 'react'
import { Map } from "@vis.gl/react-google-maps";
import PoiMarkers from './PoiMarkers';

function ModalMap({ modalOpen, toggleModal }) {
    // Placeholder POI, use events lat and lng instead in prod
    const locations = [
        { key: 'alexanderNevskyCathedral', location: { lat: 59.4370, lng: 24.7454 } },
        { key: 'kumuArtMuseum', location: { lat: 59.4389, lng: 24.7945 } },
        { key: 'tallinnTownHall', location: { lat: 59.4370, lng: 24.7535 } },
        { key: 'seaplaneHarbour', location: { lat: 59.4516, lng: 24.7346 } },
        { key: 'kadriorgPalace', location: { lat: 59.4386, lng: 24.7848 } },
      ];

  return (
    <div className={`modalMap ${modalOpen ? 'open' : 'close'}`}>
        <Map
            defaultZoom={13}
            disableDefaultUI={true}
            defaultCenter={ { 
                lat: 59.4370,
                lng: 24.7476  
            } }
            className="map"
            mapId='DEMO_MAP_ID'
            onCameraChanged={ (ev) =>
            console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
            }>
         <PoiMarkers pois={locations} />
        </Map>
    </div>
  )
}

export default ModalMap