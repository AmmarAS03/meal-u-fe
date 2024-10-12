import React from 'react';
import { IonAvatar, IonButton } from "@ionic/react";
import { useHistory } from 'react-router-dom';

const UserCard: React.FC<{ user: { image: string, firstName: string, lastName: string, email: string } }> = ({ user }) => {
  const history = useHistory();

  const handleEditProfile = () => {
    history.push('/edit-profile');
  };

  return (
    <div style={{ width: '375px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '10px', textAlign: 'center', padding: '20px' }}>
      <IonAvatar style={{ width: '120px', height: '120px', margin: '0 auto', border: '3px solid #6c63ff', borderRadius: '60px', overflow: 'hidden' }}>
        <img src={user.image} alt="Profile" style={{ width: '100%', height: '100%' }} />
      </IonAvatar>
      <h2 style={{ margin: '15px 0 5px 0', fontSize: '1.5em', fontWeight: 'bold' }}>
        {user.firstName} {user.lastName}
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
  );
};

export default UserCard;