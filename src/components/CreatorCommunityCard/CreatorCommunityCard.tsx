import React from "react";
import { IonCard, IonCardHeader } from "@ionic/react";
import RecipeIcon from "../../../public/icon/recipe-icon";
import { TrendingCreatorProfile } from "../../api/userApi";

interface ItemCardProps {
  item: TrendingCreatorProfile;
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
          alt={item.first_name}
          src={item.image|| "/img/no-photo.png"}
          className="w-full h-auto object-cover max-w-[130px] max-h-[90px] rounded-[15px]"
        />
      </div>
      <IonCardHeader className="p-1.5">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-center text-center">
            <p className="m-0 font-bold text-black text-[10px]">
              {item.first_name} {item.last_name}
            </p>
          </div>
          <div className="flex flex-row items-center justify-center gap-1">
            <div className="w-3 h-3">
              <RecipeIcon />
            </div>
            <p className="m-0 text-[6px]">{item.recipe_count} {item.recipe_count > 1 ? "Recipes" : "Recipe"} Created</p>
          </div>
        </div>
      </IonCardHeader>
    </IonCard>
  );
};

export default CreatorCommunityCard;
