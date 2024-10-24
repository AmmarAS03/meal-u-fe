import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
  IonIcon,
  IonToast,
} from '@ionic/react';
import { cameraOutline, cloudUploadOutline, imageOutline } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { useUpdateOrderStatusToDelivered } from '../../../api/courierApi';
import { useCourier } from '../../../contexts/courierContext';
import imageCompression from 'browser-image-compression';

interface RouteParams {
  id: string;
}

interface LocationState {
  order: any;
}

const ConfirmDelivery: React.FC = () => {
  const { updateOrderStatus } = useCourier();
  const [photo, setPhoto] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const history = useHistory();
  const { id } = useParams<RouteParams>();
  const location = useLocation<LocationState>();
  const [isLoading, setIsLoading] = useState(false);
  const { order } = location.state || { order: null };

  const updateToDelivered = useUpdateOrderStatusToDelivered();

  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
  
      if (!image.dataUrl) {
        throw new Error('No image data received');
      }
  
      // Convert DataUrl to Blob
      const response = await fetch(image.dataUrl);
      const blob = await response.blob();
  
      // Create original file
      const originalFile = new File([blob], "delivery_proof.jpg", {
        type: "image/jpeg",
        lastModified: new Date().getTime(),
      });
  
      // Compression options
      const options = {
        maxSizeMB: 1,           // Maximum file size of 1MB
        maxWidthOrHeight: 1920, // Maximum dimension
        useWebWorker: true      // Better performance
      };
  
      // Compress the image
      const compressedFile = await imageCompression(originalFile, options);
      
      // Log sizes for verification
      console.log(`Original size: ${originalFile.size / 1024 / 1024} MB`);
      console.log(`Compressed size: ${compressedFile.size / 1024 / 1024} MB`);
  
      // Convert back to DataURL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
  
    } catch (error) {
      console.error('Error taking/compressing photo:', error);
      setToastMessage('Failed to take or compress photo');
      setShowToast(true);
    }
  };

  const uploadPhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });
  
      if (!image.dataUrl) {
        throw new Error('No image data received');
      }
  
      const response = await fetch(image.dataUrl);
      const blob = await response.blob();
  
      const originalFile = new File([blob], "delivery_proof.jpg", {
        type: "image/jpeg",
        lastModified: new Date().getTime(),
      });
  
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };
  
      const compressedFile = await imageCompression(originalFile, options);
      
      console.log(`Original size: ${originalFile.size / 1024 / 1024} MB`);
      console.log(`Compressed size: ${compressedFile.size / 1024 / 1024} MB`);
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
  
    } catch (error) {
      console.error('Error uploading/compressing photo:', error);
      setToastMessage('Failed to upload or compress photo');
      setShowToast(true);
    }
  };

  const confirmDelivery = async () => {
    if (!photo) {
      setToastMessage('Please upload or take a photo before confirming delivery');
      setShowToast(true);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(photo);
      const blob = await response.blob();
      const photoFile = new File([blob], "delivery_proof.jpg", { 
        type: "image/jpeg",
        lastModified: new Date().getTime()
      });

      await updateToDelivered.mutateAsync({ 
        orderId: parseInt(id), 
        photoProof: photoFile 
      });
      
      updateOrderStatus(parseInt(id), 'delivered');
      
      setToastMessage('Delivery confirmed successfully');
      setShowToast(true);
      
      setTimeout(() => {
        history.push(`/courier/confirm-pickup/delivery/1?confirmed=${id}`);
      }, 1000);
    } catch (error) {
      console.error('Error confirming delivery:', error);
      setToastMessage(error instanceof Error ? error.message : 'Failed to confirm delivery');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader collapse='fade'>
        <IonToolbar className='font-sans'>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/courier/confirm-pickup/delivery/1" />
          </IonButtons>
          <IonTitle>Confirm Delivery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="font-sans">
        <div className="flex flex-col w-full h-full p-4 pt-8">
          <div className="flex-grow flex flex-col items-center">
            {photo ? (
              <div className="w-full max-w-md rounded-lg mb-4 border-4 border-dashed border-[#7862FC] p-2">
                <img src={photo} alt="Delivery proof" className="w-full rounded-lg shadow-lg" />
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 w-full rounded-lg px-8 py-16 text-center mb-4">
                <IonIcon icon={cloudUploadOutline} className="text-6xl text-gray-400 mb-4" />
                <p className="text-gray-500">Upload your proof of delivery</p>
              </div>
            )}
            
            <div className="w-full space-y-4 mt-4">
              <IonButton expand="block" onClick={uploadPhoto} color="primary" className="font-semibold">
                <IonIcon icon={imageOutline} slot="start" />
                Upload Photo
              </IonButton>
              <IonButton expand="block" onClick={takePhoto} color="primary" className="font-semibold">
                <IonIcon icon={cameraOutline} slot="start" />
                Take Photo
              </IonButton>
            </div>
          </div>
          
          <div className="mt-auto pb-4">
          <IonButton 
            expand="block" 
            onClick={confirmDelivery} 
            color="medium" 
            className="font-semibold"
            disabled={!photo || updateToDelivered.isPending}
          >
            {updateToDelivered.isPending ? 'Confirming...' : 'Confirm Delivery'}
          </IonButton>
          </div>
        </div>
      </IonContent>
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
      />
    </IonPage>
  );
};

export default ConfirmDelivery;