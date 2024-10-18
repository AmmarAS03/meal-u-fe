import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  ProductData,
  useProductList,
  useDietaryDetails,
  useMealTypeList,
} from "../../../api/productApi";
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
import { useDietary } from "../../../contexts/dietaryContext";

function OrderMobile() {
  const queryClient = useQueryClient();
  const { checkDietaryCompatibility, showIncompatibleFoodWarning } =
    useDietary();
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
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [totalItem, setTotalItem] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const { data: mealkits = [], isFetching: isMealkitsFetching } =
    useMealkitList({ search: category });
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
  const { data: locations = [], isFetching: isLocationFetching } =
    useDeliveryLocations();

  const updateCartItem = useUpdateCartItem();
  const deleteCartItem = useDeleteCartItem();
  const addCartItem = useAddCartItem();

  const isLoading =
    isMealkitsFetching ||
    isRecipesFetching ||
    isProductFetching ||
    isCartFetching ||
    isLocationFetching;

  const refetchCart = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  }, [queryClient]);

  const getCartItem = useCallback(
    (productId: number) => {
      return cart?.products?.find(
        (item: { product: { id: number } }) => item.product.id === productId
      );
    },
    [cart]
  );

  const updateTotals = useCallback(() => {
    if (cart) {
      setTotalItem(cart.total_item);
      setTotalPrice(cart.total_price);
    }
  }, [cart]);

  useEffect(() => {
    updateTotals();
  }, [updateTotals]);

  const handleFilter = useCallback(() => {
    setIsFilterVisible((prev) => !prev);
  }, []);

  const addToCart = useCallback(
    (product: ProductData, cartItem: any) => {
      if (cartItem) {
        const newQuantity = cartItem.quantity + 1;
        updateCartItem.mutate(
          { item_type: "product", item_id: cartItem.id, quantity: newQuantity },
          {
            onSuccess: () => {
              refetchCart();
              updateTotals();
            },
          }
        );
      } else {
        addCartItem.mutate(
          { item_type: "product", product_id: product.id, quantity: 1 },
          {
            onSuccess: () => {
              refetchCart();
              updateTotals();
            },
            onError: (error) => console.error("Add to cart failed:", error),
            onSettled: () => console.log("Add to cart operation completed"),
          }
        );
      }
    },
    [updateCartItem, addCartItem, refetchCart, updateTotals]
  );

  const increment = useCallback(
    (product: ProductData) => {
      const cartItem = getCartItem(product.id);
      const isCompatible = checkDietaryCompatibility(product.dietary_details);

      if (!isCompatible) {
        showIncompatibleFoodWarning(
          () => addToCart(product, cartItem),
          () => console.log("User cancelled adding incompatible food to cart")
        );
      } else {
        addToCart(product, cartItem);
      }
    },
    [
      getCartItem,
      checkDietaryCompatibility,
      showIncompatibleFoodWarning,
      addToCart,
    ]
  );

  const decrement = useCallback(
    (productId: number) => {
      const cartItem = getCartItem(productId);
      if (cartItem) {
        if (cartItem.quantity > 1) {
          updateCartItem.mutate(
            {
              item_type: "product",
              item_id: cartItem.id,
              quantity: cartItem.quantity - 1,
            },
            { onSuccess: refetchCart }
          );
        } else {
          deleteCartItem.mutate(
            { item_type: "product", cart_product_id: cartItem.id },
            { onSuccess: refetchCart }
          );
        }
      }
    },
    [getCartItem, updateCartItem, deleteCartItem, refetchCart]
  );

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
    },
    []
  );

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        setSearchValue(event.currentTarget.value);
      }
    },
    []
  );

  const handleSearchIconClick = useCallback(() => {
    setSearchValue(searchValue);
  }, [searchValue]);

  const handleMealkitClick = useCallback(
    (mealkitId: number) => {
      router.push(`/mealkit-details/${mealkitId}`);
    },
    [router]
  );

  const handleRecipeClick = useCallback(
    (recipeId: number) => {
      router.push(`/recipe-details/${recipeId}`);
    },
    [router]
  );

  const filteredData = useMemo(() => {
    const filterItems = (items: any[], searchTerm: string) => {
      return items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    };

    return {
      mealkits: filterItems(mealkits, searchValue),
      recipes: filterItems(recipes, searchValue),
      products: filterItems(product, searchValue),
    };
  }, [mealkits, recipes, product, searchValue]);

  const applyFilters = useCallback(
    (items: any[]) => {
      if (!filterApplied) return items;

      return items.filter((item) => {
        const matchesDietary =
          dietary.length === 0 ||
          dietary.every((id) =>
            item.dietary_details.includes(
              dietaryRequirements.find((dr) => dr.id === id)?.name
            )
          );

        const matchesMealType =
          mealType.length === 0 ||
          mealType.every((id) => {
            const mealTypeName = meal_types?.find((mt) => mt.id === id)?.name;
            return "cooking_time" in item
              ? item.meal_type.includes(mealTypeName)
              : "meal_types" in item
              ? item.meal_types.includes(mealTypeName)
              : true;
          });

        const itemPrice =
          "cooking_time" in item ? item.total_price : item.price;
        const matchesPriceRange =
          itemPrice >= priceRange.min && itemPrice <= priceRange.max;

        return matchesDietary && matchesMealType && matchesPriceRange;
      });
    },
    [
      filterApplied,
      dietary,
      mealType,
      priceRange,
      dietaryRequirements,
      meal_types,
    ]
  );

  const finalData = useMemo(
    () => ({
      mealkits: applyFilters(filteredData.mealkits),
      recipes: applyFilters(filteredData.recipes),
      products: applyFilters(filteredData.products),
    }),
    [filteredData, applyFilters]
  );

  useEffect(() => {
    if (!isLocationFetching && locations.length > 0 && !selectedLocation) {
      setSelectedLocation(locations[0].id.toString());
      setDeliveryDetails((prev) => ({
        ...prev,
        deliveryLocation: locations[0].id,
      }));
      fillDeliveryLocationDetails(locations[0].id);
    }
  }, [
    isLocationFetching,
    locations,
    selectedLocation,
    setDeliveryDetails,
    fillDeliveryLocationDetails,
  ]);

  const handleLocationChange = useCallback(
    (e: CustomEvent) => {
      const locationId = parseInt(e.detail.value, 10);
      setSelectedLocation(e.detail.value);
      setDeliveryDetails((prev) => ({ ...prev, deliveryLocation: locationId }));
      fillDeliveryLocationDetails(locationId);
    },
    [setDeliveryDetails, fillDeliveryLocationDetails]
  );

  const handleApplyFilter = useCallback(() => {
    setFilterApplied(true);
    setIsFilterVisible(false);
  }, []);

  useEffect(() => {
    if (
      !dietary.length &&
      !applyDietary &&
      !mealType.length &&
      priceRange.min === 0 &&
      priceRange.max === 100
    ) {

      setFilterApplied(false);
    }
  }, [dietary, applyDietary, mealType, priceRange]);

  const renderSection = useCallback(
    (
      title: string,
      items: any[],
      ItemComponent: React.ComponentType<any>,
      handleClick: (id: number) => void
    ) => (
      <div
        style={{ display: "flex", flexDirection: "column", marginTop: "5px" }}
      >
        <p style={{ fontSize: "16px", fontWeight: "600" }}>{title}</p>
        {isLoading ? (
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
        ) : items.length > 0 ? (
          <div style={{ overflowX: "auto", width: "100%" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                minWidth: "min-content",
              }}
            >
              {items.map((item) => (
                <ItemComponent
                  key={item.id}
                  item={item}
                  onClick={() => handleClick(item.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <p>No {title.toLowerCase()} found.</p>
        )}
      </div>
    ),
    [isLoading]
  );

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
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <IconInput
            onInputHandleChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            rightIcon={<SearchIcon />}
            onRightIconClick={handleSearchIconClick}
            placeholder="Search"
            width="100%"
            value={searchValue}
          />
          <IonButton size="small" onClick={handleFilter}>
            <FilterIcon />
          </IonButton>
        </div>

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

        {renderSection(
          "Mealkits",
          finalData.mealkits,
          ItemCard,
          handleMealkitClick
        )}
        {renderSection(
          "Recipes",
          finalData.recipes,
          ItemCard,
          handleRecipeClick
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "50px",
            marginTop: "10px",
          }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: "600" }}>Groceries</h3>
          {isLoading ? (
            <>
              <SkeletonProductItem />
              <SkeletonProductItem />
              <SkeletonProductItem />
            </>
          ) : finalData.products.length > 0 ? (
            finalData.products.map((product: ProductData) => {
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

                  <div style={{ display: "flex", flexDirection: "row" }}>
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
