import React, { Dispatch, SetStateAction, useState } from "react";
import { IonChip, IonButton, IonLabel } from "@ionic/react";
import { RecipeAction } from "./index";
import { CreateRecipePayload } from '../../../../api/recipeApi';
import { useDietaryDetails } from "../../../../api/productApi";

interface DietaryDetailsFormProps {
  state: CreateRecipePayload;
  dispatch: Dispatch<RecipeAction>;
}

const DietaryDetailsForm: React.FC<DietaryDetailsFormProps> = ({ state, dispatch }) => {
  const [dietary, setDietary] = useState<number[]>([]);
  const { data: dietaryDetails } = useDietaryDetails();

  const handleDietaryToggle = (id: number) => {
    setDietary((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApplyFilter = async () => {
    dispatch({ type: "SET_FIELD", field: "dietary_details", value: dietary });
  };

  const handleClearFilter = () => {
    setDietary([]);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col space-y-4 justify-between items-center mb-4">
        <div className="w-full">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="instructions">
            Dietary Details
          </label>
          <div className="flex items-center justify-center flex-wrap gap-1.5 w-full">
            {dietaryDetails &&
              dietaryDetails.map((item) => (
                <IonChip
                  key={item.id}
                  onClick={() => handleDietaryToggle(item.id)}
                  color={dietary.includes(item.id) ? "tertiary" : "medium"}
                >
                  <IonLabel>{item.name}</IonLabel>
                </IonChip>
              ))}
          </div>
          <div className="flex flex-row gap-2.5 my-10 mb-1.25 justify-center">
            <IonButton expand="block" fill="clear" onClick={handleClearFilter}>
              Clear
            </IonButton>
            <IonButton expand="block" onClick={handleApplyFilter}>
              Apply
            </IonButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietaryDetailsForm;
