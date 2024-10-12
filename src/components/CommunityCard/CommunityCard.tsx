import React from "react";
import LoveIcon from "../../../public/icon/love-icon";
import CommentIcon from "../../../public/icon/comment-icon";
import { formatDistanceToNow } from 'date-fns';

interface Creator {
  name: string;
  profile_picture: string;
}

interface CommunityRecipeData {
  description: string;
  id: number;
  creator: Creator;
  name: string;
  serving_size: number;
  meal_type: string;
  cooking_time: number;
  created_at: string;
  image: string;
  dietary_details: string[];
  total_price: number;
  likes_count: number;
  comments_count: number;
}

interface CommunityCardProps {
  recipe: CommunityRecipeData;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ recipe }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-2 mt-2">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img
              src={recipe.creator.profile_picture || "/img/no-photo.png"}
              alt="William Thacker"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h2 className="text-xs text-xl font-semibold">
                {recipe.creator.name}
              </h2>
              <p className="text-xs text-gray-500">
              {formatDate(recipe.created_at)}
              </p>
            </div>
          </div>
          <button className="text-[0.5rem] px-4 py-2 outline text-[#7862FC] rounded-full font-semibold">
            Follow
          </button>
        </div>

        <div className="flex flex-row justify-between]">
          <div className="mb-4 w-[67%]">
            <h1 className="text-xs font-medium mb-2 flex items-center">
              {recipe.name}
            </h1>
            <div className="flex space-x-2 mb-2">
              {recipe.dietary_details.slice(0, 1).map((detail, index) => (
                <span
                  key={index}
                  className="text-[0.4rem] px-1 py-1 outline text-[#7862FC] rounded-full"
                >
                  {detail}
                </span>
              ))}
              {recipe.dietary_details.length > 1 && (
                <div className="text-[0.4rem] px-1 py-1 outline text-[#7862FC] rounded-full">
                  +{recipe.dietary_details.length - 1}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-700">
            {recipe.description.length > 40 ? `${recipe.description.slice(0, 40)}...` : recipe.description}
            </p>
          </div>

          <div className="mb-4 w-[30%]">
            <img
              src={recipe.image || "/img/no-photo.png"}
              alt={recipe.name}
              className="w-[100px] h-[80px] object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-gray-500">
          <div className="flex items-center space-x-4">
            <button className="flex items-center">
              <div className="flex items-center w-6 h-6 mr-1">
                <LoveIcon />
              </div>
              <span className="text-xs text-gray-700">
                {recipe.likes_count}
              </span>
            </button>
            <button className="flex items-center">
              <div className="flex items-center w-6 h-6 mr-1">
                <CommentIcon />
              </div>
              <span className="text-xs text-gray-700">
                {recipe.comments_count}
              </span>
            </button>
            {/* <button>
             <CommentIcon />
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
