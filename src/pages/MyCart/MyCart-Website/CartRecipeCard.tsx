import { useEffect, useState } from "react";
import ArrowDownIcon from "../../../../public/icon/arrow-down";
import ArrowUpIcon from "../../../../public/icon/arrow-up";
import { CartRecipe, useDeleteCartRecipe, useUpdateCartItem } from "../../../api/cartApi";
import Increment from "../../../../public/icon/increment";
import Decrement from "../../../../public/icon/decrement";
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
      <div className="px-[9px] py-2">
      <div className="w-[623px] justify-start items-center gap-[17px] inline-flex">
        {/* image */}
        <div className="w-[109.93px] h-[84px] relative">
        <img
            src={data.image ? data.image : "/img/no-photo.png"}
            className="rounded-[10px] w-full h-auto object-cover max-w-[110px] max-h-[85px]"
          />
        </div>
        {/* Main Info Content */}
        <div className="w-[414px] flex-col justify-start items-start gap-1 inline-flex">
          <div className="self-stretch text-[#0a2533] text-base font-bold font-['DM Sans'] leading-snug">{data.name}</div>
          {/* Dietary nodes */}
          <div className="self-stretch justify-start items-center gap-[3.46px] inline-flex">
            {/* Nodes -> TODO: slice */}
            {data.dietary_details.length > 0 ? (
                data.dietary_details.map((dietary, index) => (
                    <div className="px-[9.22px] py-[4.61px] bg-[#f1f5f5] rounded-[34.25px] shadow justify-center items-center gap-[8.56px] flex">
                      <div className="text-[#0a2533] text-[9.22px] font-normal font-['DM Sans'] leading-[13.83px]">{dietary}</div>
                    </div>
                ))
            ) : null }
          </div>
          {/* price */}
          <div className="self-stretch text-[#0a2533] text-[18.93px] font-bold font-['DM Sans'] leading-[20.83px]">${data.total_price}</div>
        </div>

        {/* Increment Decrement */}
        <div className="w-[26.38px] h-6 justify-center items-center flex">
            <Decrement onClick={handleDecrement} />
              <p className="text-xs">{data.quantity}</p>
            <Increment onClick={handleIncrement} />
        </div>

        {/* Drop down arrow */}
        <div onClick={toggleExpand} className="w-[26.38px] h-6 justify-center items-center flex">
          {isExpanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded ? (
        <div className="bg-white rounded-b-2xl shadow border border-t-0 border-neutral-50 overflow-hidden">
        <div className="p-4 space-y-2">
          {data.ingredients.map((data, index) => (
            <CartIngredientsCard key={index} data={data} isFromMealkit={true} />
          ))}
        </div>
        </div>
      ) : null }
    </div>
    </div>
  )
}

export default CartRecipeCard;