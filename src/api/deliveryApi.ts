import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { useAuth } from "../contexts/authContext";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

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
  delivery_fee: string;
  longitude: string;
  latitude: string;
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
export const useDeliveryLocations = (): UseQueryResult<
  DeliveryLocation[],
  Error
> => {
  const { getToken } = useAuth();
  const token = getToken() || "";

  const fetchDeliveryLocations = async (): Promise<DeliveryLocation[]> => {
    const response = await fetch(
      `${apiBaseUrl}/orders/delivery-locations/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch delivery locations");
    }

    const data: DeliveryResponse<DeliveryLocation[]> = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch delivery locations");
    }

    return data.data;
  };

  return useQuery<DeliveryLocation[], Error>({
    queryKey: ["deliveryLocations"],
    queryFn: fetchDeliveryLocations,
    enabled: !!token,
  });
};

// Fetch Delivery Time Slots
export const useDeliveryTimeSlots = (): UseQueryResult<
  DeliveryTimeSlot[],
  Error
> => {
  const { getToken } = useAuth();
  const token = getToken() || "";

  const fetchDeliveryTimeSlots = async (): Promise<DeliveryTimeSlot[]> => {
    const response = await fetch(
      `${apiBaseUrl}/orders/delivery-time-slots/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch delivery time slots");
    }

    const data: DeliveryResponse<DeliveryTimeSlot[]> = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch delivery time slots");
    }

    return data.data;
  };

  return useQuery<DeliveryTimeSlot[], Error>({
    queryKey: ["deliveryTimeSlots"],
    queryFn: fetchDeliveryTimeSlots,
    enabled: !!token,
  });
};

// Interface for order creation payload
export interface CreateOrderPayload {
  delivery_location: any;
  delivery_time: number;
  delivery_date: string;
}

// Interface for the API response structure
export interface OrderCreationResponse {
  success: boolean;
  message: string;
  data: {
    order_id: number;
    total: number;
  };
}

export const useCreateOrder = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<OrderCreationResponse, Error, CreateOrderPayload>({
    mutationFn: async (payload) => {
      const token = getToken() || "";
      const response = await fetch(
        `${apiBaseUrl}/orders/checkout/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            delivery_location: payload.delivery_location,
            delivery_time: payload.delivery_time,
            delivery_date: payload.delivery_date,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data: OrderCreationResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to create order");
      }

      return data;
    },
    onSuccess: (data) => {
      // Invalidate or refetch queries related to orders after a successful mutation
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      return data;
    },
  });
};
