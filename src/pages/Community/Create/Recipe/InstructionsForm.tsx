import { Dispatch, useEffect, useState } from "react";
import { RecipeAction } from './index';
import { CreateRecipePayload } from "../../../../api/recipeApi";
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonReorder,
  IonReorderGroup,
  ItemReorderEventDetail,
  IonText
} from "@ionic/react";
import { toggle, trash } from 'ionicons/icons';

interface InstructionsFormProps {
  state: CreateRecipePayload;
  dispatch: Dispatch<RecipeAction>;
}

const InstructionsForm: React.FC<InstructionsFormProps> = ({ state, dispatch }) => {
  const [instructions, setInstructions] = useState<string[]>([""]); // Start with one empty instruction
  const [toggleDisabled, setToggleDisabled] = useState(true);
  const [instructionsLength, setInstructionsLength] = useState(0);

  useEffect(() => {
    setInstructionsLength(instructions.length);
  }, [instructions])


  useEffect(() => {
    // Sync with global state to save changes even when navigating through pages
    setInstructions(state.recipe.instructions.length ? state.recipe.instructions : [""]);
  }, [state.recipe.instructions]);

  // Handle input change for a specific instruction
  const handleChange = (index: number, value: any) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value || ""; // Extract the value from IonInput's event
    setInstructions(newInstructions);
    
    // Update the state in the parent component
    dispatch({ type: 'SET_FIELD', field: 'instructions', value: newInstructions });
  };


  // Add a new input field if all current fields are filled
  const addNewInstruction = () => {
    if (instructions.every(instruction => instruction.trim() !== "")) {
      setInstructions([...instructions, ""]);
    }
  };

  const handleDelete = (id: number) => {
    setInstructions(instructions.filter((array) => array !== instructions[id]));
  }

  const toggleReorder = () => {
    setToggleDisabled(!toggleDisabled);
  }

  const handleReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
    setInstructions(event.detail.complete(instructions));
    event.detail.complete();
  }

  useEffect(() => {
    if (instructions.length <= 1) {
      setToggleDisabled(true);
    }
  }, [instructions.length])

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col space-y-4 justify-start items-start mb-4">
        <IonLabel className="block text-gray-700 text-sm font-bold mb-2">
          Recipe Instructions
        </IonLabel>
        <IonList>
        <div className="w-full">
        <IonReorderGroup disabled={toggleDisabled} onIonItemReorder={handleReorder}>
          {instructions.map((instruction, index) => (
              <IonItemSliding key={index}>
                <IonItem>
                  <IonInput
                    id={`instruction-${index}`} 
                    type="text"
                    value={instruction}
                    placeholder="Add instructions for your recipe"
                    onIonInput={(e) => handleChange(index, e.target.value)}
                    label={`${index + 1}`}>
                  </IonInput>
                  <IonReorder slot="end"></IonReorder>
                </IonItem>
                <IonItemOptions slot="end">
                  <IonItemOption color="danger" expandable={true} onClick={() => handleDelete(index)}>
                    <IonIcon slot="icon-only" icon={trash}></IonIcon>
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
          ))}
        </IonReorderGroup>
        </div>
        </IonList>
        <div className="w-full flex justify-center">
          <IonText><i>Swipe left on an instruction to delete</i></IonText>
        </div>
        <div className="w-full flex justify-center">
          <IonButton
            expand="block"
            disabled={!instructions.every(instruction => instruction.trim() !== "")}
            onClick={addNewInstruction}
          >
            Add Instruction
          </IonButton>
          {instructionsLength > 1 ? (
            <IonButton
              expand="block"
              onClick={toggleReorder}>
                Reorder
            </IonButton>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default InstructionsForm;
