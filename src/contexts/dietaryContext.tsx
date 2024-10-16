import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserProfile } from '../api/userApi';
import { IonAlert } from '@ionic/react';

interface DietaryRequirement {
  id: number;
  name: string;
}

interface DietaryContextType {
  dietaryRequirements: DietaryRequirement[];
  checkDietaryCompatibility: (foodRequirements: string[]) => boolean;
  showIncompatibleFoodWarning: (onConfirm: () => void, onCancel: () => void) => void;
}

const DietaryContext = createContext<DietaryContextType | undefined>(undefined);

export const DietaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dietaryRequirements, setDietaryRequirements] = useState<DietaryRequirement[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertHandlers, setAlertHandlers] = useState<{ onConfirm: () => void; onCancel: () => void } | null>(null);
  const { data: userProfile, isLoading, isError } = useUserProfile();

  useEffect(() => {
    if (userProfile && userProfile.dietary_requirements) {
      setDietaryRequirements(userProfile.dietary_requirements);
    }
  }, [userProfile]);

  const checkDietaryCompatibility = (foodRequirements: string[]): boolean => {
    if (foodRequirements.length === 0){
        return true
    }
    const userDietaryNames = dietaryRequirements.map(req => req.name.toLowerCase());
    return foodRequirements.every(req => userDietaryNames.includes(req.toLowerCase()));
  };

  const showIncompatibleFoodWarning = (onConfirm: () => void, onCancel: () => void) => {
    setAlertHandlers({ onConfirm, onCancel });
    setShowAlert(true);
  };

  const handleAlertConfirm = () => {
    setShowAlert(false);
    alertHandlers?.onConfirm();
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
    alertHandlers?.onCancel();
  };

  const value = {
    dietaryRequirements,
    checkDietaryCompatibility,
    showIncompatibleFoodWarning,
  };

  return (
    <DietaryContext.Provider value={value}>
      {children}
      <IonAlert
        isOpen={showAlert}
        header="Dietary Warning"
        message="This food doesn't meet your dietary requirements. Do you still want to add it to your cart?"
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: handleAlertCancel,
          },
          {
            text: 'Add Anyway',
            role: 'confirm',
            handler: handleAlertConfirm,
          },
        ]}
        onDidDismiss={() => setShowAlert(false)}
      />
    </DietaryContext.Provider>
  );
};

export const useDietary = (): DietaryContextType => {
  const context = useContext(DietaryContext);
  if (context === undefined) {
    throw new Error('useDietary must be used within a DietaryProvider');
  }
  return context;
};