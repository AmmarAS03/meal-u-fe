import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    useIonModal,
    IonLabel,
    IonDatetime,
  } from '@ionic/react';
import { useRef, useState } from 'react';
import { OverlayEventDetail } from '@ionic/core/components';
import { useOrder } from '../../../contexts/orderContext';
import { addDays, format, isPast, parse } from 'date-fns';
  
const ModalDate = ({ dismiss }: { dismiss: (data?: Date | null, role?: string) => void }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const inputRef = useRef<HTMLIonDatetimeElement>(null);
  const { latestTimeSlot } = useOrder();
  
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const [minDate, setMinDate] = useState(today);
  
  // find timeslot with the latest cutoff time
  if (latestTimeSlot) {
    const latestCutOffToday = parse(latestTimeSlot.cut_off, "HH:mm:ss", today);
    const isCurrentTimePast = isPast(latestCutOffToday);
    if (isCurrentTimePast) {
      setMinDate(tomorrow);
    }
  } else {
    // set min date to tomorrow to be safe
    setMinDate(tomorrow);
  }

  const formattedMinDate = format(minDate, "yyyy-MM-dd'T'HH:mm:ss");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => dismiss(null, 'cancel')}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>Select Date</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                  const dateValue = inputRef.current?.value;
                  // dateValue can be a string or an array of strings
                  if (dateValue && typeof dateValue === 'string') {
                    dismiss(new Date(dateValue), 'confirm');
                  } else if (Array.isArray(dateValue) && dateValue.length > 0) {
                    dismiss(new Date(dateValue[0]), 'confirm');
                  } 
              }}
              strong={true}
            >
              Confirm
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="w-full">
          <IonLabel>Pick Delivery Date</IonLabel>
          <IonDatetime
            ref={inputRef}
            presentation="date"
            min={formattedMinDate} // set min date according to current time
            onIonChange={(e) => {
              const value = e.detail.value;
              if (typeof value === 'string') {
                const dateValue = new Date(value);
                setSelectedDate(dateValue);
              }
            }}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

function DateModal() {
  const [present, dismiss] = useIonModal(ModalDate, {
    dismiss: (data: Date | null, role: string) => dismiss(data, role),
  });
  const { setDeliveryDetails } = useOrder();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm' && ev.detail.data) {
          setDeliveryDetails((prevDetails) => ({
            ...prevDetails,
            deliveryDate: ev.detail.data,
          }));
        }
      },
    });
  }

  return (
    <IonButton expand="block" onClick={openModal}>
      Open Date Picker
    </IonButton>
  );
}

export default DateModal;
  