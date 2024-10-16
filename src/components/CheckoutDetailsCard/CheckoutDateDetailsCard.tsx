import { IonText } from '@ionic/react';
import styles from './checkout.module.css';
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
        <div className={styles.card_2_contents}>
          <div className={styles.column}>
            <IonText>{deliveryDetails ? deliveryDetails.deliveryDate.toString() : "Haven't set"}</IonText>

          </div>
            <DateModal />
        </div>
      </div>
    </>
  )
}

export default CheckoutDateDetailsCard;