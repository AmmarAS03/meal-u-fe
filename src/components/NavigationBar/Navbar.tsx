import React from 'react';
import { Link } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { home, list, person } from 'ionicons/icons';

// Import custom icons
import RepeatIcon from '../../../public/icon/repeat-icon';
import OrderIcon from '../../../public/icon/order-icon';
import ReceiptIcon from '../../../public/icon/receipt-icon';
import StoreIcon from '../../../public/icon/store-icon';
import UserIcon from '../../../public/icon/user-icon';
import ScheduleIcon from '../../../public/icon/schedule-icon';
import { useAuth } from '../../contexts/authContext';

const Navbar: React.FC = () => {
  const { role } = useAuth();

  const courierNavItems = [
    { to: "/courier/home", icon: RepeatIcon, label: "Home" },
    { to: "/courier/deliveries", icon: ScheduleIcon, label: "Orders" },
    { to: "/courier/profile", icon: UserIcon, label: "Profile" }
  ];

  const customerNavItems = [
    { to: "/home", icon: RepeatIcon, label: "Repeat" },
    { to: "/community", icon: StoreIcon, label: "Store" },
    { to: "/categories", icon: OrderIcon, label: "Order" },
    { to: "/tab4", icon: ReceiptIcon, label: "Receipt" },
    { to: "/mycart", icon: UserIcon, label: "Profile" }
  ];

  const navItems = role === 'courier' ? courierNavItems : customerNavItems;

  return (
    <nav className={`absolute bottom-4 left-4 right-4 bg-white rounded-[48px] shadow-[0px_10px_30px_rgba(0,0,0,0.2)] p-4 flex justify-around`}>
      {navItems.map((item, index) => (
        <Link key={index} to={item.to} className="flex flex-col items-center">
          {role === 'courier' ? (
            <item.icon />
          ) : (
            <item.icon />
          )}
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;