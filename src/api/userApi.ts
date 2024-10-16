import { useMutation, UseMutationResult, useQuery, useQueries, useQueryClient, UseQueryResult, QueryFunction, QueryKey } from '@tanstack/react-query';
import { useAuth } from "../contexts/authContext";
import { DietaryDetail, useDietaryDetails } from "./productApi";

export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  role: string;
  image: string | null;
  voucher_credits: string;
  profile: any;
}

interface Recipe {
    id: number;
    creator: {
      name: string;
      profile_picture: string;
      userID: number;
    };
    name: string;
    serving_size: number;
    meal_type: string;
    cooking_time: number;
    created_at: string;
    image: string;
    dietary_details: string[];
    total_price: number;
  }
  
interface LikedRecipe {
recipe: Recipe;
liked_at: string;
}

interface LikedRecipesResponse {
liked_recipes: LikedRecipe[];
}

export const useUserProfile = (): UseQueryResult<UserProfile, Error> => {
  const { getToken } = useAuth();
  const token = getToken() || '';

  const fetchUserProfile = async (): Promise<UserProfile> => {
    const url = 'http://meal-u-api.nafisazizi.com:8001/api/v1/users/user-profile/';

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch user profile');
    }

    return data.data;
  };

  return useQuery<UserProfile, Error>({
    queryKey: ['user.profile'],
    queryFn: fetchUserProfile,
    enabled: !!token,
  });
};

interface UserProfileResponse {
  success: boolean,
  message: string,
  data: UserProfile,
}

export const useCreatorProfile = (userId: number): UseQueryResult<UserProfile, Error> => {
  const { getToken } = useAuth();
  const token = getToken() || "";

  const fetchCreatorProfile = async (): Promise<UserProfile> => {
    const response = await fetch(`http://meal-u-api.nafisazizi.com:8001/api/v1/users/creator-profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch creator's profile");
    }

    const data: UserProfileResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch creator's profile");
    }

    return data.data;
  };

  return useQuery<UserProfile, Error>({
    queryKey: ["creatorProfile"],
    queryFn: fetchCreatorProfile,
    enabled: !!token && !!userId,
  })
}

interface TrendingCreatorListParams {
  dietary_details: number;
}

export interface TrendingCreatorProfile {
  id: number,
  email: string,
  first_name: string,
  last_name: string,
  image: string | null,
  recipe_count: number,
}

export const useTrendingCreators = () => {
  const { data: dietaryDetails = [] } = useDietaryDetails();
  const { getToken } = useAuth();

  const fetchTrendingCreators: QueryFunction<TrendingCreatorProfile[], QueryKey> = async ({ queryKey }) => {
    const [_, dietaryDetailId] = queryKey;
    const token = getToken();
    if (!token) throw new Error('Token missing');

    const url = `http://meal-u-api.nafisazizi.com:8001/api/v1/community/trending-creator/?dietary_details=${encodeURIComponent(dietaryDetailId as number)}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trending creators');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch trending creators');
    }

    return data.data;
  };

  const trendingCreatorsQueries = useQueries({
    queries: dietaryDetails.map((dd: DietaryDetail) => ({
      queryKey: ['trending.creators', dd.id] as const,
      queryFn: fetchTrendingCreators,
      enabled: !!dd.id,
    })),
  });

  const trendingCreatorsMap: Record<number, TrendingCreatorProfile[]> = {};

  trendingCreatorsQueries.forEach((query, index) => {
    if (query.isError) {
      console.error(`Error fetching trending creators for category ${dietaryDetails[index].name}:`, query.error);
    } else if (query.data) {
      trendingCreatorsMap[dietaryDetails[index].id] = query.data;
    }
  });

  return { 
    trendingCreatorsMap, 
    isLoading: trendingCreatorsQueries.some(query => query.isLoading),
    isError: trendingCreatorsQueries.some(query => query.isError),
  };
};

export const useUpdateUserProfile = (): UseMutationResult<UserProfile, Error, Partial<UserProfile>> => {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();
  
    return useMutation<UserProfile, Error, Partial<UserProfile>>({
      mutationFn: async (updatedProfile) => {
        const token = getToken() || '';
        const url = 'http://meal-u-api.nafisazizi.com:8001/api/v1/users/user-profile/';
  
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProfile),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to update profile: ${errorText}`);
        }
  
        const data = await response.json();
  
        if (!data.success) {
          throw new Error(data.message || 'Failed to update profile');
        }
  
        return data.data;
      },
      onSuccess: (data) => {
        queryClient.setQueryData(['user.profile'], data);
        queryClient.invalidateQueries({queryKey: ['user.profile']});
      },
      onError: (error) => {
        console.error('Error updating profile:', error);
      },
    });
  };

  export const useLikedRecipes = (): UseQueryResult<LikedRecipesResponse, Error> => {
    const { getToken } = useAuth();
    const token = getToken() || '';
  
    const fetchLikedRecipes = async (): Promise<LikedRecipesResponse> => {
      const url = 'http://meal-u-api.nafisazizi.com:8001/api/v1/community/user-likes/';
  
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch liked recipes');
      }
  
      const data = await response.json();
  
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch liked recipes');
      }
  
      return data.data;
    };
  
    return useQuery<LikedRecipesResponse, Error>({
      queryKey: ['user.likedRecipes'],
      queryFn: fetchLikedRecipes,
      enabled: !!token,
    });
  };
