import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useAuth } from "../contexts/authContext";

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
