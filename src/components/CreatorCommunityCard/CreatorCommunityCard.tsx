import React from "react";
import { IonCard, IonCardHeader } from "@ionic/react";
import RecipeIcon from "../../../public/icon/recipe-icon";
import FilterIcon from "../../../public/icon/filter";

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

const CreatorCommunityCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(item.id);
    }
  };

  return (
    <IonCard
      key={item.id}
      className={`w-[30vw] flex-none m-2.5 ${
        onClick ? "cursor-pointer" : "cursor-default"
      }`}
      onClick={handleClick}
    >
      <div className="flex justify-center items-center overflow-hidden p-1.5">
        <img
          alt={item.creator.name}
          src={item.creator.profile_picture || "/img/no-photo.png"}
          className="w-full h-auto object-cover max-w-[130px] max-h-[90px] rounded-[15px]"
        />
      </div>
      <IonCardHeader className="p-1.5">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-center text-center">
            <p className="m-0 font-bold text-black text-[10px]">
              {item.creator.name}
            </p>
          </div>
          <div className="flex flex-row items-center justify-center gap-1">
            <div className="w-3 h-3">
              <RecipeIcon />
            </div>
            <p className="m-0 text-[6px]">7 Recipes Created</p>
          </div>
        </div>
      </IonCardHeader>
    </IonCard>
  );
};

export default CreatorCommunityCard;
