import React, { createContext, useContext, useMemo, useState } from 'react';
import { useAllOrders, Order } from '../api/courierApi';
import { parseISO, format, isAfter } from 'date-fns';

interface BatchData {
  date: string;
  time: string;
  orders: Order[];
  isDelivery?: boolean;
}

interface CourierContextType {
  currentBatch: BatchData | null;
  getNextBatch: () => void;
  getCurrentBatchOrders: () => Order[];
  setCurrentBatch: React.Dispatch<React.SetStateAction<BatchData | null>>;
  updateOrderStatus: (orderId: number, status: string) => void;
}

const CourierContext = createContext<CourierContextType | undefined>(undefined);

export const useCourier = () => {
  const context = useContext(CourierContext);
  if (!context) {
    throw new Error('useCourier must be used within a CourierProvider');
  }
  return context;
};

export const CourierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: ordersData } = useAllOrders();
  const [currentBatch, setCurrentBatch] = useState<BatchData | null>(null);

  const getNextBatch = () => {
    if (!ordersData) return;

    if (!currentBatch) {
      let earliestBatch: BatchData | null = null;
      let earliestDateTime: Date | null = null;

      Object.entries(ordersData).forEach(([date, timeSlots]) => {
        Object.entries(timeSlots).forEach(([time, orders]) => {
          const dateTime = parseISO(`${date}T${time}`);
          if (!earliestDateTime || isAfter(earliestDateTime, dateTime)) {
            earliestDateTime = dateTime;
            earliestBatch = { date, time, orders };
          }
        });
      });

      setCurrentBatch(earliestBatch);
      return;
    }

    let foundCurrent = false;
    let nextBatch: BatchData | null = null;

    Object.entries(ordersData).forEach(([date, timeSlots]) => {
      Object.entries(timeSlots).forEach(([time, orders]) => {
        if (foundCurrent && !nextBatch) {
          nextBatch = { date, time, orders };
        }
        if (date === currentBatch.date && time === currentBatch.time) {
          foundCurrent = true;
        }
      });
      if (foundCurrent && !nextBatch && date > currentBatch.date) {
        const firstTimeSlot = Object.entries(timeSlots)[0];
        if (firstTimeSlot) {
          nextBatch = { 
            date, 
            time: firstTimeSlot[0], 
            orders: firstTimeSlot[1] 
          };
        }
      }
    });

    setCurrentBatch(nextBatch);
  };

  const getCurrentBatchOrders = () => {
    if (!currentBatch || !ordersData) return [];
    return ordersData[currentBatch.date]?.[currentBatch.time] || [];
  };

  const updateOrderStatus = (orderId: number, status: string) => {
    if (!currentBatch) return;

    setCurrentBatch(prev => {
      if (!prev) return null;
      return {
        ...prev,
        orders: prev.orders.map(order => 
          order.id === orderId ? { ...order, order_status: status } : order
        )
      };
    });
  };

  return (
    <CourierContext.Provider value={{
      currentBatch,
      getNextBatch,
      getCurrentBatchOrders,
      setCurrentBatch,
      updateOrderStatus
    }}>
      {children}
    </CourierContext.Provider>
  );
};