import React, { createContext, useContext, useState } from 'react';
import { DeliveryLocation, DeliveryTimeSlot, useCreateOrder, useDeliveryLocations, useDeliveryTimeSlots } from "../api/deliveryApi";
import { useCreateRecipe, CreateRecipePayload } from '../api/recipeApi';
import { formatDate } from '../pages/MyCart/MyCart-Mobile';
import { UnitData, useUnitList, ProductData, MealType, useMealTypeList } from '../api/productApi';

interface Filters {
  deliveryDate: string | null;
  deliveryBatch: string | null;
  deliveryLocation: number | null;
  orderStatus: string | null;
}

// Define the shape of the order context
interface OrderContextProps {
  handleOrderCreation: () => void;
  handleRecipeCreation: (payload: CreateRecipePayload) => void;
  deliveryDetails: {
    deliveryLocation: number;
    deliveryTime: number;
    deliveryDate: Date;
  };
  setDeliveryDetails: React.Dispatch<React.SetStateAction<{ // TODO: ganti implementation-nya jadi pas checkout aja
    deliveryLocation: number;
    deliveryTime: number;
    deliveryDate: Date;
  }>>;
  allDeliveryLocations: DeliveryLocation[] | undefined;
  deliveryLocationDetails: DeliveryLocation;
  setDeliveryLocationDetails: React.Dispatch<React.SetStateAction<DeliveryLocation>>;
  fillDeliveryLocationDetails: (id: number) => void;
  allDeliveryTimeSlots: DeliveryTimeSlot[] | undefined;
  deliveryTimeSlotDetails: DeliveryTimeSlot;
  setDeliveryTimeSlotDetails: React.Dispatch<React.SetStateAction<DeliveryTimeSlot>>;
  fillDeliveryTimeSlotDetails: (id: number) => void;
  units: UnitData[] | undefined;
  getUnitId: (product: ProductData) => number;
  meal_types: MealType[] | undefined;
  getMealTypeFromId: (id: number) => string | undefined;
  deliveryDateFilter: string | null;
  setDeliveryDateFilter: (date: string | null) => void;
  filters: Filters;
  setFilter: (filterName: keyof Filters, value: string | number | null) => void;
  clearFilters: () => void;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mutate: createOrder } = useCreateOrder();
  const { mutate: createRecipe} = useCreateRecipe();
  const { data: allDeliveryLocations } = useDeliveryLocations();
  const { data: allDeliveryTimeSlots } = useDeliveryTimeSlots();

  const [deliveryDetails, setDeliveryDetails] = useState({
    deliveryLocation: -1,
    deliveryTime: -1,
    deliveryDate: new Date(),
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
  })

  const fillDeliveryLocationDetails = (id: number) => {
    const data = allDeliveryLocations?.find(location => location.id === id);
    if (data) {
      setDeliveryLocationDetails({
        id: id,
        name: data.name,
        branch: data.branch,
        address_line1: data.address_line1,
        address_line2: data.address_line2,
        city: data.city,
        postal_code: data.postal_code,
        country: data.country,
        details: data.details,
      });
    }
  }

  const [deliveryTimeSlotDetails, setDeliveryTimeSlotDetails] = useState({
    id: -1,
    name: "",
    start_time: "",
    end_time: "",
    cut_off: "",
  });

  const fillDeliveryTimeSlotDetails = (id: number) => {
    const data = allDeliveryTimeSlots?.find(timeslot => timeslot.id === id);
    if (data) {
      setDeliveryTimeSlotDetails({
        id: id,
        name: data.name,
        start_time: data.start_time,
        end_time: data.end_time,
        cut_off: data.cut_off,
      });
    }
  }


  const handleOrderCreation = () => {
    const { deliveryLocation, deliveryTime, deliveryDate } = deliveryDetails;
    createOrder({
        delivery_location: deliveryLocation,
        delivery_time: deliveryTime,
        delivery_date: formatDate(deliveryDate), 
      });
  };

  const handleRecipeCreation = (payload: CreateRecipePayload) => {
    createRecipe(payload);
  }

  const { data: units } = useUnitList();
  const getUnitId = (product: ProductData) => {
  const data = units!.find(unit => unit.name === product.unit_id);
    return data!.id;
  }

  const { data: meal_types } = useMealTypeList();

  const getMealTypeFromId =  (id: number) => {
    const data = meal_types?.find(type => type.id === id);
    return data?.name;
  }

  // New state for filter
  const [deliveryDateFilter, setDeliveryDateFilter] = useState<string | null>(null);
  // New state for filters
  const [filters, setFilters] = useState<Filters>({
    deliveryDate: null,
    deliveryBatch: null,
    deliveryLocation: null,
    orderStatus: null,
  });

  // Function to set individual filters
  const setFilter = (filterName: keyof Filters, value: string | number | null) => {
    setFilters(prevFilters => ({
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
        deliveryTimeSlotDetails,
        setDeliveryTimeSlotDetails,
        fillDeliveryTimeSlotDetails,
        units,
        getUnitId,
        meal_types,
        getMealTypeFromId,
        deliveryDateFilter,
        setDeliveryDateFilter,
        filters,
        setFilter,
        clearFilters,
      }
    }>
      {children}
    </OrderContext.Provider>
  );
};