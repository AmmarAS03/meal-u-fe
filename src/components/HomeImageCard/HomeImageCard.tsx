import React from "react";
import { useIonRouter } from "@ionic/react";
import RecipeIcon from "../../../public/icon/recipe-icon";

interface HomeImageCardProps {
  creatorImage: string;
  creatorName: string;
  dietaryName: string;
  recipeCount: number;
  creatorId: number;
}

const HomeImageCard: React.FC<HomeImageCardProps> = ({
  creatorImage,
  creatorName,
  dietaryName,
  recipeCount,
  creatorId,
}) => {
  const router = useIonRouter();

  const handleClick = () => {
    router.push(`/community/creator-profile/${creatorId}`);
  };
  return (
    <div
      className="relative w-[65vw] h-30 rounded-3xl overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      {/* Background image */}
      <img
        src="/img/HomeCard.png"
        alt="Food background"
        className="w-full h-full object-cover"
      />

      {/* Overlay content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        {/* Title */}
        <h2 className="text-white text-md font-bold w-[70%]">
          {dietaryName} Category
        </h2>

        {/* Bottom row with profile and followers */}
        <div className="flex items-end justify-between">
          {/* Profile */}
          <div className="flex items-center">
            <img
              src={creatorImage || "/img/no-photo.png"}
              alt={creatorName}
              className="w-8 h-8 rounded-full mr-1 object-cover"
            />
            <span className="text-white text-xs">{creatorName}</span>
          </div>

          {/* Followers */}
          <div className="flex items-center gap-1">
            <div className="w-4 h-4">
              <RecipeIcon color="#ffffff" />
            </div>
            <span className="text-white text-sm">{recipeCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeImageCard;
