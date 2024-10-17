import { IonText } from '@ionic/react';
import styles from './checkout.module.css';
import { useOrder } from '../../contexts/orderContext';
import DateModal from '../../pages/MyCart/MyCart-Mobile/DateModal';
import { addDays, format, isPast, parse } from 'date-fns';
import { useEffect, useState } from 'react';

interface CheckoutDetailsCardProps {
}

const CheckoutDateDetailsCard: React.FC<CheckoutDetailsCardProps> = () => {
  const { deliveryDetails } = useOrder();
  
  return (
    <>
    <div className={styles.card}>
        <div className={styles.card_2_contents}>
          <div className={styles.column}>
            <IonText>{deliveryDetails ? format(deliveryDetails.deliveryDate, 'PPPP') : "Haven't set"}</IonText>

          </div>
            <DateModal />
        </div>
      </div>
    </>
  )
}

export default CheckoutDateDetailsCard;