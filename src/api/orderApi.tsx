import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { useAuth } from '../contexts/authContext';
import { DeliveryLocation, DeliveryTimeSlot } from './deliveryApi';
import { CreateOrderPayload } from './deliveryApi';

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

export const useUpdateOrderStatusToPaid = (options?: { onSuccess?: () => void }) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<OrderStatusResponse, Error, { orderId: number; useVoucher: boolean }>({
    mutationFn: async ({ orderId, useVoucher }) => {
      const token = getToken() || '';
      const response = await fetch(
        `http://meal-u-api.nafisazizi.com:8001/api/v1/orders/${orderId}/status/paid/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ use_voucher: useVoucher }), // Adding the request body here
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update order status to paid');
      }

      const data: OrderStatusResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to update order status to paid');
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      options?.onSuccess?.();
    },
  });
};
  
  
// export const useUpdateOrderStatusToPaid = (options?: { onSuccess?: () => void; }) => {
//   const { getToken } = useAuth();
//   const queryClient = useQueryClient();

//   return useMutation<OrderStatusResponse, Error, number>({
//     mutationFn: async (orderId) => {
//       const token = getToken() || '';
//       const response = await fetch(`http://meal-u-api.nafisazizi.com:8001/api/v1/orders/${orderId}/status/paid/`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update order status to paid');
//       }

//       const data: OrderStatusResponse = await response.json();

//       if (!data.success) {
//         throw new Error(data.message || 'Failed to update order status to paid');
//       }

//       return data;
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({queryKey: ['orders']});
//       options?.onSuccess?.();
//     }
//   })
// }

export interface UserOrders {
  id: number;
  order_status: string;
  delivery_details: CreateOrderPayload;
  item_names: Array<{ name: string; quantity: number }>;
  created_at: string;
  updated_at: string;
  total: string;
  delivery_proof_photo?: string | null;
  user_id: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      image: string | null;
  };
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
export interface OrderStatusPreparingResponse {
    success: boolean;
    message: string;
    data: {
      id: number;
      user_id: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        image: string | null;
      };
      order_status: number;
      created_at: string;
      updated_at: string;
      total: string;
      products: Array<{
        product: number;
        product_name: string;
        quantity: number;
        total: string;
      }>;
      recipes: any[];
      meal_kits: any[];
      delivery_details: Array<{
        delivery_location: {
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
        };
        delivery_time: {
          name: string;
          start_time: string;
          end_time: string;
          cut_off: string;
        };
        delivery_date: string;
        locker_number: string;
        qr_code: string;
      }>;
    }; 
  }
  
export const useUpdateOrderStatusToPreparing = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<OrderStatusPreparingResponse, Error, number>({
    mutationFn: async (orderId) => {
      const token = getToken() || '';
      const response = await fetch(`http://meal-u-api.nafisazizi.com:8001/api/v1/orders/${orderId}/status/preparing/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update order status to preparing');
      }

      const data: OrderStatusPreparingResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to update order status to preparing');
      }

      console.log("success");
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['orders']});
    }
  });
}

export const useUpdateOrderStatusToReadyToDeliver = () => {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation<OrderStatusPreparingResponse, Error, number>({
        mutationFn: async (orderId) => {
            const token = getToken() || '';
            const response = await fetch(`http://meal-u-api.nafisazizi.com:8001/api/v1/orders/${orderId}/status/ready-to-deliver/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to update order status to ready to deliver');
            }
            
            const data: OrderStatusPreparingResponse = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to update order status to ready to deliver');
            }

            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['orders']});
        }
    });
}

export interface CompleteOrderResponse {
    success: boolean;
    message: string;
    data: OrderDetails;
}

export const useUpdateOrderStatusToCompleted = () => {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation<CompleteOrderResponse, Error, { orderId: number; passcode: string }>({
        mutationFn: async ({ orderId, passcode }) => {
            const token = getToken() || '';
            const response = await fetch(`http://meal-u-api.nafisazizi.com:8001/api/v1/orders/${orderId}/status/completed/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ passcode }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update order status to completed');
            }

            const data: CompleteOrderResponse = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to update order status to completed');
            }

            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['orderDetails'] });
        },
    });
};
