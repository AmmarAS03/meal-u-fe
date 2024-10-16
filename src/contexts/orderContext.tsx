import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DeliveryLocation,
  DeliveryTimeSlot,
  OrderCreationResponse,
  useCreateOrder,
  useDeliveryLocations,
  useDeliveryTimeSlots,
} from "../api/deliveryApi";
import {
  useCreateRecipe,
  CreateRecipePayload,
  usePreparationTypeList,
  PreparationType,
} from "../api/recipeApi";
import { formatDate } from "../pages/MyCart/MyCart-Mobile";
import {
  UnitData,
  useUnitList,
  ProductData,
  MealType,
  useMealTypeList,
} from "../api/productApi";
import { CategoryData, useCategoriesList } from "../api/categoryApi";
import { useQueries } from "@tanstack/react-query";
import { useAuth } from "../contexts/authContext";
import { addDays, isPast, max, parse } from "date-fns";
import { useGetUserOrders } from "../api/orderApi";

interface Filters {
  deliveryDate: string | null;
  deliveryBatch: string | null;
  deliveryLocation: number | null;
  orderStatus: string | null;
}

// Define the shape of the order context
interface OrderContextProps {
  handleOrderCreation: () => Promise<OrderCreationResponse | undefined>;
  handleRecipeCreation: (payload: CreateRecipePayload) => void;
  deliveryDetails: {
    deliveryLocation: number;
    deliveryTime: number;
    deliveryDate: Date;
  };
  setDeliveryDetails: React.Dispatch<
    React.SetStateAction<{
      // TODO: ganti implementation-nya jadi pas checkout aja
      deliveryLocation: number;
      deliveryTime: number;
      deliveryDate: Date;
    }>
  >;
  allDeliveryLocations: DeliveryLocation[] | undefined;
  deliveryLocationDetails: DeliveryLocation;
  setDeliveryLocationDetails: React.Dispatch<
    React.SetStateAction<DeliveryLocation>
  >;
  fillDeliveryLocationDetails: (id: number) => void;
  allDeliveryTimeSlots: DeliveryTimeSlot[] | undefined;
  latestTimeSlot: DeliveryTimeSlot | null;
  deliveryTimeSlotDetails: DeliveryTimeSlot;
  setDeliveryTimeSlotDetails: React.Dispatch<
    React.SetStateAction<DeliveryTimeSlot>
  >;
  fillDeliveryTimeSlotDetails: (id: number) => void;
  units: UnitData[] | undefined;
  getUnitId: (product: ProductData) => number;
  getUnitFromId: (id: number) => string | undefined;
  meal_types: MealType[] | undefined;
  getMealTypeFromId: (id: number) => string | undefined;

  deliveryDateFilter: string | null;
  setDeliveryDateFilter: (date: string | null) => void;
  filters: Filters;
  setFilter: (filterName: keyof Filters, value: string | number | null) => void;
  clearFilters: () => void;
  updateDeliveryLocation: (locationId: number) => void;
  currentOrdersCount: number;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // const { mutate: createOrder } = useCreateOrder();
  const createOrderMutation = useCreateOrder();
  const { mutate: createRecipe } = useCreateRecipe();
  const { data: allDeliveryLocations } = useDeliveryLocations();
  const { data: allDeliveryTimeSlots } = useDeliveryTimeSlots();
  const [currentOrdersCount, setCurrentOrdersCount] = useState(0);
  const { data: orders } = useGetUserOrders();

  // delivery time slot with the latest cut off time
  const [latestTimeSlot, setLatestTimeSlot] = useState<DeliveryTimeSlot|null>(null);
  
  useEffect(() => {
    if (allDeliveryTimeSlots) {
      const cutOffValues = allDeliveryTimeSlots.map(slot =>
        parse(slot.cut_off, "HH:mm:ss", new Date())
      );
      const latestCutOff = max(cutOffValues);
  
      const newLatestTimeSlot = allDeliveryTimeSlots.find(
        (slot) =>
          parse(slot.cut_off, "HH:mm:ss", new Date()).getTime() === latestCutOff.getTime()
      );
  
      if (newLatestTimeSlot) {
        setLatestTimeSlot(newLatestTimeSlot);
      }
    }
    if (orders) {
      const count = orders.filter(order => 
        ['pending', 'paid', 'preparing', 'ready to deliver', 'delivering', 'delivered', 'picked_up'].includes(order.order_status)
      ).length;
      setCurrentOrdersCount(count);
    }
  }, [allDeliveryTimeSlots, orders]);

