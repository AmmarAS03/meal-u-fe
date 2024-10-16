import Increment from "../../../../public/icon/increment";
import Decrement from "../../../../public/icon/decrement";
import styles from "./cart.module.css";
import { useEffect, useState } from "react";
import {
  CartProduct,
  useDeleteCartItem,
  useUpdateCartItem,
} from "../../../api/cartApi";

interface IngredientRowCardProps {
  data: CartProduct;
}

const IngredientRowCard: React.FC<IngredientRowCardProps> = ({ data }) => {
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

  console.log("data: ", data);
  return (
    <div className={styles.card}>
      <div className={styles.row_card_content}>
        <div className={styles.column}>
          <img
            src={data.product.image || "/img/no-photo.png"}
            style={{
              borderRadius: "10px",
              width: "100%",
              height: "auto",
              objectFit: "cover",
              maxWidth: "60px",
              maxHeight: "60px",
            }}
          />
        </div>
        <div className={styles.column_middle}>
          <div className={styles.card_title}>
            <p style={{ fontSize: "11px", fontWeight: "600" }}>
              {data.product.name.length > 20
                ? `${data.product.name.slice(0, 20)}...`
                : data.product.name}
            </p>
          </div>
          <div className={styles.dietary_details}>
            {data.product.dietary_details?.slice(0, 2).map((item, index) => (
              <div key={index} className={styles.node}>
                {item}
              </div>
            ))}
            {data.product.dietary_details.length > 2 && (
              <div className={styles.node}>
                +{data.product.dietary_details.length - 2}
              </div>
            )}
          </div>
          <div className={styles.price}>${price}</div>
        </div>
        <div className={styles.column}>
          <div className={styles.quantity}>
            <Decrement onClick={handleDecrement} />
            <p style={{ fontSize: "12px" }}>{quantity}</p>
            <Increment onClick={handleIncrement} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientRowCard;
