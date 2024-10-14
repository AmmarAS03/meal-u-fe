import ArrowDownIcon from "../../../../public/icon/arrow-down";
import ArrowUpIcon from "../../../../public/icon/arrow-up";
import styles from "./cart.module.css";
import { useState } from "react";
import Increment from "../../../../public/icon/increment";
import Decrement from "../../../../public/icon/decrement";
import {
  CartMealkit,
  useDeleteCartItem,
  useUpdateCartItem,
} from "../../../api/cartApi";


import CollapsibleRecipeCard from "./collapsible-recipe-card";

interface CollapsibleMealkitCardProps {
  data: CartMealkit;
}

const CollapsibleMealkitCard: React.FC<CollapsibleMealkitCardProps> = ({
  data
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newQuantity, setNewQuantity] = useState(0);
  const updateCartItem = useUpdateCartItem();
  const deleteCartItem = useDeleteCartItem();

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
      deleteCartItem.mutate({
        item_type: "mealkit",
        cart_product_id: data.id,
      });
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.row_card_content}>
        <div className={styles.column}>
          <img
            src={data.image ? data.image : "/img/no-photo.png"}
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
              {data.name.length > 20 ? `${data.name.slice(0, 20)}...` : data.name}
            </p>
          </div>
          <div className={styles.price}>${data.total_price}</div>
        </div>
        <div className={styles.column}>
          <div className={styles.quantity}>
            <Decrement onClick={handleDecrement} />
            <p style={{fontSize: '12px'}}>
            {data.quantity}
            </p>
            <Increment onClick={handleIncrement} />
          </div>
        </div>
        <div className={styles.column} onClick={toggleExpand}>
          {isExpanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </div>
      </div>
      {isExpanded ? (
        <div className="expanded_content">
          {data.recipes.map((data, index) => (
            <CollapsibleRecipeCard
              key={index}
              data={data}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default CollapsibleMealkitCard;
