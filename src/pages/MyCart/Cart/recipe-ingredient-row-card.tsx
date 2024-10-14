import Increment from "../../../../public/icon/increment";
import Decrement from "../../../../public/icon/decrement";
import styles from "./cart.module.css";
import { useEffect, useState } from "react";
import {
  CartProduct,
  RecipeIngredient,
  useDeleteCartItem,
  useUpdateCartItem,
} from "../../../api/cartApi";
import { Ingredient } from "../../../api/recipeApi";

interface RecipeIngredientRowCardProps {
  data: RecipeIngredient;
}

const RecipeIngredientRowCard: React.FC<RecipeIngredientRowCardProps> = ({ data }) => {
  const [quantity, setQuantity] = useState(data.quantity);
  const [price, setPrice] = useState(data.price);
  const updateCartItem = useUpdateCartItem();
  const deleteCartItem = useDeleteCartItem();

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateCartItem.mutate({
      item_type: "ingredient",
      item_id: data.id,
      quantity: newQuantity,
    });
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateCartItem.mutate({
        item_type: "ingredient",
        item_id: data.id,
        quantity: newQuantity,
      });
    } else {
      deleteCartItem.mutate({
        item_type: "ingredient",
        cart_product_id: data.id,
      });
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.row_card_content}>
        <div className={styles.column}>
          <img
            src={data.ingredient.image || "/img/no-photo.png"}
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
              {data.ingredient.name.length > 20
                ? `${data.ingredient.name.slice(0, 20)}...`
                : data.ingredient.name}
            </p>
          </div>
          <div className={styles.price}>${data.price}</div>
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

export default RecipeIngredientRowCard;
