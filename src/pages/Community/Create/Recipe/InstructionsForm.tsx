import { Dispatch, useState } from "react";
import { RecipeAction } from './index';
import { CreateRecipePayload } from "../../../../api/recipeApi";

interface InstructionsFormProps {
  state: CreateRecipePayload;
  dispatch: Dispatch<RecipeAction>;
}

const InstructionsForm: React.FC<InstructionsFormProps> = ({ state, dispatch }) => {
  const [instructions, setInstructions] = useState<string[]>([""]); // Start with one empty instruction

  // Handle input change for a specific instruction
  const handleChange = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
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

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col space-y-4 justify-start items-start mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Recipe Instructions
        </label>
        {instructions.map((instruction, index) => (
          <div key={index} className="w-full">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id={`instruction-${index}`}
              type="text"
              value={instruction}
              placeholder={`Instruction ${index + 1}`}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          </div>
        ))}
        {/* Center the "Add Instruction" button */}
        <div className="w-full flex justify-center">
          <button
            className={`mt-4 px-4 py-2 rounded bg-blue-500 text-white ${!instructions.every(instruction => instruction.trim() !== "") ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!instructions.every(instruction => instruction.trim() !== "")}
            onClick={addNewInstruction}
          >
            Add Instruction
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstructionsForm;
