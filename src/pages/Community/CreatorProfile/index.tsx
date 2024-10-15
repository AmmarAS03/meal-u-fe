import { IonAvatar, IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useParams } from 'react-router-dom';
import { useCreatorProfile } from "../../../api/userApi";
import React, { useEffect, useState } from 'react';
import { UserProfile } from "../../../api/userApi";
import { useRecipesByCreator } from '../../../api/recipeApi';
import SkeletonCommunityCard from "../../../components/CommunityCard/SkeletonCommunityCard";
import NewCommunityCard from "../../../components/CommunityCard/NewCommunityCard";

const CreatorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const creatorId = parseInt(id);
  const { data: creator } = useCreatorProfile(creatorId);
  const { data: creatorRecipes = [], isFetching: isCreatorRecipesFetching } = useRecipesByCreator(creatorId);

  console.log(creator);

  return (
    <IonPage>
      <IonHeader>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/community" />
        </IonButtons>
        <IonToolbar className="ion-hide-sm-up">
          <IonTitle>Creator's Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding font-sans">
        {creator && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <IonAvatar style={{ width: '120px', height: '120px', margin: '0 auto', border: '3px solid #6c63ff', borderRadius: '60px', overflow: 'hidden' }}>
            <img src={creator.image || 'public/img/no-photo.png'} alt="Profile" style={{ width: '100%', height: '100%' }} />
          </IonAvatar>
          <h2 style={{ margin: '15px 0 5px 0', fontSize: '1.5em', fontWeight: 'bold' }}>
            {creator.first_name} {creator.last_name}
          </h2>
        </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
          {isCreatorRecipesFetching ? (
            <>
              <SkeletonCommunityCard/>
              <SkeletonCommunityCard />
              <SkeletonCommunityCard />
            </>
          ) : creatorRecipes.length > 0 ? (
            creatorRecipes.map((recipe) => (
              // recipe di sini belom ada likes & comments count
              <NewCommunityCard key={recipe.id} recipe={recipe} />
            ))
          ) : (
            <p>No recipes found.</p>
          )}
        </div>
      </IonContent>
    </IonPage>
  )
}

export default CreatorProfile;