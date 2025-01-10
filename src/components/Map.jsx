"use client"

import React, { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

function Map() {
    const mapRef = useRef(null)

    useEffect(() => {
        const initMap = async () => {
            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
                version: 'weekly',
                libraries: ["places"]
            })

            const { Map } = await loader.importLibrary('maps');
            const { Marker } = await loader.importLibrary('marker');

            const position = { 
                lat: 59.4370,
                lng: 24.7476 
              };

            // map options
            const mapOptions ={
                center: position,
                zoom: 15,
                mapId: 'MY_NEXTJS_MAPID'
            }

            // set map to mapRef
            const map = new Map(mapRef.current, mapOptions);

            // set marker on map
            const marker = new Marker({
                map: map, 
                position: position,
            });
        }

        initMap()

    }, [])

  return (
    <div style={{ height: '400px' }} ref={mapRef}>
    </div>
  )
}

export default Map