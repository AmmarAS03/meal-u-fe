import { MealkitData } from "./mealkitApi";
import { RecipeData } from "./recipeApi";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueries,
  useQueryClient,
  UseQueryResult,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
} from "@tanstack/react-query";
import { useAuth } from "../contexts/authContext";
import { DietaryDetail, useDietaryDetails } from "./productApi";
import { dietaryRequirements } from "../components/FilterOverlay/dummyData";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export interface UserProfile {
  dietary_requirements: number[];
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  role: string;
  image: string | null;
  gender: string | null;
  voucher_credits: string;
  profile: null | any;
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
  comments_count: any;
  likes_count: any;
  recipe: RecipeData;
  liked_at: string;
}

interface LikedMealkit {
  comments_count: any;
  likes_count: any;
  mealkit: MealkitData;
  liked_at: string;
}

interface LikedRecipesResponse {
  liked_mealkits: LikedMealkit[];
  liked_recipes: LikedRecipe[];
}

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
  profile: null | any;
  gender: string;
  dietary_requirements?: number[];
}

interface UpdateUserProfileResponse {
  success: boolean;
  message?: string;
  data: UserProfile;
}

export const useUserProfile = (): UseQueryResult<UserProfile, Error> => {
  const { getToken } = useAuth();
  const token = getToken() || "";

  const fetchUserProfile = async (): Promise<UserProfile> => {
    const url = `${apiBaseUrl}/users/user-profile/`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch user profile");
    }

    return data.data;
  };

  return useQuery<UserProfile, Error>({
    queryKey: ["user.profile"],
    queryFn: fetchUserProfile,
    enabled: !!token,
  });
};

export const useUpdateUserProfile = (): UseMutationResult<UserProfile, Error, UpdateUserProfilePayload> => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, UpdateUserProfilePayload>({
    mutationFn: async (updatedProfile) => {
      const token = getToken() || '';
      const url = 'http://meal-u-api.nafisazizi.com:8001/api/v1/users/user-profile/';

      const formData = new FormData();
      if (updatedProfile.first_name) formData.append('first_name', updatedProfile.first_name);
      if (updatedProfile.last_name) formData.append('last_name', updatedProfile.last_name);
      if (updatedProfile.gender) formData.append('gender', updatedProfile.gender);

      if (updatedProfile.image) {
        if (updatedProfile.image instanceof File) {
          formData.append('image', updatedProfile.image);
        } else {
          formData.append('image', updatedProfile.image);
        }
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update profile: ${errorText}`);
      }

      const data: UpdateUserProfileResponse = await response.json();

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

interface UpdateDietaryRequirementsPayload {
  dietary_requirements: number[];
}

interface UpdateDietaryRequirementsResponse {
  success: boolean;
  message?: string;
  data: UserProfile;
}

export const useUpdateDietaryRequirements = (): UseMutationResult<UserProfile, Error, UpdateDietaryRequirementsPayload> => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, UpdateDietaryRequirementsPayload>({
    mutationFn: async (updatedDietaryRequirements) => {
      const token = getToken() || '';
      const url = 'http://meal-u-api.nafisazizi.com:8001/api/v1/users/user-profile/';

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDietaryRequirements),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update dietary requirements: ${errorText}`);
      }

      const data: UpdateDietaryRequirementsResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to update dietary requirements');
      }
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user.profile'], data);
      queryClient.invalidateQueries({queryKey: ['user.profile']});
    },
    onError: (error) => {
      console.error('Error updating dietary requirements:', error);
    },
  });
};

