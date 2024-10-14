import React, { useState, useEffect } from 'react';
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
import { useUserProfile } from '../../api/userApi';
import { useCommunityRecipesList } from '../../api/recipeApi';
import CommunityCard from '../../components/CommunityCard/CommunityCard';
import SkeletonCommunityCard from '../../components/CommunityCard/SkeletonCommunityCard';

function UserMobile() {
  const history = useHistory();
  const { data: user, isLoading, error } = useUserProfile();
  const { data: recipes = [], isFetching } = useCommunityRecipesList();
  const [activeIcon, setActiveIcon] = useState('grid');
  const [scrolled, setScrolled] = useState(false);

  const handleEditProfile = () => {
    history.push('/edit-profile');
  };

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setScrolled(scrollTop > 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <div
            style={{
              textAlign: 'center',
              margin: '0 0 20px 0',
              position: 'sticky',
              top: 0,
              backgroundColor: '#fff',
              zIndex: 10,
              padding: '10px 0',
              transition: 'transform 0.3s ease',
              transform: scrolled ? 'translateY(-50%)' : 'translateY(0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              flexDirection: scrolled ? 'row' : 'column',
            }}
          >
            <IonAvatar style={{ width: '60px', height: '60px', margin: '10px', border: '2px solid #6c63ff', borderRadius: '30px', overflow: 'hidden' }}>
              <img src={user.image || 'public/img/no-photo.png'} alt="Profile" style={{ width: '100%', height: '100%' }} />
            </IonAvatar>
            <div>
              <h2 style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                {user.first_name} {user.last_name}
              </h2>
              <p style={{ color: '#000' }}>{user.email}</p>
              <IonButton
                color="primary"
                style={{
                  width: '120px',
                  height: '30px',
                  borderRadius: '15px',
                  marginBottom: '10px',
                  backgroundColor: '#6c63ff',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  textTransform: 'none',
                }}
                onClick={handleEditProfile}
              >
                Edit Profile
              </IonButton>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <IonIcon
                icon={gridOutline}
                style={{
                  fontSize: '24px',
                  color: activeIcon === 'grid' ? '#7862FC' : '#000',
                  cursor: 'pointer',
                  marginRight: '15px',
                }}
                onClick={() => setActiveIcon('grid')}
              />
              <IonIcon
                icon={heartOutline}
                style={{
                  fontSize: '24px',
                  color: activeIcon === 'heart' ? '#7862FC' : '#000',
                  cursor: 'pointer',
                  marginRight: '15px',
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
        )}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
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

export default UserMobile;import React, { useState, useEffect } from 'react';
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
import { useUserProfile } from '../../api/userApi';
import { useCommunityRecipesList } from '../../api/recipeApi';
import CommunityCard from '../../components/CommunityCard/CommunityCard';
import SkeletonCommunityCard from '../../components/CommunityCard/SkeletonCommunityCard';

function UserMobile() {
  const history = useHistory();
  const { data: user, isLoading, error } = useUserProfile();
  const { data: recipes = [], isFetching } = useCommunityRecipesList();
  const [activeIcon, setActiveIcon] = useState('grid');
  const [scrolled, setScrolled] = useState(false);

  const handleEditProfile = () => {
    history.push('/edit-profile');
  };

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setScrolled(scrollTop > 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <div
            style={{
              textAlign: 'center',
              margin: '0 0 20px 0',
              position: 'sticky',
              top: 0,
              backgroundColor: '#fff',
              zIndex: 10,
              padding: '10px 0',
              transition: 'transform 0.3s ease',
              transform: scrolled ? 'translateY(-50%)' : 'translateY(0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              flexDirection: scrolled ? 'row' : 'column',
            }}
          >
            <IonAvatar style={{ width: '60px', height: '60px', margin: '10px', border: '2px solid #6c63ff', borderRadius: '30px', overflow: 'hidden' }}>
              <img src={user.image || 'public/img/no-photo.png'} alt="Profile" style={{ width: '100%', height: '100%' }} />
            </IonAvatar>
            <div>
              <h2 style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                {user.first_name} {user.last_name}
              </h2>
              <p style={{ color: '#000' }}>{user.email}</p>
              <IonButton
                color="primary"
                style={{
                  width: '120px',
                  height: '30px',
                  borderRadius: '15px',
                  marginBottom: '10px',
                  backgroundColor: '#6c63ff',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  textTransform: 'none',
                }}
                onClick={handleEditProfile}
              >
                Edit Profile
              </IonButton>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <IonIcon
                icon={gridOutline}
                style={{
                  fontSize: '24px',
                  color: activeIcon === 'grid' ? '#7862FC' : '#000',
                  cursor: 'pointer',
                  marginRight: '15px',
                }}
                onClick={() => setActiveIcon('grid')}
              />
              <IonIcon
                icon={heartOutline}
                style={{
                  fontSize: '24px',
                  color: activeIcon === 'heart' ? '#7862FC' : '#000',
                  cursor: 'pointer',
                  marginRight: '15px',
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
        )}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
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