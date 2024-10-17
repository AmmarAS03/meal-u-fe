import React, { useState } from 'react';
import { Calendar } from "lucide-react";
import { DeliveryTimeSlot, useDeliveryLocations, useDeliveryTimeSlots } from '../../../api/deliveryApi';

const CheckoutDetailsWeb: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [cartSubtotal] = useState(0);
  const [deliveryFee] = useState(-1);
  const [total] = useState(-1);

  const { data: deliveryData } = useDeliveryLocations();
  const { data: deliveryTimeSlot = [] } = useDeliveryTimeSlots();

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(parseInt(e.target.value));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(e.target.value);
  };

  const handleSubmit = () => {
    if (!selectedLocation || !selectedDate || !selectedTime) {
      alert('Please fill in all delivery details');
      return;
    }
    console.log({
      location: selectedLocation,
      date: selectedDate,
      time: selectedTime,
      total
    });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Location Picker */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery to</h3>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7862fc] focus:border-transparent bg-white text-gray-900"
          onChange={handleLocationChange}
          value={selectedLocation!}
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
            min={new Date().toISOString().split('T')[0]}
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
          value={selectedTime}
        >
          <option value="">Select time</option>
          {deliveryTimeSlot.map((time: DeliveryTimeSlot) => (
            <option key={time.id} value={time.id}>{time.name}: {time.start_time} - {time.end_time}</option>
          ))}
        </select>
      </div>

      {/* Payment Summary */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Payment Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>${cartSubtotal.toFixed(2)}</span>
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