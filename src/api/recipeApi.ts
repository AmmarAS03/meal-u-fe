import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { useAuth } from "../contexts/authContext";

interface Creator {
  name: string;
  profile_picture: string;
  userID: number;
}

export interface PreparationType {
  id: number;
  name: string;
  additional_price: string;
  category: number;
}

// IngredientRecipe[] maybe can be deleted

export interface Ingredient {
  ingredient: {
    id: number;
    name: string;
    image: string | null;
    product_id: number;
    unit_id: number;
    unit_size: string;
    price_per_unit: string;
  };
  preparation_type: PreparationType | null;
  quantity: number;
  price: number;
}

interface NutritionDetails {
  energy_per_serving: string;
  protein_per_serving: string;
  fat_total_per_serving: string;
  carbohydrate_per_serving: string;
}

export interface RecipeData {
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

export interface CommunityRecipeData {
  id: number;
  creator: Creator;
  name: string;
  serving_size: number;
  meal_type: string;
  description: string;
  cooking_time: number;
  created_at: string;
  image: string;
  dietary_details: string[];
  total_price: number;
  likes_count: number;
  comments_count: number;
  is_like: boolean;
}

interface RecipeListParams {
  search: string;
}

interface LikeRecipeResponse {
  success: boolean;
  message: string;
}

export const useRecipesList = (
  params: RecipeListParams
): UseQueryResult<RecipeData[], Error> => {
  const { getToken } = useAuth();
  const token = getToken() || "";

  const fetchRecipe = async (): Promise<RecipeData[]> => {
    const url =
      params.search && params.search !== "Show All"
        ? `https://meal-u-api.nafisazizi.com:8001/api/v1/community/recipes/?search=${encodeURIComponent(
            params.search
          )}`
        : "https://meal-u-api.nafisazizi.com:8001/api/v1/community/recipes/";

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

  return useQuery<
    RecipeData[],
    Error,
    RecipeData[],
    [string, RecipeListParams]
  >({
    queryKey: ["recipe.list", params],
    queryFn: fetchRecipe,
    initialData: [],
    enabled: !!token,
  });
};

export const fetchRecipeDetails = async (
  recipeId: number,
  token: string
): Promise<RecipeData> => {
  if (!token) {
    throw new Error("No authentication token provided");
  }

  const response = await fetch(
    `https://meal-u-api.nafisazizi.com:8001/api/v1/community/recipe/${recipeId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch recipe details");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch recipe details");
  }

  return data.data;
};

export const useTrendingRecipesList = (): UseQueryResult<
  CommunityRecipeData[],
  Error
> => {
  const { getToken } = useAuth();
  const token = getToken() || "";

  const fetchTrendingRecipe = async (): Promise<CommunityRecipeData[]> => {
    const url =
      "https://meal-u-api.nafisazizi.com:8001/api/v1/community/trending-recipes/";

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
  return useQuery<
    CommunityRecipeData[],
    Error,
    CommunityRecipeData[],
    [string]
  >({
    queryKey: ["trending-recipe.list"],
    queryFn: fetchTrendingRecipe,
    initialData: [],
    enabled: !!token,
  });
};

export const useCommunityRecipesList = (): UseQueryResult<
  CommunityRecipeData[],
  Error
> => {
  const { getToken } = useAuth();
  const token = getToken() || "";

  const fetchCommunityRecipe = async (): Promise<CommunityRecipeData[]> => {
    const url =
      "https://meal-u-api.nafisazizi.com:8001/api/v1/community/community-recipes/";

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
  return useQuery<
    CommunityRecipeData[],
    Error,
    CommunityRecipeData[],
    [string]
  >({
    queryKey: ["community-recipe.list"],
    queryFn: fetchCommunityRecipe,
    initialData: [],
    enabled: !!token,
  });
};

export interface IngredientRecipe {
  ingredient: {
    name: string;
    product_id: number;
    unit_id: number;
    unit_size: string;
    description?: string | null;
  };
  preparation_type: number | null;
  quantity: number;
  price: number;
}

export const useRecipesByCreator = (
  creatorId: number
): UseQueryResult<RecipeData[], Error> => {
  const { getToken } = useAuth();
  const token = getToken() || "";

  const fetchRecipesByCreator = async (): Promise<RecipeData[]> => {
    const url = `https://meal-u-api.nafisazizi.com:8001/api/v1/community/recipes/?creator=${creatorId}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recipes by creator");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch recipes by creator");
    }

    return data.data;
  };

  return useQuery<RecipeData[], Error, RecipeData[], [string, number]>({
    queryKey: ["recipe.list.byCreator", creatorId],
    queryFn: fetchRecipesByCreator,
    initialData: [],
    enabled: !!token,
  });
};

export interface CreateRecipePayload {
  recipe: {
    name: string;
    description: string;
    cooking_time: number;
    serving_size: number;
    meal_type: number;
    instructions: string[];
  };
  ingredients: IngredientRecipe[];
  dietary_details: string[];
  image: string | null;
}

interface RecipeCreationResponse {
  success: boolean;
  message: string;
  data: RecipeData;
}

export const useCreateRecipe = (options?: {
  onSuccess?: (data: RecipeCreationResponse) => void;
}) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<RecipeCreationResponse, Error, CreateRecipePayload>({
    mutationFn: async (payload) => {
      const token = getToken() || "";
      const formData = new FormData();

      // Append recipe data
      formData.append("recipe", JSON.stringify(payload.recipe));

      // Append ingredients data
      formData.append("ingredients", JSON.stringify(payload.ingredients));

      // Append dietary details
      formData.append(
        "dietary_details",
        JSON.stringify(payload.dietary_details)
      );

      // Append image if it exists
      if (payload.image) {
        formData.append("image", payload.image);
      }

      const response = await fetch(
        "https://meal-u-api.nafisazizi.com:8001/api/v1/community/recipe/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type header, let the browser set it with the boundary
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create recipe");
      }

      const data: RecipeCreationResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to create recipe");
      }

      return data;
    },
    onSuccess: (data) => {
      // Invalidate or refetch queries related to recipes after a successful mutation
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      options?.onSuccess?.(data);
    },
  });
};

