import React from "react";
import { CreateRecipePayload } from "../../../../api/recipeApi";
import ImageInput from "../../../../components/image-input";
import { useOrder } from "../../../../contexts/orderContext";
import { RecipeAction } from './index';

interface GeneralFormProps {
  state: CreateRecipePayload;
  dispatch: React.Dispatch<RecipeAction>;
}

const GeneralForm: React.FC<GeneralFormProps> = ({ state, dispatch }) => {
  const { meal_types } = useOrder();
  const handleChange = (field: keyof CreateRecipePayload['recipe']) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value: string | number = e.target.value;

    if (['cooking_time', 'serving_size', 'meal_type'].includes(field)) {
      value = Math.max(0, parseInt(value, 10));
    }

    dispatch({ type: 'SET_FIELD', field, value });
  };

  return (
    <div className="w-full max-w-md mx-auto">
    <div className="grid grid-cols-1 gap-4 justify-between items-start mb-4">
      <div className="w-full col-span-1">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recipe_photo">
          Recipe Photo
        </label>
        <div className="flex justify-center">
          <ImageInput />
        </div>
      </div>
  
      <div className="w-full">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Recipe Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          value={state.recipe.name}
          onChange={handleChange('name')}
          placeholder="Name"
        />
      </div>
  
      <div className="w-full">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description"
          type="text"
          value={state.recipe.description}
          onChange={handleChange('description')}
          placeholder="Description"
        />
      </div>
  
      <div className="w-full">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cooking_time">
          Cooking Time
        </label>
        <div>
          <div className="flex space-x-2">
            <input
              className="border border-gray-300 rounded-lg p-2 w-full"
              id="cooking_time"
              type="number"
              value={state.recipe.cooking_time}
              onChange={handleChange('cooking_time')}
              placeholder="Cooking Time"
              min={0}
            />
            <select className="border border-gray-300 rounded-lg p-2">
              <option>Minutes</option>
              <option>Hours</option>
            </select>
          </div>
        </div>
      </div>
  
      <div className="w-full">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="serving_size">
          Number of Servings
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="serving_size"
          type="number"
          value={state.recipe.serving_size}
          onChange={handleChange('serving_size')}
          placeholder="Number of Servings"
          min={0}
        />
      </div>
  
      <div className="w-full">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="meal_type">
          Meal Type
        </label>
        <select id="meal_type" onChange={handleChange('meal_type')} value={state.recipe.meal_type}>
          <option value="" disabled>Select a meal type</option>
          {meal_types?.map((meal) => (
            <option key={meal.id} value={meal.id}>
              {meal.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
  
  );
}

export default GeneralForm;