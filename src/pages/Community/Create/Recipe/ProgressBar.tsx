import React from 'react';

interface ProgressBarProps {
  currentStep: number; // 1 for General, 2 for Instructions, 3 for Ingredients, 4 for Dietary
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const steps = ['General', 'Instructions', 'Ingredients', 'Dietary'];

  return (
    <div className="w-full max-w-md mx-auto mb-5">
      <div className="relative pt-2">
        {/* Horizontal line */}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-300"></div>
        
        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={`w-4 h-4 rounded-full border-2 border-white ${
                  index + 1 === currentStep 
                    ? 'bg-indigo-600' 
                    : index + 1 < currentStep 
                      ? 'bg-indigo-600' 
                      : 'bg-gray-300'
                } z-10`}
              ></div>
              <span className={`text-xs mt-2 ${
                index + 1 === currentStep ? 'text-indigo-600 font-medium' : 'text-gray-500'
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
