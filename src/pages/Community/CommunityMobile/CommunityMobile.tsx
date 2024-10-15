import React, { useEffect, useMemo, useState } from "react";
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
import CommunityCard from "../../../components/CommunityCard/CommunityCard";
import NewCommunityCard from "../../../components/CommunityCard/NewCommunityCard";
import SkeletonCommunityCard from "../../../components/CommunityCard/SkeletonCommunityCard";
import HomeImageCard from "../../../components/HomeImageCard";
import CreatorCommunityCard from "../../../components/CreatorCommunityCard/CreatorCommunityCard";
import SkeletonCreatorCommunityCard from "../../../components/CreatorCommunityCard/SkeletonCreatorCommunityCard";
import {
  addOutline,
  restaurantOutline,
  gift,
} from 'ionicons/icons';
import { useDietaryDetails, useMealTypeList } from "../../../api/productApi";
import { useOrder } from "../../../contexts/orderContext";

import styles from './CommunityMobile.module.css'
import { useCommunityMealkitsList, CommunityMealkitData } from "../../../api/mealkitApi";

type CombinedData = 
  | (CommunityRecipeData & { type: 'recipe' })
  | (CommunityMealkitData & { type: 'mealkit' });

function CommunityMobile() {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [dietary, setDietary] = useState<number[]>([]);
  const [applyDietary, setApplyDietary] = useState(false);
  const [mealType, setMealType] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  
  const { data: communityRecipes = [], isFetching: isRecipesFetching } = useCommunityRecipesList();
  const { data: communityMealkits = [], isFetching: isMealkitFetching } = useCommunityMealkitsList();
  const { data: dietaryRequirements = [] } = useDietaryDetails();
  const { data: mealTypes = [] } = useMealTypeList();
  const { meal_types } = useOrder();

  const [selectedFilter, setSelectedFilter] = useState("All");
  const buttons = ["All", "Recipe", "Mealkits", "Creators"];

    // for when filters applied
    const [filteredContent, setFilteredContent] = useState<CommunityRecipeData[]>([]);

  // combined mealkits and recipes
  const combinedData: CombinedData[] = useMemo(() => {
    const combined = [
      ...communityRecipes.map(recipe => ({ ...recipe, type: 'recipe' as const })),
      ...communityMealkits.map(mealkit => ({ ...mealkit, type: 'mealkit' as const }))
    ];
    return combined.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [communityRecipes, communityMealkits]);

  const handleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleButtonClick = (button: any) => {
    setSelectedFilter(button);
  };

  const renderContent = () => {
    if (isRecipesFetching || isMealkitFetching) {
      return (
        <>
          <SkeletonCommunityCard />
          <SkeletonCommunityCard />
          <SkeletonCommunityCard />
        </>
      );
    }

    let filteredData = combinedData;

    if (selectedFilter === "Creators") {
      return (
        <div className="flex flex-col mt-5 gap-1">
          <h3 className="text-sm font-medium">This week's spotlight</h3>
          <div className="overflow-x-auto w-full">
            <div className="flex flex-row min-w-min gap-2">
              <HomeImageCard />
              <HomeImageCard />
              <HomeImageCard />
            </div>
          </div>

          <h3 className="text-sm font-medium mt-5">Popular Gluten Free Creators</h3>
          {renderCreators()}

          <h3 className="text-sm font-medium mt-2">Popular Vegan Creator</h3>
          {renderCreators()}
        </div>
      );
    }

    if (selectedFilter === "Recipe") {
      filteredData = combinedData.filter(item => item.type === 'recipe');
    } else if (selectedFilter === "Mealkits") {
      filteredData = combinedData.filter(item => item.type === 'mealkit');
    }

    // apply filters for the filter component if applicable
    let filteredDataFiltered = filteredData;
    if (filterApplied) {
      // if dietary filters applied
      if (dietary.length > 0) {
        filteredDataFiltered = filteredData.filter(item => {
          // get the names of the selected dietary requirements
          const selectedDietaryNames = dietary
          .map(id => dietaryRequirements.find(dr => dr.id === id)?.name)
          .filter((name): name is string => name !== undefined);

          // check if all selected dietary names are included in the item's dietary_details
          return selectedDietaryNames.every(name => item.dietary_details.includes(name));
        })
      // if meal type filters applied
      if (mealType.length > 0) {
        filteredDataFiltered = filteredDataFiltered.filter(item => {
          // get the names of the selected meal types
          const selectedMealTypes = mealType
          .map(id => meal_types?.find(mt => mt.id === id)?.name)
          .filter((name): name is string => name !== undefined);

          // check if all selected meal types are included in the item's meal types
          if (item.type === 'mealkit') {
            return selectedMealTypes.every(mt => item.meal_types.includes(mt));
          } else {
            return selectedMealTypes.every(mt => item.meal_type.includes(mt));
          }
        });
      }
      // if price range filters applied
      if (priceRange.min !== 0 || priceRange.max !== 100) {
        filteredDataFiltered = filteredDataFiltered.filter(item => {
          // field 'price' on mealkit, field 'total_price' on recipe
          const itemPrice = item.type === 'mealkit' ? item.price : item.total_price;
          return itemPrice >= priceRange.min && itemPrice <= priceRange.max;
        })
      }
      }
    }

    return filteredDataFiltered.map((item) => (
      <NewCommunityCard 
        key={`${item.type}-${item.id}`} 
        item={item} 
      />
    ));

  };

  const renderCreators = () => {
    if (isRecipesFetching) {
      return (
        <div className="overflow-x-auto w-full">
          <div className="flex flex-row min-w-min">
            {[...Array(5)].map((_, index) => (
              <SkeletonCreatorCommunityCard key={index} />
            ))}
          </div>
        </div>
      );
    }

    if (communityRecipes.length > 0) {
      return (
        <div className="overflow-x-auto w-full">
          <div className="flex flex-row min-w-min">
            {communityRecipes.map((recipe) => (
              <CreatorCommunityCard key={recipe.id} item={recipe} />
            ))}
          </div>
        </div>
      );
    }

    return <p>No recipes found.</p>;
  };

  const router = useIonRouter();

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

        {renderContent()}

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
          <IonFabButton>
            <IonIcon icon={addOutline}></IonIcon>
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