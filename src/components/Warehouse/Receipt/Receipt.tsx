import React from 'react';
import { format, parseISO } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';

interface Ingredient {
  ingredient_name: string;
  quantity: number;
  unit_size: string;
  unit_name: string;
  preparation_type?: string;
}

interface Recipe {
  recipe_name: string;
  quantity: number;
  total: string;
  ingredients: Ingredient[];
}

interface MealKit {
  mealkit_name: string;
  quantity: number;
  total: string;
}

interface Product {
  product_name: string;
  quantity: number;
  total: string;
}

interface OrderDetails {
  id: number;
  created_at: string;
  user_id: {
    first_name: string;
    last_name: string;
  };
  total: string;
  meal_kits: MealKit[];
  recipes: Recipe[];
  products: Product[];
  delivery_details: {
    qr_code: string | null;
  }[];
}

const Receipt: React.FC<{ orderDetails: OrderDetails }> = ({ orderDetails }) => (
    <div className="bg-white p-4 w-80 text-sm">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">Meal.U</h2>
        <p>Order Receipt</p>
      </div>
      <div className="mb-4">
        <p>Order ID: {orderDetails.id}</p>
        <p>Date: {format(parseISO(orderDetails.created_at), 'MMM d, yyyy h:mm a')}</p>
        <p>Customer: {orderDetails.user_id.first_name} {orderDetails.user_id.last_name}</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold mb-2">Items:</h3>
        {orderDetails.meal_kits.map((kit, index) => (
          <p key={index}>{kit.quantity}x {kit.mealkit_name} - ${kit.total}</p>
        ))}
        {orderDetails.recipes.map((recipe, index) => (
          <div key={index}>
            <p>{recipe.quantity}x {recipe.recipe_name} - ${recipe.total}</p>
            <ul className="list-disc list-inside pl-4 text-xs">
              {recipe.ingredients.map((ingredient, i) => (
                <li key={i}>
                  {ingredient.ingredient_name} ({ingredient.quantity} x {ingredient.unit_size} {ingredient.unit_name})
                  {ingredient.preparation_type && ` - ${ingredient.preparation_type}`}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {orderDetails.products.map((product, index) => (
          <p key={index}>{product.quantity}x {product.product_name} - ${product.total}</p>
        ))}
      </div>
      <div className="border-t pt-2">
        <p className="font-bold">Total: ${orderDetails.total}</p>
      </div>
      <div className="mt-4 text-center">
        <p>Thank you for ordering from Meal.U!</p>
        {orderDetails.delivery_details[0].qr_code && (
          <QRCodeSVG value={orderDetails.delivery_details[0].qr_code} size={100} className="mx-auto mt-2" />
        )}
      </div>
    </div>
  );

  export default Receipt