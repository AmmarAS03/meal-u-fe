import React, { useState, useEffect, useRef, useMemo } from 'react';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { arrowUp, arrowDown } from 'ionicons/icons';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { useHistory } from 'react-router-dom';
import { format, parseISO, addHours } from 'date-fns';
import { useAllOrders } from '../../../api/courierApi';
import { useCourier } from '../../../contexts/courierContext';

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;

if (!MAPTILER_API_KEY) {
    throw new Error('MapTiler API key is not set. Please set REACT_APP_MAPTILER_API_KEY in your .env file.');
}

const CourierHome: React.FC = () => {
  const { currentBatch, setCurrentBatch } = useCourier();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const geolocateControl = useRef<maptilersdk.GeolocateControl | null>(null);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const history = useHistory();
  const { data: ordersData, isLoading, error } = useAllOrders();

  const nextDelivery = useMemo(() => {
    if (!ordersData) return null;

    let earliestDelivery: any = null;
    let earliestDateTime: Date | null = null;

    Object.entries(ordersData).forEach(([date, timeSlots]) => {
      Object.entries(timeSlots).forEach(([time, orders]) => {
        const hasUndeliveredOrders = orders.some(order => order.order_status !== 'delivered');
        if (!hasUndeliveredOrders) return;

        const deliveryTime = parseISO(`${date}T${time}`);
        if (!earliestDateTime || deliveryTime < earliestDateTime) {
          earliestDateTime = deliveryTime;
          earliestDelivery = {
            date,
            time,
            orders: orders,
          };
        }
      });
    });

    return earliestDelivery;
  }, [ordersData]);

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
      });

      if (geolocateControl.current) {
        geolocateControl.current.on('geolocate', (e: any) => {
          const lon = e.coords.longitude;
          const lat = e.coords.latitude;
          setCurrentLocation([lon, lat]);
        });
      }
    }
  }, []);

  useEffect(() => {
    if (map.current && currentLocation) {
      map.current.flyTo({
        center: currentLocation,
        zoom: 18
      });
    }
  }, [currentLocation]);

  const handleStartDelivery = () => {
    if (nextDelivery) {
      setCurrentBatch({
        date: nextDelivery.date,
        time: nextDelivery.time,
        orders: nextDelivery.orders,
        isDelivery: false
      });
      
      history.push('/courier/pickup/1', {
        orders: nextDelivery.orders,
        date: nextDelivery.date,
        time: nextDelivery.time
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <IonPage className="overflow-hidden">
      <IonContent fullscreen scrollY={false} className="bg-[#F3F5F7] font-sans">
        <div className="h-full w-full relative">
          <div ref={mapContainer} className="absolute inset-0" style={{ height: 'calc(100% + 35px)' }} />
          <div className="absolute bottom-0 left-0 right-0 pb-[330px] px-4 bg-transparent" style={{ height: '150px' }}>
            {nextDelivery ? (
              <>
                <button 
                  className="w-full bg-[#7862FC] text-white font-semibold py-3 rounded-2xl mb-4"
                  onClick={handleStartDelivery}
                >
                  Start Delivery
                </button>
                <div className="bg-white rounded-2xl shadow p-4">
                  <h3 className="font-medium text-lg mb-4">Next Delivery</h3>
                  <div className="relative">
                    <div className="flex items-start mb-6 relative">
                      <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center z-10 mr-4">
                        <IonIcon icon={arrowUp} className="text-sm" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-xs text-gray-500">Pick Up</p>
                        <p className="font-medium">Warehouse Center</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="font-medium">{format(addHours(parseISO(`${nextDelivery.date}T${nextDelivery.time}`), -1), 'HH:mm')}</p>
                      </div>
                    </div>
                    <div className="flex items-start relative">
                      <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center z-10 mr-4">
                        <IonIcon icon={arrowDown} className="text-sm" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-xs text-gray-500">Delivery</p>
                        <p className="font-medium">{`${nextDelivery.orders[0].delivery_details.delivery_location.name} ${nextDelivery.orders[0].delivery_details.delivery_location.branch}`}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="font-medium">{format(parseISO(`${nextDelivery.date}T${nextDelivery.time}`), 'HH:mm')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow p-8 mt-24 text-center">
                <h3 className="font-medium text-xl mb-2">No Upcoming Deliveries</h3>
                <p className="text-gray-500">All deliveries have been completed for now.</p>
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CourierHome;