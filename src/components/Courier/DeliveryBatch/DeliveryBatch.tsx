import React from 'react';
import { IonIcon } from '@ionic/react';
import { arrowUp, arrowDown } from 'ionicons/icons';

interface DeliveryInfo {
  type: 'Pick Up' | 'Delivery';
  location: string;
  time: string;
}

interface DeliveryBatchProps {
  batchNumber: string;
  pickUp: DeliveryInfo;
  delivery: DeliveryInfo;
}

const DeliveryBatch: React.FC<DeliveryBatchProps> = ({ batchNumber, pickUp, delivery }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-4">
      <h3 className="font-medium text-lg mb-4">Delivery Batch #{batchNumber}</h3>
      <div className="relative">
        <div className="flex items-start mb-6 relative">
          <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center z-10 mr-4">
            <IonIcon icon={arrowUp} className="text-sm" />
          </div>
          <div className="flex-grow">
            <p className="text-xs text-gray-500">{pickUp.type}</p>
            <p className="font-medium">{pickUp.location}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Time</p>
            <p className="font-medium">{pickUp.time}</p>
          </div>
        </div>
        <div className="flex items-start relative">
          <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center z-10 mr-4">
            <IonIcon icon={arrowDown} className="text-sm" />
          </div>
          <div className="flex-grow">
            <p className="text-xs text-gray-500">{delivery.type}</p>
            <p className="font-medium">{delivery.location}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Time</p>
            <p className="font-medium">{delivery.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBatch;