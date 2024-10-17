import React, { useReducer, useState, useEffect } from 'react';
import { IonAlert, IonButton, IonButtons, IonCheckbox, IonChip, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonText, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { useRecipesByCreator } from '../../../../api/recipeApi';
import { useUserProfile } from '../../../../api/userApi';
import { CreateMealkitPayload, useCreateMealkit } from '../../../../api/mealkitApi';
import { useDietaryDetails } from '../../../../api/productApi';
import { useHistory } from 'react-router-dom';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { chevronBack, cloudUploadOutline } from 'ionicons/icons';

interface MealkitAction {
  type: string;
  field: keyof CreateMealkitPayload['mealkit'] | 'image';
  value: any;
}

const initialState: CreateMealkitPayload = {
  image: null,
  mealkit: {
    name: '',
    description: '',
    dietary_details: [],
    recipes: [],
  }
};

const mealkitReducer = (state: CreateMealkitPayload, action: MealkitAction): CreateMealkitPayload => {
  switch (action.type) {
    case 'SET_FIELD':
      if (action.field === 'image') {
        return { ...state, [action.field]: action.value };
      } else {
        return { ...state, mealkit: { ...state.mealkit, [action.field]: action.value } };
      }
    default:
      return state;
  }
}

const CreateMealkit: React.FC = () => {
  const history = useHistory();
  const [state, dispatch] = useReducer(mealkitReducer, initialState);
  const { data: userProfile } = useUserProfile();
  const { data: usersRecipes = [], isFetching: isRecipesFetching } = useRecipesByCreator(userProfile!.id);
  const { data: dietaryDetails } = useDietaryDetails();
  const { mutate: handleMealkitCreation } = useCreateMealkit({
    onSuccess: (data) => {
      console.log("data id: ", data.data.id);
      setTimeout(() => {
        history.replace(`/mealkit-details/${data.data.id}`);
      }, 100);
    }
  });

  const router = useIonRouter();
  const [selectedRecipes, setSelectedRecipes] = useState<number[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [anyFieldFilled, setAnyFieldFilled] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const isValid = Boolean(
      state.mealkit.name &&
      state.mealkit.description &&
      state.mealkit.dietary_details.length > 0 &&
      selectedRecipes.length > 0
    );
    setAllFieldsFilled(isValid);
  }, [state, selectedRecipes]);

  useEffect(() => {
    const isValid = Boolean(
      state.image ||
      state.mealkit.name ||
      state.mealkit.description ||
      state.mealkit.dietary_details.length > 0 ||
      state.mealkit.recipes.length > 0
    );
    setAnyFieldFilled(isValid);
  }, [state]);

  const handleBackClick = () => {
    if (anyFieldFilled) {
      setShowAlert(true);
    } else {
      history.replace('/community');
    }
  };

  const handleCreateMealkit = () => {
    if (selectedRecipes.length === 0) {
      alert('Please select at least one recipe');
      return;
    }
    const mealkitData = {
      ...state,
      mealkit: {
        ...state.mealkit,
        recipes: selectedRecipes,
      }
    };
    handleMealkitCreation(mealkitData);
  }

  const handleRecipeToggle = (recipeId: number) => {
    setSelectedRecipes(prev =>
      prev.includes(recipeId) ? prev.filter(id => id !== recipeId) : [...prev, recipeId]
    );
  }

  const handleDietaryToggle = (id: number) => {
    const updatedDietaryDetails = state.mealkit.dietary_details.includes(id)
      ? state.mealkit.dietary_details.filter(item => item !== id)
      : [...state.mealkit.dietary_details, id];
    dispatch({ type: 'SET_FIELD', field: 'dietary_details', value: updatedDietaryDetails });
  }

  const uploadPhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });
      
      setPhoto(image.dataUrl || null);
      dispatch({type: "SET_FIELD", field: "image", value: image.dataUrl});
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  const navigateToCreateRecipe = () => {
    router.push('/community/create/recipe');
  }

  const noRecipeRender = () => {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="w-full max-w-md text-center">
          <IonText>
            It looks like you don't have a recipe yet. Create one to start building your meal kit!
          </IonText>
          <div className="mt-4">
            <IonButton onClick={navigateToCreateRecipe}>Create Recipe</IonButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleBackClick} className="custom-back-button">
              <IonIcon icon={chevronBack} slot="start" 
                style={{
                  fontSize: '24px',
                  marginRight: '2px'
                }}
              />
              <span
                style={{
                  marginLeft: '2px'
                }}
              >
                Back
              </span>
            </IonButton>
          </IonButtons>
          <IonTitle>Create Mealkit</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {usersRecipes.length === 0 ? (
          noRecipeRender()
        ) : (
          <div className="w-full max-w-md mx-auto">
          <div className="mb-4">
            <IonLabel className="block text-gray-700 text-sm font-bold mb-2">
              Mealkit Photo
            </IonLabel>
            <div className="flex justify-center">
              <div className="w-full max-w-md rounded-lg mb-4 border-4 border-dashed border-[#7862FC] p-2">
                {photo ? (
                  <IonImg src={photo} alt="Mealkit Photo" className="w-full rounded-lg shadow-lg" />
                ) : (
                  <div className="grid grid-cols-1 justify-items-center items-center py-20">
                    <p>No image selected</p>
                  </div>
                )}
              </div>
            </div>
            <IonButton expand="block" onClick={uploadPhoto}>
              <IonIcon slot="start" ios={cloudUploadOutline} md={cloudUploadOutline}></IonIcon>
              Upload Photo
            </IonButton>
          </div>

          <div className="mb-4">
            <IonLabel className="block text-gray-700 text-sm font-bold mb-2">
              Mealkit Name
            </IonLabel>
            <IonInput
              value={state.mealkit.name}
              placeholder="Enter mealkit name"
              onIonChange={e => dispatch({ type: 'SET_FIELD', field: 'name', value: e.detail.value! })}
            />
          </div>

          <div className="mb-4">
            <IonLabel className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </IonLabel>
            <IonInput
              value={state.mealkit.description}
              placeholder="Enter mealkit description"
              onIonChange={e => dispatch({ type: 'SET_FIELD', field: 'description', value: e.detail.value! })}
            />
          </div>

          <div className="mb-4">
            <IonLabel className="block text-gray-700 text-sm font-bold mb-2">
              Dietary Details
            </IonLabel>
            <div className="flex flex-wrap gap-2">
              {dietaryDetails?.map((detail) => (
                <IonChip
                  key={detail.id}
                  color={state.mealkit.dietary_details.includes(detail.id) ? 'primary' : 'medium'}
                  onClick={() => handleDietaryToggle(detail.id)}
                >
                  <IonLabel>{detail.name}</IonLabel>
                </IonChip>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <IonLabel className="block text-gray-700 text-sm font-bold mb-2">
              Select Recipes (minimum 1)
            </IonLabel>
            {isRecipesFetching ? (
              <IonText>Loading recipes...</IonText>
            ) : usersRecipes.length === 0 ? (
              <div className="text-center p-4 bg-white rounded-lg shadow-md">
                <IonText>
                  It looks like you don't have a recipe yet. Create one to start building your meal kit!
                </IonText>
                <IonButton onClick={navigateToCreateRecipe}>Create Recipe</IonButton>
              </div>
            ) : (
              <IonList>
                {usersRecipes.map((recipe) => (
                  <IonItem key={recipe.id}>
                    <IonCheckbox
                      slot="start"
                      checked={selectedRecipes.includes(recipe.id)}
                      onIonChange={() => handleRecipeToggle(recipe.id)}
                    />
                    <IonLabel>{recipe.name}</IonLabel>
                  </IonItem>
                ))}
              </IonList>
            )}
          </div>
          {allFieldsFilled ? (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
            <div className="flex justify-between max-w-2xl mx-auto">
            <div className='w-full'>
              <IonButton
                color="tertiary"
                expand="block"
                onClick={handleCreateMealkit}
                className="px-4 py-2 rounded-md bg-primary text-white" 
                disabled={!allFieldsFilled}
              >
                Create Mealkit
              </IonButton>
            </div>
            </div>
            </div>
          ) : null}
        </div>
        )}
        <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Are you sure you want to leave?"
        message="Any changes you've made will not be saved."
        buttons={[
          {
            text: 'Stay',
            role: 'cancel',
            handler: () => {
              setShowAlert(false);
            },
          },
          {
            text: 'Leave',
            role: 'confirm',
            handler: () => {
              history.replace('/community');
            },
          },
        ]}
      />
      </IonContent>
    </IonPage>
  );
}

export default CreateMealkit;