import {
    IonButton,
    IonBackButton,
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
  import React, { useRef, useState } from 'react';
  import { OverlayEventDetail } from '@ionic/core/components';
  import { useOrder } from '../../../contexts/orderContext';
  
  const ModalExample = ({ dismiss }: { dismiss: (data?: Date | null, role?: string) => void }) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const inputRef = useRef<HTMLIonDatetimeElement>(null);
  
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

                    // Check if dateValue is a string or an array of strings
                    if (dateValue && typeof dateValue === 'string') {
                      dismiss(new Date(dateValue), 'confirm');
                    } else if (Array.isArray(dateValue) && dateValue.length > 0) {
                      // Handle the case where the dateValue is an array, if needed
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
              min={new Date().toISOString().split("T")[0]} // Set min date to today
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
    const [present, dismiss] = useIonModal(ModalExample, {
      dismiss: (data: Date | null, role: string) => dismiss(data, role),
    });
    const { setDeliveryDetails } = useOrder();
  
    function openModal() {
      present({
        onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
          if (ev.detail.role === 'confirm' && ev.detail.data) {
            setDeliveryDetails((prevDetails) => ({
              ...prevDetails,
              deliveryDate: ev.detail.data, // Update the delivery date
            }));
          }
        },
      });
    }
  
    return (
      <IonButton expand="block" onClick={openModal}>
        Set
      </IonButton>
    );
  }
  
  export default DateModal;
  