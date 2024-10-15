import React from "react";
import LoveIcon from "../../../public/icon/love-icon";
import CommentIcon from "../../../public/icon/comment-icon";
import { formatDistanceToNow } from 'date-fns';
import { CommunityRecipeData } from "../../api/recipeApi";
import { CommunityMealkitData } from "../../api/mealkitApi";

type CombinedData = 
  | (CommunityRecipeData & { type: 'recipe' })
  | (CommunityMealkitData & { type: 'mealkit' });

interface NewCommunityCardProps {
  item: CombinedData;
}

interface NewCommunityCardProps {
  item: CombinedData;
}

const NewCommunityCard: React.FC<NewCommunityCardProps> = ({ item }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const renderDietaryDetails = () => {
    if (item.type === 'recipe') {
      return item.dietary_details.slice(0, 1).map((detail, index) => (
        <span
          key={index}
          className="text-[0.4rem] px-1 py-1 outline text-[#7862FC] rounded-full"
        >
          {detail}
        </span>
      ));
    } else {
      return item.dietary_details.slice(0, 1).map((detailId, index) => (
        <span
          key={index}
          className="text-[0.4rem] px-1 py-1 outline text-[#7862FC] rounded-full"
        >
          Dietary {detailId}
        </span>
      ));
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-2 mt-2">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img
              src={item.creator.profile_picture || "/img/no-photo.png"}
              alt={item.creator.name}
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
          <button className="text-[0.5rem] px-4 py-2 outline text-[#7862FC] rounded-full font-semibold">
            Follow
          </button>
        </div>

        <div className="flex flex-row justify-between">
          <div className="mb-4 w-[67%]">
            <h1 className="text-xs font-medium mb-2 flex items-center">
              {item.name}
            </h1>
            <div className="flex space-x-2 mb-2">
              {renderDietaryDetails()}
              {(item.type === 'recipe' ? item.dietary_details.length : item.dietary_details.length) > 1 && (
                <div className="text-[0.4rem] px-1 py-1 outline text-[#7862FC] rounded-full">
                  +{(item.type === 'recipe' ? item.dietary_details.length : item.dietary_details.length) - 1}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-700">
              {item.description.length > 40 ? `${item.description.slice(0, 40)}...` : item.description}
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
            <button className="flex items-center">
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
          {/* <div className="text-xs text-gray-700">
            {item.type === 'recipe' ? `$${item.total_price.toFixed(2)}` : `$${item.price.toFixed(2)}`}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default NewCommunityCard;