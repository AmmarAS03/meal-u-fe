import React, { useEffect, useReducer, useState, useMemo } from 'react'
import { IonAlert, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from '@ionic/react'
import GeneralForm from './GeneralForm'
import { CreateRecipePayload } from '../../../../api/recipeApi';
import InstructionsForm from './InstructionsForm';
import IngredientsForm from './IngredientsForm';
import DietaryDetailsForm from './DietaryDetails';
import Overview from './Overview';
import { useCreateRecipe } from '../../../../api/recipeApi';
import { useHistory } from 'react-router-dom';
import { chevronBack, informationOutline, listOutline, nutritionOutline, pricetagOutline, textOutline } from 'ionicons/icons';

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
  const { mutate: createRecipe } = useCreateRecipe();

  const segments = [
    { id: 'general', icon: textOutline, label: 'General' },
    { id: 'instructions', icon: listOutline, label: 'Instructions' },
    { id: 'ingredients', icon: nutritionOutline, label: 'Ingredients' },
    { id: 'dietary_details', icon: pricetagOutline, label: 'Dietary' },
    { id: 'overview', icon: informationOutline, label: 'Overview' }
  ];

  const [activeSegment, setActiveSegment] = useState(segments[0].id);

  const handleSegmentChange = (e: CustomEvent) => {
    setActiveSegment(e.detail.value);
  };

  const handleCreateRecipe = async () => {
    console.log(state);
    try {
      await createRecipe(state, {
        onSuccess: (data) => {
          history.replace(`/recipe-details/${data.data.id}`);
        }
      });
    } catch (error) {
      console.error('Failed to create recipe:', error);
    }
  };

  const renderContent = useMemo(() => {
    switch (activeSegment) {
      case 'general':
        return (
          <GeneralForm 
            state={state} 
            dispatch={dispatch} 
          />
        );
      case 'instructions':
        return (
          <InstructionsForm 
            state={state} 
            dispatch={dispatch} 
          />
        );
      case 'ingredients':
        return (
          <IngredientsForm 
            state={state} 
            dispatch={dispatch} 
          />
        );
      case 'dietary_details':
        return (
          <DietaryDetailsForm 
            state={state} 
            dispatch={dispatch} 
          />
        );
      case 'overview':
        return <Overview state={state} />;
      default:
        return null;
    }
  }, [activeSegment, state]);

  const currentIndex = segments.findIndex(s => s.id === activeSegment);
  const isFirstSegment = currentIndex === 0;
  const isLastSegment = currentIndex === segments.length - 1;

  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  useEffect(() => {
    // Check if all required fields are filled
    const isValid = Boolean(
      // General section
      state.recipe.name &&
      state.recipe.description &&
      state.recipe.cooking_time > 0 &&
      state.recipe.serving_size > 0 &&
      
      // Instructions section
      // state.recipe.instructions.length > 0 &&
      
      // Ingredients section
      state.ingredients.length > 0 &&
      
      // Dietary details section
      state.dietary_details.length > 0
    );

    setAllFieldsFilled(isValid);
  }, [state]);

  useEffect(() => {
    const isValid = Boolean(
      // General section
      state.recipe.name ||
      state.recipe.description ||
      state.recipe.cooking_time > 0 ||
      state.recipe.serving_size > 0 ||
      
      // Instructions section
      state.recipe.instructions.length > 0 ||
      
      // Ingredients section
      state.ingredients.length > 0 ||
      
      // Dietary details section
      state.dietary_details.length > 0
    );
    setAnyFieldFilled(isValid);
  }, [state]);

  const navigateToOverview = () => {
    setActiveSegment('overview');
  }

  const [anyFieldFilled, setAnyFieldFilled] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [pendingAction, setPendingAction] = useState<() => void>(() => {});

  const handleBackClick = () => {
    if (anyFieldFilled) {
      setShowAlert(true);
    } else {
      history.replace('/community');
    }
  };
  
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
          <IonTitle>Create Recipe</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="fixed top-[56px] left-0 right-0 bg-white z-10 px-4">
          <div className="w-full max-w-2xl mx-auto">
            <IonSegment value={activeSegment} onIonChange={handleSegmentChange}>
              {segments.map(({ id, icon, label }) => (
                <IonSegmentButton key={id} value={id}>
                  <IonIcon icon={icon} />
                  <IonLabel className="ion-hide-sm-down">{label}</IonLabel>
                </IonSegmentButton>
              ))}
            </IonSegment>
          </div>
        </div>

        <div className="w-full max-w-2xl mx-auto pt-16">
          <div className="mb-20">
            {renderContent}
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
            <div className="flex justify-between max-w-2xl mx-auto">
              {allFieldsFilled ? (isLastSegment ? (
                <div className='w-full'>
                  <IonButton
                    expand="block"
                    onClick={handleCreateRecipe}
                    className="px-4 py-2 rounded-md bg-primary text-white" 
                    disabled={!allFieldsFilled}
                  >
                    Create Recipe
                  </IonButton>
                </div>
              ) : (
                <div className='w-full'>
                  <IonButton
                    expand="block"
                    onClick={navigateToOverview}
                    className="px-4 py-2 rounded-md bg-primary text-white" 
                    disabled={!allFieldsFilled}
                  >
                    Confirm Details
                  </IonButton>
                </div>
              ) ) : (null) }
            </div>
          </div>
        </div>
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
};

export default CreateRecipe;