import { useEffect, useState } from "react";
import ArrowDownIcon from "../../../public/icon/arrow-down";
import ArrowUpIcon from "../../../public/icon/arrow-up";
import { CartRecipe, useDeleteCartRecipe, useUpdateCartItem } from "../../api/cartApi";
import Increment from "../../../public/icon/increment";
import Decrement from "../../../public/icon/decrement";
import CartProductsCard from "./CartProductsCard";
import CartIngredientsCard from "./CartIngredientCard";

interface CartRecipeCardProps {
  data: CartRecipe;
  isFromMealkit: boolean;
}

const CartRecipeCard: React.FC<CartRecipeCardProps> = ({data, isFromMealkit}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChildExist, setIsChildExist] = useState(false);
  const [newQuantity, setNewQuantity] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [isFirstCustomization, setIsFirstCustomization] = useState(true);
  const [pendingAction, setPendingAction] = useState<() => void>(() => {});

  const updateCartItem = useUpdateCartItem();
  const deleteCartRecipe = useDeleteCartRecipe();

  const toggleExpand = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const handleCustomization = (action: () => void) => {
    if (isFirstCustomization) {
      setShowAlert(true);
      setPendingAction(() => action);
    } else {
      action();
    }
  };

  const handleIncrement = () => {
    if (isFromMealkit) {
      handleCustomization(() => {
        const newQuantity = data.quantity + 1;
        setNewQuantity(newQuantity);
        updateCartItem.mutate({
          item_type: "recipe",
          item_id: data.id,
          quantity: newQuantity,
        });
      });
    } else {
    const newQuantity = data.quantity + 1;
    setNewQuantity(newQuantity);
    updateCartItem.mutate({
      item_type: "recipe",
      item_id: data.id,
      quantity: newQuantity,
    });
    }
  };

  const handleDecrement = () => {
    if (isFromMealkit) {
      handleCustomization(() => {
        if (data.quantity > 1) {
          const newQuantity = data.quantity - 1;
          setNewQuantity(newQuantity);
          updateCartItem.mutate({
            item_type: "recipe",
            item_id: data.id,
            quantity: newQuantity,
          });
        } else {
          deleteCartRecipe.mutate({
            item_type: "recipe",
            cart_recipe_id: data.id,
          });
        }
      })
    } else {
      if (data.quantity > 1) {
        const newQuantity = data.quantity - 1;
        setNewQuantity(newQuantity);
        updateCartItem.mutate({
          item_type: "recipe",
          item_id: data.id,
          quantity: newQuantity,
        });
      } else {
        deleteCartRecipe.mutate({
          item_type: "recipe",
          cart_recipe_id: data.id,
        });
      }
    }
  };

  useEffect(() => {
    if (data.ingredients) {
      setIsChildExist(true);
    }
  }, [data.ingredients])

  return (
    <div className="relative mb-2">
      <div className={`bg-white rounded-2xl shadow border border-neutral-50 transition-all duration-200 ease-in-out ${isExpanded ? 'rounded-b-none border-b-0' : ''}`}></div>
      <div className="p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Image */}
          <div className="w-full sm:w-28 h-20 shrink-0">
            <img
              src={data.image ? data.image : "/img/no-photo.png"}
              alt={data.name}
              className="rounded-lg w-full h-full object-cover"
            />
          </div>

          {/* Main Info Content */}
          <div className="flex-grow min-w-0">
            <h3 className="text-[#0a2533] text-base font-bold font-['DM Sans'] leading-snug mb-1 truncate">
              {data.name}
            </h3>
            
            {/* Dietary Details */}
            {data.dietary_details.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1">
                {data.dietary_details.map((dietary, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-[#f1f5f5] rounded-full text-[#0a2533] text-xs"
                  >
                    {dietary}
                  </span>
                ))}
              </div>
            )}
            
            <div className="text-[#0a2533] text-lg font-bold font-['DM Sans']">
              ${data.total_price}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button 
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                onClick={handleDecrement}
              >
                <Decrement />
              </button>
              <span className="text-sm min-w-[20px] text-center">{data.quantity}</span>
              <button 
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                onClick={handleIncrement}
              >
                <Increment />
              </button>
            </div>

            {/* Expand/Collapse */}
            <button 
              onClick={toggleExpand}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isExpanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="bg-white rounded-b-2xl shadow border border-t-0 border-neutral-50 overflow-hidden">
          <div className="p-4 space-y-2">
            {data.ingredients.map((ingredient, index) => (
              <CartIngredientsCard key={index} data={ingredient} isFromMealkit={isFromMealkit} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CartRecipeCard;