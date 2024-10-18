import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Calendar } from "lucide-react";
import { addDays, format, isPast, parse, isFuture } from 'date-fns';
import { useOrder } from '../../../contexts/orderContext';
import { useDeliveryLocations, useDeliveryTimeSlots } from '../../../api/deliveryApi';
import { useHistory } from 'react-router';

interface CheckoutDetailsWebProps {
  subTotal: number;
  setSubTotal: Dispatch<SetStateAction<number>>;
}

const CheckoutDetailsWeb: React.FC<CheckoutDetailsWebProps> = ({subTotal, setSubTotal}) => {
  const { 
    fillDeliveryLocationDetails, 
    deliveryDetails, 
    setDeliveryDetails, 
    latestTimeSlot,
    handleOrderCreation,
    deliveryLocationDetails
  } = useOrder();

  const history = useHistory();
  const today = new Date()
  const tomorrow = addDays(today, 1);

  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [minDate, setMinDate] = useState(tomorrow);

  const { data: deliveryData } = useDeliveryLocations();
  const { data: deliveryTimeSlot = [] } = useDeliveryTimeSlots();

  // calculate total based on subtotal and delivery fee
  const total = subTotal + deliveryFee;

  // calculate minimum date based on latest time slot
  useEffect(() => {
    let calculatedMinDate = tomorrow;

    if (latestTimeSlot) {
      const latestCutOffToday = parse(latestTimeSlot.cut_off, "HH:mm:ss", today);
      const isCurrentTimePast = isPast(latestCutOffToday);
      if (!isCurrentTimePast) {
        calculatedMinDate = today;
      }
    }

    setMinDate(calculatedMinDate);
  }, [latestTimeSlot]);

  // filter time slots based on selected date
  const filteredTimeSlots = deliveryTimeSlot.filter((item) => {
    if (!selectedDate) return false;
    return isFuture(parse(item.cut_off, "HH:mm:ss", new Date(selectedDate)));
  });

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locationId = parseInt(e.target.value);
    setSelectedLocation(locationId);
    fillDeliveryLocationDetails(locationId);
    setDeliveryDetails(prev => ({
      ...prev,
      deliveryLocation: locationId
    }));
  };

  // set delivery fee when location is set
  useEffect(() => {
    if (deliveryLocationDetails.id !== -1) {
      setDeliveryFee(parseInt(deliveryLocationDetails.delivery_fee));
    }
  }, [deliveryLocationDetails.id, deliveryLocationDetails.delivery_fee]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedTime(null); // reset time when date changes
    setDeliveryDetails(prev => ({
      ...prev,
      deliveryDate: new Date(date)
    }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const timeId = parseInt(e.target.value);
    setSelectedTime(timeId);
    setDeliveryDetails(prev => ({
      ...prev,
      deliveryTime: timeId
    }));
  };

  const handleSubmit = async () => {
    if (!selectedLocation || !selectedDate || !selectedTime) {
      alert('Please fill in all delivery details');
      return;
    }

    try {
      const data = await handleOrderCreation();
      if (data?.data.order_id) {
        history.replace(`/payment-options/${data.data.order_id}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to process order. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Location Picker */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery to</h3>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7862fc] focus:border-transparent bg-white text-gray-900"
          onChange={handleLocationChange}
          value={selectedLocation || ''}
        >
          <option value="">Select location</option>
          {deliveryData?.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name} - {location.branch}
            </option>
          ))}
        </select>
      </div>

      {/* Date Picker */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Set Date</h3>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <input
            type="date"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7862fc] focus:border-transparent bg-white text-gray-900"
            min={format(minDate, "yyyy-MM-dd")}
            onChange={handleDateChange}
            value={selectedDate}
          />
        </div>
      </div>

      {/* Time Picker */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Set Time</h3>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7862fc] focus:border-transparent bg-white text-gray-900"
          onChange={handleTimeChange}
          value={selectedTime || ''}
        >
          <option value="">Select time</option>
          {filteredTimeSlots.length > 0 ? (
            filteredTimeSlots.map((time) => (
              <option key={time.id} value={time.id}>
                {time.name}: {time.start_time} - {time.end_time}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No timeslot available for the selected delivery date
            </option>
          )}
        </select>
      </div>

      {/* Payment Summary */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Payment Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>${subTotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="pt-2 border-t mt-2">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-[#7862fc] text-white rounded-lg py-3 font-medium hover:bg-[#6852ec] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!selectedLocation || !selectedDate || !selectedTime}
      >
        Process to Payment
      </button>
    </div>
  );
};

export default CheckoutDetailsWeb;