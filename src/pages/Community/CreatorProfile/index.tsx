import {
  IonAvatar, IonBackButton, IonButtons, IonContent, IonHeader,
  IonLabel, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar
} from "@ionic/react";
import { useParams } from 'react-router-dom';
import { useCreatorProfile } from "../../../api/userApi";
import React, { useMemo, useState } from 'react';
import { RecipeData, useRecipesByCreator } from '../../../api/recipeApi';
import SkeletonCommunityCard from "../../../components/CommunityCard/SkeletonCommunityCard";
import { MealkitData, useMealkitList } from "../../../api/mealkitApi";
import FlexibleCommunityCard from "../../../components/CommunityCard/FlexibleCommunityCard";

const CreatorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const creatorId = parseInt(id);
  const { data: creator } = useCreatorProfile(creatorId);
  const { data: creatorRecipes = [], isFetching: isCreatorRecipesFetching } = useRecipesByCreator(creatorId);
  const { data: allMealkits = [], isFetching: isMealkitFetching } = useMealkitList({ search: "" });

  // Filter mealkit based on id
  const creatorMealkits = allMealkits.filter((mealkit) => mealkit.creator?.id === creatorId);

  const segments = ['recipe', 'mealkit'];
  const [segment, setSegment] = useState(segments[0]);
  const [contentToRender, setContentToRender] = useState<RecipeData[] | MealkitData[]>(creatorRecipes);

  const handleSegmentChange = (e: CustomEvent) => {
    const value = e.detail.value;
    setContentToRender(value === "recipe" ? creatorRecipes : creatorMealkits);
    setSegment(value);
  };

  const renderContent = useMemo(() => {
    if (isCreatorRecipesFetching || isMealkitFetching) {
      return (
        <>
          <SkeletonCommunityCard />
          <SkeletonCommunityCard />
          <SkeletonCommunityCard />
        </>
      );
    }

    if (contentToRender.length) {
      return contentToRender.map((content, index) => (
        <div style={{width: "100%"}}>
          <FlexibleCommunityCard key={index} item={content} />
        </div>
      ));
    }

    return <p>No {segment}s.</p>;
  }, [isCreatorRecipesFetching, isMealkitFetching, contentToRender, segment]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="ion-hide-sm-up">
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Creator's Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding font-sans">
        {creator && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <IonAvatar
              style={{
                width: '120px', height: '120px', margin: '0 auto',
                border: '3px solid #6c63ff', borderRadius: '60px', overflow: 'hidden'
              }}
            >
              <img
                src={creator.image || '/img/no-photo.png'}
                alt="Profile"
                style={{ width: '100%', height: '100%' }}
              />
            </IonAvatar>
            <h2 style={{ margin: '15px 0 5px 0', fontSize: '1.5em', fontWeight: 'bold' }}>
              {creator.first_name} {creator.last_name}
            </h2>
          </div>
        )}
        <IonSegment value={segment} onIonChange={(e) => handleSegmentChange(e)}>
          <IonSegmentButton value="recipe">
            <IonLabel>Recipe</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="mealkit">
            <IonLabel>Mealkit</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
          {renderContent}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CreatorProfile;