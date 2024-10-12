import React from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import OrderItem from '../../components/OrderItem/OrderItem';

const Orders: React.FC = () => {
  const orderGroups = [
    {
      title: 'Ongoing',
      isCurrent: true,
      orders: [
        {
          status: 'Your order is being sen...',
          title: '7 Days Meal Kit, GF Fe...',
          date: '2m ago',
        },
      ],
    },
    {
      title: 'Yesterday',
      isCurrent: false,
      orders: [
        {
          status: 'Your order is deliver...',
          title: 'Gluten Free Pizza, Asia...',
          date: '18 Aug',
        },
      ],
    },
    {
      title: 'Past 7 Days',
      isCurrent: false,
      orders: [
        {
          status: 'Order',
          title: 'Seafood Fried Rice',
          date: '15 Aug',
        },
        {
          status: 'Order',
          title: 'All Around The World Vegan',
          date: '13 Aug',
        },
      ],
    },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className='font-sans'>
          <IonTitle>Orders</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='font-sans'>
        <div className="px-4 py-6">
          {orderGroups.map((group, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-xl font-bold mb-3">{group.title}</h2>
              {group.orders.map((order, orderIndex) => (
                <OrderItem
                  key={orderIndex}
                  status={order.status}
                  title={order.title}
                  date={order.date}
                  isCurrent={group.isCurrent}
                />
              ))}
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Orders;