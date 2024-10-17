import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useAuth } from '../contexts/authContext';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

interface DietaryDetail {
  id: number;
  name: string;
}

interface TopCreator {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  image: string;
  recipe_count: number;
}

interface TopCreatorByDietary {
  dietary_detail: DietaryDetail;
  top_creator: TopCreator;
}

interface TopCreatorsByDietaryResponse {
  success: boolean;
  message: string;
  data: TopCreatorByDietary[];
}

export const useTopCreatorsByDietary = (): UseQueryResult<TopCreatorByDietary[], Error> => {
  const { getToken } = useAuth();
  const token = getToken() || '';

  const fetchTopCreatorsByDietary = async (): Promise<TopCreatorByDietary[]> => {
    const response = await fetch(`${apiBaseUrl}/community/top-creator-by-dietary-detail/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch top creators by dietary detail');
    }

    const data: TopCreatorsByDietaryResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch top creators by dietary detail');
    }

    return data.data;
  };

  return useQuery<TopCreatorByDietary[], Error>({
    queryKey: ['topCreatorsByDietary.list'],
    queryFn: fetchTopCreatorsByDietary,
    enabled: !!token,
  });
};