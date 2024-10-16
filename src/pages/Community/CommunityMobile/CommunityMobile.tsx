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
  IonIcon,
  IonCard
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
import {
  addOutline,
  restaurantOutline,
  gift,
} from 'ionicons/icons';
import styles from './CommunityMobile.module.css';
import { TrendingCreatorProfile, useTrendingCreators } from "../../../api/userApi";

import { useDietaryDetails, useMealTypeList } from "../../../api/productApi";
import { useOrder } from "../../../contexts/orderContext";



function CommunityMobile() {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [dietary, setDietary] = useState<number[]>([]);
  const [applyDietary, setApplyDietary] = useState(false);
  const [mealType, setMealType] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });

  const { data: communityRecipes = [], isFetching: isRecipesFetching } =
    useCommunityRecipesList();
  const { data: communityMealkit = [], isFetching: isMealkitFetching } =
    useCommunityMealkitList();
  const { trendingCreatorsMap, isLoading: isCreatorsLoading, isError } = 
    useTrendingCreators();

  const handleFilter = useCallback(() => {
    setIsFilterVisible((prev) => !prev);
  }, []);

  const { data: dietaryRequirements = [] } = useDietaryDetails();
  const { data: mealTypes = [] } = useMealTypeList();
  const { meal_types } = useOrder();

  const router = useIonRouter();

  const [selectedFilter, setSelectedFilter] = useState("All");
  const buttons = ["All", "Recipe", "Mealkits", "Creators"];

  const handleButtonClick = useCallback((button: string) => {
    setSelectedFilter(button);
  }, []);

  const handleItemClick = useCallback((item: CommunityRecipeData | CommunityMealkitData | TrendingCreatorProfile) => {
    if ('cooking_time' in item || 'meal_type' in item) {
      // It's a recipe
      router.push(`/recipe-details/${item.id}`);
    } else if ('email' in item) {
      // It's a creator
      router.push(`/community/creator-profile/${item.id}`);
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

  const renderContent = useMemo(() => {

    if (isRecipesFetching || isMealkitFetching || isCreatorsLoading) {
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
              marginBottom: "50px",
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
            
            <div>
              {dietaryRequirements.map((dietaryDetail) => (
                <div key={dietaryDetail.id}>
                  {trendingCreatorsMap[dietaryDetail.id].length > 0 && (
                    <div>
                      <h3>Popular {dietaryDetail.name} Creators</h3>
                      <div>
                        <div style={{ overflowX: "auto", width: "100%" }}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              minWidth: "min-content",
                            }}
                          >
                            {trendingCreatorsMap[dietaryDetail.id].map((creator) => (
                              <CreatorCommunityCard key={creator.id} item={creator} onClick={() => handleItemClick(creator)}/>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <p>No content to display.</p>;
    }

    let filteredContent = contentToRender;
    
    if (filterApplied) {
      // if dietary requirements filter applied
      if (dietary.length > 0) {
        filteredContent = contentToRender.filter(item => {
          // get the names of the selected dietary requirements
          const selectedDietaryNames = dietary
          .map(id => dietaryRequirements.find(dr => dr.id === id)?.name)
          .filter((name): name is string => name !== undefined);

          // check if all selected dietary names are included in the item's dietary_details
          return selectedDietaryNames.every(name => item.dietary_details.includes(name));
        })
      }
      // if meal type filters applied
      if (mealType.length > 0) {
        filteredContent = filteredContent.filter(item => {
          // get the names of the selected meal types
          const selectedMealTypes = mealType
          .map(id => meal_types?.find(mt => mt.id === id)?.name)
          .filter((name): name is string => name !== undefined);

          // check if all selected meal types are included in the item's meal types
          if ('cooking_time' in item) { // recipe
            return selectedMealTypes.every(mt => item.meal_type.includes(mt));
          } else if ('meal_types' in item) { // mealkit
            return selectedMealTypes.every(mt => item.meal_types.includes(mt));
          } else {
            return false;
          }
        });
      }
      // if price range filters applied
      if (priceRange.min !== 0 || priceRange.max !== 100) {
        filteredContent = filteredContent.filter(item => {
          // field 'price' on mealkit, field 'total_price' on recipe
          const itemPrice = ('cooking_time' in item) ? item.total_price : item.price;
          return itemPrice >= priceRange.min && itemPrice <= priceRange.max;
        })
      }

      // if no content matches the filter
      if (filteredContent.length === 0) {
        return (
          <div className="flex items-center justify-center h-4/5">
            <p className="text-sm text-gray-800">Sorry, we don't have anything that matches your preferences.</p>
          </div>
        );
      }

    }

    return (
      <>
        {filteredContent.map((item: CommunityRecipeData | CommunityMealkitData, index: number) => (
          <CommunityCard key={`${item.id}-${index}`} recipe={item} onClick={() => handleItemClick(item)}/>
        ))}
      </>
    );
  }, [selectedFilter,
      isRecipesFetching,
      isMealkitFetching,
      communityRecipes,
      communityMealkit,
      combinedAndSortedData,
      filterApplied,
      dietary,
      mealType,
      priceRange,
    ]);


  const navigateToCreateRecipe = () => {
    router.push('/community/create/recipe');
  }

  const navigateToCreateMealkit = () => {
    router.push('/community/create/mealkit');
  }

  const handleApplyFilter = (filters: any) => {
    setFilterApplied(true);
    setIsFilterVisible(false);
  };

  // user clears filter
  useEffect(() => {
    if (!dietary.length && !applyDietary && !mealType.length &&
      priceRange.min === 0 && priceRange.max === 100) {
      setFilterApplied(false);
    }
  }, [dietary, applyDietary, mealType, priceRange]);

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
            <FilterOverlay
            onClose={() => setIsFilterVisible(false)}
            onApplyFilter={handleApplyFilter}
            dietary={dietary}
            setDietary={setDietary}
            applyDietary={applyDietary}
            setApplyDietary={setApplyDietary}
            meals={mealType}
            setMeals={setMealType}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            dietaryRequirements={dietaryRequirements}
            mealTypes={mealTypes}
          />
        )}
        <IonFab className={styles.fabStyle} color="tertiary" slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton color="tertiary">
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
