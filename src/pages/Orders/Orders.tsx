import React from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonSpinner, IonText, IonButton } from '@ionic/react';
import OrderItem from '../../components/OrderItem/OrderItem';
import { useGetUserOrders, UserOrders } from '../../api/orderApi';
import { useHistory } from 'react-router-dom';

const Orders: React.FC = () => {
  const { data: orders, isLoading, error } = useGetUserOrders();
  const history = useHistory()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const groupOrders = (orders: UserOrders[]) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return [
      {
        title: 'Waiting for Payment',
        isCurrent: true,
        orders: orders.filter(order => order.order_status === 'pending'),
      },
      {
        title: 'Ongoing',
        isCurrent: true,
        orders: orders.filter(order => ['paid', 'preparing', 'ready to deliver', 'delivering', 'delivered', 'picked_up'].includes(order.order_status)),
      },
      {
        title: 'Today',
        isCurrent: !orders.filter(order => order.order_status === 'completed'),
        orders: orders.filter(order => 
          order.order_status === 'completed' && 
          new Date(order.created_at) >= now
        ),
      },
      {
        title: 'Yesterday',
        isCurrent: false,
        orders: orders.filter(order => 
          new Date(order.created_at) >= yesterday && 
          new Date(order.created_at) < now && 
          order.order_status !== 'pending'
        ),
      },
      {
        title: 'Past 7 Days',
        isCurrent: false,
        orders: orders.filter(order => 
          new Date(order.created_at) >= sevenDaysAgo && 
          new Date(order.created_at) < yesterday && 
          order.order_status !== 'pending'
        ),
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
  const noOrders = orderGroups.every((section) => section.orders.length === 0);

  const navigateToOrder = () => {
    history.replace("/categories");
  }

  return (
    <IonPage>
      <IonHeader collapse='fade'>
        <IonToolbar className='font-sans'>
          <IonTitle>Orders</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='font-sans'>
        <div className="px-4 py-6 pb-20">
          {noOrders ? (
            <div className="flex items-center justify-center w-full h-full">
              <div className="w-full max-w-md text-center">
                <IonText>
                You don't have any orders yet. Ready to start shopping?
                </IonText>
                <div className="mt-4">
                  <IonButton onClick={navigateToOrder}>Explore</IonButton>
                </div>
              </div>
            </div>
          ) : (
            <>
            {orderGroups.map((group, index) => (
            group.orders.length > 0 && (
              <div key={index} className="mb-6">
                <h2 className="text-xl font-bold mb-3">{group.title}</h2>
                {group.orders.map((order, orderIndex) => (
                  <OrderItem
                    key={orderIndex}
                    id={order.id}
                    status={order.order_status}
                    title={order.item_names.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                    date={formatDate(order.created_at)}
                    isCurrent={group.isCurrent}
                  />
                ))}
              </div>
            )
          ))}
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Orders;