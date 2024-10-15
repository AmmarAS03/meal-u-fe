import { IonSelect, IonSelectOption } from '@ionic/react';
import styles from './checkout.module.css';
import { useState } from 'react';
import { useOrder } from '../../contexts/orderContext';
import { useDeliveryLocations } from "../../api/deliveryApi";

interface CheckoutDetailsCardProps {
    data1: string;
    data2: string;
    button: string;
}

const CheckoutDetailsCard: React.FC<CheckoutDetailsCardProps> = ({data1, data2, button}) => {
  const {fillDeliveryLocationDetails, setDeliveryDetails, deliveryLocationDetails } = useOrder();
  const { data: deliveryData } = useDeliveryLocations();
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  
    return (
      <>
      <div className={styles.card}>
          <div className={styles.card_2_contents}>
          <IonSelect
              value={selectedLocation}
              label="Location"
              placeholder="Not Selected"
              onIonChange={
                (e) => {
                  setSelectedLocation(e.detail.value);
                  fillDeliveryLocationDetails(e.detail.value);
                  setDeliveryDetails((prevDetails) => ({
                    ...prevDetails,
                    deliveryLocation: e.detail.value, // update only the location
                  }));
                }
                }>
              {deliveryData?.map((data: any) => (
                <IonSelectOption key={data.id} value={data.id}>{data.name} - {data.branch}</IonSelectOption>
              ))}
            </IonSelect>
          </div>
        </div>
      </>
    )
}

export default CheckoutDetailsCard;