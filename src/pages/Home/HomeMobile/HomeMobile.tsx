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
import HomeImageCard from "../../../components/HomeImageCard";
import SkeletonHomeItemCard from "../../../components/HomeCard/SkeletonHomeItemCard";

function HomeMobile() {
  const { category } = useParams<{ category: string }>();
  const router = useIonRouter();
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentLocation, setCurrentLocation] = useState("");
  const { data: mealkits = [], isFetching: isMealkitsFetching } =
    useMealkitList({
      search: selectedCategory,
    });
  const { data: recipes = [], isFetching: isRecipesFetching } = useRecipesList({
    search: category,
  });

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

  const handleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleMealkitClick = (mealkitId: number) => {
    router.push(`/mealkit-details/${mealkitId}`);
  };

  // To do di filter based on selected
  const filterItems = (items: any[], searchTerm: string) => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleRecipeClick = (recipeId: number) => {
    router.push(`/recipe-details/${recipeId}`);
  };

  const filteredMealkits = filterItems(mealkits, searchValue);
  const filteredRecipes = filterItems(recipes, searchValue);

  const [selectedFilter, setSelectedFilter] = useState("All");
  const buttons = ["All", "Recipe", "Mealkits", "Creators"];

  const handleButtonClick = (button: any) => {
    setSelectedFilter(button);
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
          <div className="flex justify-between items-center w-4/5 border-2 border-[#7862FC] p-3 rounded-xl">
            <p className="text-sm font-semibold text-[#7862FC]">
              1 Update From Your Order
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
            <p>No recipes found.</p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "15px",
            marginBottom: "50px"
          }}
        >
          <p style={{ fontSize: "16px", fontWeight: "600" }}>
            Trending Mealkits
          </p>
          {isTrendingMealkitFetching ? (
             <div style={{ overflowX: "auto", width: "100%" }}>
             <div style={{ display: "flex", flexDirection: "row", minWidth: "min-content" }}>
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
            <p>No mealkits found.</p>
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
