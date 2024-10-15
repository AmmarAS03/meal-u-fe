import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonContent,
  IonTitle,
  IonIcon,
  IonSpinner,
  IonModal,
  IonInput,
  IonToast,
} from '@ionic/react';
import { timeOutline, cubeOutline, locationOutline, closeOutline, bicycleOutline, basketOutline, lockClosedOutline } from 'ionicons/icons';
import { useOrderDetails, useUpdateOrderStatusToCompleted } from '../../api/orderApi';
import { QRCodeSVG } from 'qrcode.react';

const DeliveryStatus: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: order, isLoading, error } = useOrderDetails(parseInt(id));
    const updateOrderStatus = useUpdateOrderStatusToCompleted();
    const [showQRCode, setShowQRCode] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [showPasscodeInput, setShowPasscodeInput] = useState(false);
    const [passcode, setPasscode] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);
    const [startY, setStartY] = useState(0);
    const [currentY, setCurrentY] = useState(0);
  
    useEffect(() => {
      if (isClosing) {
        const timer = setTimeout(() => {
          setShowQRCode(false);
          setIsClosing(false);
        }, 300);
        return () => clearTimeout(timer);
      }
    }, [isClosing]);
  
    const closeModal = () => {
      setIsClosing(true);
    };
  
    const handleTouchStart = (e: React.TouchEvent) => {
      setStartY(e.touches[0].clientY);
    };
  
    const handleTouchMove = (e: React.TouchEvent) => {
      setCurrentY(e.touches[0].clientY);
    };
  
    const handleTouchEnd = () => {
      if (currentY - startY > 50) {
        closeModal();
      }
      setStartY(0);
      setCurrentY(0);
    };  

    const handleContinue = () => {
        setShowPasscodeInput(true);
      };

      const handleBack = () => {
        setShowPasscodeInput(false);
      };

      const handleConfirmOrder = async () => {
        if (!order) return;

        try {
            await updateOrderStatus.mutateAsync({ orderId: order.id, passcode });
            setToastMessage('Order confirmed successfully');
            setShowToast(true);
            closeModal();
        } catch (error) {
            if (error instanceof Error) {
                setToastMessage(error.message);
            } else {
                setToastMessage('An error occurred while confirming the order');
            }
            setShowToast(true);
        }
    };
    

  const getStatusMessage = (status: number) => {
    switch (status) {
      case 1: return 'Your order is pending';
      case 2: return 'Your order has been paid';
      case 3: return 'Your order is being prepared';
      case 4: return 'Your order is ready for pickup';
      case 5: return 'Your order is being delivered';
      case 6: return 'Your order is stored on your designated locker';
      case 7: return 'Your order is completed';
      case 8: return 'Your order has been cancelled';
      default: return 'Order status unknown';
    }
  };

  const getStatusPoints = (status: number) => {
    return Math.min(status, 6);
  };

  if (isLoading) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <IonSpinner />
        </IonContent>
      </IonPage>
    );
  }

  if (error || !order) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <p>Error loading order details. Please try again later.</p>
        </IonContent>
      </IonPage>
    );
  }

  const statusPoints = getStatusPoints(order.order_status);

  return (
    <IonPage>
      <IonHeader collapse='fade'>
        <IonToolbar className='font-sans'>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/orders" />
          </IonButtons>
          <IonTitle>Your Order</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding font-sans">
        <div className="bg-[#F3F1FF] rounded-xl p-4 mb-6">
          <h2 className="text-[#7862FC] font-semibold mb-1">Status:</h2>
          <p className="text-[#0A2533] font-medium">{getStatusMessage(order.order_status)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="space-y-4">
            {statusPoints >= 6 && (
              <div className="flex items-start relative">
                <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-[#7862FC] bg-dashed" style={{backgroundSize: '1px 8px'}}></div>
                <IonIcon icon={lockClosedOutline} className="text-[#7862FC] w-6 h-6 mr-3 flex-shrink-0 z-10 bg-white" />
                <div>
                  <h3 className="font-semibold text-[#0A2533]">Order is stored on your locker</h3>
                  <p className="text-[#97A2B0]">Please use the QR code to unlock</p>
                </div>
              </div>
            )}
            {statusPoints >= 5 && (
              <div className="flex items-start relative">
                <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-[#7862FC] bg-dashed" style={{backgroundSize: '1px 8px'}}></div>
                <IonIcon icon={bicycleOutline} className="text-[#7862FC] w-6 h-6 mr-3 flex-shrink-0 z-10 bg-white" />
                <div>
                  <h3 className="font-semibold text-[#0A2533]">Your order is being sent to</h3>
                  <p className="text-[#97A2B0]">{order.delivery_details[0].delivery_location.name}, {order.delivery_details[0].delivery_location.branch}</p>
                </div>
              </div>
            )}
            {statusPoints >= 4 && (
              <div className="flex items-start relative">
                <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-[#7862FC] bg-dashed" style={{backgroundSize: '1px 8px'}}></div>
                <IonIcon icon={bicycleOutline} className="text-[#7862FC] w-6 h-6 mr-3 flex-shrink-0 z-10 bg-white" />
                <div>
                  <h3 className="font-semibold text-[#0A2533]">Driver is picking up your order</h3>
                  <p className="text-[#97A2B0]">From our warehouse</p>
                </div>
              </div>
            )}
            {statusPoints >= 3 && (
              <div className="flex items-start relative">
                <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-[#7862FC] bg-dashed" style={{backgroundSize: '1px 8px'}}></div>
                <IonIcon icon={basketOutline} className="text-[#7862FC] w-6 h-6 mr-3 flex-shrink-0 z-10 bg-white" />
                <div>
                  <h3 className="font-semibold text-[#0A2533]">Order is being prepared</h3>
                  <p className="text-[#97A2B0]">Preparing order</p>
                </div>
              </div>
            )}
            {statusPoints >= 2 && (
              <div className="flex items-start">
                <IonIcon icon={locationOutline} className="text-[#7862FC] w-6 h-6 mr-3 flex-shrink-0 z-10 bg-white" />
                <div>
                  <h3 className="font-semibold text-[#0A2533]">{order.delivery_details[0].delivery_location.name} - {order.delivery_details[0].delivery_location.branch}</h3>
                  <p className="text-[#97A2B0]">Delivery Address</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {order.order_status === 6 && (
          <div className="mt-8">
            <button 
              className="w-full bg-[#7862FC] text-white py-3 px-4 rounded-xl font-semibold"
              onClick={() => setShowQRCode(true)}
            >
              Retrieve Order
            </button>
          </div>
        )}
      </IonContent>

      {(showQRCode || isClosing) && (
        <div 
          className={`fixed inset-x-0 bottom-0 font-sans flex items-end justify-center transition-opacity duration-300 ease-in-out ${showQRCode && !isClosing ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeModal}
        >
          <div 
            ref={modalRef}
            className={`bg-white rounded-t-3xl w-full max-w-md transition-transform duration-300 ease-in-out shadow-lg ${showQRCode && !isClosing ? 'translate-y-0' : 'translate-y-full'}`}
            style={{
              transform: `translateY(${currentY - startY > 0 ? currentY - startY : 0}px)`,
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="p-4">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
              {!showPasscodeInput ? (
                <>
                  <h2 className="text-xl font-bold mb-4">Below is your unique QR code</h2>
                  <p className="text-gray-600 mb-4">Use it to unlock your designated locker</p>
                  <div className="bg-[#7862FC] p-4 rounded-xl mb-4">
                    <div className="bg-white p-4 rounded-lg flex justify-center">
                      <QRCodeSVG 
                        value={order.delivery_details[0].qr_code || 'No QR code available'} 
                        size={200}
                        level="L"
                      />
                    </div>
                  </div>
                  <button 
                    className="w-full bg-[#7862FC] text-white py-3 px-4 rounded-xl font-semibold"
                    onClick={handleContinue}
                  >
                    Continue
                  </button>
                </>
              ) : (
                <>
                    <h2 className="text-xl font-bold mb-4">Input the labeled passcode to confirm</h2>
                    <p className="text-gray-600 mb-4">Your order contains a passcode used for confirming the order</p>
                    <input
                        type="text"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder="Passcode"
                        className="w-full bg-gray-100 rounded-xl p-3 mb-4 text-[#0A2533] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7862FC] focus:border-transparent"
                    />
                    <button 
                        className="w-full bg-[#7862FC] text-white py-3 px-4 rounded-xl font-semibold mb-4"
                        onClick={handleConfirmOrder}
                        disabled={updateOrderStatus.isPending}
                    >
                        {updateOrderStatus.isPending ? 'Confirming...' : 'Confirm Order'}
                    </button>
                    <button 
                        className="w-full border border-[#7862FC] text-[#7862FC] py-3 px-4 rounded-xl font-semibold"
                        onClick={handleBack}
                    >
                        Back
                    </button>
                </>
            )}
        </div>
    </div>
</div>
)}

        <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        position="top"
        />
    </IonPage>
  );
};

export default DeliveryStatus;