interface UserProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export const useCreatorProfile = (
  userId: number
): UseQueryResult<UserProfile, Error> => {
  const { getToken } = useAuth();
  const token = getToken() || "";

  const fetchCreatorProfile = async (): Promise<UserProfile> => {
    const response = await fetch(
      `${apiBaseUrl}/users/creator-profile/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
  });
};

interface TrendingCreatorListParams {
  dietary_details: number;
}

export interface TrendingCreatorProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  image: string | null;
  recipe_count: number;
}

export const useTrendingCreators = () => {
  const { data: dietaryDetails = [] } = useDietaryDetails();
  const { getToken } = useAuth();

  const fetchTrendingCreators: QueryFunction<
    TrendingCreatorProfile[],
    QueryKey
  > = async ({ queryKey }) => {
    const [_, dietaryDetailId] = queryKey;
    const token = getToken();
    if (!token) throw new Error("Token missing");

    const url = `${apiBaseUrl}/community/trending-creator/?dietary_details=${encodeURIComponent(
      dietaryDetailId as number
    )}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch trending creators");
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch trending creators");
    }

    return data.data;
  };

  const trendingCreatorsQueries = useQueries({
    queries: dietaryDetails.map((dd: DietaryDetail) => ({
      queryKey: ["trending.creators", dd.id] as const,
      queryFn: fetchTrendingCreators,
      enabled: !!dd.id,
    })),
  });

  const trendingCreatorsMap: Record<number, TrendingCreatorProfile[]> = {};

  trendingCreatorsQueries.forEach((query, index) => {
    if (query.isError) {
      console.error(
        `Error fetching trending creators for category ${dietaryDetails[index].name}:`,
        query.error
      );
    } else if (query.data) {
      trendingCreatorsMap[dietaryDetails[index].id] = query.data;
    }
  });

  return {
    trendingCreatorsMap,
    isLoading: trendingCreatorsQueries.some((query) => query.isLoading),
    isError: trendingCreatorsQueries.some((query) => query.isError),
  };
};

export const useLikedRecipes = (): UseQueryResult<
  LikedRecipesResponse,
  Error
> => {
  const { getToken } = useAuth();
  const token = getToken() || "";

  const fetchLikedRecipes = async (): Promise<LikedRecipesResponse> => {
    const url = `${apiBaseUrl}/community/user-likes/`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch liked recipes");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch liked recipes");
    }

    return data.data;
  };

  return useQuery<LikedRecipesResponse, Error>({
    queryKey: ["user.likedRecipes"],
    queryFn: fetchLikedRecipes,
    enabled: !!token,
  });
};

export interface PaymentMethod {
  user: number;
  method: number;
  token: string;
  last_four_digits: string;
  expiration_date: string;
}

interface PaymentMethodsResponse {
  success: boolean;
  message: string;
  data: PaymentMethod[];
}

interface AddPaymentMethodPayload {
  method: number;
  last_four_digits: string;
  expiration_date: string;
}

interface AddPaymentMethodResponse {
  success: boolean;
  message: string;
  data: PaymentMethod;
}

export const useUserPaymentMethods = (): UseQueryResult<
  PaymentMethod[],
  Error
> => {
  const { getToken } = useAuth();
  const token = getToken() || "";

  const fetchUserPaymentMethods = async (): Promise<PaymentMethod[]> => {
    const url = `${apiBaseUrl}/users/payment-methods/`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user payment methods");
    }

    const data: PaymentMethodsResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch user payment methods");
    }

    return data.data;
  };

  return useQuery<PaymentMethod[], Error>({
    queryKey: ["user.paymentMethods"],
    queryFn: fetchUserPaymentMethods,
    enabled: !!token,
  });
};

export const useAddPaymentMethod = (): UseMutationResult<
  PaymentMethod,
  Error,
  AddPaymentMethodPayload
> => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<PaymentMethod, Error, AddPaymentMethodPayload>({
    mutationFn: async (paymentMethodData) => {
      const token = getToken() || "";
      const url = `${apiBaseUrl}/users/payment-methods/`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentMethodData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add payment method: ${errorText}`);
      }

      const data: AddPaymentMethodResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to add payment method");
      }

      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user.paymentMethods"] });
    },
    onError: (error) => {
      console.error("Error adding payment method:", error);
    },
  });
};
