import React, { useState } from 'react';
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
    IonIcon,
    IonImg,
} from '@ionic/react';
import { chevronForward } from 'ionicons/icons';
import { useUpdateOrderStatusToPaid } from '../../api/orderApi';
import { useHistory, useParams } from 'react-router-dom';
import VoucherCard from './VoucherCard';

const PaymentOptions: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const updateOrderStatus = useUpdateOrderStatusToPaid({
        onSuccess: () => {
          setTimeout(() => {
            history.push('/tab4'); 
          }, 100);
        }
      });
    const [useVoucher, setUseVoucher] = useState(false);

    // const { mutate } = useUpdateOrderStatusToPaid({
    //     onSuccess: () => {
    //       setTimeout(() => {
    //         history.push('/tab4'); 
    //       }, 100);
    //     }
    //   });

    const changeStatusToPaid = () => {
        // mutate(parseInt(id));
        updateOrderStatus.mutate({ orderId: parseInt(id), useVoucher: useVoucher})
    }

    const handlePayLater = () => {
        history.push('/home');
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
            <IonContent className='font-sans'>
                <div className="pb-40">
                    <h2 className="text-2xl font-bold text-[#0A2533] px-4 mt-4">Your Card</h2>
                    <IonCard className="bg-[#D9D5FF] rounded-2xl p-4 mb-5">
                        <IonCardContent>
                            <div className="flex justify-between items-start mb-4">
                                <IonText className="text-lg font-bold text-[#0A2533]">Oscar Isaac</IonText>
                                <img src="/payment/mastercard-logo.svg" alt="Mastercard" className="w-15 h-auto" />
                            </div>
                            <IonText className="block text-xl tracking-wider mb-2.5 text-[#0A2533]">4241 9214 7219 3456</IonText>
                            <IonText className="text-sm text-[#0A2533]">12/24</IonText>
                        </IonCardContent>
                    </IonCard>
                    <div className='px-4 mb-2'>
                    <button className="w-full py-3 px-4 rounded-2xl border-2 border-[#7862FC] bg-transparent text-[#7862FC] mb-7.5 flex items-center justify-center hover:bg-[#7862FC] hover:text-white transition-colors duration-300">
                        <span className="mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        </span>
                        Add New Card
                    </button>
                    </div>

                    <VoucherCard useVoucher={useVoucher} setUseVoucher={setUseVoucher} />

                    {/* <h2 className="text-2xl font-bold text-[#0A2533] mb-4 px-4">Other Payment Method</h2>
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
                    /> */}
                </div>
                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 z-50 flex flex-col w-full items-center gap-2.5 rounded-t-3xl">
                    <button 
                        className="flex-1 w-full py-3 px-4 bg-[#7862FC] hover:bg-[#6a56de] active:bg-[#6a56de] focus:bg-[#6a56de] text-white transition-all duration-300 rounded-xl"
                        onClick={changeStatusToPaid}
                    >
                        Pay
                    </button>
                    <button 
                        className="flex-1 w-full py-3 px-4 bg-transparent border-2 border-[#7862FC] text-[#7862FC] hover:bg-[#7862FC] hover:text-white transition-all duration-300 rounded-xl"
                        onClick={handlePayLater}
                    >
                        Pay Later
                    </button>
                </div>
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
        <IonCard className="bg-white rounded-2xl shadow-md mb-3">
            <IonCardContent className="flex items-center p-3">
                <div className="w-12 h-12 mr-4 flex items-center justify-center bg-[#F5F5F5] rounded-xl">
                    <IonImg src={icon} alt={name} />
                </div>
                <div className="flex-grow">
                    <IonText className="text-base font-semibold text-[#0A2533] block mb-1">{name}</IonText>
                    <IonText className="text-sm text-[#97A2B0]">{details}</IonText>
                </div>
                <div className="w-8 h-8 bg-[#0F2930] rounded-lg flex items-center justify-center">
                    <IonIcon icon={chevronForward} className="text-white text-lg" />
                </div>
            </IonCardContent>
        </IonCard>
    );
};

export default PaymentOptions;