import React, { useState, useEffect, useRef } from 'react';
import { IonContent, IonPage, IonIcon, IonBackButton, IonButtons, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { arrowUp, arrowDown } from 'ionicons/icons';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { useHistory, useParams } from 'react-router-dom';

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;

if (!MAPTILER_API_KEY) {
    throw new Error('MapTiler API key is not set. Please set REACT_APP_MAPTILER_API_KEY in your .env file.');
}

interface RouteParams {
  type: string;
}

const CourierDelivery: React.FC = () => {
  const { type } = useParams<RouteParams>();
  const isPickup = type === 'pickup';
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const geolocateControl = useRef<maptilersdk.GeolocateControl | null>(null);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [destinationLocation] = useState<[number, number]>(
    isPickup ? [153.0197, -27.4648] : [153.0140, -27.4975]
  );

  const history = useHistory();

  const handleConfirm = () => {
    if (isPickup) {
      history.push('/courier/confirm-pickup/1');
    } else {
        history.push('/courier/confirm-delivery/1');
    }
  };

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      maptilersdk.config.apiKey = MAPTILER_API_KEY;
      map.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: maptilersdk.MapStyle.DATAVIZ.LIGHT,
        zoom: 2,
        center: [0, 0],
        navigationControl: false,
        geolocateControl: false
      });

      geolocateControl.current = new maptilersdk.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showAccuracyCircle: false,
      });

      map.current.addControl(geolocateControl.current);

      map.current.on('load', () => {
        if (geolocateControl.current) {
          geolocateControl.current.trigger();
        }

        if (map.current) {
          new maptilersdk.Marker({color: "#7862FC"})
            .setLngLat(destinationLocation)
            .addTo(map.current);
        }
      });

      if (geolocateControl.current) {
        geolocateControl.current.on('geolocate', (e: any) => {
          const lon = e.coords.longitude;
          const lat = e.coords.latitude;
          setCurrentLocation([lon, lat]);
        });
      }
    }
  }, [destinationLocation]);

  useEffect(() => {
    if (map.current && currentLocation) {
      map.current.flyTo({
        center: currentLocation,
        zoom: 15
      });
    }
  }, [currentLocation]);

  const openGoogleMaps = () => {
    const [lng, lat] = destinationLocation;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <IonPage className="overflow-hidden">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/courier/home" />
          </IonButtons>
          <IonTitle>{isPickup ? 'Pick Up' : 'Delivery'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollY={false} className="bg-[#F3F5F7] font-sans">
        <div className="h-full w-full relative">
          <div ref={mapContainer} className="absolute inset-0" style={{ height: 'calc(100% + 35px)' }} />
          <div className="absolute bottom-0 left-0 right-0 pb-8 px-4 bg-transparent">
            <div className="bg-white rounded-2xl shadow p-4 mb-4">
              <h3 className="font-medium text-lg mb-4">{isPickup ? 'Pick Up' : 'Delivery'} Destination</h3>
              <div className="flex items-start mb-4">
                <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center z-10 mr-4">
                  <IonIcon icon={isPickup ? arrowUp : arrowDown} className="text-sm" />
                </div>
                <div className="flex-grow">
                  <p className="text-xs text-gray-500">{isPickup ? 'Pick Up' : 'Delivery'}</p>
                  <p className="font-medium">{isPickup ? 'Roma Street Parkland' : 'University of Queensland'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-medium">{isPickup ? '11:00' : '12:00'}</p>
                </div>
              </div>
              <button 
                className="w-full bg-[#0F2930] text-white font-semibold py-3 rounded-xl mb-4"
                onClick={openGoogleMaps}
              >
                Open in Google Maps
              </button>
            </div>
            <button 
                className="w-full bg-[#7862FC] text-white font-semibold py-3 rounded-2xl"
                onClick={handleConfirm}
            >
                {isPickup ? 'Confirm Pick Up' : 'Confirm Delivery'}
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CourierDelivery;