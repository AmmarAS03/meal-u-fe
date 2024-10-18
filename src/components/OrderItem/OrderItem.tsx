import React from 'react';
import { useHistory } from 'react-router-dom';
import BagIcon from '../../../public/icon/bag-icon';

interface OrderItemProps {
  id: number;
  status: string;
  title: string;
  date: string;
  isCurrent: boolean;
}

const OrderItem: React.FC<OrderItemProps> = ({ id, status, title, date, isCurrent }) => {
  const history = useHistory();
  
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleClick = () => {
    if (status === 'pending') {
      history.push(`/payment-options/${id}`);
    } else {
      history.push(`/order-status/${id}`);
    }
  };

  return (
    <div 
      className={`flex items-center bg-white rounded-xl p-3 mb-3 shadow-sm cursor-pointer hover:bg-gray-50`}
      onClick={handleClick}
    >
      <div className="w-12 h-12 bg-gray-100 rounded-lg mr-3 flex items-center justify-center">
        <BagIcon />
      </div>
      <div className="flex-grow overflow-hidden">
        <p className="text-gray-500 text-sm">{capitalizeFirstLetter(status)}</p>
        <p className={`${isCurrent ? 'font-semibold' : 'font-normal'} text-navy-700 truncate`}>{title}</p>
      </div>
      <div className="text-right ml-2">
        <p className={`${isCurrent ? 'font-semibold' : 'font-normal'} text-sm text-gray-500`}>{date}</p>
        {isCurrent && <div className="w-2 h-2 bg-purple-500 rounded-full ml-auto mt-1"></div>}
      </div>
    </div>
  );
};

export default OrderItem;