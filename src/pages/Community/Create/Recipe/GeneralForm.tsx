import { IonInput, IonLabel, IonSelect, IonSelectOption } from "@ionic/react";
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
        <IonLabel className="block text-gray-700 text-sm font-bold mb-2">
          Recipe Photo
        </IonLabel>
        <div className="flex justify-center">
          <ImageInput />
        </div>
      </div>
  
      <div className="w-full">
        <IonLabel className="block text-gray-700 text-sm font-bold mb-2">
          Recipe Name
        </IonLabel>
        <IonInput
          id="name"
          type="text"
          value={state.recipe.name}
          placeholder="Recipe Name"
          onIonInput={(e) => handleChange('name')}
          fill="outline"
        />
      </div>
  
      <div className="w-full">
        <IonLabel className="block text-gray-700 text-sm font-bold mb-2">
          Description
        </IonLabel>
        <IonInput
          id="description"
          type="text"
          value={state.recipe.description}
          placeholder="Description"
          onIonInput={(e) => handleChange('description')}
          fill="outline"
        />
      </div>
  
      <div className="w-full">
        <IonLabel className="block text-gray-700 text-sm font-bold mb-2">
          Cooking Time
        </IonLabel>
        <div>
          <div className="flex space-x-2">
            <IonInput
              id="cooking_time"
              type="number"
              value={state.recipe.cooking_time}
              placeholder="Cooking Time"
              onIonInput={(e) => handleChange('cooking_time')}
              min={0}
              fill="outline"
              >
              </IonInput>
            <IonSelect value="minutes">
              <IonSelectOption value="minutes">Minute(s)</IonSelectOption>
              <IonSelectOption value="hours">Hour(s)</IonSelectOption>
            </IonSelect>
          </div>
        </div>
      </div>
  
      <div className="w-full">
        <IonLabel className="block text-gray-700 text-sm font-bold mb-2">
          Number of Servings
        </IonLabel>
        <IonInput
          id="serving_size"
          type="number"
          value={state.recipe.serving_size}
          placeholder="Number of Servings"
          onIonInput={(e) => handleChange('serving_size')}
          min={0}
          fill="outline"
        >
        </IonInput>
      </div>
  
      <div className="w-full">
        <IonLabel className="block text-gray-700 text-sm font-bold mb-2">
          Meal Type
        </IonLabel>
        <IonSelect id="meal_type" placeholder="Select Meal Type" onIonChange={(e) => handleChange('meal_type')} value={state.recipe.meal_type}>
          {meal_types?.map((meal) => (
            <IonSelectOption key={meal.id} value={meal.id}>{meal.name}</IonSelectOption>
          ))}
        </IonSelect>
      </div>
    </div>
  </div>
  
  );
}

export default GeneralForm;