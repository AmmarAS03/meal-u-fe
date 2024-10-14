import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { useAuth } from '../contexts/authContext';
import { DeliveryLocation, DeliveryTimeSlot } from './deliveryApi';
import { CreateOrderPayload } from './deliveryApi';
import { User } from './userApi';

export interface OrderDetails {
    id: number;
    user_id: number;
    order_status: number; 
    created_at: string;
    updated_at: string;  // or Date?
    total: string;  // or number?
    products: OrderProducts[];
    recipes: OrderRecipes[];
    meal_kits: OrderMealKits[];
    delivery_details: DeliveryDetails[]; // or DeliveryDetails[]
}

interface DeliveryDetails {
    delivery_location: DeliveryLocation;
    delivery_time: DeliveryTimeSlot;
    delivery_date: Date;
    locker_number: number | null;
    qr_code: string | null;
}

interface OrderProducts {
    id: number;
    product: number;
    quantity: number;
    total: number;
}

interface OrderRecipes {
    id: number;
    recipe: number;
    quantity: number;
    total: number;
}

interface OrderMealKits {
    id: number;
    mealkit: number;
    quantity: number;
    total: number;
}

export interface OrderStatuses {
    id: number;
    name: string;
}

interface OrderResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface Location {
    id: number;
    name: string;
    branch: string,
    address_line1: string,
    address_line2: string,
    city: string,
    postal_code: string,
    country: string,
    details: string,
    delivery_fee: string,
    longitude: string,
    latitude: string
}

export const useOrderDetails = (orderId: number): UseQueryResult<OrderDetails, Error> => {
    const { getToken } = useAuth();
    const token = getToken() || '';

    const fetchOrderDetails = async (): Promise<OrderDetails> => {
        const response = await fetch(`http://meal-u-api.nafisazizi.com:8001/api/v1/orders/order-details/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch order details');
        }

        const data: OrderResponse<OrderDetails> = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch order details');
        }

        return data.data;
    };

    return useQuery<OrderDetails, Error>({
        queryKey: ['orderDetails', orderId],
        queryFn: fetchOrderDetails,
        enabled: !!token,
    });
}

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

export interface UserOrders {
    id: number;
    order_status: string;
    delivery_details: CreateOrderPayload;
    item_names: string[];
    created_at: string;
    updated_at: string;
    total: string;
    delivery_proof_photo?: string | null;
    user_id: User;
}

export const useGetUserOrders = (): UseQueryResult<UserOrders[], Error> => {
    const { getToken } = useAuth();
    const token = getToken() || '';

    const fetchUserOrders = async (): Promise<UserOrders[]> => {
        const response = await fetch('http://meal-u-api.nafisazizi.com:8001/api/v1/orders/', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user orders');
        }

        const data: OrderResponse<UserOrders[]> = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch user orders');
        }

        //return data.data;

        // Sort orders by 'created_at' field in descending order (most recent first)
        const sortedOrders = data.data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return sortedOrders;

    }
    return useQuery<UserOrders[], Error>({
        queryKey: ['userOrders'],
        queryFn: fetchUserOrders,
        enabled: !!token,
    });
};

export const useLocationList = (): UseQueryResult<
  Location[],
  Error
> => {
  const { getToken } = useAuth();
  const token = getToken() || "";

  const fetchLocation = async (): Promise<Location[]> => {
    const url =
      "http://meal-u-api.nafisazizi.com:8001/api/v1/community/community-mealkits/";

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch mealkits");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch recipes");
    }

    return data.data;
  };
  return useQuery<Location[], Error, Location[], [string]>({
    queryKey: ["location.list"],
    queryFn: fetchLocation,
    initialData: [],
    enabled: !!token,
  });
};