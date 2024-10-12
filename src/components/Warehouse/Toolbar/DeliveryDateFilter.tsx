import React, { useState } from 'react';
import { useOrder } from '../../../contexts/orderContext'

const DeliveryDateFilter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { deliveryDateFilter, setDeliveryDateFilter } = useOrder();

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleFilterChange = (date: string | null) => {
    setDeliveryDateFilter(date);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          {deliveryDateFilter || 'Filter by Delivery Date'}
          <svg
            className="-mr-1 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            data-slot="icon"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            <button onClick={() => handleFilterChange('Today')} className="block w-full text-left px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1}>Today</button>
            <button onClick={() => handleFilterChange('Tomorrow')} className="block w-full text-left px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1}>Tomorrow</button>
            <button onClick={() => handleFilterChange(null)} className="block w-full text-left px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1}>Clear Filter</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryDateFilter;