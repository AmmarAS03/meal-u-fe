import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { useAuth } from '../contexts/authContext';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

interface CommunityCreator {
  name: string;
  profile_picture: string;
}

interface Creator {
  name: string;
  profile_picture: string;
  id: number;
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
  id: number;
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

export interface CommunityMealkitData {
  id: number;
  creator: Creator;
  name: string;
  description: string;
  created_at: string;
  image: string;
  dietary_details: string[];
  meal_types: string[];
  likes_count: number;
  comments_count: number;
  price: number;
  is_like: boolean
}
interface LikeMealkitResponse {
  success: boolean;
  message: string;
}

export const useMealkitList = (params: MealkitListParams): UseQueryResult<MealkitData[], Error> => {
  const { getToken } = useAuth();
  const token = getToken() || '';

  const fetchMealkits = async (): Promise<MealkitData[]> => {
    const url = params.search && params.search !== "Show All"
      ? `${apiBaseUrl}/community/mealkits/?search=${encodeURIComponent(params.search)}`
      : `${apiBaseUrl}/community/mealkits/`;

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

  const response = await fetch(`${apiBaseUrl}/community/mealkit/${mealkitId}/`, {
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
    const url = `${apiBaseUrl}/community/trending-mealkits/`;

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

export const useCommunityMealkitList = (): UseQueryResult<
  CommunityMealkitData[],
  Error
> => {
  const { getToken } = useAuth();
  const token = getToken() || "";

  const fetchCommunityMealkit = async (): Promise<CommunityMealkitData[]> => {
    const url =
    `${apiBaseUrl}/community/community-mealkits/`;

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
  return useQuery<CommunityMealkitData[], Error, CommunityMealkitData[], [string]>({
    queryKey: ["community-mealkit.list"],
    queryFn: fetchCommunityMealkit,
    initialData: [],
    enabled: !!token,
  });
};

export const useLikeMealkit = (options?: {
  onSuccess?: (data: LikeMealkitResponse) => void;
}) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<LikeMealkitResponse, Error, number>({
    mutationFn: async (mealkitId: number) => {
      const token = getToken() || '';
      const response = await fetch(`${apiBaseUrl}/community/mealkit/${mealkitId}/like/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to like mealkit');
      }

      const data: LikeMealkitResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to like mealkit');
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['mealkit.list']});
      queryClient.invalidateQueries({queryKey: ["community-mealkit.list"]});
      options?.onSuccess?.(data);
    },
  });
};  

export interface CreateMealkitPayload {
  image: File | null;
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
    recipes: Recipe[];
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

      const response = await fetch(`${apiBaseUrl}/community/mealkit/`, {
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

interface Comment {
  id: number;
  recipe?: number;
  mealkit?: number;
  user_details: any;
  comment: string;
  commented_at: string;
  is_creator: boolean;
}

interface CommentResponse {
  success: boolean;
  message: string;
  data: Comment[];
}

export const useAddMealkitComment = (mealkitId: number) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<CommentResponse, Error, { comment: string }>({
    mutationFn: async ({ comment }) => {
      const token = getToken() || '';
      const response = await fetch(`${apiBaseUrl}/community/mealkit/${mealkitId}/comment/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealkitComments', mealkitId] });
    },
  });
};

export const useMealkitComments = (mealkitId: number) => {
  const { getToken } = useAuth();

  return useQuery<Comment[], Error>({
    queryKey: ['mealkitComments', mealkitId],
    queryFn: async () => {
      const token = getToken() || '';
      const response = await fetch(`${apiBaseUrl}/community/mealkit/${mealkitId}/comments/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data: CommentResponse = await response.json();
      return data.data;
    },
  });
};

interface Stats {
  likes_count: number;
  comments_count: number;
}

export const useMealkitStats = (mealkitId: number): UseQueryResult<Stats, Error> => {
  const { getToken } = useAuth();
  const token = getToken() || "";

  const fetchMealkitStats = async (): Promise<Stats> => {
    const url = `${apiBaseUrl}/community/mealkit/${mealkitId}/stats`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch mealkit stats");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch mealkit stats");
    }

    return data.data;
  };

  return useQuery<Stats, Error>({
    queryKey: ["recipe.stats", mealkitId],
    queryFn: fetchMealkitStats,
    enabled: !!token,
  });
}