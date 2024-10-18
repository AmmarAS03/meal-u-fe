import React from "react";
import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonButton,
  IonInput,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
} from "@ionic/react";
import { useCategoriesList } from '../../../api/categoryApi';
import { useHistory } from "react-router-dom";
import { useTrendingRecipesList } from "../../../api/recipeApi";
import SkeletonHomeItemCard from "../../../components/HomeCard/SkeletonHomeItemCard";
import HomeItemCard from "../../../components/HomeCard/HomeItemCard";

function HomeWeb() {
  const history = useHistory();
  const { data: listOfCategories = [], isFetching: isCategoriesFetching } = useCategoriesList();
  const { data: listOfTrendingRecipes = [], isFetching: isTrendingRecipesFetching } = useTrendingRecipesList();

  const navigateToCategory = (category: string) => {
    history.push(`/order/${category}`);
  }


  // TODO
  const handleRecipeClick = (id: number) => {
    console.log("recipe clicked");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="ion-hide-sm-up">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1"></IonBackButton>
          </IonButtons>
          <IonTitle>Order</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="flex flex-col mx-20 justify-center">
          <div className="">
            <img
              src="/img/Card.png"
              alt="Order card"
              className="order-card-image"
            />
          </div>
          <div className="header-category">
            <h3>Category</h3>
            <p style={{ color: '#7862FC' }}>See All</p>
          </div>
          <div className="flex flex-row overflow-x-auto">
            {isCategoriesFetching ? (
              <>
                <IonButton shape="round">...</IonButton>
              </>
            ) : (
              listOfCategories.map((category) => (
                <IonButton
                  shape="round"
                  onClick={() => navigateToCategory(category.name)}
                >
                  {category.name}
                </IonButton>
              ))
            )}
          </div>
          <div className="header-category">
            <h3>Popular Recipes</h3>
            <p style={{ color: '#7862FC' }}>See All</p>
          </div>
          <div className="flex flex-row overflow-x-auto shrink-0">
            {isTrendingRecipesFetching ? (
              <>
                {[...Array(5)].map((_, index) => (
                  <SkeletonHomeItemCard key={index} />
                ))}
              </>
            ) : (
              listOfTrendingRecipes.length > 0 ? (
                listOfTrendingRecipes.map((recipe) => (
                  <HomeItemCard key={recipe.id} item={recipe} onClick={() => handleRecipeClick}/>
                ))
              ) : (
                <div><p>No trending recipes.</p></div>
              )
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default HomeWeb;
