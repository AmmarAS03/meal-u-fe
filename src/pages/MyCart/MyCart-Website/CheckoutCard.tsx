import { useState } from "react";
import { useDeliveryLocations } from "../../../api/deliveryApi";
import { useOrder } from "../../../contexts/orderContext";

const CheckoutCard: React.FC = () => {
  const {
    fillDeliveryLocationDetails,
    deliveryDetails,
    setDeliveryDetails,
    deliveryLocationDetails,
  } = useOrder();
  const { data: deliveryData } = useDeliveryLocations();
  const [isDeliveryDetailsSet, setIsDeliveryDetailsSet] = useState(
    deliveryDetails.deliveryLocation == -1 ? false : true
  );
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  return (
    <div className="w-[361px] h-[99px] left-0 top-[39.94px] absolute">
      <div className="w-[361px] h-[99px] left-0 top-0 absolute bg-white rounded-2xl shadow" />
      <form className="w-full">
        <label 
          htmlFor="location" 
          className="block mb-2 text-[#0a2533] text-base font-bold font-['DM Sans']"
        >
          Select Location
        </label>
        <div className="flex items-center gap-4">
          <select 
            id="location" 
            className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#7862fc] focus:border-[#7862fc] block w-full p-2.5"
            defaultValue=""
          >
            <option value="" disabled>Choose a location</option>
            {deliveryData?.map((data: any) => (
              <option value={data.id}>{data.name} - {data.branch}</option>
            ))}
          </select>
        </div>
      </form>
    </div>
  )
}

export default CheckoutCard;