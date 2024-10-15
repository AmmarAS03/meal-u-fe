import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/authContext';

export interface LocationData {
  id: number;
  name: string;
  branch: string;
  address_line1: string;
  address_line2: string;
  city: string;
  country: string;
  postal_code: string;
  delivery_fee: string;
  details: string;
  latitude: string;
  longitude: string;
}

const fetchLocation = async (token: string): Promise<LocationData[]> => {
  const response = await fetch('http://meal-u-api.nafisazizi.com:8001/api/v1/orders/delivery-locations/', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch location');
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch location');
  }

  return data.data;
};

export const useLocationList = () => {
  const { getToken } = useAuth();
  const token = getToken() || '';

  return useQuery({
    queryKey: ['location'],
    queryFn: () => fetchLocation(token),
    enabled: !!token,
  });
};