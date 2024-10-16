import { IonButton, IonText } from '@ionic/react';
import styles from './checkout.module.css';
import { useState } from 'react';
import { useOrder } from '../../contexts/orderContext';
import DateModal from '../../pages/MyCart/MyCart-Mobile/DateModal';
import { format } from 'date-fns';

interface CheckoutDetailsCardProps {
}

const CheckoutDateDetailsCard: React.FC<CheckoutDetailsCardProps> = () => {
  const { deliveryDetails } = useOrder();
  
    return (
      <>
      <div className={styles.card}>
          <div className={styles.row_two_columns}>
            <div className={styles.column}>
              <IonText>{deliveryDetails ? format(deliveryDetails.deliveryDate, 'PPPP') : "Haven't set"}</IonText>
            </div>
            <div className={styles.column}>
              <DateModal />
            </div>

              {/* <DateModal /> */}
          </div>
        </div>
      </>
    )
}

export default CheckoutDateDetailsCard;