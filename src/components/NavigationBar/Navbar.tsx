import React from "react";
import { Link, useLocation } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { home, list, person } from "ionicons/icons";

import RepeatIcon from "../../../public/icon/repeat-icon";
import OrderIcon from "../../../public/icon/order-icon";
import ReceiptIcon from "../../../public/icon/receipt-icon";
import StoreIcon from "../../../public/icon/store-icon";
import UserIcon from "../../../public/icon/user-icon";
import ScheduleIcon from "../../../public/icon/schedule-icon";
import { useAuth } from "../../contexts/authContext";
import WarehouseDesktopNavbar from "../Warehouse/DesktopNavbar/WarehouseDesktopNavbar";

const Navbar: React.FC = () => {
  const { role } = useAuth();
  const location = useLocation();
  const isMobile = window.innerWidth < 768;

  if (role === "warehouse" && !isMobile) {
    return <WarehouseDesktopNavbar />;
  }

  const courierNavItems = [
    { to: "/courier/home", icon: RepeatIcon, label: "Home" },
    { to: "/courier/deliveries", icon: ScheduleIcon, label: "Orders" },
    { to: "/courier/profile", icon: UserIcon, label: "Profile" },
  ];

  const customerNavItems = [
    { to: "/home", icon: RepeatIcon, label: "Repeat" },
    { to: "/community", icon: StoreIcon, label: "Store" },
    { to: "/categories", icon: OrderIcon, label: "Order" },
    { to: "/tab4", icon: ReceiptIcon, label: "Receipt" },
    { to: "/user", icon: UserIcon, label: "Profile" },
  ];

  const navItems = role === "courier" ? courierNavItems : customerNavItems;

  return (
    <nav
      className={`absolute bottom-4 left-4 right-4 bg-white rounded-[48px] shadow-[0px_10px_30px_rgba(0,0,0,0.2)] p-4 flex justify-around`}
    >
      {navItems.map((item, index) => (
        <Link key={index} to={item.to} className="flex flex-col items-center">
          {role === "courier" ? (
            <item.icon
              selected={location.pathname.startsWith(item.to)}
              selectedColor="#7862FC"
            />
          ) : (
            <item.icon
              selected={location.pathname === item.to}
              selectedColor="#7862FC"
            />
          )}
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
