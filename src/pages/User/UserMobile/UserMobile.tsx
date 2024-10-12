import React from 'react';
import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
} from "@ionic/react";
import UserCard from '../../../components/UserCard/UserCard';
import { useUserProfile } from '../../../api/userApi';
import RecipeCard from '../../../components/UserCard/RecipeCard';

function UserMobile() {
  const { data: user, isLoading, error } = useUserProfile();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile.</p>;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="ion-hide-sm-up">
          <IonTitle>My Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding font-sans">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
          {user && (
            <>
              <UserCard user={{
                image: user.image || 'public/img/food-image.png',
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email
              }} />
              <RecipeCard />
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}

export default UserMobile;