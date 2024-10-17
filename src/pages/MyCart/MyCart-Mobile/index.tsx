import Cart from "../Cart";
import Checkout from "../Checkout";
import { IonButton, IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonModal, IonItem, IonInput, IonLabel, IonSelect, IonSelectOption, IonDatetime } from '@ionic/react';
import React, { useEffect, useState } from "react";
import styles from './mobilecart.module.css';
import { cartContents } from "../Cart";
import { useOrder } from '../../../contexts/orderContext';
import { useHistory } from "react-router-dom";
import PaymentSummaryCard from "../../../components/PaymentSummaryCard/PaymentSummaryCard";


export const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const MyCartMobile: React.FC = () => {
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(-1);
  const [deliveryFee, setDeliveryFee] = useState(-1);
  const [isDeliveryDetailsSet, setIsDeliveryDetailsSet] = useState(false);

  const { cartNotEmpty } = cartContents();
  const { handleOrderCreation, deliveryDetails, deliveryLocationDetails } = useOrder();

  const history = useHistory();

  const createOrderFromCart = async () => {
    const data = await handleOrderCreation()
    history.replace(`/payment-options/${data?.data.order_id}`)
  }

  // make button not disable when delivery details is set
  useEffect(() => {
    if (deliveryDetails.deliveryLocation !== -1 && deliveryDetails.deliveryTime !== -1) {
      setIsDeliveryDetailsSet(true);
    } else {
      setIsDeliveryDetailsSet(false);
    }
  }, [deliveryDetails.deliveryLocation, deliveryDetails.deliveryTime]);

  // set delivery fee when location is set
  useEffect(() => {
    if (deliveryLocationDetails.id !== -1) {
      setDeliveryFee(parseInt(deliveryLocationDetails.delivery_fee))
    }
  }, [deliveryDetails.deliveryLocation])

  
  useEffect(() => {
    const calculateTotal = () => {
        const newTotal = subTotal + parseInt(deliveryLocationDetails.delivery_fee);
        setTotal(newTotal);
    };
    calculateTotal();
  }, [subTotal, total]);

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
        <div className="mb-40">
        <Cart subTotal={subTotal} setSubTotal={setSubTotal}/>

        {cartNotEmpty ? (
          <>
            <div className={styles.subsection}>
              <Checkout />
            </div>
            <div className={styles.subsection}>
              <div className={styles.title}>Payment Summary</div>
              <PaymentSummaryCard subTotal={subTotal} fee={deliveryFee} total={total}/>
            </div>
            <div className={styles.bottom_button}>
              <IonButton expand="block" disabled={!isDeliveryDetailsSet} className={styles.checkout_button} onClick={createOrderFromCart}>
                Proceed to Payment
              </IonButton>
            </div>
          </>
        ) : null
        }
        </div>
        
      </IonContent>
    </IonPage>
  )
};


export default MyCartMobile;