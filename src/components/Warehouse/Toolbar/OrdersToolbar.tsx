import DeliveryBatchFilter from "./DeliveryBatchFilter";
import DeliveryDateFilter from "./DeliveryDateFilter";
import DeliveryLocationFilter from "./DeliveryLocationFilter";
import StatusFilter from "./StatusFilter";

const OrdersToolbar: React.FC = () => {
  return (
    <div className="flex flex-row">
      <DeliveryDateFilter />
      <DeliveryBatchFilter />
      <DeliveryLocationFilter />
      <StatusFilter />
    </div>
  )
}

export default OrdersToolbar;