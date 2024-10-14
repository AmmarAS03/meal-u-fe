import React from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonSpinner } from '@ionic/react';
import OrderItem from '../../components/OrderItem/OrderItem';
import { useGetUserOrders, UserOrders } from '../../api/orderApi';

const Orders: React.FC = () => {
  const { data: orders, isLoading, error } = useGetUserOrders();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const groupOrders = (orders: UserOrders[]) => {
    const now = new Date();
    const yesterday = new Date(now.setDate(now.getDate() - 1));
    const sevenDaysAgo = new Date(now.setDate(now.getDate() - 6));

    return [
      {
        title: 'Waiting for Payment',
        isCurrent: true,
        orders: orders.filter(order => order.order_status === 'pending'),
      },
      {
        title: 'Ongoing',
        isCurrent: true,
        orders: orders.filter(order => ['preparing', 'ready', 'picked_up'].includes(order.order_status)),
      },
      {
        title: 'Yesterday',
        isCurrent: false,
        orders: orders.filter(order => new Date(order.created_at) >= yesterday && new Date(order.created_at) < now && order.order_status !== 'pending'),
      },
      {
        title: 'Past 7 Days',
        isCurrent: false,
        orders: orders.filter(order => new Date(order.created_at) >= sevenDaysAgo && new Date(order.created_at) < yesterday && order.order_status !== 'pending'),
      },
    ];
  };

  if (isLoading) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <IonSpinner />
        </IonContent>
      </IonPage>
    );
  }

  if (error) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <p>Error loading orders. Please try again later.</p>
        </IonContent>
      </IonPage>
    );
  }

  const orderGroups = groupOrders(orders || []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className='font-sans'>
          <IonTitle>Orders</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='font-sans'>
        <div className="px-4 py-6 pb-20">
          {orderGroups.map((group, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-xl font-bold mb-3">{group.title}</h2>
              {group.orders.length > 0 ? (
                group.orders.map((order, orderIndex) => (
                  <OrderItem
                    key={orderIndex}
                    status={order.order_status}
                    title={order.item_names.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                    date={formatDate(order.created_at)}
                    isCurrent={group.isCurrent}
                  />
                ))
              ) : (
                <p className="text-gray-500">
                  {group.title === 'Waiting for Payment' && 'No orders waiting for payment'}
                  {group.title === 'Ongoing' && 'No ongoing orders'}
                  {group.title === 'Yesterday' && 'No orders yesterday'}
                  {group.title === 'Past 7 Days' && 'No orders in the last 7 days'}
                </p>
              )}
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Orders;