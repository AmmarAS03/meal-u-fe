import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/authContext';

export interface CategoryData {
  id: number;
  name: string;
  image: string;
}
const BASE_URL = import.meta.env.BASE_URL;

const fetchCategories = async (token: string): Promise<CategoryData[]> => {
  const response = await fetch(`${BASE_URL}/api/v1/groceries/categories/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch categories');
  }

  return data.data;
};

export const useCategoriesList = () => {
  const { getToken } = useAuth();
  const token = getToken() || '';

  return useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(token),
    enabled: !!token,
  });
};