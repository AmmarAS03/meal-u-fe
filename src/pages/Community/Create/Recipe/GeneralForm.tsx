import { IonButton, IonIcon, IonImg, IonInput, IonLabel, IonSelect, IonSelectOption } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { CreateRecipePayload } from "../../../../api/recipeApi";
import ImageInput from "../../../../components/image-input";
import { useOrder } from "../../../../contexts/orderContext";
import { RecipeAction } from './index';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { cloudUploadOutline } from 'ionicons/icons';

interface GeneralFormProps {
  state: CreateRecipePayload;
  dispatch: React.Dispatch<RecipeAction>;
}

const GeneralForm: React.FC<GeneralFormProps> = ({ state, dispatch }) => {
  const { meal_types } = useOrder();
  const [recipeName, setRecipeName] = useState(state.recipe.name);
  const [description, setDescription] = useState(state.recipe.description);
  const [cookingTime, setCookingTime] = useState(state.recipe.cooking_time);
  const [servingSize, setServingSize] = useState(state.recipe.serving_size);
  const [mealType, setMealType] = useState(state.recipe.meal_type);
  const [photo, setPhoto] = useState<string | null>(state.image);

  useEffect(() => {
    setRecipeName(state.recipe.name);
    setDescription(state.recipe.description);
    setCookingTime(state.recipe.cooking_time);
    setServingSize(state.recipe.serving_size);
    setMealType(state.recipe.meal_type);
    setPhoto(state.image);
  }, [state]);

  const handleChange = (field: keyof CreateRecipePayload['recipe'], value: any) => {
    let processedValue = value;
    
    if (['cooking_time', 'serving_size'].includes(field)) {
      processedValue = Math.max(0, parseInt(value, 10));
    }

    // update local state
    switch (field) {
      case 'name':
        setRecipeName(processedValue);
        break;
      case 'description':
        setDescription(processedValue);
        break;
      case 'cooking_time':
        setCookingTime(processedValue);
        break;
      case 'serving_size':
        setServingSize(processedValue);
        break;
      case 'meal_type':
        setMealType(processedValue);
        break;
    }

    // Update global state
    dispatch({ type: 'SET_FIELD', field, value: processedValue });
  };

  // for uploading photo
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const uploadPhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });
      
      setPhoto(image.dataUrl || null);

      dispatch({type: "SET_FIELD", field: "image", value: image.dataUrl})
    } catch (error) {
      console.error('Error uploading photo:', error);
      setToastMessage('Failed to upload photo');
      setShowToast(true);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <IonLabel className="grow block text-gray-700 text-sm font-bold mb-2">
          Recipe Photo
        </IonLabel>
        <div className="flex justify-center">
          <div className="w-full max-w-md rounded-lg mb-4 border-4 border-dashed border-[#7862FC] p-2">
            {photo ? (
                <IonImg src={photo} alt="Recipe Photo" className="w-full rounded-lg shadow-lg" />
              ) : (
                <div className="grid grid-cols-1 justify-items-center items-center py-20">
                  <p>No image selected</p>
                </div>
              )
            }
          </div>
        </div>
        <IonButton expand="block" onClick={uploadPhoto}>
            <IonIcon slot="start" ios={cloudUploadOutline} md={cloudUploadOutline}>Upload Photo</IonIcon>
        </IonButton>
      </div>
  
      <div className="mb-4">
        <IonLabel className="block text-gray-700 text-sm font-bold mb-2">
          Recipe Name
        </IonLabel>
        <IonInput
          id="name"
          type="text"
          value={recipeName}
          placeholder="Recipe Name"
          onIonInput={(e) => handleChange('name', e.target.value)}
          fill="outline"
        />
      </div>
  
      <div className="mb-4">
        <IonLabel className="block text-gray-700 text-sm font-bold mb-2">
          Description
        </IonLabel>
        <IonInput
          id="description"
          type="text"
          value={state.recipe.description}
          placeholder="Description"
          onIonInput={(e) => handleChange('description', e.target.value)}
          fill="outline"
        />
      </div>
  
      <div className="mb-4">
        <IonLabel className="block text-gray-700 text-sm font-bold mb-2">
          Cooking Time
        </IonLabel>
        <div>
          <div className="flex space-x-2 items-center">
            <IonInput
              id="cooking_time"
              type="number"
              value={state.recipe.cooking_time}
              placeholder="Cooking Time"
              onIonInput={(e) => handleChange('cooking_time', e.target.value)}
              min={0}
              fill="outline"
              >
              </IonInput>
            <IonLabel>Minute(s)</IonLabel>
          </div>
        </div>
      </div>
  
      <div className="mb-4">
        <IonLabel className="block text-gray-700 text-sm font-bold mb-2">
          Number of Servings
        </IonLabel>
        <IonInput
          id="serving_size"
          type="number"
          value={state.recipe.serving_size}
          placeholder="Number of Servings"
          onIonInput={(e) => handleChange('serving_size', e.target.value)}
          min={0}
          fill="outline"
        >
        </IonInput>
      </div>
  
      <div className="mb-4">
        <IonLabel className="block text-gray-700 text-sm font-bold mb-2">
          Meal Type
        </IonLabel>
        <IonSelect id="meal_type" placeholder="Select Meal Type" onIonChange={(e) => handleChange('meal_type', e.target.value)} value={state.recipe.meal_type}>
          {meal_types?.map((meal) => (
            <IonSelectOption key={meal.id} value={meal.id}>{meal.name}</IonSelectOption>
          ))}
        </IonSelect>
      </div>
  </div>
  
  );
}

export default GeneralForm;