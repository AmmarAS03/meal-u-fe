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

const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
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
      <div className="relative w-full pt-[75%] overflow-hidden">
        <img
          alt={item.name}
          src={item.image || '/img/no-photo.png'}
          className="absolute top-0 left-0 w-full h-full object-cover p-1.5 rounded-[12px]"
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
              className="w-[5px] h-[5px] object-cover rounded-[15px]"
            />
            <p className="m-0 text-[6px]">
              {item.creator.name.length > 15 ? `${item.creator.name.slice(0, 15)}...` : item.creator.name} -
            </p>
            <p className="m-0 text-[6px]">
              ${(item.price || item.total_price || 0).toFixed(2)}
            </p>
          </div>
          {item.cooking_time && (
            <p className="m-0 text-[6px] text-center">
              {item.cooking_time} min | {item.meal_type} | {item.serving_size} serving
            </p>
          )}
          <div className="flex flex-row gap-1 justify-center">
            {item.dietary_details
              .slice(0, 1)
              .map((detail, index) => (
                <div
                  key={index}
                  className="bg-[#F0F0F0] rounded-[10px] px-1.5 py-0.5 text-[8px]"
                >
                  {detail}
                </div>
              ))}
            {item.dietary_details.length > 1 && (
              <div className="bg-[#F0F0F0] rounded-[10px] px-1.5 py-0.5 text-[8px]">
                +{item.dietary_details.length - 1}
              </div>
            )}
          </div>
        </div>
      </IonCardHeader>
    </IonCard>
  );
};

export default ItemCard;