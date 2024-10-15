import { useDeliveryLocations, useDeliveryTimeSlots } from "../../../api/deliveryApi";
import { IonButton } from "@ionic/react";
import styles from './checkout.module.css';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import { useOrder } from '../../../contexts/orderContext';

interface DeliveryLocationPickerProps {
	setIsDeliveryDetailsSet: Dispatch<SetStateAction<boolean>>;
	setIsPickerShown: Dispatch<SetStateAction<boolean>>;
    setDeliveryFee: Dispatch<SetStateAction<number>>;
}

const DeliveryLocationPicker: React.FC<DeliveryLocationPickerProps> = 
({
	setIsDeliveryDetailsSet,
	setIsPickerShown,
    setDeliveryFee,
}) => {
  const [isFieldFilled, setIsFieldFilled] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState(-1);
  const [deliveryBatch, setDeliveryBatch] = useState(-1);
  const [deliveryDate, setDeliveryDate] = useState(new Date());

	const { data: deliveryTimeSlot } = useDeliveryTimeSlots();
	const { data: deliveryData } = useDeliveryLocations();
  const { fillDeliveryLocationDetails, setDeliveryDetails, fillDeliveryTimeSlotDetails } = useOrder();

  useEffect(() => {
    if (deliveryLocation !== -1 && deliveryBatch !== -1) {
        setIsFieldFilled(true);
        setDeliveryDetails({
          deliveryLocation: deliveryLocation,
          deliveryTime: deliveryBatch,
          deliveryDate: deliveryDate,
        });
        deliveryData ? setDeliveryFee(parseInt(deliveryData[deliveryLocation].delivery_fee)) : null;
    } else {
        setIsFieldFilled(false);
    }
  }, [deliveryLocation, deliveryBatch, deliveryDate]);

  const handleSetDeliveryDetails = () => {
		setIsDeliveryDetailsSet(true);
		setIsPickerShown(false);
    fillDeliveryLocationDetails(deliveryLocation);
    fillDeliveryTimeSlotDetails(deliveryBatch);
  }
		
  return (
      <div className={styles.page}>
          <div className={styles.container}>
              Pick your delivery location
              <div className={styles.subcontainer}>
                  {deliveryData?.map((data, index) => (
                      <div key={index} className={styles.card_2_contents}>
                          <div className={styles.column}>
                              <div className={styles.card_title}>
                                  {data.branch}
                              </div>
                              <div>
                                  {data.name}
                              </div>
                          </div>
                          <div className={styles.column}>
                            <p className={styles.clickable_word}>
                              <IonButton onClick={() => setDeliveryLocation(data.id)} size="small" >Set</IonButton>
                            </p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
          <div className={styles.container}>
              Pick your delivery time
              <div className={styles.subcontainer}>
                  {deliveryTimeSlot?.map((data, index) => (
                      <div key={index} className={styles.card_2_contents}>
                          <div className={styles.column}>
                              <div className={styles.card_title}>
                                  {data.name}
                              </div>
                              <div>
                                  {data.start_time} - {data.end_time}
                              </div>
                          </div>
                          <div className={styles.column}>
                            <p className={styles.clickable_word}>
                              <IonButton onClick={() => setDeliveryBatch(data.id)} size="small" >Set</IonButton>
                            </p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
          <div className={styles.container}>
              Pick your delivery Date
              <DatePicker
							  selected={deliveryDate}
								onChange={(date) => {
									if (date) {
										setDeliveryDate(date);
									}}}/>
          </div>
          <div className={styles.button}>
              <IonButton disabled={!isFieldFilled} onClick={handleSetDeliveryDetails}>Continue</IonButton>
          </div>
      </div>
  );
};

export default DeliveryLocationPicker;