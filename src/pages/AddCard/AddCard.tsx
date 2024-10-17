import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonContent,
  IonTitle,
  IonButton,
  useIonRouter,
  IonToast,
} from "@ionic/react";
import { useAddPaymentMethod } from "../../api/userApi";

const AddCardPage: React.FC = () => {
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const router = useIonRouter();
  const addPaymentMethod = useAddPaymentMethod();

  const formatExpiryDate = (input: string) => {
    const cleaned = input.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const convertExpiryDateToAPIFormat = (mmyy: string) => {
    const [month, year] = mmyy.split("/");
    if (month && year) {
      const fullYear = "20" + year;
      return `${fullYear}-${month}-01`;
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lastFourDigits = cardNumber.slice(-4);
    const apiFormattedDate = convertExpiryDateToAPIFormat(expiryDate);

    if (!apiFormattedDate) {
      setToastMessage("Invalid expiration date format");
      setShowToast(true);
      return;
    }

    addPaymentMethod.mutate(
      {
        method: 1,
        last_four_digits: lastFourDigits,
        expiration_date: apiFormattedDate,
      },
      {
        onSuccess: () => {
          router.goBack();
        },
        onError: (error: any) => {
          console.error("Error adding card:", error);
          setToastMessage(error.message || "Failed to add card");
          setShowToast(true);
        },
      }
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/payment-options" />
          </IonButtons>
          <IonTitle>Add New Card</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1 className="text-2xl font-bold mb-4">Your Card Info</h1>

        <div className="bg-[#D9D5FF] rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-start mb-4">
            <span className="text-lg font-bold text-[#0A2533]">
              {cardName || "Card Holder Name"}
            </span>
            <img
              src="/payment/mastercard-logo.svg"
              alt="Mastercard"
              className="w-12 h-auto"
            />
          </div>
          <div className="text-xl mb-2 tracking-wider">
            {cardNumber
              ? cardNumber.replace(/(.{4})/g, "$1 ").trim()
              : "•••• •••• •••• ••••"}
          </div>
          <div className="text-sm">{expiryDate || "MM/YY"}</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative pt-5">
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7862FC] focus:border-transparent"
              placeholder=" "
            />
            <label className="absolute left-3 -top-2 text-sm text-gray-600 transition-all duration-300 transform scale-75 origin-[0]">
              Card Name <span className="text-red-500">*</span>
            </label>
          </div>

          <div className="relative pt-5">
            <input
              type="tel"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
              maxLength={16}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7862FC] focus:border-transparent"
              placeholder=" "
            />
            <label className="absolute left-3 -top-2 text-sm text-gray-600 transition-all duration-300 transform scale-75 origin-[0]">
              Card Number <span className="text-red-500">*</span>
            </label>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1 pt-5">
              <input
                type="tel"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
                maxLength={3}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7862FC] focus:border-transparent"
                placeholder=" "
              />
              <label className="absolute left-3 -top-2 text-sm text-gray-600 transition-all duration-300 transform scale-75 origin-[0]">
                CVV <span className="text-red-500">*</span>
              </label>
            </div>

            <div className="relative flex-1 pt-5">
              <input
                type="text"
                value={expiryDate}
                onChange={(e) =>
                  setExpiryDate(formatExpiryDate(e.target.value))
                }
                required
                maxLength={5}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7862FC] focus:border-transparent"
                placeholder=" "
              />
              <label className="absolute left-3 -top-2 text-sm text-gray-600 transition-all duration-300 transform scale-75 origin-[0]">
                Expires (MM/YY) <span className="text-red-500">*</span>
              </label>
            </div>
          </div>

          <IonButton
            expand="block"
            type="submit"
            className="mt-6"
            color="primary"
            disabled={addPaymentMethod.isPending}
          >
            {addPaymentMethod.isPending ? "Adding..." : "Add Card"}
          </IonButton>
        </form>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default AddCardPage;
