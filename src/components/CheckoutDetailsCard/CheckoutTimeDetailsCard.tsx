import { IonSelect, IonSelectOption } from '@ionic/react';
import styles from './checkout.module.css';
import { useState } from 'react';
import { useOrder } from '../../contexts/orderContext';
import { useDeliveryTimeSlots } from "../../api/deliveryApi";
import { isFuture, parse } from 'date-fns';

interface CheckoutTimeDetailsCardProps {
    data: any;
}

const CheckoutTimeDetailsCard: React.FC<CheckoutTimeDetailsCardProps> = (data) => {
  const { deliveryDetails, setDeliveryDetails, latestTimeSlot } = useOrder();
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const { data: deliveryTimeSlot = [] } = useDeliveryTimeSlots();

  // make sure the cutoff time of the time shown hasn't passed
  const filteredTimeSlot = deliveryTimeSlot?.filter((item) => isFuture(parse(item.cut_off, "HH:mm:ss", new Date(deliveryDetails.deliveryDate))));

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
                deliveryTime: e.detail.value,
              }));
              }}>
            {filteredTimeSlot?.length > 0 ? (
              filteredTimeSlot?.map((data: any) => (
              <IonSelectOption key={data.id} value={data.id}>{data.end_time}</IonSelectOption>
            ))
            ) : (
              <IonSelectOption>No timeslot available for the selected delivery date. Please pick a different delivery date.</IonSelectOption>
            )}
          </IonSelect>
        </div>
      </div>
    </>
  )
}

export default CheckoutTimeDetailsCard;