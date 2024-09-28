import React, { useState, useCallback } from "react";
import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonButton,
  useIonRouter,
} from "@ionic/react";
import LocationIcon from "../../../../public/icon/location-icon";
import SearchIcon from "../../../../public/icon/search-icon";
import FilterIcon from "../../../../public/icon/filter";
import FilterOverlay from "../../../components/FilterOverlay";
import "./order-mobile.css";
import {
  heart,
  searchOutline,
  addCircleOutline,
  removeCircleOutline,
  remove,
  optionsOutline,
} from "ionicons/icons";
import IconInput from "../../../components/icon-input";
import { useMealkitList, MealkitData } from "../../../api/mealkitApi";
import { RecipeData, useRecipesList } from "../../../api/recipeApi";
import { ProductData, useProductList } from "../../../api/productApi";
import { LocationData, useLocationList } from "../../../api/locationApi";
import { useParams } from "react-router-dom";
import ItemCard from "../../../components/ItemCard";

function OrderMobile() {
  const { category } = useParams<{ category: string }>();
  const router = useIonRouter();
  const [count, setCount] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<{[key: number]: number}>({});
  const { data: mealkits = [], isFetching: isMealkitsFetching } =
    useMealkitList({
      search: selectedCategory,
    });
  const { data: recipes = [], isFetching: isRecipesFetching } = useRecipesList({
    search: category,
  });
  const { data: product = [], isFetching: isProductFetching } = useProductList({
    search: category,
  });

  const { data: location = [], isFetching: isLocationFetching } =
    useLocationList();

  if (!isLocationFetching && location && !currentLocation) {
    const firstLocation = location[0].name;
    setCurrentLocation(firstLocation);
  }

  const handleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const increment = (productId: number) => {
    setSelectedProducts(prev => {
      const newCount = (prev[productId] || 0) + 1;
      const newSelected = { ...prev, [productId]: newCount };
      console.log("Selected products:", newSelected);
      return newSelected;
    });
  };
  
  const decrement = (productId: number) => {
    setSelectedProducts(prev => {
      const newCount = Math.max((prev[productId] || 0) - 1, 0);
      const newSelected = { ...prev, [productId]: newCount };
      if (newCount === 0) {
        delete newSelected[productId];
      }
      console.log("Selected products:", newSelected);
      return newSelected;
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setSearchValue(searchValue);
    }
  };

  const handleMealkitClick = (mealkitId: number) => {
    router.push(`/mealkit-details/${mealkitId}`);
  };

  const handleSearchIconClick = useCallback(() => {
    setSearchValue(searchValue);
  }, [searchValue]);

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
  const filteredProducts = filterItems(product, searchValue);
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
        <div>
          <p style={{ marginBottom: "0px" }}>Delivery Location</p>
        </div>
        <div className="header-location">
          <LocationIcon />
          <p>{currentLocation}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
          <IconInput
            onInputHandleChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            rightIcon={<SearchIcon />}
            onRightIconClick={handleSearchIconClick}
            placeholder="Search"
            width="300px"
            value={searchValue}
          />
          <IonButton size="small" onClick={handleFilter}>
            <FilterIcon />
          </IonButton>
        </div>
        {isFilterVisible ? (
          <div className="filter">
            <FilterOverlay />
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h3>Mealkits</h3>
              {isMealkitsFetching ? (
                <p>Loading mealkits...</p>
              ) : filteredMealkits.length > 0 ? (
                <div style={{ overflowX: "auto", width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      minWidth: "min-content",
                    }}
                  >
                    {filteredMealkits.map((mealkit: MealkitData) => (
                      <ItemCard
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

            <div style={{ display: "flex", flexDirection: "column" }}>
              <h3>Recipes</h3>
              {isRecipesFetching ? (
                <p>Loading recipes...</p>
              ) : filteredRecipes.length > 0 ? (
                <div style={{ overflowX: "auto", width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      minWidth: "min-content",
                    }}
                  >
                    {filteredRecipes.map((recipe: RecipeData) => (
                      <ItemCard
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

            <div style={{ display: "flex", flexDirection: "column" }}>
              <h3>Groceries</h3>
              {isProductFetching ? (
                <p>Loading groceries...</p>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product: ProductData) => (
                  <div
                    key={product.id}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#ffffff",
                      borderRadius: 15,
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      padding: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <div style={{display: 'flex', flexDirection: 'row', gap: '5px'}}>
                      <img
                        alt={product.name}
                        src={product.image || "/img/no-photo.png"}
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "cover",
                          maxWidth: "50px",
                          maxHeight: "50px",
                          borderRadius: "10px",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "flex-start",
                          height: "100%",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            marginBottom: "4px",
                            fontSize: "12px",
                            fontWeight: "normal",
                          }}
                        >
                          {product.name.length > 65 ? `${product.name.slice(0, 65)}...` : product.name}
                        </p>
                        <h3
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          ${product.price_per_unit}
                        </h3>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <IonIcon
                        icon={removeCircleOutline}
                        onClick={() => decrement(product.id)}
                        style={{ fontSize: "24px", cursor: "pointer" }}
                      />
                      <div
                        style={{
                          width: "30px",
                          textAlign: "center",
                          margin: "0 5px",
                        }}
                      >
                    {selectedProducts[product.id] || 0}
                      </div>
                      <IonIcon
                        icon={addCircleOutline}
                        onClick={() => increment(product.id)}
                        style={{ fontSize: "24px", cursor: "pointer" }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p>No Groceries found.</p>
              )}
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
}

export default OrderMobile;
