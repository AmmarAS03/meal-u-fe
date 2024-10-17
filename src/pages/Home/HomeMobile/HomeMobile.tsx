import { useState } from "react";
import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonButton,
  useIonRouter,
} from "@ionic/react";
import FilterIcon from "../../../../public/icon/filter";
import FilterOverlayOld from "../../../components/FilterOverlay/filterOverlayOld";
import {
  useMealkitList,
  MealkitData,
  useTrendingMealkitList,
} from "../../../api/mealkitApi";
import {
  CommunityRecipeData,
  useRecipesList,
  useTrendingRecipesList,
} from "../../../api/recipeApi";
import { useLocationList } from "../../../api/locationApi";
import { useParams } from "react-router-dom";
import HomeItemCard from "../../../components/HomeCard/HomeItemCard";
import NotifIcon from "../../../../public/icon/notif-icon";
import HomeImageCard from "../../../components/HomeImageCard/HomeImageCard";
import SkeletonHomeItemCard from "../../../components/HomeCard/SkeletonHomeItemCard";
import { useTopCreatorsByDietary } from "../../../api/creatorApi";
import SkeletonHomeImageCard from "../../../components/HomeImageCard/SkeletonImageCard";
import { useOrder } from "../../../contexts/orderContext";

function HomeMobile() {
  const { category } = useParams<{ category: string }>();
  const { currentOrdersCount } = useOrder();
  const router = useIonRouter();
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");

  const { data: trendingRecipes = [], isFetching: isTrendingRecipesFetching } =
    useTrendingRecipesList();
  const { data: trendingMealkit = [], isFetching: isTrendingMealkitFetching } =
    useTrendingMealkitList();

  const { data: location = [], isFetching: isLocationFetching } =
    useLocationList();

  if (!isLocationFetching && location && !currentLocation) {
    const firstLocation = location[0].name;
    setCurrentLocation(firstLocation);
  }

  const { data: topCreator = [], isFetching: isTopCreatorFetching } =
    useTopCreatorsByDietary();

  const handleMealkitClick = (mealkitId: number) => {
    router.push(`/mealkit-details/${mealkitId}`);
  };

  const handleRecipeClick = (recipeId: number) => {
    router.push(`/recipe-details/${recipeId}`);
  };

  const handleClick = () => {
    router.push('/tab4');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="ion-hide-sm-up">
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding font-sans">
        <div className="flex justify-center items-center">
          <div className="flex justify-between items-center w-4/5 border-2 border-[#7862FC] p-3 rounded-xl" onClick={handleClick}>
            <p className="text-sm font-semibold text-[#7862FC]">
              You have {currentOrdersCount} ongoing orders.
            </p>
            <NotifIcon />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "20px",
          }}
        >
          {isTrendingRecipesFetching ? (
            // Show skeleton loading state outside the overflow div
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                marginBottom: 10,
              }}
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonHomeImageCard key={index} />
              ))}
            </div>
          ) : (
            <div style={{ overflowX: "auto", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  minWidth: "min-content",
                  gap: 10,
                }}
              >
                {topCreator.length > 0 ? (
                  // Render HomeImageCards with topCreator data
                  topCreator.map((item) => (
                    <HomeImageCard
                      key={item.dietary_detail.id}
                      creatorImage={item.top_creator.image}
                      creatorName={`${item.top_creator.first_name} ${item.top_creator.last_name}`}
                      dietaryName={item.dietary_detail.name}
                      recipeCount={item.top_creator.recipe_count}
                    />
                  ))
                ) : (
                  // Show message if no data
                  <p>No top creators found.</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "20px",
          }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: "600" }}>
            Trending Recipes
          </h3>
          {isTrendingRecipesFetching ? (
            <div style={{ overflowX: "auto", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  minWidth: "min-content",
                }}
              >
                {[...Array(5)].map((_, index) => (
                  <SkeletonHomeItemCard key={index} />
                ))}
              </div>
            </div>
          ) : trendingRecipes.length > 0 ? (
            <div style={{ overflowX: "auto", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  minWidth: "min-content",
                }}
              >
                {trendingRecipes.map((recipe: CommunityRecipeData) => (
                  <HomeItemCard
                    key={recipe.id}
                    item={recipe}
                    onClick={handleRecipeClick}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p>No trending recipes found.</p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "15px",
            marginBottom: "50px",
          }}
        >
          <p style={{ fontSize: "16px", fontWeight: "600" }}>
            Trending Mealkits
          </p>
          {isTrendingMealkitFetching ? (
            <div style={{ overflowX: "auto", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  minWidth: "min-content",
                }}
              >
                {[...Array(5)].map((_, index) => (
                  <SkeletonHomeItemCard key={index} />
                ))}
              </div>
            </div>
          ) : trendingMealkit.length > 0 ? (
            <div style={{ overflowX: "auto", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  minWidth: "min-content",
                }}
              >
                {trendingMealkit.map((mealkit: MealkitData) => (
                  <HomeItemCard
                    key={mealkit.id}
                    item={mealkit}
                    onClick={handleMealkitClick}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p>No trending mealkits found.</p>
          )}
        </div>

        {isFilterVisible && (
          <div className="filter">
            <FilterOverlayOld />
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}

export default HomeMobile;
