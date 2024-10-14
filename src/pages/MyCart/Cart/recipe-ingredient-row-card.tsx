import Increment from "../../../../public/icon/increment";
import Decrement from "../../../../public/icon/decrement";
import styles from "./cart.module.css";
import { useEffect, useState } from "react";
import {
  RecipeIngredient,
  useDeleteCartIngredient,
  useDeleteCartItem,
  useUpdateCartItem,
} from "../../../api/cartApi";
import { IonAlert } from '@ionic/react';

interface RecipeIngredientRowCardProps {
  data: RecipeIngredient;
  isFromMealkit: boolean;
}

const RecipeIngredientRowCard: React.FC<RecipeIngredientRowCardProps> = ({ data, isFromMealkit }) => {
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
          {isFromMealkit ? null : (
            <div className={styles.quantity}>
            <Decrement onClick={handleDecrement} />
            <p style={{ fontSize: "12px" }}>{data.quantity}</p>
            <Increment onClick={handleIncrement} />
          </div>
          )}
        </div>
      </div>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Customization Alert"
        message="After customization, any addition to recipe will multiply from your customized recipe. Are you sure you want to continue?"
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              setShowAlert(false);
            },
          },
          {
            text: 'Continue',
            handler: () => {
              setIsFirstCustomization(false);
              pendingAction();
            },
          },
        ]}
      />
    </div>
  );
};

export default RecipeIngredientRowCard;
