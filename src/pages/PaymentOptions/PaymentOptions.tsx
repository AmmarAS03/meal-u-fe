import React, { useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonContent,
    IonTitle,
    IonIcon,
} from '@ionic/react';
import { chevronForward } from 'ionicons/icons';
import { useUpdateOrderStatusToPaid } from '../../api/orderApi';
import { useUserPaymentMethods, PaymentMethod } from '../../api/userApi';
import { useHistory, useParams } from 'react-router-dom';
import VoucherCard from './VoucherCard';
import { useQueryClient } from '@tanstack/react-query';

const PaymentOptions: React.FC = () => {
    const queryClient = useQueryClient();
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const updateOrderStatus = useUpdateOrderStatusToPaid({
        onSuccess: () => {
          setTimeout(() => {
            history.push('/tab4'); 
          }, 100);
        }
    });
    const { data: paymentMethods, isLoading, isError } = useUserPaymentMethods();
    const [useVoucher, setUseVoucher] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

    const changeStatusToPaid = () => {
        updateOrderStatus.mutate({ orderId: parseInt(id), useVoucher: useVoucher})
    }

    const refetchCart = () => {
        queryClient.invalidateQueries({ queryKey: ["userOrders"] });
      };
      
    const handlePayLater = () => {
        refetchCart()
        history.push('/home');
    }

    const handleMethodSelect = (method: PaymentMethod) => {
        setSelectedMethod(method);
    }
   
    const handleAddNewCard = () => {
        history.push('/add-card');
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
                    {selectedMethod && (
                        <div className="bg-[#D9D5FF] rounded-2xl p-4 mb-5 mx-4">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-lg font-bold text-[#0A2533]">Card ending in {selectedMethod.last_four_digits}</span>
                                <img src="/payment/mastercard-logo.svg" alt="Mastercard" className="w-15 h-auto" />
                            </div>
                            <span className="block text-xl tracking-wider mb-2.5 text-[#0A2533]">
                                •••• •••• •••• {selectedMethod.last_four_digits}
                            </span>
                            <span className="text-sm text-[#0A2533]">{selectedMethod.expiration_date}</span>
                        </div>
                    )}
                    <div className='px-4 mb-2'>
                        <button 
                            className="w-full py-3 px-4 rounded-2xl border-2 border-[#7862FC] bg-transparent text-[#7862FC] mb-7.5 flex items-center justify-center hover:bg-[#7862FC] hover:text-white transition-colors duration-300"
                            onClick={handleAddNewCard}
                        >
                            <span className="mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                            </span>
                            Add New Card
                        </button>
                    </div>

                    <VoucherCard useVoucher={useVoucher} setUseVoucher={setUseVoucher} />

                    <h2 className="text-2xl font-bold text-[#0A2533] mb-4 px-4">Other Payment Method</h2>
                    {isLoading ? (
                        <div className="text-center">Loading payment methods...</div>
                    ) : isError ? (
                        <div className="text-center text-red-500">Error loading payment methods</div>
                    ) : (
                        paymentMethods?.map((method) => (
                            <PaymentMethodCard
                                key={method.token}
                                icon="/payment/mastercard-logo.svg"
                                name={`Card ending in ${method.last_four_digits}`}
                                details={`Expires ${method.expiration_date}`}
                                onClick={() => handleMethodSelect(method)}
                            />
                        ))
                    )}
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
    onClick: () => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ icon, name, details, onClick }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md mb-3 mx-4" onClick={onClick}>
            <div className="flex items-center p-3">
                <div className="w-12 h-12 mr-4 flex items-center justify-center bg-[#F5F5F5] rounded-xl">
                    <img src={icon} alt={name} className="w-8 h-8" />
                </div>
                <div className="flex-grow">
                    <span className="text-base font-semibold text-[#0A2533] block mb-1">{name}</span>
                    <span className="text-sm text-[#97A2B0]">{details}</span>
                </div>
                <div className="w-8 h-8 bg-[#0F2930] rounded-lg flex items-center justify-center">
                    <IonIcon icon={chevronForward} className="text-white text-lg" />
                </div>
            </div>
        </div>
    );
};

export default PaymentOptions;