export const useLikeRecipe = (options?: {
  onSuccess?: (data: LikeRecipeResponse) => void;
}) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<LikeRecipeResponse, Error, number>({
    mutationFn: async (recipeId: number) => {
      const token = getToken() || "";
      const response = await fetch(
        `https://meal-u-api.nafisazizi.com:8001/api/v1/community/recipe/${recipeId}/like/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to like recipe");
      }

      const data: LikeRecipeResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to like recipe");
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["community-recipe.list"] });
      options?.onSuccess?.(data);
    },
  });
};

export const usePreparationTypeList = (
  categoryId: number
): UseQueryResult<PreparationType[], Error> => {
  const { getToken } = useAuth();
  const token = getToken() || '';

  const fetchPreparationTypes = async (): Promise<PreparationType[]> => {
    const url = `https://meal-u-api.nafisazizi.com:8001/api/v1/groceries/preparation-type/${categoryId}/`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch preparation types');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch preparation types');
    }

    return data.data;
  };

  return useQuery<PreparationType[], Error, PreparationType[], [string, number]>({
    queryKey: ['preparationType.list', categoryId],
    queryFn: fetchPreparationTypes,
    initialData: [],
    enabled: !!token && !!categoryId,
  });
};

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

export const useAddRecipeComment = (recipeId: number) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<CommentResponse, Error, { comment: string }>({
    mutationFn: async ({ comment }) => {
      const token = getToken() || '';
      const response = await fetch(`https://meal-u-api.nafisazizi.com:8001/api/v1/community/recipe/${recipeId}/comment/`, {
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
      queryClient.invalidateQueries({ queryKey: ['recipeComments', recipeId] });
    },
  });
};

export const useRecipeComments = (recipeId: number) => {
  const { getToken } = useAuth();

  return useQuery<Comment[], Error>({
    queryKey: ['recipeComments', recipeId],
    queryFn: async () => {
      const token = getToken() || '';
      const response = await fetch(`https://meal-u-api.nafisazizi.com:8001/api/v1/community/recipe/${recipeId}/comments/`, {
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