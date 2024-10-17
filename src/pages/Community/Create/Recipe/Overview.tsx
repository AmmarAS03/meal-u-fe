import React, { useState } from 'react';
import { CreateRecipePayload } from '../../../../api/recipeApi';
import { useOrder } from '../../../../contexts/orderContext';
import { useDietary } from '../../../../contexts/dietaryContext';
import { useDietaryDetails } from '../../../../api/productApi';

interface OverviewProps {
  state: CreateRecipePayload;
}

const Overview: React.FC<OverviewProps> = ({ state }) => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const { getMealTypeFromId, getUnitFromId } = useOrder();
  const { data: dietaryRequirements } = useDietaryDetails();

  const findDietaryFromId = (id: number) => {
    const data = dietaryRequirements?.find((item) => item.id === id);
    return data?.name;
  }

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const renderSectionContent = (section: string) => {
    switch (section) {
      case 'general':
        return (
          <div className="p-4 bg-gray-50">
            <p className="mb-2"><span className="font-semibold">Name:</span> {state.recipe.name}</p>
            <p className="mb-2"><span className="font-semibold">Description:</span> {state.recipe.description}</p>
            <p className="mb-2"><span className="font-semibold">Cooking Time:</span> {state.recipe.cooking_time} minutes</p>
            <p className="mb-2"><span className="font-semibold">Serving Size:</span> {state.recipe.serving_size} portions</p>
            <p className="mb-2"><span className="font-semibold">Meal Type:</span> {getMealTypeFromId(state.recipe.meal_type)}</p>
          </div>
        );
      case 'cooking':
        return (
          <div className="p-4 bg-gray-50">
            <h4 className="font-semibold mb-2">Instructions:</h4>
            <ol className="list-decimal list-inside">
              {state.recipe.instructions.map((instruction, index) => (
                <li key={index} className="mb-1">{instruction}</li>
              ))}
            </ol>
          </div>
        );
      case 'ingredients':
        return (
          <div className="p-4 bg-gray-50">
            <ul className="list-disc list-inside">
              {state.ingredients.map((ingredient, index) => (
                <li key={index} className="mb-1">{ingredient.ingredient.name} - {ingredient.ingredient.unit_size} {getUnitFromId(ingredient.ingredient.unit_id)}</li>
              ))}
            </ul>
          </div>
        );
      case 'dietary':
        return (
          <div className="p-4 bg-gray-50">
            <ul className="list-disc list-inside">
              {state.dietary_details.map((detail, index) => (
                <li key={index} className="mb-1">{findDietaryFromId(parseInt(detail))}</li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  const renderSection = (title: string, section: string) => (
    <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => toggleSection(section)}
        className="w-full px-4 py-2 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex justify-between items-center"
      >
        <span className="font-medium">{title}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${openSection === section ? 'transform rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {openSection === section && renderSectionContent(section)}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Confirm Recipe Details</h2>
      {renderSection('General Details', 'general')}
      {renderSection('Cooking Details', 'cooking')}
      {renderSection('Ingredients', 'ingredients')}
      {renderSection('Dietary Details', 'dietary')}
    </div>
  );
};

export default Overview;