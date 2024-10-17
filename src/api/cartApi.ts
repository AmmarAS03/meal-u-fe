import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { useAuth } from "../contexts/authContext";
import { ProductData } from "./productApi";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Interfaces for the API response structure

interface Ingredient {
  id: number;
  name: string;
  image: string | null;
  product_id: number;
  unit_id: number;
  unit_size: string;
  price_per_unit: string;
}

interface PreparationType {
  id: number;
  name: string;
  additional_price: string;
  category: number;
}

export interface RecipeIngredient {
  id: number;
  ingredient: Ingredient;
  preparation_type: PreparationType | null;
  quantity: number;
  price: number;
}

export interface CartProduct {
  id: number;
  product: ProductData;
  quantity: number;
  total_price: number;
}

export interface CartRecipe {
  id: number;
  recipe: number;
  name: string;
  image: string;
  quantity: number;
  ingredients: RecipeIngredient[];
  dietary_details: string[];
  total_price: number;
}

export interface CartMealkit {
  id: number;
  mealkit: number;
  name: string;
  image: string;
  quantity: number;
  recipes: CartRecipe[];
  total_price: number;
}

export interface CartData {
  products: CartProduct[];
  recipes: CartRecipe[];
  mealkits: CartMealkit[];
  total_item: number;
  total_price: number;
}

interface CartResponse {
  success: boolean;
  message: string;
  data: CartData;
}

export const useCart = (): UseQueryResult<CartData, Error> => {
  const { getToken } = useAuth();
  const token = getToken() || "";

  const fetchCart = async (): Promise<CartData> => {
    const response = await fetch(`${apiBaseUrl}/cart/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cart");
    }

    const data: CartResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch cart");
    }

    return data.data;
  };

  return useQuery<CartData, Error>({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: !!token,
  });
};

// Update cart
interface UpdateCartItemPayload {
  item_type: "recipe" | "product" | "mealkit" | "ingredient";
  item_id: number;
  quantity: number;
}

interface DeleteCartItemPayload {
  item_type: "product";
  cart_product_id: number;
}

interface AddMealkitPayload {
  item_type: "mealkit";
  item_data: {
    mealkit_id: number;
    recipes: {
      recipe_id: number;
      quantity: number;
      recipe_ingredients: {
        ingredient_id: number;
        preparation_type_id: number | null;
        quantity: number;
      }[];
    }[];
  };
  quantity: number;
}

interface AddRecipePayload {
  item_type: "recipe";
  quantity: number;
  recipe_id: number;
  recipe_ingredients: {
    ingredient_id: number;
    preparation_type_id: number | null;
    quantity: number;
  }[];
}

interface AddProductPayload {
  item_type: "product";
  quantity: number;
  product_id: number;
}

// interface AddCartItemPayload {
//   item_type: "recipe" | "product" | "mealkit";
//   product_id: number;
//   quantity: number;
// }

type AddCartItemPayload = AddMealkitPayload | AddRecipePayload | AddProductPayload;

export const useAddCartItem = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<CartData, Error, AddCartItemPayload>({
    mutationFn: async (payload) => {
      const token = getToken() || "";
      const response = await fetch(`${apiBaseUrl}/cart/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add cart item");
      }

      const data: CartResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to add cart item");
      }

      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });
};

export const useUpdateCartItem = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<CartData, Error, UpdateCartItemPayload>({
    mutationFn: async (payload) => {
      const token = getToken() || "";
      const response = await fetch(`${apiBaseUrl}/cart/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart item");
      }

      const data: CartResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to update cart item");
      }

      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });
};

export const useDeleteCartItem = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<CartData, Error, DeleteCartItemPayload>({
    mutationFn: async (payload) => {
      const token = getToken() || "";
      const response = await fetch(
        `${apiBaseUrl}/cart/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete cart product");
      }

      const data: CartResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to delete cart product");
      }

      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });
};

interface DeleteCartIngredientPayload {
  item_type: "ingredient";
  cart_ingredient_id: number;
}

export const useDeleteCartIngredient = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<CartData, Error, DeleteCartIngredientPayload>({
    mutationFn: async (payload) => {
      const token = getToken() || "";
      const response = await fetch(
        `${apiBaseUrl}/cart/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete cart ingredient");
      }

      const data: CartResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to delete cart ingredient");
      }

      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });
};

interface DeleteCartRecipePayload {
  item_type: "recipe";
  cart_recipe_id: number;
} 

export const useDeleteCartRecipe = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<CartData, Error, DeleteCartRecipePayload>({
    mutationFn: async (payload) => {
      const token = getToken() || "";
      const response = await fetch(`${apiBaseUrl}/cart/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete cart recipe");
    }

    const data: CartResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to delete cart recipe");
    }

    return data.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    }
  });
};

interface DeleteCartMealkitPayload {
  item_type: "mealkit";
  cart_mealkit_id: number;
}

export const useDeleteCartMealkit = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<CartData, Error, DeleteCartMealkitPayload>({
    mutationFn: async (payload) => {
      const token = getToken() || "";
      const response = await fetch(`${apiBaseUrl}/cart/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete cart mealkit");
    }

    const data: CartResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to delete cart mealkit");
    }

    return data.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    }
  });
}