import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton } from '@ionic/react';
import { useParams, useLocation } from 'react-router-dom';
import Order from '../../../components/Courier/Order/Order';

interface LocationState {
  orders: any[];
}

const DeliveryBatchDetails: React.FC = () => {
  const { batchNumber } = useParams<{ batchNumber: string }>();
  const location = useLocation<LocationState>();
  const orders = location.state?.orders || [];

  return (
    <IonPage>
      <IonHeader collapse='fade'>
        <IonToolbar className='font-sans'>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/courier/deliveries" />
          </IonButtons>
          <IonTitle>Delivery Batch: {batchNumber}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='font-sans'>
        <div className='pb-20'>
          <div className='px-4 pt-4'>
            <h2 className="text-xl font-bold">List of Orders</h2>
          </div>
          {orders.map((order, index) => (
            <Order
              key={index}
              orderNumber={order.id.toString()}
              customerName={`${order.user_id.first_name} ${order.user_id.last_name}`}
            />
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DeliveryBatchDetails;