import React, { useCallback, useEffect, useState } from "react";
import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonIcon,
  IonButton,
  useIonRouter,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import LocationIcon from "../../../../public/icon/location-icon";
import SearchIcon from "../../../../public/icon/search-icon";
import FloatCartIcon from "../../../../public/icon/float-cart-icon";
import FilterIcon from "../../../../public/icon/filter";
import { addCircleOutline, removeCircleOutline } from "ionicons/icons";
import IconInput from "../../../components/icon-input";
import { useMealkitList, MealkitData } from "../../../api/mealkitApi";
import { RecipeData, useRecipesList } from "../../../api/recipeApi";
import { ProductData, useProductList, useDietaryDetails, useMealTypeList } from "../../../api/productApi";
import { LocationData, useLocationList } from "../../../api/locationApi";
import { useOrder } from "../../../contexts/orderContext";
import {
  useCart,
  CartData,
  useUpdateCartItem,
  useDeleteCartItem,
  useAddCartItem,
} from "../../../api/cartApi";
import { useParams } from "react-router-dom";
import ItemCard from "../../../components/ItemCard/ItemCard";
import { useQueryClient } from "@tanstack/react-query";
import SkeletonOrderCard from "../../../components/ItemCard/SkeletonItemCard";
import SkeletonProductItem from "../../../components/ProductCard/SkeletonProductCard";
import {
  DeliveryLocation,
  useDeliveryLocations,
} from "../../../api/deliveryApi";
import FilterOverlay from "../../../components/FilterOverlay";
import { useDietary, DietaryProvider } from "../../../contexts/dietaryContext";

