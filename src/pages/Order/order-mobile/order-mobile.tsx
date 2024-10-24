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

  const handleProductClick = useCallback(
    (productId: number) => {
      router.push(`/product-details/${productId}`);
    },
    [router]
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
      <IonContent className="ion-padding font-sans">
        <div className="flex flex-col gap-1">
          <p className="text-xs">Delivery Location</p>
          <div className="flex flex-row items-center gap-0.5">
            <LocationIcon />
            <IonSelect
              value={selectedLocation}
              placeholder="Select Location"
              onIonChange={handleLocationChange}
              interface="popover"
              className="text-sm font-medium"
            >
              {locations.map((location: DeliveryLocation) => (
                <IonSelectOption key={location.id} value={location.id.toString()}>
                  {location.name} - {location.branch}
                </IonSelectOption>
              ))}
            </IonSelect>
          </div>
        </div>

        <div className="flex flex-row gap-1 mt-1 w-full justify-between">
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

        <div className="flex flex-col mt-1">
          <h3 className="text-base font-semibold">Mealkits</h3>
          {isLoading ? (
            <div className="overflow-x-auto w-full">
              <div className="flex flex-row min-w-min">
                {[...Array(5)].map((_, index) => (
                  <SkeletonOrderCard key={index} />
                ))}
              </div>
            </div>
          ) : finalData.mealkits.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <div className="flex flex-row min-w-min">
                {finalData.mealkits.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onClick={() => handleMealkitClick(item.id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p>No mealkits found.</p>
          )}
        </div>

        <div className="flex flex-col mt-1">
          <h3 className="text-base font-semibold">Recipes</h3>
          {isLoading ? (
            <div className="overflow-x-auto w-full">
              <div className="flex flex-row min-w-min">
                {[...Array(5)].map((_, index) => (
                  <SkeletonOrderCard key={index} />
                ))}
              </div>
            </div>
          ) : finalData.recipes.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <div className="flex flex-row min-w-min">
                {finalData.recipes.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onClick={() => handleRecipeClick(item.id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p>No recipes found.</p>
          )}
        </div>

        <div className="flex flex-col mb-12 mt-2.5">
          <h3 className="text-base font-semibold">Groceries</h3>
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
                  className="flex flex-row justify-between items-center bg-white rounded-2xl shadow-md p-2.5 mb-2.5 cursor-pointer"
                >
                  <div
                    onClick={() => handleProductClick(product.id)}
                    className="flex flex-row gap-1 flex-1"
                  >
                    <img
                      alt={product.name}
                      src={product.image || "/img/no-photo.png"}
                      className="w-full h-auto object-cover max-w-[50px] max-h-[50px] rounded-xl"
                    />
                    <div className="flex flex-col justify-center items-start h-full">
                      <p className="m-0 mb-1 text-xs font-normal truncate max-w-[200px]">
                        {product.name}
                      </p>
                      <h3 className="m-0 text-sm font-bold">
                        ${product.price_per_unit}
                      </h3>
                    </div>
                  </div>

                  <div 
                    className="flex flex-row items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IonIcon
                      icon={removeCircleOutline}
                      onClick={() => decrement(product.id)}
                      className="text-2xl cursor-pointer"
                    />
                    <div className="w-8 text-center m-0">
                      {cartQuantity}
                    </div>
                    <IonIcon
                      icon={addCircleOutline}
                      onClick={() => increment(product)}
                      className="text-2xl cursor-pointer"
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
          className="fixed font-sans bottom-5 left-1/2 transform -translate-x-1/2 w-[92vw] rounded-[16px] shadow-md bg-[#7862FC] z-50"
        >
          <div className="flex justify-between w-full flex-row px-2 py-1">
            <div className="flex w-full flex-col justify-around">
              <p className="text-base font-semibold text-left text-white">
                My Orders
              </p>
              {cart && (
                <p className="text-xs text-left font-normal text-white">
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
