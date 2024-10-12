import Cart from "../Cart";
import Checkout from "../Checkout";
import { IonButton, IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from "react";
import styles from './mobilecart.module.css';
import DeliveryLocationPicker from "../Checkout/LocationPicker";
import PaymentDetailsCard from "../Checkout/payment-details-card";
import { cartContents } from "../Cart";
import { useIonRouter } from "@ionic/react";
import { useOrder } from '../../../contexts/orderContext';


export const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const MyCartMobile: React.FC = () => {
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [isDeliveryDetailsSet, setIsDeliveryDetailsSet] = useState(false);
  const [isPickerShown, setIsPickerShown] = useState(false);
  const { cartNotEmpty } = cartContents();
  const { handleOrderCreation } = useOrder();
  const router = useIonRouter();
  //const navigate = useNavigate();


  const handleSetLocation = () => {
    setIsPickerShown(!isPickerShown);
  };

  const createOrderFromCart = () => {
    handleOrderCreation();
    //navigate('/payment-options', {state: (taro sini)})
    router.push("/payment-options");
  }
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/tab1"></IonBackButton>
        </IonButtons>
          <IonTitle>My Cart</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <Cart subTotal={subTotal} setSubTotal={setSubTotal}/>

        {isDeliveryDetailsSet ? 
          <Checkout subTotal={subTotal} total={total} setTotal={setTotal} />
          : null
        }
        {isPickerShown ?
        <DeliveryLocationPicker
          setIsDeliveryDetailsSet={setIsDeliveryDetailsSet}
          setIsPickerShown={setIsPickerShown}
        />
        : null}

        {cartNotEmpty ? (
          isDeliveryDetailsSet ? (
            <div className={styles.subsection}>
              <div className={styles.title}>Payment Summary</div>
                <PaymentDetailsCard subTotal={subTotal} fee={10} total={total}/>
            </div>
          ) : (
            <div className={styles.subsection}>
              <div className={styles.title}>Payment Summary</div>
                <PaymentDetailsCard subTotal={subTotal} fee={null} total={null}/>
                </div>
          )
        ) : null
        }

        <div className={styles.bottom_button}>
          {isDeliveryDetailsSet ? 
          <IonButton expand="block" className={styles.checkout_button} onClick={createOrderFromCart}>
          Proceed to Payment
          </IonButton>
          :
          <IonButton expand="block" disabled={!cartNotEmpty} className={styles.checkout_button} onClick={handleSetLocation}>
          Enter Delivery Details
          </IonButton>}
        </div>
      </IonContent>
    </IonPage>
  )
};


export default MyCartMobile;