import React from 'react';
import { format, isToday, parseISO } from 'date-fns';
import { useWarehouseOrders } from '../../../api/warehouseApi';

interface OrderBatch {
  name: string;
  totalOrders: number;
  status: string;
  timeSlot: string;
}

const TodaysOrders: React.FC = () => {
  const { data: warehouseOrders, isLoading, error } = useWarehouseOrders();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const today = new Date();
  const todayString = format(today, 'yyyy-MM-dd');

  const todaysOrders = warehouseOrders?.[todayString] || {};

  const orderBatches: OrderBatch[] = Object.entries(todaysOrders)
    .map(([time, orders]) => {
      const firstOrder = orders[0];
      if (!firstOrder) return null;

      return {
        name: `${firstOrder.delivery_details.delivery_time.name} Batch`,
        totalOrders: orders.length,
        status: firstOrder.order_status,
        timeSlot: `${format(parseISO(`${todayString}T${time}`), 'h:mm a')} - ${format(parseISO(`${todayString}T${firstOrder.delivery_details.delivery_time.end_time}`), 'h:mm a')}`
      };
    })
    .filter((batch): batch is OrderBatch => batch !== null)
    .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

  return (
    <div className="h-full bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Today's Orders</h2>
        <p className="text-sm text-gray-500">{format(today, 'EEEE, d MMMM yyyy')}</p>
      </div>
      {orderBatches.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No orders need to be delivered today</p>
      ) : (
        orderBatches.map((batch, index) => (
          <div key={index} className="border-t py-3 flex justify-between items-center">
            <div>
              <h3 className="font-medium">{batch.name}</h3>
              <p className="text-sm text-gray-500">Total: {batch.totalOrders} Orders</p>
              <p className="text-sm text-gray-500">Status: {batch.status}</p>
            </div>
            <p className="text-sm text-gray-500">{batch.timeSlot}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default TodaysOrders;