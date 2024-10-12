import React, { useEffect, useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { format, subHours, parseISO, compareAsc, isToday, isTomorrow } from 'date-fns';
import { useWarehouseOrders } from '../../../api/warehouseApi';
import { useHistory } from 'react-router-dom';
import OrdersToolbar from '../../../components/Warehouse/Toolbar/OrdersToolbar';
import { useOrder } from '../../../contexts/orderContext';

const AllOrders: React.FC = () => {
  const { data: warehouseOrders, isLoading, error } = useWarehouseOrders();
  const history = useHistory();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const { filters, clearFilters } = useOrder();
  const [isFilterUsed, setIsFilterUsed] = useState(false);

  useEffect(() => {
    // Check if any filter is active
    const hasActiveFilters = Object.values(filters).some(filter => filter !== null && filter !== '');
    setIsFilterUsed(hasActiveFilters);
  }, [filters]);

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
          deliveryLocationId: order.delivery_details.delivery_location.id,
          deliveryLocation: `${order.delivery_details.delivery_location.name} - ${order.delivery_details.delivery_location.branch}`,
          deliveryTimeId: order.delivery_details.delivery_time.name,
          deliveryTime: format(subHours(parseISO(`${date}T${time}`), 1), 'h:mm a'),
          courier: "Courier",
          sortTime: parseISO(`${date}T${time}`),
          deliveryDate: parseISO(date)
        }))
      )
    )
    .sort((a, b) => compareAsc(a.sortTime, b.sortTime))

  const filteredOrders = processedOrders.filter(order => {
    if (filters.deliveryDate) {
      if (filters.deliveryDate === 'Today' && !isToday(order.deliveryDate)) return false;
      if (filters.deliveryDate === 'Tomorrow' && !isTomorrow(order.deliveryDate)) return false;
    }
    if (filters.deliveryBatch && order.deliveryTimeId !== filters.deliveryBatch) return false;
    if (filters.deliveryLocation && order.deliveryLocationId !== filters.deliveryLocation) return false;
    if (filters.orderStatus && order.status !== filters.orderStatus) return false;
    return true;
  });

  const ordersToDisplay = isFilterUsed ? filteredOrders : processedOrders;

  const handleOrderClick = (orderId: string) => {
    history.push(`/warehouse/order/${orderId}`);
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedOrders(processedOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleResetFilters = () => {
    clearFilters();
    setIsFilterUsed(false);
  };
  
  return (
    <IonPage>
      <IonContent className="font-sans">
        <div className="pl-24 pr-6 py-6 bg-gray-100 min-h-screen overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">All Orders</h1>
            {processedOrders.length === 0 ? (
              <p className="text-center py-4 text-gray-500">There are no orders</p>
            ) : (
              <>
              <div className='flex flex-row'>
                <OrdersToolbar />
                {isFilterUsed && (
                <button 
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Reset Filters
                </button>
              )}
              </div>
              {/* <OrdersToolbar /> */}
              <table className="table-auto">
                <thead>
                  <tr>
                    <th className="pl-4 w-8">
                      <input 
                        id="selectAll" 
                        type="checkbox" 
                        onChange={handleSelectAll}
                        checked={selectedOrders.length === processedOrders.length}
                      />
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OrderId</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Location</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Time</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courier</th>
                  </tr>
                </thead>
                <tbody>
                {ordersToDisplay.map((order) => (
                  <tr key={order.id}>
                    <td className="pl-4 w-8">
                      <input id={`checkbox-${order.id}`}
                             type="checkbox"
                             className="hidden peer"
                             checked={selectedOrders.includes(order.id)}
                             onChange={() => handleSelectOrder(order.id)}
                      />
                      <label htmlFor={`checkbox-${order.id}`}
                             className="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-gray-50 w-5 h-5 cursor-pointer bg-blue-500 border border-gray-400 rounded overflow-hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-full fill-white" viewBox="0 0 520 520">
                          <path
                            d="M79.423 240.755a47.529 47.529 0 0 0-36.737 77.522l120.73 147.894a43.136 43.136 0 0 0 36.066 16.009c14.654-.787 27.884-8.626 36.319-21.515L486.588 56.773a6.13 6.13 0 0 1 .128-.2c2.353-3.613 1.59-10.773-3.267-15.271a13.321 13.321 0 0 0-19.362 1.343q-.135.166-.278.327L210.887 328.736a10.961 10.961 0 0 1-15.585.843l-83.94-76.386a47.319 47.319 0 0 0-31.939-12.438z"
                            data-name="7-Check" data-original="#000000" />
                        </svg>
                      </label>
                    </td>
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
              </>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AllOrders;