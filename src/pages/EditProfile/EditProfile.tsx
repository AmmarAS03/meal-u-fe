import React, { useState, useEffect, useMemo } from "react";
import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonAvatar,
  IonInput,
  IonItem,
  IonButton,
  IonIcon,
  IonImg,
} from "@ionic/react";
import {
  personOutline,
  mailOutline,
  arrowBackOutline,
  cloudUploadOutline,
  cameraOutline,
} from "ionicons/icons";
import { useUserProfile, useUpdateUserProfile } from "../../api/userApi";
import { useHistory } from "react-router-dom";
import "./EditProfile.css";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
};

interface PhotoState {
  dataUrl: string | null;
  file: File | null;
}

const DEFAULT_IMAGE = "/img/no-photo.png";

function EditProfile() {
  const history = useHistory();
  const { data: user, isLoading, error } = useUserProfile();
  const updateUserProfile = useUpdateUserProfile();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [photo, setPhoto] = useState<PhotoState>({ dataUrl: null, file: null });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      });
      setPhoto({ dataUrl: user.image || null, file: null });
    }
  }, [user]);

  const hasChanges = useMemo(() => {
    if (!user) return false;
    return (
      formData.firstName !== user.first_name ||
      formData.lastName !== user.last_name ||
      formData.email !== user.email ||
      photo.file !== null
    );
  }, [formData, photo, user]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateProfile = async () => {
    if (!hasChanges) return;

    setIsUpdating(true);
    try {
      const updatedProfile: any = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
      };

      if (photo.file) {
        updatedProfile.image = photo.file;
      }

      await updateUserProfile.mutateAsync(updatedProfile);
      setToastMessage('Profile updated successfully');
      setShowToast(true);
      history.push("/user");
    } catch (err) {
      console.error("Error updating profile:", err);
      setToastMessage('Failed to update profile');
      setShowToast(true);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePhotoCapture = async (source: CameraSource) => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: source
      });
      
      if (image.dataUrl) {
        const response = await fetch(image.dataUrl);
        const blob = await response.blob();
        const file = new File([blob], "profile_photo.jpg", { type: "image/jpeg" });
        
        setPhoto({ dataUrl: image.dataUrl, file: file });
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      setToastMessage('Failed to capture photo');
      setShowToast(true);
    }
  };

  const takePhoto = () => handlePhotoCapture(CameraSource.Camera);
  const uploadPhoto = () => handlePhotoCapture(CameraSource.Photos);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile.</p>;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton
            slot="start"
            fill="clear"
            onClick={() => history.push("/user")}
            className="back-button"
          >
            <IonIcon icon={arrowBackOutline} />
          </IonButton>
          <IonTitle>Edit Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 text-center">
            Profile Photo
          </label>
          <div className="flex justify-center">
            <div className="w-[40%] max-w-md rounded-lg mb-4 border-4 border-dashed border-[#7862FC] p-2">
              <IonImg
                src={photo.dataUrl || DEFAULT_IMAGE}
                alt="Profile Photo"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <IonButton
              expand="block"
              onClick={uploadPhoto}
              color="primary"
              className="flex-1"
            >
              <IonIcon slot="start" icon={cloudUploadOutline} />
              Upload Photo
            </IonButton>
            <IonButton
              expand="block"
              onClick={takePhoto}
              color="dark"
              className="flex-1"
            >
              <IonIcon slot="start" icon={cameraOutline} />
              Take Photo
            </IonButton>
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              First Name
            </label>
            <IonItem
              lines="none"
              className={`input-item ${
                focusedField === "firstName"
                  ? "input-item-focused"
                  : "input-item-blur"
              }`}
            >
              <IonIcon
                icon={personOutline}
                slot="start"
                style={{
                  fontSize: "18px",
                  marginLeft: "-10px",
                  marginRight: "8px",
                }}
              />
              <IonInput
                value={formData.firstName}
                onIonChange={(e) =>
                  handleInputChange("firstName", e.detail.value!)
                }
                onFocus={() => setFocusedField("firstName")}
                onBlur={() => setFocusedField(null)}
                clearInput={false}
                style={{
                  textDecoration: "none",
                  "--highlight-background": "transparent",
                }}
              />
            </IonItem>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Last Name
            </label>
            <IonItem
              lines="none"
              className={`input-item ${
                focusedField === "lastName"
                  ? "input-item-focused"
                  : "input-item-blur"
              }`}
            >
              <IonIcon
                icon={personOutline}
                slot="start"
                style={{
                  fontSize: "18px",
                  marginLeft: "-10px",
                  marginRight: "8px",
                }}
              />
              <IonInput
                value={formData.lastName}
                onIonChange={(e) =>
                  handleInputChange("lastName", e.detail.value!)
                }
                onFocus={() => setFocusedField("lastName")}
                onBlur={() => setFocusedField(null)}
                clearInput={false}
                style={{
                  textDecoration: "none",
                  "--highlight-background": "transparent",
                }}
              />
            </IonItem>
          </div>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Email Address
          </label>
          <IonItem
            lines="none"
            className={`input-item ${
              focusedField === "email"
                ? "input-item-focused"
                : "input-item-blur"
            }`}
          >
            <IonIcon
              icon={mailOutline}
              slot="start"
              style={{
                fontSize: "18px",
                marginLeft: "-10px",
                marginRight: "8px",
              }}
            />
            <IonInput
              value={formData.email}
              onIonChange={(e) => handleInputChange("email", e.detail.value!)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              clearInput={false}
              style={{
                textDecoration: "none",
                "--highlight-background": "transparent",
              }}
            />
          </IonItem>
        </div>

        <IonButton
          expand="full"
          color="primary"
          onClick={handleUpdateProfile}
          className="update-profile-button"
          disabled={isUpdating || !hasChanges}
          style={{
            borderRadius: "17.5px",
            marginBottom: "20px",
            backgroundColor: "#6c63ff",
            fontWeight: "bold",
            fontSize: "14px",
            textTransform: "none",
          }}
        >
          {isUpdating ? "Updating..." : "Update Profile"}
        </IonButton>
      </IonContent>
    </IonPage>
  );
}

export default EditProfile;