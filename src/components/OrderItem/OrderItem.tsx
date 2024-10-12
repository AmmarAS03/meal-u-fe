import React from 'react';
import BagIcon from '../../../public/icon/bag-icon';

interface OrderItemProps {
  status: string;
  title: string;
  date: string;
  isCurrent: boolean;
}

const OrderItem: React.FC<OrderItemProps> = ({ status, title, date, isCurrent }) => {
  return (
    <div className="flex items-center bg-white rounded-xl p-3 mb-3 shadow-sm">
      <div className="w-12 h-12 bg-gray-100 rounded-lg mr-3 flex items-center justify-center">
        <BagIcon />
      </div>
      <div className="flex-grow">
        <p className="text-gray-500 text-sm">{status}</p>
        <p className={`${isCurrent ? 'font-semibold' : 'font-normal'} text-navy-700 truncate`}>{title}</p>
      </div>
      <div className="text-right">
        <p className={`${isCurrent ? 'font-semibold' : 'font-normal'} text-sm text-gray-500`}>{date}</p>
        {isCurrent && <div className="w-2 h-2 bg-purple-500 rounded-full ml-auto mt-1"></div>}
      </div>
    </div>
  );
};

export default OrderItem;