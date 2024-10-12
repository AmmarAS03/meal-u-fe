import React, { useState } from 'react';
import { IonIcon, IonContent } from "@ionic/react";
import { gridOutline, heartOutline, bookmarkOutline } from 'ionicons/icons';
import RecipeList from '../../components/UserCard/RecipeList'; // Component to display recipes

const RecipeCard: React.FC = () => {
  const [showRecipes, setShowRecipes] = useState(false);

  const handleIconClick = () => {
    setShowRecipes(!showRecipes);
  };

  return (
    <>
      <div style={{ 
        width: '375px', 
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
        borderRadius: '10px', 
        textAlign: 'center', 
        padding: '20px', 
        marginTop: '10px' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', color: '#000' }}>
          <IonIcon icon={gridOutline} style={{ fontSize: '24px', color: '#6c63ff' }} onClick={handleIconClick} />
          <IonIcon icon={heartOutline} style={{ fontSize: '24px' }} />
          <IonIcon icon={bookmarkOutline} style={{ fontSize: '24px' }} />
        </div>
      </div>
      {showRecipes && (
        <IonContent>
          <RecipeList />
        </IonContent>
      )}
    </>
  );
};

export default RecipeCard;