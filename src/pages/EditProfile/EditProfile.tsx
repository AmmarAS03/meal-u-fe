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
} from "@ionic/react";
import {
  personOutline,
  mailOutline,
  cardOutline,
  arrowBackOutline,
} from "ionicons/icons";
import { useUserProfile, useUpdateUserProfile } from "../../api/userApi";
import { useHistory } from "react-router-dom";
import "./EditProfile.css";

function EditProfile() {
  const history = useHistory();
  const { data: user, isLoading, error } = useUserProfile();
  const updateUserProfile = useUpdateUserProfile();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Set initial form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      });
    }
  }, [user]);

  // Check if form data has changed
  const hasChanges = useMemo(() => {
    if (!user) return false;
    return (
      formData.firstName !== user.first_name ||
      formData.lastName !== user.last_name ||
      formData.email !== user.email
    );
  }, [formData, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateProfile = () => {
    setIsUpdating(true);
    const updatedProfile = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      profile: {
        ...user?.profile,
      },
    };

    updateUserProfile.mutate(updatedProfile, {
      onSuccess: () => {
        setIsUpdating(false);
        history.push("/user");
      },
      onError: (err) => {
        setIsUpdating(false);
        console.error("Error updating profile:", err);
        alert("Error updating profile");
      },
    });
  };

  const handleBack = () => {
    history.push("/user");
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile.</p>;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton
            slot="start"
            fill="clear"
            onClick={handleBack}
            className="back-button"
          >
            <IonIcon icon={arrowBackOutline} />
          </IonButton>
          <IonTitle>Edit Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <IonAvatar className="avatar">
            <img
              src={user?.image || "public/img/no-photo.png"}
              alt="Profile"
              style={{ width: "100%", height: "100%" }}
            />
          </IonAvatar>
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
