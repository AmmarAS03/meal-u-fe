import React from 'react';
import { IonCard, IonCardHeader } from '@ionic/react';

interface Creator {
  name: string;
  profile_picture: string;
}

interface ItemData {
  id: number;
  name: string;
  image: string;
  creator: Creator;
  dietary_details: string[];
  price?: number;
  total_price?: number;
  cooking_time?: number;
  meal_type?: string;
  serving_size?: number;
}

interface ItemCardProps {
  item: ItemData;
  onClick?: (id: number) => void;
}

const HomeItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(item.id);
    }
  };

  return (
    <IonCard
      key={item.id}
      className={`w-[30vw] flex-none m-2.5 ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={handleClick}
    >
      <div className="flex justify-center items-center overflow-hidden p-1.5">
        <img
          alt={item.name}
          src={item.image || '/img/no-photo.png'}
          className="w-full h-auto object-cover max-w-[130px] max-h-[90px] rounded-[15px]"
        />
      </div>
      <IonCardHeader className="p-1.5">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-center text-center">
            <p className="m-0 font-bold text-black text-[10px]">
              {item.name.length > 25 ? `${item.name.slice(0, 25)}...` : item.name}
            </p>
          </div>
          <div className="flex flex-row gap-0.5 items-center justify-center">
            <img
              alt={item.creator.name}
              src={item.creator.profile_picture}
              className="w-[8px] h-[8px] object-cover rounded-[15px]"
            />
            <p className="m-0 text-[6px]">
              {item.creator.name.length > 15 ? `${item.creator.name.slice(0, 15)}...` : item.creator.name} -
            </p>
            <p className="m-0 text-[6px]">
              {item.cooking_time ? `${item.cooking_time} mins` : `$${(item.price || item.total_price || 0).toFixed(2)}`}
            </p>
          </div>
        </div>
      </IonCardHeader>
    </IonCard>
  );
};

export default HomeItemCard;