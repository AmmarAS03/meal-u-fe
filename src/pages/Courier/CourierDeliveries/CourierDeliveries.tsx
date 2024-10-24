import React, { useState, useMemo } from 'react';
import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import DropdownSelect from '../../../components/Dropdown/DropdownSelect';
import DeliveryBatch from '../../../components/Courier/DeliveryBatch/DeliveryBatch';
import { useAllOrders } from '../../../api/courierApi';
import { format, addHours, parseISO, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { logOutOutline } from 'ionicons/icons';
import { useAuth } from '../../../contexts/authContext';
import { useQueryClient } from '@tanstack/react-query';

const CourierDeliveries: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('All Deliveries');
  const { logout } = useAuth();
  const history = useHistory();
  const queryClient = useQueryClient();
  const { data: ordersData, isLoading, error } = useAllOrders();

  const deliveries = useMemo(() => {
    if (!ordersData) return [];

    return Object.entries(ordersData).map(([date, timeSlots]) => {
      const batches = Object.entries(timeSlots).map(([time, orders]) => {
        const firstOrder = orders[0];
        const deliveryTime = parseISO(`${date}T${time}`);
        const pickUpTime = addHours(deliveryTime, -1);
        
        return {
          batchNumber: firstOrder.delivery_details.delivery_time.name,
          pickUp: {
            type: 'Pick Up' as const,
            location: 'Warehouse Center',
            time: format(pickUpTime, 'HH:mm'),
          },
          delivery: {
            type: 'Delivery' as const,
            location: `${firstOrder.delivery_details.delivery_location.name} ${firstOrder.delivery_details.delivery_location.branch}`,
            time: format(deliveryTime, 'HH:mm'),
          },
          orders: orders,
          date: parseISO(date),
        };
      });

      return {
        date: format(parseISO(date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'Today' : date,
        batches,
      };
    });
  }, [ordersData]);

  const filteredDeliveries = useMemo(() => {
    return deliveries.map(dateGroup => ({
      ...dateGroup,
      batches: dateGroup.batches.filter(batch => {
        switch (selectedFilter) {
          case 'Today':
            return isToday(batch.date);
          case 'Tomorrow':
            return isTomorrow(batch.date);
          case 'This Week':
            return isThisWeek(batch.date, { weekStartsOn: 1 });
          default:
            return true;
        }
      })
    })).filter(dateGroup => dateGroup.batches.length > 0);
  }, [deliveries, selectedFilter]);

  const handleBatchClick = (batchNumber: string, orders: any[]) => {
    history.push(`/courier/delivery-batch/${batchNumber}`, { orders });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const NoDeliveriesMessage = () => {
    const messages = {
      'All Deliveries': {
        primary: 'No deliveries available',
        secondary: 'Check back later for new deliveries'
      },
      'Today': {
        primary: 'No deliveries today',
        secondary: 'Check tomorrow\'s schedule'
      },
      'Tomorrow': {
        primary: 'No deliveries tomorrow',
        secondary: 'Check other days'
      },
      'This Week': {
        primary: 'No deliveries this week',
        secondary: 'Check back later for new schedules'
      }
    };

    return (
      <div className="flex flex-col items-center justify-center p-8 mt-8 text-center">
        <p className="text-gray-500 text-lg">{messages[selectedFilter as keyof typeof messages].primary}</p>
        <p className="text-gray-400 text-sm mt-2">{messages[selectedFilter as keyof typeof messages].secondary}</p>
      </div>
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      history.push('/login');
      queryClient.clear();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader collapse='fade'>
        <IonToolbar className='font-sans'>
          <IonTitle>Deliveries</IonTitle>
          <IonButton 
            slot="end" 
            fill="clear" 
            onClick={handleLogout}
            className="text-red-500 font-bold md:hidden"
          >
            <IonIcon slot="icon-only" icon={logOutOutline} className="text-xl" />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='font-sans'>
        <div className="p-4 pb-20">
          <DropdownSelect
            options={['All Deliveries', 'Today', 'Tomorrow', 'This Week']}
            defaultValue="All Deliveries"
            onChange={setSelectedFilter}
          />
          {filteredDeliveries.length === 0 ? (
            <NoDeliveriesMessage />
          ) : (
            filteredDeliveries.map((dateGroup, index) => (
              <div key={index} className="mt-6">
                <h2 className="text-xl font-bold mb-4">{dateGroup.date}</h2>
                {dateGroup.batches.map((batch, batchIndex) => (
                  <div key={batchIndex} onClick={() => handleBatchClick(batch.batchNumber, batch.orders)}>
                    <DeliveryBatch
                      batchNumber={batch.batchNumber}
                      pickUp={batch.pickUp}
                      delivery={batch.delivery}
                    />
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CourierDeliveries;