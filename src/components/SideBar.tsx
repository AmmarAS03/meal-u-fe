import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import DashboardWareIcon from "../../public/icon/dashboard-w-icon";
import FourDotIcon from "../../public/icon/ware-four-icon";
import WareOneIcon from "../../public/icon/ware-1-icon";
import WareTwoIcon from "../../public/icon/ware-two-icon";
import WareThreeIcon from "../../public/icon/ware-three-icon";

const Sidebar = () => (
  <div className="fixed left-0 top-0 bottom-0 w-20 bg-purple-600 text-white p-4 overflow-y-auto">
    <div className="mb-8">
      <div className="w-10 h-10 rounded-lg mb-4">
        <img
          src="/img/meal-warehouse.png"
          alt="Uncle Roger"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </div>
    <nav>
      <ul className="space-y-2">
        <li className="p-2 rounded">
          <div className="w-8 h-8 rounded-lg mb-4 hover:bg-purple-700 hover:cursor-pointer">
            <WareTwoIcon />
          </div>
        </li>
        <li className="p-2 rounded">
          <div className="w-8 h-8 rounded-lg mb-4 hover:bg-purple-700 hover:cursor-pointer">
            <WareThreeIcon />
          </div>
        </li>
        <li className="p-2 rounded">
          {" "}
          <div className="w-8 h-8 rounded-lg mb-4 hover:bg-purple-700 hover:cursor-pointer">
            <DashboardWareIcon />
          </div>
        </li>
        <li className="p-2 rounded">
          {" "}
          <div className="w-8 h-8 rounded-lg mb-4 hover:bg-purple-700 hover:cursor-pointer">
            <WareOneIcon />
          </div>
        </li>
        <li className="p-2 rounded">
          {" "}
          <div className="w-8 h-8 rounded-lg mb-4 hover:bg-purple-700 hover:cursor-pointer">
            <FourDotIcon />
          </div>
        </li>
      </ul>
    </nav>
  </div>
);

export default Sidebar;
