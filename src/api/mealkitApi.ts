import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { useAuth } from '../contexts/authContext';

interface Creator {
  name: string;
  profile_picture: string;
}

interface NutritionDetails {
  energy_per_serving: string;
  protein_per_serving: string;
  fat_total_per_serving: string;
  carbohydrate_per_serving: string;
}

interface Ingredient {
  ingredient: {
    id: number;
    name: string;
    image: string | null;
    product_id: number;
    unit_id: number;
    unit_size: string;
    price_per_unit: string;
  };
  preparation_type: {
    id: number;
    name: string;
    additional_price: string;
    category: number;
  } | null;
  price: number;
}

interface Recipe {
  id: number;
  creator: Creator;
  name: string;
  description: string;
  serving_size: number;
  meal_type: string;
  cooking_time: number;
  instructions: string[];
  created_at: string;
  updated_at: string;
  is_customized: boolean;
  image: string;
  dietary_details: string[];
  ingredients: Ingredient[];
  total_price: number;
  nutrition_details: NutritionDetails;
}

export interface MealkitData {
  id: number;
  name: string;
  image: string;
  creator: Creator;
  created_at: string;
  description: string;
  dietary_details: string[];
  total_price: number;
  quantity: number;
  recipes: Recipe[];
}

export interface MealkitDetailsData {
  name: string;
  creator: Creator;
  image: string;
  created_at: string;
  description: string;
  dietary_details: string[];
  total_price: number;
  recipes: Recipe[];
}

interface MealkitListParams {
  search: string;
}

export const useMealkitList = (params: MealkitListParams): UseQueryResult<MealkitData[], Error> => {
  const { getToken } = useAuth();
  const token = getToken() || '';

  const fetchMealkits = async (): Promise<MealkitData[]> => {
    const url = params.search && params.search !== "Show All"
      ? `http://meal-u-api.nafisazizi.com:8001/api/v1/community/mealkits/?search=${encodeURIComponent(params.search)}`
      : 'http://meal-u-api.nafisazizi.com:8001/api/v1/community/mealkits/';

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch mealkits');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch mealkits');
    }

    return data.data;
  };

  return useQuery<MealkitData[], Error, MealkitData[], [string, MealkitListParams]>({
    queryKey: ['mealkit.list', params],
    queryFn: fetchMealkits,
    initialData: [],
    enabled: !!token,
  });
};

export const fetchMealkitDetails = async (mealkitId: number, token: string): Promise<MealkitDetailsData> => {
  if (!token) {
    throw new Error('No authentication token available');
  }

  const response = await fetch(`http://meal-u-api.nafisazizi.com:8001/api/v1/community/mealkit/${mealkitId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch mealkit details');
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch mealkit details');
  }

  return data.data;
};

export const useMealkitDetails = (mealkitId: number): UseQueryResult<MealkitDetailsData, Error> => {
  const { getToken } = useAuth();
  const token = getToken() || '';

  return useQuery<MealkitDetailsData, Error>({
    queryKey: ['mealkit.details', mealkitId],
    queryFn: () => fetchMealkitDetails(mealkitId, token),
    enabled: !!token && !!mealkitId,
  });
};

export const useTrendingMealkitList = (): UseQueryResult<MealkitData[], Error> => {
  const { getToken } = useAuth();
  const token = getToken() || '';

  const fetchTrendingMealkits = async (): Promise<MealkitData[]> => {
    const url = 'http://meal-u-api.nafisazizi.com:8001/api/v1/community/trending-mealkits/';

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch mealkits');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch mealkits');
    }

    return data.data;
  };

  return useQuery<MealkitData[], Error, MealkitData[], [string]>({
    queryKey: ['trending-mealkit.list'],
    queryFn: fetchTrendingMealkits,
    initialData: [],
    enabled: !!token,
  });
};

export interface CreateMealkitPayload {
  image: string | null;
  mealkit: {
    name: string;
    description: string;
    dietary_details: number[];
    recipes: number[];
  }
}

// cek dah bener belom
interface MealkitCreationResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    creator: {
      name: string;
      profile_picture: string | null;
    };
    image: string | null;
    created_at: string;
    description: string;
    dietary_details: string[];
    total_price: number;
    recipes: RecipeData[];
  };
}

export const useCreateMealkit = (options?: {
  onSuccess?: (data: MealkitCreationResponse) => void;}) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<MealkitCreationResponse, Error, CreateMealkitPayload>({
    mutationFn: async (payload) => {
      const token = getToken() || "";
      const formData = new FormData();

      // append image
      if (payload.image) {
        formData.append('image', payload.image);
      }

      // append rest of data
      formData.append('mealkit', JSON.stringify(payload.mealkit));

      const response = await fetch('http://meal-u-api.nafisazizi.com:8001/api/v1/community/mealkit/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create mealkit');
      }

      const data: MealkitCreationResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create mealkit');
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['recipes']});
      options?.onSuccess?.(data);
    }
  })
}