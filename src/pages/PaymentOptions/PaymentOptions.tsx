import React from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonContent,
    IonTitle,
    IonCard,
    IonCardContent,
    IonText,
    IonButton,
    IonIcon,
    IonImg,
} from '@ionic/react';
import { addOutline, chevronForward } from 'ionicons/icons';
import styles from './PaymentOptions.module.css';
import { useUpdateOrderStatusToPaid } from '../../api/orderApi';
import { useHistory, useParams } from 'react-router-dom';

const PaymentOptions: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const { mutate } = useUpdateOrderStatusToPaid({
        onSuccess: () => {
          setTimeout(() => {
            history.replace('/tab4'); 
          }, 100);
        }
      });

    const changeStatusToPaid = () => {
        mutate(parseInt(id));
    }
    
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/" />
                    </IonButtons>
                    <IonTitle>Payment Options</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Your Card</h2>
                    <IonCard className={styles.creditCard}>
                        <IonCardContent>
                            <div className={styles.cardContent}>
                                <IonText className={styles.cardName}>Oscar Isaac</IonText>
                                <img src="/payment/mastercard-logo.svg" alt="Mastercard" className={styles.cardLogo} />
                            </div>
                            <IonText className={styles.cardNumber}>4241 9214 7219 3456</IonText>
                            <IonText className={styles.cardExpiry}>12/24</IonText>
                        </IonCardContent>
                    </IonCard>

                    <IonButton expand="block" fill="outline" className={styles.addCardButton}>
                        <IonIcon icon={addOutline} slot="start" />
                        Add New Card
                    </IonButton>

                    <h2 className={styles.sectionTitle}>Other Payment Method</h2>
                    <PaymentMethodCard
                        icon="/payment/mastercard-visa.svg"
                        name="Mastercard/VISA"
                        details="1240 5231 **** ****"
                    />
                    <PaymentMethodCard
                        icon="/payment/paypal.svg"
                        name="PayPal"
                        details="Add PayPal"
                    />
                    <PaymentMethodCard
                        icon="/payment/money.svg"
                        name="Cash on Delivery"
                        details="Pay in Cash"
                    />
                </div>
                {/* { id ? ( */}
                    <div className={styles.bottom_button}>
                        <IonButton expand="block" className={styles.checkout_button} onClick={changeStatusToPaid} >
                            Pay
                        </IonButton>
                  </div>
                {/* ) : null } */}
            </IonContent>
        </IonPage>
    );
};

interface PaymentMethodCardProps {
    icon: string;
    name: string;
    details: string;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ icon, name, details }) => {
    return (
        <IonCard className={styles.paymentMethodCard}>
            <IonCardContent className={styles.paymentMethodContent}>
                <div className={styles.paymentMethodIcon}>
                    <IonImg src={icon} alt={name} />
                </div>
                <div className={styles.paymentMethodDetails}>
                    <IonText className={styles.paymentMethodName}>{name}</IonText>
                    <IonText className={styles.paymentMethodInfo}>{details}</IonText>
                </div>
                <div className={styles.paymentMethodArrow}>
                    <IonIcon icon={chevronForward} />
                </div>
            </IonCardContent>
        </IonCard>
    );
};

export default PaymentOptions;