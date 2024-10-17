import React from 'react';

interface ProgressBarProps {
  currentStep: number; // 1 for General, 2 for Instructions, 3 for Ingredients, 4 for Dietary
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        {/* Step 1 */}
        <div className="flex flex-col items-center">
          <div className={`w-4 h-4 rounded-full ${currentStep >= 1 ? 'bg-purple-700' : 'bg-gray-400'}`}></div>
          <span className="text-xs mt-2">General</span>
        </div>

        {/* Dashed Line between Step 1 and Step 2 */}
        <div className="flex-1 h-0.5 border-dashed border-t-2 border-gray-400"></div>

        {/* Step 2 */}
        <div className="flex flex-col items-center">
          <div className={`w-4 h-4 rounded-full ${currentStep >= 2 ? 'bg-purple-700' : 'bg-gray-400'}`}></div>
          <span className="text-xs mt-2">Instructions</span>
        </div>

        {/* Dashed Line between Step 2 and Step 3 */}
        <div className="flex-1 h-0.5 border-dashed border-t-2 border-gray-400"></div>

        {/* Step 3 */}
        <div className="flex flex-col items-center">
          <div className={`w-4 h-4 rounded-full ${currentStep >= 3 ? 'bg-purple-700' : 'bg-gray-400'}`}></div>
          <span className="text-xs mt-2">Ingredients</span>
        </div>

        {/* Dashed Line between Step 3 and Step 4 */}
        <div className="flex-1 h-0.5 border-dashed border-t-2 border-gray-400"></div>

        {/* Step 4 */}
        <div className="flex flex-col items-center">
          <div className={`w-4 h-4 rounded-full ${currentStep >= 4 ? 'bg-purple-700' : 'bg-gray-400'}`}></div>
          <span className="text-xs mt-2">Dietary</span>
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
