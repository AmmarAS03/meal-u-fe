import { useQuery, UseQueryResult } from '@tanstack/react-query';
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

export interface WarehouseOrdersData {
  [date: string]: {
    [time: string]: Order[];
  };
}

const fetchWarehouseOrders = async (token: string): Promise<WarehouseOrdersData> => {
  const response = await fetch('http://meal-u-api.nafisazizi.com:8001/api/v1/orders/warehouse/', {
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