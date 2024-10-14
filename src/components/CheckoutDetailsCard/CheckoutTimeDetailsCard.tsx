import { IonButton, IonText, IonSelect, IonSelectOption } from '@ionic/react';
import styles from './checkout.module.css';
import { useState } from 'react';
import { useOrder } from '../../contexts/orderContext';
import { useDeliveryTimeSlots } from "../../api/deliveryApi";

interface CheckoutTimeDetailsCardProps {
    data: any;
}

const CheckoutTimeDetailsCard: React.FC<CheckoutTimeDetailsCardProps> = (data) => {
  const { setDeliveryDetails } = useOrder();
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const { data: deliveryTimeSlot } = useDeliveryTimeSlots();

    return (
      <>
      <div className={styles.card}>
          <div className={styles.card_2_contents}>
          <IonSelect
              value={selectedTime}
              label="Time"
              placeholder="Not Selected"
              onIonChange={
                (e) => {
                setSelectedTime(e.detail.value);
                setDeliveryDetails((prevDetails) => ({
                  ...prevDetails,
                  deliveryTime: e.detail.value, // update only the time
                }));
                }}>
              {deliveryTimeSlot?.map((data: any) => (
                <IonSelectOption key={data.id} value={data.id}>{data.end_time}</IonSelectOption>
              ))}
            </IonSelect>
          </div>
        </div>
      </>
    )
}

export default CheckoutTimeDetailsCard;