function OrderMobile() {
  const queryClient = useQueryClient();
  const { checkDietaryCompatibility, showIncompatibleFoodWarning } = useDietary();
  const { category } = useParams<{ category: string }>();
  const { setDeliveryDetails, fillDeliveryLocationDetails } = useOrder();
  const router = useIonRouter();
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [dietary, setDietary] = useState<number[]>([]);
  const [applyDietary, setApplyDietary] = useState(false);
  const [mealType, setMealType] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [totalItem, setTotalItem] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
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
  const { data: cart, isFetching: isCartFetching } = useCart() as {
    data: CartData | undefined;
    isFetching: boolean;
  };
  const { data: dietaryRequirements = [] } = useDietaryDetails();
  const { data: mealTypes = [] } = useMealTypeList();
  const { meal_types } = useOrder();

  const updateCartItem = useUpdateCartItem();
  const deleteCartItem = useDeleteCartItem();
  const addCartItem = useAddCartItem();

  const refetchCart = () => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  };

  const getCartItem = (productId: number) => {
    return cart?.products?.find(
      (item: { product: { id: number } }) => item.product.id === productId
    );
  };

  const { data: locations = [], isFetching: isLocationFetching } =
    useDeliveryLocations();

  const updateTotals = useCallback(() => {
    if (cart) {
      setTotalItem(cart.total_item);
      setTotalPrice(cart.total_price);
    }
  }, [cart]);

  useEffect(() => {
    updateTotals();
  }, [cart, updateTotals]);

  const handleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const increment = (product: ProductData) => {
    const cartItem = getCartItem(product.id);
    
    // Check if the product is compatible with the user's dietary requirements
    const isCompatible = checkDietaryCompatibility(product.dietary_details);
  
    if (!isCompatible) {
      showIncompatibleFoodWarning(
        () => {
          // User confirmed to add the item despite the warning
          addToCart(product, cartItem);
        },
        () => {
          // User cancelled adding the item
          console.log('User cancelled adding incompatible food to cart');
        }
      );
    } else {
      // If compatible, add to cart directly
      addToCart(product, cartItem);
    }
  };
  
  const addToCart = (product: ProductData, cartItem: any) => {
    if (cartItem) {
      const newQuantity = cartItem.quantity + 1;
      updateCartItem.mutate(
        {
          item_type: "product",
          item_id: cartItem.id,
          quantity: newQuantity,
        },
        {
          onSuccess: () => {
            refetchCart();
            updateTotals();
          },
        }
      );
    } else {
      addCartItem.mutate(
        {
          item_type: "product",
          product_id: product.id,
          quantity: 1,
        },
        {
          onSuccess: () => {
            refetchCart();
            updateTotals();
          },
          onError: (error) => {
            console.error("Add to cart failed:", error);
          },
          onSettled: () => {
            console.log("Add to cart operation completed (success or failure)");
          },
        }
      );
    }
  };

  const decrement = (productId: number) => {
    const cartItem = getCartItem(productId);
    if (cartItem) {
      if (cartItem.quantity > 1) {
        const newQuantity = cartItem.quantity - 1;
        updateCartItem.mutate(
          {
            item_type: "product",
            item_id: cartItem.id,
            quantity: newQuantity,
          },
          {
            onSuccess: () => refetchCart(),
          }
        );
      } else {
        deleteCartItem.mutate(
          {
            item_type: "product",
            cart_product_id: cartItem.id,
          },
          {
            onSuccess: () => refetchCart(),
          }
        );
      }
    }
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

  function filterContent(content: any): any {
    let finalContent = content;

    if (!filterApplied) {
      return content;
    } else {
      // dietary requirements filter applied
      if (dietary.length > 0) {
        finalContent = content.filter((item: any) => {
          const selectedDietaryNames = dietary
          .map(id => dietaryRequirements.find(dr => dr.id === id)?.name)
          .filter((name): name is string => name !== undefined);

          // check if all selected dietary names are included in the item's dietary_details
          return selectedDietaryNames.every(name => item.dietary_details.includes(name));
        })
      }

      // if meal type filters applied
      if (mealType.length > 0) {
        finalContent = content.filter((item: any) => {
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
        finalContent = content.filter((item: any) => {
          // field 'price' on mealkit, field 'total_price' on recipe
          const itemPrice = ('cooking_time' in item) ? item.total_price : item.price;
          return itemPrice >= priceRange.min && itemPrice <= priceRange.max;
        })
      }

      // if no content matches the filter
      if (finalContent.length === 0) {
        return (
          <div className="flex items-center justify-center h-4/5">
            <p className="text-sm text-gray-800">Sorry, we don't have anything that matches your preferences.</p>
          </div>
        );
      }

      return finalContent;
    }
  }

  // filter contents 
  const [finalMealkits, setFinalMealkits] = useState<any[]|null>(null);
  const [finalRecipes, setFinalRecipes] = useState<any[]|null>(null);
  const [finalProducts, setFinalProducts] = useState<any[]|null>(null);


  useEffect(() => {
    setFinalMealkits(filterContent(filteredMealkits));
    setFinalRecipes(filterContent(filteredRecipes));
    setFinalProducts(filterContent(filteredProducts));

  }, [isRecipesFetching,
    isMealkitsFetching,
    filteredMealkits,
    filteredRecipes,
    filteredProducts,
    filterApplied,
    dietary,
    mealType,
    priceRange,
  ])

  useEffect(() => {
    if (!isLocationFetching && locations.length > 0 && !selectedLocation) {
      setSelectedLocation(locations[0].id.toString());
      setDeliveryDetails((prev) => ({
        ...prev,
        deliveryLocation: locations[0].id,
      }));
      fillDeliveryLocationDetails(locations[0].id);
    }
  }, [isLocationFetching, locations, selectedLocation]);

  const handleLocationChange = (e: CustomEvent) => {
    const locationId = parseInt(e.detail.value, 10);
    setSelectedLocation(e.detail.value);
    setDeliveryDetails((prev) => ({
      ...prev,
      deliveryLocation: locationId,
    }));
    fillDeliveryLocationDetails(locationId);
  };

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
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1"></IonBackButton>
          </IonButtons>
          <IonTitle>Order</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <p style={{ fontSize: "12px" }}>Delivery Location</p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              alignItems: "center",
            }}
          >
            <LocationIcon />
            <IonSelect
              value={selectedLocation}
              placeholder="Select Location"
              onIonChange={handleLocationChange}
              interface="popover"
              style={{ fontSize: "14px", fontWeight: "500" }}
            >
              {locations.map((location: DeliveryLocation) => (
                <IonSelectOption
                  key={location.id}
                  value={location.id.toString()}
                >
                  {location.name} - {location.branch}
                </IonSelectOption>
              ))}
            </IonSelect>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "5px",
            marginTop: 5,
          }}
        >
          <IconInput
            onInputHandleChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            rightIcon={<SearchIcon />}
            onRightIconClick={handleSearchIconClick}
            placeholder="Search"
            width="300px"
            value={searchValue}
          />

          {/* FILTER BUTTON */}
          <IonButton size="small" onClick={handleFilter}>
            <FilterIcon />
          </IonButton>
        </div>

        {/* FILTER*/}
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "5px",
          }}
        >
          <p style={{ fontSize: "16px", fontWeight: "600" }}>Mealkits</p>
          {isMealkitsFetching ? (
            <div style={{ overflowX: "auto", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  minWidth: "min-content",
                }}
              >
                {[...Array(5)].map((_, index) => (
                  <SkeletonOrderCard key={index} />
                ))}
              </div>
            </div>
          ) : finalMealkits!.length > 0 ? (
            <div style={{ overflowX: "auto", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  minWidth: "min-content",
                }}
              >
                {finalMealkits!.map((mealkit: MealkitData) => (
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
          <h3 style={{ fontSize: "16px", fontWeight: "600" }}>Recipes</h3>
          {isRecipesFetching ? (
            <div style={{ overflowX: "auto", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  minWidth: "min-content",
                }}
              >
                {[...Array(5)].map((_, index) => (
                  <SkeletonOrderCard key={index} />
                ))}
              </div>
            </div>
          ) : finalRecipes!.length > 0 ? (
            <div style={{ overflowX: "auto", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  minWidth: "min-content",
                }}
              >
                {finalRecipes!.map((recipe: RecipeData) => (
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

        {/* Bawah ini Product (Groceries) */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "50px",
            marginTop: "10px",
          }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: "600" }}>Groceries</h3>
          {isProductFetching ? (
            <>
              <SkeletonProductItem />
              <SkeletonProductItem />
              <SkeletonProductItem />
            </>
          ) : finalProducts!.length > 0 ? (
            finalProducts!.map((product: ProductData) => {
              const cartItem = getCartItem(product.id);
              const cartQuantity = cartItem ? cartItem.quantity : 0;
              return (
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
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "5px",
                    }}
                  >
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
                          fontSize: "10px",
                          fontWeight: "normal",
                        }}
                      >
                        {product.name.length > 50
                          ? `${product.name.slice(0, 50)}...`
                          : product.name}
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
                        margin: "0px",
                      }}
                    >
                      {cartQuantity}
                    </div>
                    <IonIcon
                      icon={addCircleOutline}
                      onClick={() => increment(product)}
                      style={{ fontSize: "24px", cursor: "pointer" }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p>No Groceries found.</p>
          )}
        </div>

        {/* Bawah ini Floating Button */}

        {!isFilterVisible && (
          <IonButton
            onClick={() => router.push("/mycart")}
            style={{
              position: "fixed",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "85vw",
              height: "50px",
              "--border-radius": "25px",
              "--box-shadow": "0 4px 6px rgba(0, 0, 0, 0.1)",
              "--background": "#7862FC",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                flexDirection: "row",
                padding: "5px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "space-around",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "400",
                    textAlign: "left",
                    color: "#fff",
                  }}
                >
                  My Orders
                </p>
                {cart && (
                  <p
                    style={{
                      fontSize: "12px",
                      textAlign: "left",
                      color: "#fff",
                    }}
                  >
                    {totalItem} items - ${totalPrice} AUD
                  </p>
                )}
              </div>
              <FloatCartIcon />
            </div>
          </IonButton>
        )}
      </IonContent>
    </IonPage>
  );
}

export default OrderMobile;
