import { useEffect, useState } from "react";
import { CartProduct, useDeleteCartItem, useUpdateCartItem } from "../../api/cartApi";
import Increment from "../../../public/icon/increment";
import Decrement from "../../../public/icon/decrement";

interface CartCardProps {
  data: CartProduct;
}

const CartProductsCard: React.FC<CartCardProps> = ({data}) => {
  const pricePerUnit = parseFloat(data.product.price_per_unit);
  const [quantity, setQuantity] = useState(data.quantity);
  const [price, setPrice] = useState(pricePerUnit);
  const updateCartItem = useUpdateCartItem();
  const deleteCartItem = useDeleteCartItem();

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateCartItem.mutate({
      item_type: "product",
      item_id: data.id,
      quantity: newQuantity,
    });
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateCartItem.mutate({
        item_type: "product",
        item_id: data.id,
        quantity: newQuantity,
      });
    } else {
      deleteCartItem.mutate({
        item_type: "product",
        cart_product_id: data.id,
      });
    }
  };

  useEffect(() => {
    setPrice(data.total_price);
  }, [data.total_price, data]);

  return (
    <div className="mb-2">
      <div className="bg-white rounded-2xl shadow border border-neutral-50">
        <div className="p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Image */}
            <div className="w-full sm:w-28 h-20 shrink-0">
              <img
                src={data.product.image ? data.product.image : "/img/no-photo.png"}
                alt={data.product.name}
                className="rounded-lg w-full h-full object-cover"
              />
            </div>

            {/* Main Info Content */}
            <div className="flex-grow min-w-0">
              <h3 className="text-[#0a2533] text-base font-bold font-['DM Sans'] leading-snug mb-1 truncate">
                {data.product.name}
              </h3>
              
              {/* Dietary Details */}
              {data.product.dietary_details.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1">
                  {data.product.dietary_details.map((dietary, index) => (
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
                <span className="text-sm min-w-[20px] text-center">{quantity}</span>
                <button 
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={handleIncrement}
                >
                  <Increment />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartProductsCard;