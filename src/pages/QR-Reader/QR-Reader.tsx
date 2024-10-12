import React, { useState, useEffect, useRef } from "react";
import { IonContent, IonPage, IonButton, IonAlert } from "@ionic/react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface DecodedString {
  location: string;
  time: string;
  date: string;
  order_id: number;
  locker_number: number;
}

const decodeString = (input: string): DecodedString | null => {
  const parts = input.split("_");

  if (parts.length !== 5) {
    return null;
  }

  const orderId = parseInt(parts[3], 10);
  const lockerNumber = parseInt(parts[4], 10);

  if (isNaN(orderId) || isNaN(lockerNumber)) {
    return null;
  }

  return {
    location: parts[0],
    time: parts[1],
    date: parts[2],
    order_id: orderId,
    locker_number: lockerNumber,
  };
};

const QRReader: React.FC = () => {
  const [scanResult, setScanResult] = useState<DecodedString | null>(null);
  const [errorAlert, setErrorAlert] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const readerRef = useRef<HTMLDivElement | null>(null);

  const startScanning = () => {
    setScanResult(null);
    setIsScanning(true);

    if (scannerRef.current) {
      scannerRef.current
        .clear()
        .then(() => {
          scannerRef.current = null;
          initializeScanner();
        })
        .catch((err) => console.error("Failed to clear scanner", err));
    } else {
      initializeScanner();
    }
  };

  const initializeScanner = () => {
    if (readerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        {
          qrbox: {
            width: 500,
            height: 500,
          },
          fps: 5,
        },
        false
      );

      scannerRef.current.render(success, error);
    }
  };

  const success = (result: string) => {
    const decoded = decodeString(result);

    if (decoded) {
      scannerRef.current?.clear();
      setScanResult(decoded);
      setIsScanning(false);
    } else {
      setErrorAlert(true);
    }
  };

  const error = (err: string) => {
    console.warn(err);
  };

  useEffect(() => {
    return () => {
      scannerRef.current?.clear();
      scannerRef.current = null;
    };
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        {scanResult ? (
          <div className="flex justify-center items-center px-96 w-full min-h-screen">
            <div className="w-full bg-white text-center">
              <p className="text-4xl font-semibold mb-2">
                Locker Number: {scanResult.locker_number}
              </p>
              <p className="text-2xl mb-6">
                {scanResult.location} #{scanResult.order_id}
              </p>
              <button
                className="w-full bg-[#7862FC] text-white font-semibold py-4 rounded-2xl mb-4 text-2xl"
                onClick={startScanning}
              >
                Scan Again
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div
              className="w-full max-h-full"
              id="reader"
              ref={readerRef}
            />
            {!isScanning && (
              <div className="flex justify-center items-center w-full min-h-screen">
                <div className="px-96 w-full bg-white text-center">
                  <button
                    className="w-full bg-[#7862FC] text-white font-semibold py-4 rounded-2xl mb-4 text-2xl"
                    onClick={startScanning}
                  >
                    Start Scan
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <IonAlert
          isOpen={errorAlert}
          onDidDismiss={() => setErrorAlert(false)}
          header={"Invalid QR Code"}
          message={"The scanned QR code is not valid. Please try again."}
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};

export default QRReader;
