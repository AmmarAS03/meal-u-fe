import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { useAuth } from '../contexts/authContext';

// Interfaces for the API response structure
export interface DeliveryLocation {
  id: number;
  name: string;
  branch: string;
  address_line1: string;
  address_line2: string;
  city: string;
  postal_code: string;
  country: string;
  details: string;
}

export interface DeliveryTimeSlot {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  cut_off: string;
}

interface DeliveryResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Fetch Delivery Locations
export const useDeliveryLocations = (): UseQueryResult<DeliveryLocation[], Error> => {
  const { getToken } = useAuth();
  const token = getToken() || '';

  const fetchDeliveryLocations = async (): Promise<DeliveryLocation[]> => {
    const response = await fetch('http://meal-u-api.nafisazizi.com:8001/api/v1/orders/delivery-locations/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch delivery locations');
    }

    const data: DeliveryResponse<DeliveryLocation[]> = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch delivery locations');
    }

    return data.data;
  };

  return useQuery<DeliveryLocation[], Error>({
    queryKey: ['deliveryLocations'],
    queryFn: fetchDeliveryLocations,
    enabled: !!token,
  });
};

// Fetch Delivery Time Slots
export const useDeliveryTimeSlots = (): UseQueryResult<DeliveryTimeSlot[], Error> => {
  const { getToken } = useAuth();
  const token = getToken() || '';

  const fetchDeliveryTimeSlots = async (): Promise<DeliveryTimeSlot[]> => {
    const response = await fetch('http://meal-u-api.nafisazizi.com:8001/api/v1/orders/delivery-time-slots/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch delivery time slots');
    }

    const data: DeliveryResponse<DeliveryTimeSlot[]> = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch delivery time slots');
    }

    return data.data;
  };

  return useQuery<DeliveryTimeSlot[], Error>({
    queryKey: ['deliveryTimeSlots'],
    queryFn: fetchDeliveryTimeSlots,
    enabled: !!token,
  });
};


// Interface for order creation payload
interface CreateOrderPayload {
  delivery_location: number;
  delivery_time: number;
  delivery_date: string;
}

// Interface for the API response structure
interface OrderCreationResponse {
  success: boolean;
  message: string;
  data: any; // Adjust to match your Order data structure
}

export const useCreateOrder = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<OrderCreationResponse, Error, CreateOrderPayload>({
    mutationFn: async (payload) => {
      const token = getToken() || '';
      const response = await fetch('http://meal-u-api.nafisazizi.com:8001/api/v1/orders/checkout/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          delivery_location: payload.delivery_location,
          delivery_time: payload.delivery_time,
          delivery_date: payload.delivery_date,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data: OrderCreationResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      return data.data;
    },
    onSuccess: (data) => {
      // Invalidate or refetch queries related to orders after a successful mutation
      queryClient.invalidateQueries({queryKey: ['orders']});
    },
  });
};

// Interface for Order Status response structure
export interface OrderStatusResponse {
  success: boolean;
  message: string;
  data: string;
}

export const useUpdateOrderStatusToPaid = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<OrderStatusResponse, Error, number>({
    mutationFn: async (orderId) => {
      const token = getToken() || '';
      const response = await fetch(`http://meal-u-api.nafisazizi.com:8001/api/v1/orders/${orderId}/status/paid/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update order status to paid');
      }

      const data: OrderStatusResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to update order status to paid');
      }

      console.log("success");
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['orders']});
    }
  })
}