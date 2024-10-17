import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useAuth } from '../contexts/authContext';

interface Creator {
  name: string;
  profile_picture: string;
}

interface RecipePreview {
  id: number;
  creator: Creator;
  name: string;
  serving_size: number;
  meal_type: string;
  cooking_time: number;
  created_at: string;
  image: string;
  dietary_details: string[];
  total_price: number;
}

export interface ProductData {
  id: number;
  name: string;
  unit_id: string;
  unit_size: string;
  price_per_unit: string;
  measurement_size: string;
  price_per_measurement: string;
  image: string | null;
  description: string;
  stock: number;
  dietary_details: string[];
  product_nutrition: ProductNutrition | null;
  recipes: RecipePreview[];
  total_price: number;
  category_id: string;
}

interface ProductNutrition {
  servings_per_package: number;
  serving_size: string;
  energy_per_serving: string;
  protein_per_serving: string;
  fat_total_per_serving: string;
  saturated_fat_per_serving: string;
  carbohydrate_per_serving: string;
  sugars_per_serving: string;
  dietary_fibre_per_serving: string;
  sodium_per_serving: string;
  energy_per_100g: string;
  protein_per_100g: string;
  fat_total_per_100g: string;
  saturated_fat_per_100g: string;
  carbohydrate_per_100g: string;
  sugars_per_100g: string;
  dietary_fibre_per_100g: string;
  sodium_per_100g: string;
}

interface ProductListParams {
  search: string;
}

export const useProductList = (params: ProductListParams): UseQueryResult<ProductData[], Error> => {
  const { getToken } = useAuth();
  const token = getToken() || '';

  const fetchProduct = async (): Promise<ProductData[]> => {
    const url = params.search && params.search !== "Show All"
      ? `http://meal-u-api.nafisazizi.com:8001/api/v1/groceries/products/?search=${encodeURIComponent(params.search)}`
      : 'http://meal-u-api.nafisazizi.com:8001/api/v1/groceries/products/';

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
      throw new Error(data.message || 'Failed to fetch product');
    }

    return data.data;
  };

  return useQuery<ProductData[], Error, ProductData[], [string, ProductListParams]>({
    queryKey: ['product.list', params],
    queryFn: fetchProduct,
    initialData: [],
    enabled: !!token,
  });
};

export const fetchProductDetails = async (productId: number, token: string): Promise<ProductData> => {
  if (!token) {
    throw new Error('No authentication token available');
  }

  const response = await fetch(`http://meal-u-api.nafisazizi.com:8001/api/v1/groceries/product/${productId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch product details');
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch product details');
  }

  return data.data;
};

export interface DietaryDetail {
  id: number;
  name: string;
}

export const useDietaryDetails = (): UseQueryResult<DietaryDetail[], Error> => {
  const { getToken } = useAuth();
  const token = getToken() || '';

  const fetchDietaryDetails = async (): Promise<DietaryDetail[]> => {
    const url = 'http://meal-u-api.nafisazizi.com:8001/api/v1/groceries/dietary-details/';

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dietary details');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch dietary details');
    }

    return data.data;
  };

  return useQuery<DietaryDetail[], Error>({
    queryKey: ['dietary.details'],
    queryFn: fetchDietaryDetails,
    initialData: [],
    enabled: !!token,
  });
};

export interface UnitData {
  id: number;
  name: string;
}

export const useUnitList = (): UseQueryResult<UnitData[], Error> => {
  const { getToken } = useAuth();
  const token = getToken() || '';

  const fetchUnits = async (): Promise<UnitData[]> => {
    const url = 'http://meal-u-api.nafisazizi.com:8001/api/v1/groceries/units';

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch units');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch units');
    }

    return data.data;
  };

  return useQuery<UnitData[], Error, UnitData[], [string]>({
    queryKey: ['unit.list'],
    queryFn: fetchUnits,
    initialData: [],
    enabled: !!token,
  });
};

export interface MealType {
  id: number;
  name: string;
}

export const useMealTypeList = (): UseQueryResult<MealType[], Error> => {
  const { getToken } = useAuth();
  const token = getToken() || '';

  const fetchMealTypes = async (): Promise<MealType[]> => {
    const url = 'http://meal-u-api.nafisazizi.com:8001/api/v1/community/meal-types';

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch meal types');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch meal types');
    }

    return data.data;
  };

  return useQuery<MealType[], Error, MealType[], [string]>({
    queryKey: ['mealType.list'],
    queryFn: fetchMealTypes,
    initialData: [],
    enabled: !!token,
  });
};

