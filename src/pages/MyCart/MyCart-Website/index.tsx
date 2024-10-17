import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useState } from "react";
import Cart from "../Cart";
import Checkout from "../Checkout";
import CartWeb from "./CartWeb";
import { useOrder } from '../../../contexts/orderContext';
import { useHistory } from "react-router-dom";
import { useCart } from '../../../api/cartApi';
import CheckoutDetailsWeb from "./CheckoutDetailsWeb";

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

const MyCartWebsite: React.FC = () => {
  const { data: cartData } = useCart();
  const { cartNotEmpty } = cartContents();

  return(
    <IonPage>
      <IonContent className="no-padding">
          <div className="w-[1440px] h-[1131px] pl-[172px] pr-[171px] pt-[169px] pb-[237.52px] bg-white justify-center items-center inline-flex">
            <div className="self-stretch justify-start items-start gap-[47px] inline-flex">
                <div className="w-[641px] flex-col justify-start items-start gap-5 inline-flex">
                    <div className="self-stretch text-black text-[20.96px] font-bold font-['DM Sans'] leading-7">Cart</div>
                    <CartWeb />
                </div>
                <div className="w-[409px] flex-col justify-start items-start gap-5 inline-flex">
                  {cartNotEmpty ? (
                    <>
                    <div className="self-stretch text-black text-[20.96px] font-bold font-['DM Sans'] leading-7">Checkout Details</div>
                    <CheckoutDetailsWeb />
                    </>
                  ) : null }
                </div>
            </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default MyCartWebsite;