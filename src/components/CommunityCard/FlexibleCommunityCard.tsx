import React, { useEffect } from "react";
import LoveIcon from "../../../public/icon/love-icon";
import CommentIcon from "../../../public/icon/comment-icon";
import { formatDistanceToNow } from "date-fns";
import {CommunityRecipeData, useLikeRecipe} from "../../../src/api/recipeApi";
import {CommunityMealkitData, MealkitData, useLikeMealkit} from "../../../src/api/mealkitApi";

interface Creator {
  name: string;
  profile_picture: string;
}

interface FlexibleCommunityCardProps {
  item: CommunityRecipeData | CommunityMealkitData;
  onClick?: () => void;
}

const FlexibleCommunityCard: React.FC<FlexibleCommunityCardProps> = ({ item, onClick }) => {
  const likeRecipeMutation = useLikeRecipe();
  const likeMealkitMutation = useLikeMealkit();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const isRecipe = 'meal_type' in item || 'cooking_time' in item;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const mutation = isRecipe ? likeRecipeMutation : likeMealkitMutation;
    
    mutation.mutate(item.id, {
      onSuccess: () => {
        console.log(`${isRecipe ? 'Recipe' : 'Mealkit'} liked successfully`);
      },
      onError: (error) => {
        console.error(`Failed to like ${isRecipe ? 'recipe' : 'mealkit'}:`, error);
      }
    });
  };
  return (
    <div
      className="max-w-xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-2 mt-2"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img
              src={item.creator.profile_picture || "/img/no-photo.png"}
              alt="Profile Picture"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h2 className="text-xs text-xl font-semibold">
                {item.creator.name}
              </h2>
              <p className="text-xs text-gray-500">
                {formatDate(item.created_at)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-between]">
          <div className="mb-4 w-[67%]">
            <h1 className="text-xs font-medium mb-2 flex items-center">
              {item.name}
            </h1>
            <div className="flex space-x-2 mb-2">
              {item.dietary_details.slice(0, 2).map((detail, index) => (
                <span
                  key={index}
                  className="text-[0.5rem] px-1 py-1 outline text-[#7862FC] rounded-full"
                >
                  {detail}
                </span>
              ))}
              {item.dietary_details.length > 2 && (
                <div className="text-[0.5rem] px-1 py-1 outline text-[#7862FC] rounded-full">
                  +{item.dietary_details.length - 2}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-700">
              {item.description ? ( item.description.length > 55
                ? `${item.description.slice(0, 55)}...`
                : item.description) : null}
            </p>
          </div>

          <div className="mb-4 w-[30%]">
            <img
              src={item.image || "/img/no-photo.png"}
              alt={item.name}
              className="w-[100px] h-[80px] object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-gray-500">
          <div className="flex items-center space-x-4">
            <button className="flex items-center" onClick={handleLike}>
              <div className="flex items-center w-6 h-6 mr-1">
                <LoveIcon />
              </div>
              <span className="text-xs text-gray-700">
                {item.likes_count}
              </span>
            </button>
            <button className="flex items-center">
              <div className="flex items-center w-6 h-6 mr-1">
                <CommentIcon />
              </div>
              <span className="text-xs text-gray-700">
                {item.comments_count}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlexibleCommunityCard;
