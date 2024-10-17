import React from 'react';
import { IonCard, IonCardContent, IonText, IonIcon } from '@ionic/react';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';

interface OrderProps {
  orderNumber: string;
  customerName: string;
  isChecked?: boolean;
  onToggle?: () => void;
  showCheckbox?: boolean;
}

const Order: React.FC<OrderProps> = ({ 
  orderNumber, 
  customerName, 
  isChecked = false, 
  onToggle, 
  showCheckbox = false 
}) => {
  return (
    <IonCard className={`mb-4 rounded-xl ${isChecked ? 'border border-[#7862FC]' : ''}`}>
      <IonCardContent className="flex justify-between items-center">
        <div>
          <IonText className="text-gray-500 text-sm">Order #{orderNumber}</IonText>
          <IonText className="block text-black font-base">{customerName}</IonText>
        </div>
        {showCheckbox && onToggle && (
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${isChecked ? 'bg-[#7862FC]' : 'bg-gray-200'}`}
            onClick={onToggle}
          >
            <IonIcon icon={isChecked ? closeCircle : checkmarkCircle} className={isChecked ? 'text-white' : 'text-gray-500'} />
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default Order;