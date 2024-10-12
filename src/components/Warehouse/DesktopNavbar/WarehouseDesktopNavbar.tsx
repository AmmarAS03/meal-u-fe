import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { notificationsOutline } from 'ionicons/icons';
import DashboardIcon from '../../../../public/icon/dashboard-icon';
import OrdersIcon from '../../../../public/icon/orders-icon';

const WarehouseDesktopNavbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { to: "/warehouse/dashboard", icon: DashboardIcon, label: "Dashboard" },
    { to: "/warehouse/orders", icon: OrdersIcon, label: "Orders" },
  ];

  return (
    <nav className="flex flex-col h-screen w-20 bg-[#7862FC] fixed left-0 top-0 group hover:w-64 transition-all duration-300 ease-in-out">
      <div className="flex-1">
        <div className="p-4 mb-8 text-white text-2xl font-bold">
          <span className="hidden group-hover:inline">Meal.U</span>
          <span className="group-hover:hidden">M.U</span>
        </div>
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className={`flex items-center py-4 px-6 ${
              location.pathname === item.to ? 'bg-white bg-opacity-20' : ''
            } hover:bg-white hover:bg-opacity-10 transition-all duration-200`}
          >
            <item.icon />
            <span className="ml-4 text-white hidden group-hover:inline">{item.label}</span>
          </Link>
        ))}
      </div>
      <div className="p-4">
        <div className="flex items-center">
          <img src="/img/no-photo.png" alt="Profile" className="w-10 h-10 rounded-full" />
          <div className="ml-3 hidden group-hover:block">
            <p className="text-white font-semibold">Alex Turner</p>
            <p className="text-white text-sm opacity-70">Employee ID: W9ACB</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default WarehouseDesktopNavbar;