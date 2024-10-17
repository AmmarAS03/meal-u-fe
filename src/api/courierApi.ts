import { useQuery, UseQueryResult, useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/authContext';

interface DeliveryLocation {
  id: number;
  name: string;
  branch: string;
  address_line1: string;
  address_line2: string;
  city: string;
  postal_code: string;
  country: string;
  details: string;
  delivery_fee: string;
  longitude: string;
  latitude: string;
}

interface DeliveryTime {
  name: string;
  start_time: string;
  end_time: string;
  cut_off: string;
}

interface DeliveryDetails {
  delivery_location: DeliveryLocation;
  delivery_time: DeliveryTime;
  delivery_date: string;
}

interface ItemName {
  name: string;
  quantity: number;
}

interface UserInfo {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  image: string | null;
}

interface Order {
  id: number;
  order_status: string;
  delivery_details: DeliveryDetails;
  item_names: ItemName[];
  created_at: string;
  updated_at: string;
  total: string;
  delivery_proof_photo: string | null;
  user_id: UserInfo;
}

interface OrdersByDate {
    [date: string]: {
      [time: string]: Order[];
    };
  }
  
interface OrdersResponse {
    success: boolean;
    message: string;
    data: OrdersByDate;
  }

  interface UpdateOrderStatusResponse {
    success: boolean;
    message: string;
    data: string;
  }
  
  export const useAllOrders = (): UseQueryResult<OrdersByDate, Error> => {
    const { getToken } = useAuth();
    const token = getToken() || '';
  
    const fetchOrders = async (): Promise<OrdersByDate> => {
      const response = await fetch('http://meal-u-api.nafisazizi.com:8001/api/v1/orders/warehouse/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
  
      const data: OrdersResponse = await response.json();
  
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch orders');
      }
  
      return data.data;
    };
  
    return useQuery<OrdersByDate, Error>({
      queryKey: ['courier.orders'],
      queryFn: fetchOrders,
      enabled: !!token,
    });
  };

  export const useUpdateOrderStatusToDelivering = () => {
    const { getToken } = useAuth();
  
    return useMutation<UpdateOrderStatusResponse, Error, number>({
      mutationFn: async (orderId: number) => {
        const token = getToken() || '';
        const response = await fetch(`http://meal-u-api.nafisazizi.com:8001/api/v1/orders/${orderId}/status/delivering/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to update order status');
        }
  
        const data: UpdateOrderStatusResponse = await response.json();
  
        if (!data.success) {
          throw new Error(data.message || 'Failed to update order status');
        }
  
        return data;
      },
    });
  };
  
  export const useUpdateOrderStatusToDelivered = () => {
    const { getToken } = useAuth();
  
    return useMutation<UpdateOrderStatusResponse, Error, { orderId: number; photoProof: File }>({
      mutationFn: async ({ orderId, photoProof }) => {
        const token = getToken() || '';
        const formData = new FormData();
        formData.append('photo_proof', photoProof);
  
        const response = await fetch(`http://meal-u-api.nafisazizi.com:8001/api/v1/orders/${orderId}/status/delivered/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('Failed to update order status');
        }
  
        const data: UpdateOrderStatusResponse = await response.json();
  
        if (!data.success) {
          throw new Error(data.message || 'Failed to update order status');
        }
  
        return data;
      },
    });
  };