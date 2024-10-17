import { useState } from "react";
import ArrowDownIcon from "../../../../public/icon/arrow-down";
import ArrowUpIcon from "../../../../public/icon/arrow-up";
import { CartMealkit, useDeleteCartMealkit, useUpdateCartItem } from "../../../api/cartApi";
import Increment from "../../../../public/icon/increment";
import Decrement from "../../../../public/icon/decrement";
import CartRecipeCard from "./CartRecipeCard";

interface CartCardProps {
  data: CartMealkit;
}

const CartCard: React.FC<CartCardProps> = ({data}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newQuantity, setNewQuantity] = useState(0);
  const updateCartItem = useUpdateCartItem();
  const deleteCartMealkit = useDeleteCartMealkit();

  const toggleExpand = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const handleIncrement = () => {
    const newQuantity = data.quantity + 1;
    setNewQuantity(newQuantity);
    updateCartItem.mutate({
      item_type: "mealkit",
      item_id: data.id,
      quantity: newQuantity,
    });
  };

  const handleDecrement = () => {
    if (data.quantity > 1) {
      const newQuantity = data.quantity - 1;
      setNewQuantity(newQuantity);
      updateCartItem.mutate({
        item_type: "mealkit",
        item_id: data.id,
        quantity: newQuantity,
      });
    } else {
      deleteCartMealkit.mutate({
        item_type: "mealkit",
        cart_mealkit_id: data.id,
      });
    }
  };

  return (
    <div className="relative mb-2">
      <div className={`bg-white rounded-2xl shadow border border-neutral-50 transition-all duration-200 ease-in-out ${isExpanded ? 'rounded-b-none border-b-0' : ''}`}>
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
              {/* price */}
              <div className="self-stretch text-[#0a2533] text-[18.93px] font-bold font-['DM Sans'] leading-[20.83px]">{data.total_price}</div>
            </div>

            {/* Increment Decrement */}
            <div className="w-[26.38px] h-6 justify-center items-center flex">
              <Decrement onClick={handleDecrement} />
              <p className="text-xs">{data.quantity}</p>
              <Increment onClick={handleIncrement} />
            </div>

            {/* Drop down arrow */}
            <div onClick={toggleExpand} className="w-[26.38px] h-6 justify-center items-center flex cursor-pointer">
              {isExpanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </div>
          </div>
        </div>
      </div>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="bg-white rounded-b-2xl shadow border border-t-0 border-neutral-50 overflow-hidden">
          <div className="p-4 space-y-2">
            {data.recipes.map((recipe, index) => (
              <CartRecipeCard key={index} data={recipe} isFromMealkit={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartCard;