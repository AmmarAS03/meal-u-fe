import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useState } from "react";
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
  const [subTotal, setSubTotal] = useState(-1);

  useEffect(() => {
    if (cartData) {
      setSubTotal(cartData.total_price);
    }
  }, [cartData]);

  return(
    <IonPage>
      <IonContent className="no-padding">
        <div className="min-h-screen bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Cart Section */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-black mb-6">Cart</h2>
                <CartWeb />
              </div>

              {/* Checkout Details Section */}
              {cartNotEmpty && (
                <div className="w-full lg:w-[400px]">
                  <h2 className="text-xl font-bold text-black mb-6">Checkout Details</h2>
                  <CheckoutDetailsWeb subTotal={subTotal} setSubTotal={setSubTotal}/>
                </div>
              )}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default MyCartWebsite;