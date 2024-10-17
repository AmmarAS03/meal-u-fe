import { useEffect, useState } from "react";
import { CartProduct, useDeleteCartItem, useUpdateCartItem } from "../../../api/cartApi";
import Increment from "../../../../public/icon/increment";
import Decrement from "../../../../public/icon/decrement";

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
    <div className="self-stretch h-[100px] px-[9px] py-2 bg-white rounded-2xl shadow border border-neutral-50 flex-col justify-start items-start gap-2.5 flex">
      <div className="w-[623px] justify-start items-center gap-[17px] inline-flex">
        {/* image */}
        <div className="w-[109.93px] h-[84px] relative">
          <img
            src={data.product.image ? data.product.image : "/img/no-photo.png"}
            className="rounded-[10px] w-full h-auto object-cover max-w-[110px] max-h-[85px]"
          />
        </div>

        {/* Main Info Content */}
        <div className="w-[414px] flex-col justify-start items-start gap-1 inline-flex">
          <div className="self-stretch text-[#0a2533] text-base font-bold font-['DM Sans'] leading-snug">{data.product.name}</div>
          
          {/* Dietary nodes */}
          <div className="self-stretch justify-start items-center gap-[4px] inline-flex">
            {/* nodes */}
            {data.product.dietary_details.length > 0 ? (
              data.product.dietary_details.map((dietary, index) => (
                <div className="px-[9.22px] py-[4.61px] bg-[#f1f5f5] rounded-[34.25px] shadow justify-center items-center gap-[8.56px] flex">
                  <div className="text-[#0a2533] text-[9.22px] font-normal font-['DM Sans'] leading-[13.83px]">{dietary}</div>
                </div>
              ))
            ) : null}
          </div>

          {/* price */}
          <div className="self-stretch text-[#0a2533] text-[18.93px] font-bold font-['DM Sans'] leading-[20.83px]">${data.total_price}</div>
        </div>

        {/* Increment Decrement */}
        <div className="w-[26.38px] h-6 justify-center items-center flex">
            <Decrement onClick={handleDecrement} />
              <p className="text-xs">{quantity}</p>
            <Increment onClick={handleIncrement} />
        </div>
      </div>
    </div>
  )
}

export default CartProductsCard;