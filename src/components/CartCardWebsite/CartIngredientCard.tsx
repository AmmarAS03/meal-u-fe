import { useEffect, useState } from "react";
import { RecipeIngredient, useDeleteCartIngredient, useUpdateCartItem } from "../../api/cartApi";
import Increment from "../../../public/icon/increment";
import Decrement from "../../../public/icon/decrement";

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
    <div className="mb-2">
      <div className="bg-white rounded-2xl shadow border border-neutral-50">
        <div className="p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Image Section */}
            <div className="w-full sm:w-28 h-20 shrink-0">
              <img
                src={data.ingredient.image || "/img/no-photo.png"}
                alt={data.ingredient.name}
                className="rounded-lg w-full h-full object-cover"
              />
            </div>

            {/* Main Content Section */}
            <div className="flex-grow min-w-0">
              <h3 className="text-[#0a2533] text-base font-bold font-['DM Sans'] leading-snug mb-1 truncate">
                {data.ingredient.name}
              </h3>

              <div className="text-[#0a2533] text-lg font-bold font-['DM Sans']">
                ${data.price}
              </div>
            </div>

            {/* Quantity Controls */}
            {!isFromMealkit && (
              <div className="flex items-center gap-4 ml-auto">
                <button
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={handleDecrement}
                >
                  <Decrement />
                </button>
                <span className="text-sm min-w-[20px] text-center">{quantity}</span>
                <button
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={handleIncrement}
                >
                  <Increment />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartIngredientsCard;