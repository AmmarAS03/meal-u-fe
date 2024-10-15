import { useCallback, useEffect, useMemo, useState } from "react";
import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonButton,
  useIonRouter,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon
} from "@ionic/react";
import FilterIcon from "../../../../public/icon/filter";
import FilterOverlay from "../../../components/FilterOverlay";
import {
  CommunityRecipeData,
  useCommunityRecipesList,
} from "../../../api/recipeApi";
import {
  CommunityMealkitData,
  useCommunityMealkitList,
} from "../../../api/mealkitApi";
import CommunityCard from "../../../components/CommunityCard/CommunityCard";
import SkeletonCommunityCard from "../../../components/CommunityCard/SkeletonCommunityCard";
import HomeImageCard from "../../../components/HomeImageCard";
import CreatorCommunityCard from "../../../components/CreatorCommunityCard/CreatorCommunityCard";
import SkeletonCreatorCommunityCard from "../../../components/CreatorCommunityCard/SkeletonCreatorCommunityCard";
import RecipeIcon from "../../../../public/icon/recipe-icon";
import {
  addOutline,
  restaurantOutline,
  gift,
} from 'ionicons/icons';

import styles from './CommunityMobile.module.css'


function CommunityMobile() {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const { data: communityRecipes = [], isFetching: isRecipesFetching } =
    useCommunityRecipesList();
  const { data: communityMealkit = [], isFetching: isMealkitFetching } =
    useCommunityMealkitList();

  const handleFilter = useCallback(() => {
    setIsFilterVisible((prev) => !prev);
  }, []);


  const router = useIonRouter();

  const [selectedFilter, setSelectedFilter] = useState("All");
  const buttons = ["All", "Recipe", "Mealkits", "Creators"];

  const handleButtonClick = useCallback((button: string) => {
    setSelectedFilter(button);
  }, []);

  const handleItemClick = useCallback((item: CommunityRecipeData | CommunityMealkitData) => {
    if ('cooking_time' in item || 'meal_type' in item) {
      // It's a recipe
      router.push(`/recipe-details/${item.id}`);
    } else {
      // It's a mealkit
      router.push(`/mealkit-details/${item.id}`);
    }
  }, [router]);

  const combinedAndSortedData = useMemo(() => {
    const combined = [...communityRecipes, ...communityMealkit];
    return combined.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [communityRecipes, communityMealkit]);

  console.log("MEALKIT COMMUNITY",communityMealkit)

  const renderContent = useMemo(() => {

    if (isRecipesFetching || isMealkitFetching) {
      return (
        <>
          <SkeletonCommunityCard />
          <SkeletonCommunityCard />
          <SkeletonCommunityCard />
        </>
      );
    }

    let contentToRender;

    switch (selectedFilter) {
      case "Recipe":
        contentToRender = communityRecipes;
        break;
      case "Mealkits":
        contentToRender = communityMealkit;
        break;
      case "All":
        contentToRender = combinedAndSortedData;
        break;
      case "Creators":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "20px",
              gap: "5px",
            }}
          >
            <h3 style={{ fontSize: "14px", fontWeight: "500" }}>
              This week's spotlight
            </h3>
            <div style={{ overflowX: "auto", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  minWidth: "min-content",
                  gap: 10,
                }}
              >
                <HomeImageCard />
                <HomeImageCard />
                <HomeImageCard />
              </div>
            </div>

            <h3
              style={{ fontSize: "14px", fontWeight: "500", marginTop: "20px" }}
            >
              Popular Gluten Free Creators
            </h3>
            <div style={{ overflowX: "auto", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  minWidth: "min-content",
                }}
              >
                {communityRecipes.map((recipe: CommunityRecipeData) => (
                  <CreatorCommunityCard key={recipe.id} item={recipe} />
                ))}
              </div>
            </div>

            <h3
              style={{ fontSize: "14px", fontWeight: "500", marginTop: "10px" }}
            >
              Popular Vegan Creator
            </h3>
            <div style={{ overflowX: "auto", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  minWidth: "min-content",
                }}
              >
                {communityRecipes.map((recipe: CommunityRecipeData) => (
                  <CreatorCommunityCard key={recipe.id} item={recipe} />
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return <p>No content to display.</p>;
    }

    return (
      <>
        {contentToRender.map((item: CommunityRecipeData | CommunityMealkitData, index: number) => (
          <CommunityCard key={`${item.id}-${index}`} recipe={item} onClick={() => handleItemClick(item)}/>
        ))}
      </>
    );
  }, [selectedFilter, isRecipesFetching, isMealkitFetching, communityRecipes, communityMealkit, combinedAndSortedData]);


  const navigateToCreateRecipe = () => {
    router.push('/community/create/recipe');
  }

  const navigateToCreateMealkit = () => {
    router.push('/community/create/mealkit');
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="ion-hide-sm-up">
          <IonTitle>Community</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding font-sans">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row space-x-2">
            {buttons.map((button) => (
              <button
                key={button}
                onClick={() => handleButtonClick(button)}
                className={`px-4 py-2 rounded-full text-xs transition-colors ${
                  selectedFilter === button
                    ? "bg-[#7862FC] text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {button}
              </button>
            ))}
          </div>

          <IonButton size="small" onClick={handleFilter}>
            <FilterIcon />
          </IonButton>
        </div>

        {renderContent}

        {isFilterVisible && (
          <div className="filter">
            <FilterOverlay />
          </div>
        )}
        <IonFab className={styles.fabStyle} color="tertiary" slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton>
            <IonIcon icon={addOutline}></IonIcon> {/*main button*/}
          </IonFabButton>
          <IonFabList side="top">
            <IonFabButton color="dark" onClick={navigateToCreateRecipe}>
              <IonIcon icon={restaurantOutline}></IonIcon>
            </IonFabButton>
            <IonFabButton color="dark" onClick={navigateToCreateMealkit}>
              <IonIcon icon={gift}></IonIcon>
            </IonFabButton>
          </IonFabList>
        </IonFab>
      </IonContent>
    </IonPage>
  );
}

export default CommunityMobile;
