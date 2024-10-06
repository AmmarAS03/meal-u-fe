import React from 'react';
import { useIonRouter } from '@ionic/react';

interface NavigationButtonsProps {
  currentStep: number; // Add currentStep as a prop
  onPrevious?: () => void; // Function for going to the previous section
  onNext?: () => void; // Function for going to the next section
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ currentStep, onPrevious, onNext }) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <button
        className={`bg-gray-400 text-white font-bold py-2 px-4 rounded ${
          currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        type="button"
        onClick={onPrevious}
        disabled={currentStep === 1} // Disable if on the first step
      >
        Previous Section
      </button>
      <button
        className={`bg-purple-700 text-white font-bold py-2 px-4 rounded ${
          currentStep === 4 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        type="button"
        onClick={onNext}
        disabled={currentStep === 4} // Disable if on the last step
      >
        Next Section
      </button>
    </div>
  );
};

export default NavigationButtons;
