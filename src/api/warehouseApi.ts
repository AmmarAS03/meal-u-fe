import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useAuth } from '../contexts/authContext';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

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

interface User {
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
  user_id: User;
}

interface Product {
  product: number;
  product_name: string;
  quantity: number;
  total: string;
}

interface RecipeIngredient {
  ingredient_name: string;
  preparation_type?: string;
  quantity: number;
  unit_size: string;
  unit_name: string;
  total: string;
}

interface Recipe {
  recipe: number;
  recipe_name: string;
  quantity: number;
  total: string;
  ingredients: RecipeIngredient[];
}

interface MealKit {
  mealkit: number;
  mealkit_name: string;
  quantity: number;
  total: string;
}

interface DeliveryDetailWithLocker extends DeliveryDetails {
  locker_number: string;
  qr_code: string;
}

interface DeliveryDetail {
  delivery_location: DeliveryLocation;
  delivery_time: DeliveryTime;
  delivery_date: string;
  locker_number: string | null;
  qr_code: string | null;
}

export interface OrderDetailsData {
  id: number;
  user_id: User;
  order_status: number;
  created_at: string;
  updated_at: string;
  total: string;
  products: Product[];
  recipes: Recipe[];
  meal_kits: MealKit[];
  delivery_details: DeliveryDetail[];
}

export interface WarehouseOrdersData {
  [date: string]: {
    [time: string]: Order[];
  };
}

const fetchWarehouseOrders = async (token: string): Promise<WarehouseOrdersData> => {
  const response = await fetch(`${apiBaseUrl}/orders/warehouse/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch warehouse orders');
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch warehouse orders');
  }

  return data.data;
};

export const useWarehouseOrders = (): UseQueryResult<WarehouseOrdersData, Error> => {
  const { getToken } = useAuth();
  const token = getToken() || '';

  return useQuery<WarehouseOrdersData, Error>({
    queryKey: ['warehouse.orders'],
    queryFn: () => fetchWarehouseOrders(token),
    enabled: !!token,
  });
};

const fetchOrderDetails = async (token: string, orderId: number): Promise<OrderDetailsData> => {
  const response = await fetch(`${apiBaseUrl}/orders/order-details/${orderId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch order details');
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch order details');
  }

  return data.data;
};

export const useOrderDetails = (orderId: number): UseQueryResult<OrderDetailsData, Error> => {
  const { getToken } = useAuth();
  const token = getToken() || '';

  return useQuery<OrderDetailsData, Error>({
    queryKey: ['order.details', orderId],
    queryFn: () => fetchOrderDetails(token, orderId),
    enabled: !!token && !!orderId,
  });
};