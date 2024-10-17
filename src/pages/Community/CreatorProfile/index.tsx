import {
  IonAvatar, IonBackButton, IonButtons, IonContent, IonHeader,
  IonIcon,
  IonLabel, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar
} from "@ionic/react";
import { useParams } from 'react-router-dom';
import { useCreatorProfile } from "../../../api/userApi";
import React, { useMemo, useState } from 'react';
import { CommunityRecipeData, useCommunityRecipesList, useRecipesByCreator } from '../../../api/recipeApi';
import SkeletonCommunityCard from "../../../components/CommunityCard/SkeletonCommunityCard";
import { CommunityMealkitData, useMealkitList, useCommunityMealkitList } from "../../../api/mealkitApi";
import FlexibleCommunityCard from "../../../components/CommunityCard/FlexibleCommunityCard";
import { cubeOutline, bookOutline } from "ionicons/icons";
import { DietaryDetail } from "../../../api/productApi";
import { useHistory } from 'react-router-dom';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender?: string;
  image?: string;
  dietary_requirements?: DietaryDetail[];
}

const CreatorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const creatorId = parseInt(id);
  const history = useHistory();
  const { data: creator } = useCreatorProfile(creatorId)  as {data: User | undefined};
  // const { data: creatorRecipes = [], isFetching: isCreatorRecipesFetching } = useRecipesByCreator(creatorId);
  const { data: communityRecipes = [], isFetching: isCommunityRecipesFetching } = useCommunityRecipesList();
  const { data: communityMealkits = [], isFetching: isCommunityMealkitsFetching } = useCommunityMealkitList();

  // get creator's recipes and mealkits
  const creatorRecipes = communityRecipes?.filter((recipe) => recipe.creator.id === creator?.id);
  const creatorMealkits = communityMealkits?.filter((mealkit) => mealkit.creator.id === creator?.id);

  const segments = ['recipe', 'mealkit'];
  const [segment, setSegment] = useState(segments[0]);
  const [contentToRender, setContentToRender] = useState<CommunityRecipeData[] | CommunityMealkitData[]>(creatorRecipes);

  const handleSegmentChange = (type: string) => {
    setActiveIcon(type);
    setContentToRender(type === "recipe" ? creatorRecipes : creatorMealkits);
  }

  const navigateToContent = (content: CommunityMealkitData | CommunityRecipeData) => {
    if ('meal_types' in content) { // mealkit
      history.push(`/mealkit-details/${content.id}`);
    } else { // recipe
      history.push(`/recipe-details/${content.id}`);
    }
  }

  const renderContent = useMemo(() => {
    if (isCommunityRecipesFetching || isCommunityMealkitsFetching) {
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
          <FlexibleCommunityCard key={index} item={content} onClick={() => navigateToContent(content)}/>
        </div>
      ));
    }

    return <p>No {segment}s.</p>;
  }, [isCommunityRecipesFetching, isCommunityMealkitsFetching, contentToRender, segment]);

  const [activeIcon, setActiveIcon] = useState("recipe");

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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            margin: "20px 0",
          }}
        >
          <div style={{
              display: "flex",
              justifyContent: "space-around",
              width: "90%",
              maxWidth: "500px",
              padding: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: "25px",
              background: "#fff",
            }}
          >
            <IonIcon
              icon={bookOutline}
              style={{
                fontSize: "24px",
                color: activeIcon === "recipe" ? "#7862FC" : "#000",
                cursor: "pointer",
              }}
              onClick={() => {
                handleSegmentChange("recipe");
              }}
            />
            <IonIcon
              icon={cubeOutline}
              style={{
                fontSize: "24px",
                color: activeIcon === "mealkit" ? "#7862FC" : "#000",
                cursor: "pointer",
              }}
            onClick={() => {
              handleSegmentChange("mealkit");
            }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
          {renderContent}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CreatorProfile;