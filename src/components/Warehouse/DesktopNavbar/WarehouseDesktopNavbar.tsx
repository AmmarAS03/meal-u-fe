import React from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { notificationsOutline, logOutOutline } from 'ionicons/icons';
import DashboardIcon from '../../../../public/icon/dashboard-icon';
import OrdersIcon from '../../../../public/icon/orders-icon';
import { useAuth } from '../../../contexts/authContext';

const WarehouseDesktopNavbar: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const { user, logout } = useAuth();

  const navItems = [
    { to: "/warehouse/dashboard", icon: DashboardIcon, label: "Dashboard" },
    { to: "/warehouse/orders", icon: OrdersIcon, label: "Orders" },
  ];

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

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
        <div className="flex items-center mb-4">
          <img src={user?.profile_picture} alt="Profile" className="w-10 h-10 rounded-full" />
          <div className="ml-3 hidden group-hover:block">
            <p className="text-white font-semibold">{user?.first_name} {user?.last_name}</p>
            <p className="text-white text-sm opacity-70">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center py-2 px-4 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg transition-all duration-200"
        >
          <IonIcon icon={logOutOutline} className="mr-2" />
          <span className="hidden group-hover:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default WarehouseDesktopNavbar;