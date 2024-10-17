import { useEffect, useState } from "react";
import { RecipeIngredient, useDeleteCartIngredient, useUpdateCartItem } from "../../../api/cartApi";
import Increment from "../../../../public/icon/increment";
import Decrement from "../../../../public/icon/decrement";

interface CartCardProps {
  data: RecipeIngredient;
  isFromMealkit: boolean;
}

const CartIngredientsCard: React.FC<CartCardProps> = ({data, isFromMealkit}) => {
  const [quantity, setQuantity] = useState(data.quantity);
  const [showAlert, setShowAlert] = useState(false);
  const [isFirstCustomization, setIsFirstCustomization] = useState(true);
  const [pendingAction, setPendingAction] = useState<() => void>(() => {});
  const updateCartItem = useUpdateCartItem();
  const deleteCartIngredient = useDeleteCartIngredient();

  const handleCustomization = (action: () => void) => {
    if (isFirstCustomization) {
      setShowAlert(true);
      setPendingAction(() => action);
    } else {
      action();
    }
  };

  const handleIncrement = () => {
    handleCustomization(() => {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      updateCartItem.mutate({
        item_type: "ingredient",
        item_id: data.id,
        quantity: newQuantity,
      });
    });
  };

  useEffect(() => {
    setQuantity(data.quantity);
  }, [data.quantity]);

  const handleDecrement = () => {
    handleCustomization(() => {
      if (quantity > 1) {
        const newQuantity = quantity - 1;
        setQuantity(newQuantity);
        updateCartItem.mutate({
          item_type: "ingredient",
          item_id: data.id,
          quantity: newQuantity,
        });
      } else {
        deleteCartIngredient.mutate({
          item_type: "ingredient",
          cart_ingredient_id: data.id,
        });
      }
    });
  };

  return (
    <div className="self-stretch h-[100px] px-[9px] py-2 bg-white rounded-2xl shadow border border-neutral-50 flex-col justify-start items-start gap-2.5 flex">
      <div className="w-[623px] justify-start items-center gap-[17px] inline-flex">
        {/* image */}
        <div className="w-[109.93px] h-[84px] relative">
          <img
            src={data.ingredient.image ? data.ingredient.image : "/img/no-photo.png"}
            className="rounded-[10px] w-full h-auto object-cover max-w-[110px] max-h-[85px]"
          />
        </div>

        {/* Main Info Content */}
        <div className="w-[414px] flex-col justify-start items-start gap-1 inline-flex">
          <div className="self-stretch text-[#0a2533] text-base font-bold font-['DM Sans'] leading-snug">{data.ingredient.name}</div>

          {/* price */}
          <div className="self-stretch text-[#0a2533] text-[18.93px] font-bold font-['DM Sans'] leading-[20.83px]">${data.price}</div>
        </div>

        {/* Increment Decrement */}
        {isFromMealkit ? null : (
          <div className="w-[26.38px] h-6 justify-center items-center flex">
            <Decrement onClick={handleDecrement} />
              <p className="text-xs">{quantity}</p>
            <Increment onClick={handleIncrement} />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartIngredientsCard;