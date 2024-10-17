import React, { useState, useMemo } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import DropdownSelect from '../../../components/Dropdown/DropdownSelect';
import DeliveryBatch from '../../../components/Courier/DeliveryBatch/DeliveryBatch';
import { useAllOrders } from '../../../api/courierApi';
import { format, addHours, parseISO, isToday, isTomorrow, isThisWeek } from 'date-fns';

const CourierDeliveries: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('All Deliveries');
  const history = useHistory();
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

  return (
    <IonPage>
      <IonHeader collapse='fade'>
        <IonToolbar className='font-sans'>
          <IonTitle>Deliveries</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='font-sans'>
        <div className="p-4 pb-20">
          <DropdownSelect
            options={['All Deliveries', 'Today', 'Tomorrow', 'This Week']}
            defaultValue="All Deliveries"
            onChange={setSelectedFilter}
          />
          {filteredDeliveries.map((dateGroup, index) => (
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
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CourierDeliveries;