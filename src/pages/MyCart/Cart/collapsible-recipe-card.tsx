import ArrowDownIcon from "../../../../public/icon/arrow-down";
import ArrowUpIcon from "../../../../public/icon/arrow-up";
import Increment from "../../../../public/icon/increment";
import Decrement from "../../../../public/icon/decrement";
import styles from "./cart.module.css";
import { useEffect, useState } from "react";
import {
  useDeleteCartRecipe,
  useUpdateCartItem,
} from "../../../api/cartApi";
import { CartRecipe, } from '../../../api/cartApi'
import RecipeIngredientRowCard from "./recipe-ingredient-row-card";

interface CollapsibleRecipeCardProps {
  data: CartRecipe;
}

const CollapsibleRecipeCard: React.FC<CollapsibleRecipeCardProps> = ({data}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChildExist, setIsChildExist] = useState(false);
  const [newQuantity, setNewQuantity] = useState(0);
  const updateCartItem = useUpdateCartItem();
  const deleteCartRecipe = useDeleteCartRecipe();

  const toggleExpand = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const handleIncrement = () => {
    const newQuantity = data.quantity + 1;
    setNewQuantity(newQuantity);
    updateCartItem.mutate({
      item_type: "recipe",
      item_id: data.id,
      quantity: newQuantity,
    });
  };

  const handleDecrement = () => {
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
  };

  useEffect(() => {
    if (data.ingredients) {
      setIsChildExist(true);
    }
  }, [data.ingredients])

  return (
    <div className={styles.card}>
      <div className={styles.row_card_content}>
        <div className={styles.column}>
          <img
            src={data.image || "/img/no-photo.png"}
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
          <div className={styles.dietary_details}>
            {Object.values(data.dietary_details).map((detail, index) => (
              <div key={index} className={styles.node}>
                {detail}
              </div>
            ))}
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
          {isChildExist ? (
            isExpanded ? (
              <ArrowUpIcon />
            ) : (
              <ArrowDownIcon />
            )
          ) : null}
        </div>
      </div>
      {isExpanded ? (
        <div className="expanded_content">
          {data.ingredients.map((data, index) => (
            <RecipeIngredientRowCard key={index} data={data}/>
          ))}
        </div>
      ) : null}
      </div>
  );
};

export default CollapsibleRecipeCard;
