import React, { useState, useEffect } from 'react';
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
} from '@ionic/react';
import { personOutline, mailOutline, cardOutline, arrowBackOutline } from 'ionicons/icons';
import { useUserProfile, useUpdateUserProfile } from '../../api/userApi';
import { useHistory } from 'react-router-dom';
import './EditProfile.css';

function EditProfile() {
  const history = useHistory();
  const { data: user, isLoading, error } = useUserProfile();
  const updateUserProfile = useUpdateUserProfile();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setEmail(user.email);
      setPaymentMethod(user.profile?.paymentMethod || '');
    }
  }, [user]);

  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = () => {
    setIsUpdating(true);
    const updatedProfile = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      profile: {
        ...user?.profile,
      },
    };

    updateUserProfile.mutate(updatedProfile, {
      onSuccess: () => {
        setIsUpdating(false);
        alert('Profile updated successfully');
        history.push('/user');
      },
      onError: (err: any) => {
        setIsUpdating(false);
        console.error('Error updating profile:', err);
        alert('Error updating profile');
      },
    });
  };

  const handleBack = () => {
    history.push('/user');
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile.</p>;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="start" fill="clear" onClick={handleBack} className="back-button">
            <IonIcon icon={arrowBackOutline} />
          </IonButton>
          <IonTitle>Edit Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <IonAvatar className="avatar">
            <img src={user?.image || 'public/img/no-photo.png'} alt="Profile" style={{ width: '100%', height: '100%' }} />
          </IonAvatar>
        </div>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>First Name</label>
            <IonItem
              lines="none"
              className={`input-item ${focusedField === 'firstName' ? 'input-item-focused' : 'input-item-blur'}`}
            >
              <IonIcon icon={personOutline} slot="start" style={{ fontSize: '18px', marginLeft: '-10px', marginRight: '8px' }} />
              <IonInput
                value={firstName}
                onIonChange={(e) => setFirstName(e.detail.value!)}
                onFocus={() => setFocusedField('firstName')}
                onBlur={() => setFocusedField(null)}
                clearInput={false}
                style={{ textDecoration: 'none', '--highlight-background': 'transparent' }}
              />
            </IonItem>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Last Name</label>
            <IonItem
              lines="none"
              className={`input-item ${focusedField === 'lastName' ? 'input-item-focused' : 'input-item-blur'}`}
            >
              <IonIcon icon={personOutline} slot="start" style={{ fontSize: '18px', marginLeft: '-10px', marginRight: '8px' }} />
              <IonInput
                value={lastName}
                onIonChange={(e) => setLastName(e.detail.value!)}
                onFocus={() => setFocusedField('lastName')}
                onBlur={() => setFocusedField(null)}
                clearInput={false}
                style={{ textDecoration: 'none', '--highlight-background': 'transparent' }}
              />
            </IonItem>
          </div>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email Address</label>
          <IonItem
            lines="none"
            className={`input-item ${focusedField === 'email' ? 'input-item-focused' : 'input-item-blur'}`}
          >
            <IonIcon icon={mailOutline} slot="start" style={{ fontSize: '18px', marginLeft: '-10px', marginRight: '8px' }} />
            <IonInput
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              clearInput={false}
              style={{ textDecoration: 'none', '--highlight-background': 'transparent' }}
            />
          </IonItem>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Payment Method</label>
          <IonItem
            lines="none"
            className={`input-item ${focusedField === 'paymentMethod' ? 'input-item-focused' : 'input-item-blur'}`}
          >
            <IonIcon icon={cardOutline} slot="start" style={{ fontSize: '18px', marginLeft: '-10px', marginRight: '8px' }} />
            <IonInput
              value={paymentMethod}
              onIonChange={(e) => setPaymentMethod(e.detail.value!)}
              onFocus={() => setFocusedField('paymentMethod')}
              onBlur={() => setFocusedField(null)}
              placeholder="Click to set payment method"
              clearInput={false}
              style={{ textDecoration: 'none', '--highlight-background': 'transparent' }}
            />
          </IonItem>
        </div>
        <IonButton 
          expand="full" 
          color="primary" 
          onClick={handleUpdateProfile} 
          className="update-profile-button"
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 'Update Profile'}
        </IonButton>
      </IonContent>
    </IonPage>
  );
}

export default EditProfile;