  const [deliveryDetails, setDeliveryDetails] = useState({
    deliveryLocation: -1,
    deliveryTime: -1,
    deliveryDate: addDays(new Date(), 1),
  });

  const [deliveryLocationDetails, setDeliveryLocationDetails] = useState({
    id: -1,
    name: "",
    branch: "",
    address_line1: "",
    address_line2: "",
    city: "",
    postal_code: "",
    country: "",
    details: "",
    delivery_fee: "",
    longitude: "",
    latitude: "",
  });

  const fillDeliveryLocationDetails = (id: number) => {
    const data = allDeliveryLocations?.find((location) => location.id === id);
    if (data) {
      setDeliveryLocationDetails({
        id: data.id,
        name: data.name,
        branch: data.branch,
        address_line1: data.address_line1,
        address_line2: data.address_line2,
        city: data.city,
        postal_code: data.postal_code,
        country: data.country,
        details: data.details,
        delivery_fee: data.delivery_fee,
        longitude: data.longitude,
        latitude: data.latitude,
      });
    }
  };

  const [deliveryTimeSlotDetails, setDeliveryTimeSlotDetails] = useState({
    id: -1,
    name: "",
    start_time: "",
    end_time: "",
    cut_off: "",
  });

  const fillDeliveryTimeSlotDetails = (id: number) => {
    const data = allDeliveryTimeSlots?.find((timeslot) => timeslot.id === id);
    if (data) {
      setDeliveryTimeSlotDetails({
        id: id,
        name: data.name,
        start_time: data.start_time,
        end_time: data.end_time,
        cut_off: data.cut_off,
      });
    }
  };

  const handleOrderCreation = async () => {
    const { deliveryLocation, deliveryTime, deliveryDate } = deliveryDetails;
    try {
      const result = await createOrderMutation.mutateAsync({
        delivery_location: deliveryLocation,
        delivery_time: deliveryTime,
        delivery_date: formatDate(deliveryDate),
      });
      return result;
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handleRecipeCreation = (payload: CreateRecipePayload) => {
    createRecipe(payload);
  };

  const { data: units } = useUnitList();
  const getUnitId = (product: ProductData) => {
    const data = units!.find((unit) => unit.name === product.unit_id);
    return data!.id;
  };
  // get unit from unit_id
  const getUnitFromId = (id: number) => {
    const data = units?.find((unit) => unit.id === id);
    return data?.name;
  };

  const { data: meal_types } = useMealTypeList();

  const getMealTypeFromId = (id: number) => {
    const data = meal_types?.find((type) => type.id === id);
    return data?.name;
  };

  // New state for filter
  const [deliveryDateFilter, setDeliveryDateFilter] = useState<string | null>(
    null
  );
  // New state for filters
  const [filters, setFilters] = useState<Filters>({
    deliveryDate: null,
    deliveryBatch: null,
    deliveryLocation: null,
    orderStatus: null,
  });

  // Function to set individual filters
  const setFilter = (
    filterName: keyof Filters,
    value: string | number | null
  ) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  // Function to clear all filters
  const clearFilters = () => {
    setFilters({
      deliveryDate: null,
      deliveryBatch: null,
      deliveryLocation: null,
      orderStatus: null,
    });
  };

  // categories and preparation types
  const { data: categories } = useCategoriesList();

  const updateDeliveryLocation = (locationId: number) => {
    setDeliveryDetails((prev) => ({
      ...prev,
      deliveryLocation: locationId,
    }));
    fillDeliveryLocationDetails(locationId);
  };

  return (
    <OrderContext.Provider
      value={{
        handleOrderCreation,
        handleRecipeCreation,
        deliveryDetails,
        setDeliveryDetails,
        deliveryLocationDetails,
        setDeliveryLocationDetails,
        fillDeliveryLocationDetails,
        allDeliveryLocations,
        allDeliveryTimeSlots,
        latestTimeSlot,
        deliveryTimeSlotDetails,
        setDeliveryTimeSlotDetails,
        fillDeliveryTimeSlotDetails,
        units,
        getUnitId,
        getUnitFromId,
        meal_types,
        getMealTypeFromId,
        deliveryDateFilter,
        setDeliveryDateFilter,
        filters,
        setFilter,
        clearFilters,
        updateDeliveryLocation,
        currentOrdersCount
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
