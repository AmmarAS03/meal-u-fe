import React, { useReducer, useState, useEffect } from 'react'
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import ProgressBar from './ProgressBar'
import GeneralForm from './GeneralForm'
import { CreateRecipePayload } from '../../../../api/recipeApi';
import InstructionsForm from './InstructionsForm';
import NavigationButtons from './NavigationButton';
import IngredientsForm from './IngredientsForm';
import DietaryDetailsForm from './DietaryDetails';
import Overview from './Overview';
import { useCreateRecipe } from '../../../../api/recipeApi';
import { useHistory } from 'react-router-dom';

export interface RecipeAction {
  type: string;
  field: keyof CreateRecipePayload['recipe'] | 'ingredients' | 'dietary_details' | 'image';
  value: any;
}

const initialState: CreateRecipePayload = {
  recipe: {
    name: '',
    description: '',
    cooking_time: 0,
    serving_size: 0,
    meal_type: 1,
    instructions: [],
  },
  ingredients: [],
  dietary_details: [],
  image: null,
};

const recipeReducer = (state: CreateRecipePayload, action: RecipeAction): CreateRecipePayload => {
  switch (action.type) {
    case 'SET_FIELD':
      if (action.field === 'ingredients' || action.field === 'dietary_details' || action.field === 'image') {
        return { ...state, [action.field]: action.value };
      } else {
        return { ...state, recipe: { ...state.recipe, [action.field]: action.value } };
      }
    default:
      return state;
  }
};

const CreateRecipe: React.FC = () => {
  const history = useHistory();
  const [state, dispatch] = useReducer(recipeReducer, initialState);
  const [currentStep, setCurrentStep] = useState(1);

  const { mutate: handleRecipeCreation } = useCreateRecipe({
    onSuccess: (data) => {
      setTimeout(() => {
        history.replace(`/recipe-details/${data.data.id}`); 
      }, 100);
    }
  });

  const handleNextSection = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePreviousSection = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCreateRecipe = () => {
    console.log(state);
    const response = handleRecipeCreation(state);
    console.log(response);
  }

  const renderSection = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return <GeneralForm state={state} dispatch={dispatch} />
      case 2:
        return <InstructionsForm state={state} dispatch={dispatch} />
      case 3:
        return <IngredientsForm state={state} dispatch={dispatch}/>
      case 4:
        return <DietaryDetailsForm state={state} dispatch={dispatch} />
      case 5:
        return <Overview state={state} />
      default:
        return null;
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
          </IonButtons>
          <IonTitle>Create Recipe</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="w-full max-w-md mx-auto mb-[80px]">
          <ProgressBar currentStep={currentStep} />
          {renderSection(currentStep)}
          {currentStep === 5 ? (
            <NavigationButtons
              currentStep={currentStep}
              onPrevious={handlePreviousSection}
              onNext={handleCreateRecipe}
            />
          ) : (
          <NavigationButtons 
            currentStep={currentStep} 
            onPrevious={handlePreviousSection} 
            onNext={handleNextSection} 
          />
        )}
        </div>
      </IonContent>
    </IonPage>
  )
}

export default CreateRecipe;