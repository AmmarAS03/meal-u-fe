import React from 'react';
import { IonCard, IonCardHeader } from '@ionic/react';

const SkeletonCreatorCommunityCard: React.FC = () => {
  return (
    <IonCard className="w-[30vw] flex-none m-2.5 animate-pulse">
      <div className="flex justify-center items-center overflow-hidden p-1.5">
        <div className="w-full h-[90px] bg-gray-300 rounded-[15px]"></div>
      </div>
      <IonCardHeader className="p-1.5">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-center">
            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          </div>
          <div className="flex flex-row gap-0.5 items-center justify-center">
            <div className="w-[5px] h-[5px] bg-gray-300 rounded-full"></div>
            <div className="h-2 bg-gray-200 rounded w-16"></div>
            <div className="h-2 bg-gray-200 rounded w-8"></div>
          </div>
        </div>
      </IonCardHeader>
    </IonCard>
  );
};

export default SkeletonCreatorCommunityCard;