import React from 'react';
import { IonCard, IonCardHeader } from '@ionic/react';

const SkeletonOrderCard: React.FC = () => {
  return (
    <IonCard className="w-[30vw] flex-none m-2.5 animate-pulse">
      <div className="flex justify-center items-center overflow-hidden p-1.5">
        <div className="w-full h-[90px] bg-gray-300 rounded-[15px]"></div>
      </div>
      <IonCardHeader className="p-1.5">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-center text-center">
            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          </div>
          <div className="flex flex-row gap-0.5 items-center justify-center">
            <div className="w-[5px] h-[5px] bg-gray-300 rounded-full"></div>
            <div className="h-2 bg-gray-200 rounded w-16"></div>
            <div className="h-2 bg-gray-200 rounded w-8"></div>
          </div>
          <div className="h-2 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="flex flex-row gap-1 justify-center">
            <div className="bg-gray-200 rounded-[10px] w-12 h-3"></div>
            <div className="bg-gray-200 rounded-[10px] w-8 h-3"></div>
          </div>
        </div>
      </IonCardHeader>
    </IonCard>
  );
};

export default SkeletonOrderCard;