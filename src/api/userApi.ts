import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { useAuth } from '../contexts/authContext';
import { MealkitData } from './mealkitApi';
import { RecipeData } from './recipeApi';

interface UserProfile {
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
recipe: RecipeData;
liked_at: string;
}

interface LikedMealkit {
  mealkit: MealkitData;
  liked_at: string;
  }

interface LikedRecipesResponse {
  liked_mealkits: LikedMealkit[]
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