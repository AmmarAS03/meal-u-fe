import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonToast } from '@ionic/react';
import Order from '../../../components/Courier/Order/Order';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { useUpdateOrderStatusToDelivering } from '../../../api/courierApi';

interface RouteParams {
  type: string;
}

interface LocationState {
  orders: any[];
  date: string;
  time: string;
}

const ConfirmPickup: React.FC = () => {
  const { type } = useParams<RouteParams>();
  const isPickup = type === 'pickup';
  const history = useHistory();
  const location = useLocation<LocationState>();
  const { orders: initialOrders = [], date = '', time = '' } = location.state || {};

  const [orders, setOrders] = useState(initialOrders.map(order => ({
    ...order,
    isChecked: isPickup ? (order.order_status === 'delivering' || order.order_status === 'delivered') : order.order_status === 'delivered'
  })));
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const updateToDelivering = useUpdateOrderStatusToDelivering();

  const toggleOrder = async (id: number) => {
    if (isPickup) {
      const orderToUpdate = orders.find(order => order.id === id);
      if (orderToUpdate && orderToUpdate.order_status !== 'delivering') {
        try {
          await updateToDelivering.mutateAsync(id);
          setOrders(prevOrders => 
            prevOrders.map(order => 
              order.id === id ? { ...order, isChecked: true, order_status: 'delivering' } : order
            )
          );
          setToastMessage(`Order ${id} status updated to 'delivering'`);
          setShowToast(true);
        } catch (error) {
          console.error('Failed to update order status:', error);
          setToastMessage('Failed to update order status');
          setShowToast(true);
        }
      } else {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === id ? { ...order, isChecked: !order.isChecked } : order
          )
        );
      }
    } else {
      history.push(`/courier/confirm-delivery/${id}`, { order: orders.find(o => o.id === id) });
    }
  };

  const allOrdersChecked = orders.every(order => order.isChecked);

  const confirmAll = () => {
    if (allOrdersChecked) {
      if (isPickup) {
        history.push('/courier/delivery/1', { orders, date, time });
      } else {
        history.push('/courier/home');
      }
    }
  };

  return (
    <IonPage>
      <IonHeader collapse='fade'>
        <IonToolbar className='font-sans'>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/courier/home" />
          </IonButtons>
          <IonTitle>{isPickup ? 'Confirm Pick up' : 'Confirm Delivery'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollY={false} className="font-sans">
        <div className="h-full w-full relative flex flex-col">
          <div className="flex-grow overflow-auto">
            {orders.map(order => (
              <Order
                key={order.id}
                orderNumber={order.id.toString()}
                customerName={`${order.user_id.first_name} ${order.user_id.last_name}`}
                isChecked={order.isChecked}
                onToggle={() => toggleOrder(order.id)}
                showCheckbox={true}
              />
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white">
            <button
              className={`w-full py-3 rounded-2xl font-semibold ${
                allOrdersChecked ? 'bg-[#7862FC] text-white' : 'bg-gray-300 text-gray-500'
              }`}
              onClick={confirmAll}
              disabled={!allOrdersChecked}
            >
              {isPickup ? 'Confirm Pick up' : 'Finish Delivery'}
            </button>
          </div>
        </div>
      </IonContent>
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
      />
    </IonPage>
  );
};

export default ConfirmPickup;