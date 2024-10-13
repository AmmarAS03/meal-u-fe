import React from 'react';
import { format, subHours, parseISO, compareAsc } from 'date-fns';
import { useWarehouseOrders } from '../../../api/warehouseApi';
import { useHistory } from 'react-router-dom';

const UpcomingOrders: React.FC = () => {
  const { data: warehouseOrders, isLoading, error } = useWarehouseOrders();
  const history = useHistory();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const processedOrders = Object.entries(warehouseOrders || {})
    .flatMap(([date, timeSlots]) =>
      Object.entries(timeSlots).flatMap(([time, orders]) =>
        orders.map(order => ({
          id: order.id.toString(),
          items: order.item_names.map(item => `${item.name} (x${item.quantity})`).join(', '),
          total: parseFloat(order.total),
          status: order.order_status,
          deliveryLocation: `${order.delivery_details.delivery_location.name} - ${order.delivery_details.delivery_location.branch}`,
          deliveryTime: format(subHours(parseISO(`${date}T${time}`), 1), 'h:mm a'),
          courier: "Courier",
          sortTime: parseISO(`${date}T${time}`)
        }))
      )
    )
    .sort((a, b) => compareAsc(a.sortTime, b.sortTime))
    .slice(0, 5);

  const handleOrderClick = (orderId: string) => {
    history.push(`/warehouse/order/${orderId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <h2 className="text-xl font-semibold p-4">Upcoming Orders</h2>
      {processedOrders.length === 0 ? (
        <p className="text-center py-4 text-gray-500">There are no upcoming orders</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Location</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Time</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courier</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processedOrders.map((order, index) => (
                <tr key={index} onClick={() => handleOrderClick(order.id)} className="cursor-pointer hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">{order.id}</td>
                  <td className="px-4 py-2">{order.items}</td>
                  <td className="px-4 py-2 whitespace-nowrap">${order.total.toFixed(2)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{order.status}</td>
                  <td className="px-4 py-2">{order.deliveryLocation}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{order.deliveryTime}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{order.courier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UpcomingOrders;