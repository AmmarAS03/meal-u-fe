import React, { useState } from 'react';
import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonAvatar,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { useHistory } from 'react-router-dom';
import { gridOutline, heartOutline, bookmarkOutline } from 'ionicons/icons';
import { useUserProfile } from '../../../api/userApi';
import { useCommunityRecipesList } from '../../../api/recipeApi';
import CommunityCard from '../../../components/CommunityCard/CommunityCard';
import SkeletonCommunityCard from '../../../components/CommunityCard/SkeletonCommunityCard';

function UserMobile() {
  const history = useHistory();
  const { data: user, isLoading, error } = useUserProfile();
  const { data: recipes = [], isFetching } = useCommunityRecipesList();
  const [activeIcon, setActiveIcon] = useState('grid');

  const handleEditProfile = () => {
    history.push('/edit-profile');
  };

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
        {user && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <IonAvatar style={{ width: '120px', height: '120px', margin: '0 auto', border: '3px solid #6c63ff', borderRadius: '60px', overflow: 'hidden' }}>
              <img src={user.image || 'public/img/no-photo.png'} alt="Profile" style={{ width: '100%', height: '100%' }} />
            </IonAvatar>
            <h2 style={{ margin: '15px 0 5px 0', fontSize: '1.5em', fontWeight: 'bold' }}>
              {user.first_name} {user.last_name}
            </h2>
            <p style={{ margin: '0 0 15px 0', color: '#000' }}>{user.email}</p>
            <IonButton
              color="primary"
              style={{
                width: '218px',
                height: '35px',
                borderRadius: '17.5px',
                marginBottom: '20px',
                backgroundColor: '#6c63ff',
                fontWeight: 'bold',
                fontSize: '14px',
                textTransform: 'none',
              }}
              onClick={handleEditProfile}
            >
              Edit Profile
            </IonButton>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', width: '90%', maxWidth: '500px', padding: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '25px', background: '#fff' }}>
            <IonIcon
              icon={gridOutline}
              style={{
                fontSize: '24px',
                color: activeIcon === 'grid' ? '#7862FC' : '#000',
                cursor: 'pointer',
              }}
              onClick={() => setActiveIcon('grid')}
            />
            <IonIcon
              icon={heartOutline}
              style={{
                fontSize: '24px',
                color: activeIcon === 'heart' ? '#7862FC' : '#000',
                cursor: 'pointer',
              }}
              onClick={() => setActiveIcon('heart')}
            />
            <IonIcon
              icon={bookmarkOutline}
              style={{
                fontSize: '24px',
                color: activeIcon === 'bookmark' ? '#7862FC' : '#000',
                cursor: 'pointer',
              }}
              onClick={() => setActiveIcon('bookmark')}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
          {isFetching ? (
            <>
              <SkeletonCommunityCard />
              <SkeletonCommunityCard />
              <SkeletonCommunityCard />
            </>
          ) : (
            recipes.map((recipe) => (
              <CommunityCard key={recipe.id} recipe={recipe} />
            ))
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}

export default UserMobile;