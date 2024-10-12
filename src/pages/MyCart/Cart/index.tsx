import CollapsibleMealkitCard from "./collapsible-mealkit-card";
import CollapsibleRecipeCard from "./collapsible-recipe-card";
import IngredientRowCard from "./ingredient-row-card";
import React, { Dispatch, SetStateAction, useEffect }from "react";
import styles from './cart.module.css';
import { useCart } from '../../../api/cartApi';

interface CartProps {
  subTotal: number;
  setSubTotal: Dispatch<SetStateAction<number>>;
}

export const cartContents = () => {
  const { data: cartData } = useCart();

  if (cartData?.mealkits.length || cartData?.recipes.length || cartData?.products.length) {
    return ({
      cartNotEmpty: true,
      cartMealkits: cartData.mealkits,
      cartRecipes: cartData.recipes,
      cartProducts: cartData.products,
    })
  } 

  return {
    cartNotEmpty: false,
    cartMealkits: [],
    cartRecipes: [],
    cartProducts: [],
  };
}

const Cart: React.FC<CartProps> = ({subTotal, setSubTotal}) => {
  const { data: cartData } = useCart();

  useEffect(() => {
    if (cartData) {
      setSubTotal(cartData.total_price);
    }
  }, [cartData]);

  if (!cartData) {
    return <div className={styles.empty_cart}>You have no items in your cart right now.</div>;
  }

  return (
    <>
    	<div className={styles.subsection}>
			<div className={styles.title}>Meal Kits</div>
    	  <div className={styles.cards}>
          {cartData.mealkits.length ? (
    	    cartData.mealkits.map((data, index) => (
    	        <CollapsibleMealkitCard key={index} data={data} />
    	    ))
          ) : <div className={styles.empty}>You have no mealkits in your cart.</div>
        }
    	  </div>
    	</div>
    	<div className={styles.subsection}>
			<div className={styles.title}>Recipe</div>
    	  <div className={styles.cards}>
          {cartData.recipes.length ? (
            cartData.recipes.map((data, index) => (
    	        <CollapsibleRecipeCard key={index} data={data}/>
    	    ))
          ) : <div className={styles.empty}>You have no recipes in your cart.</div>
              }
    	  </div>
    	</div>
    	<div className={styles.subsection}>
			<div className={styles.title}>Products</div>
    	  <div className={styles.cards}>
          {cartData.products.length ? (
            cartData.products.map((data, index) => (
    	        <IngredientRowCard key={index} data={data}/>
    	    ))
          ) : <div className={styles.empty}>You have no products in your cart.</div>
          }
    	  </div>
    	</div>
    </>
  )
}

export default Cart;