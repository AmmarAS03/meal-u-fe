import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { useAuth } from "../contexts/authContext";
import { ProductData } from "./productApi";
import { RecipeData } from "./recipeApi";
import { MealkitData } from "./mealkitApi";

// Interfaces for the API response structure

interface Ingredient {
  id: number;
  name: string;
  image: string | null;
  unit_id: number;
  unit_size: string;
  price_per_unit: string;
}

interface PreparationType {
  id: number;
  name: string;
  additional_price: string;
}

export interface RecipeIngredient {
  ingredient: Ingredient;
  preparation_type: PreparationType | null;
  price: number;
}

export interface CartProduct {
  id: number;
  product: ProductData;
  quantity: number;
}

export interface CartRecipe {
  id: number;
  recipe: RecipeData;
  quantity: number;
}

export interface CartItem {
  id: number;
  product: ProductData;
  quantity: number;
  total_price: number;
}

export interface CartData {
  products: CartItem[];
  recipes: RecipeData[];
  mealkits: MealkitData[];
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
    const response = await fetch(
      "http://meal-u-api.nafisazizi.com:8001/api/v1/cart/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
  item_type: "recipe" | "product" | "mealkit";
  item_id: number;
  quantity: number;
}

interface DeleteCartItemPayload {
  item_type: "recipe" | "product" | "mealkit";
  cart_product_id: number;
}

interface AddCartItemPayload {
  item_type: "recipe" | "product" | "mealkit";
  product_id: number;
  quantity: number;
}

export const useAddCartItem = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<CartData, Error, AddCartItemPayload>({
    mutationFn: async (payload) => {
      const token = getToken() || "";
      const response = await fetch(
        "http://meal-u-api.nafisazizi.com:8001/api/v1/cart/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

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

export const useUpdateCartItem = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<CartData, Error, UpdateCartItemPayload>({
    mutationFn: async (payload) => {
      const token = getToken() || "";
      const response = await fetch(
        "http://meal-u-api.nafisazizi.com:8001/api/v1/cart/",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

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
        "http://meal-u-api.nafisazizi.com:8001/api/v1/cart/",
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
        throw new Error("Failed to delete cart item");
      }

      const data: CartResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to delete cart item");
      }

      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });
};
