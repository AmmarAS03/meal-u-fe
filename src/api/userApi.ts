import { useQuery, useQueries, UseQueryResult, QueryFunction, QueryKey } from '@tanstack/react-query';
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
  profile: any | null;
}

interface UserProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export const useUserProfile = (): UseQueryResult<UserProfile, Error> => {
  const { getToken } = useAuth(); // Assume useAuth provides authentication token
  const token = getToken() || "";

  const fetchUserProfile = async (): Promise<UserProfile> => {
    const response = await fetch(
      "http://meal-u-api.nafisazizi.com:8001/api/v1/users/user-profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const data: UserProfileResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch user profile");
    }

    return data.data;
  };

  return useQuery<UserProfile, Error>({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    enabled: !!token, // Only enable the query if the token exists
  });
};

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