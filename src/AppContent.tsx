// AppContent.tsx
import { Redirect, Route, useLocation } from "react-router-dom";
import {
  IonContent,
  IonHeader,
  IonRouterOutlet,
} from "@ionic/react";
import Tab1 from "./pages/Tab-1/Tab1";
import Tab2 from "./pages/Tab-2/Tab2";
import Tab4 from "./pages/Tab-4/Tab4";
import Tab5 from "./pages/Tab-5/Tab5";
import MyCart from "./pages/MyCart";
import { useState } from "react";
import SubPage from "./pages/Tab-1/Sub-Page-1/sub-page-1";
import RecipeDetails from "./pages/RecipeDetails/RecipeDetails";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Navbar from "./components/NavigationBar/Navbar";
import PaymentOptions from "./pages/PaymentOptions/PaymentOptions";
import Order from "./pages/Order";
import Login from "./pages/Login/login";
import Category from "./pages/Category";
import { useAuth } from "./contexts/authContext";
import MealkitDetails from "./pages/MealkitDetails/MealkitDetails";
import CourierHome from "./pages/Courier/CourierHome/CourierHome";
import CourierDelivery from "./pages/Courier/CourierDelivery/CourierDelivery";
import ConfirmPickup from "./pages/Courier/ConfirmPickUp/ConfirmPickUp";
import ConfirmDelivery from "./pages/Courier/ConfirmDelivery/ConfirmDelivery";
import CourierDeliveries from "./pages/Courier/CourierDeliveries/CourierDeliveries";
import DeliveryBatchDetails from "./pages/Courier/DeliveryBatchDetails/DeliveryBatchDetails";
import Dashboard from "./pages/Warehouse/Dashboard/Dashboard";
import OrderDetail from "./pages/Warehouse/OrderDetail/OrderDetail";

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const shouldShowTabs = () => {
    const noTabRoutes = ['/categories', '/mycart', '/login'];
    const noTabPrefixes = ['/order/', '/product-details/', '/recipe-details/', '/mealkit-details/', '/courier/delivery/', '/courier/pickup/', '/courier/confirm-pickup/', '/courier/confirm-delivery/'];

    if (noTabRoutes.includes(location.pathname)) {
      return false;
    }

    for (const prefix of noTabPrefixes) {
      if (location.pathname.startsWith(prefix)) {
        return false;
      }
    }

    return true;
  };

  return (
    <>
      {isAuthenticated && (
        <IonHeader className="ion-hide-sm-down">
          <Navbar />
        </IonHeader>
      )}
      <IonContent>
        {isAuthenticated ? (
          <>
            <IonRouterOutlet>
              <Route exact path="/tab1" component={Tab1} />
              <Route exact path="/tab1/subpage" component={SubPage} />
              <Route exact path="/order/:category" component={Order} />
              <Route exact path="/categories" component={Category} />
              <Route exact path="/tab2" component={Tab2} />
              <Route path="/tab4" component={Tab4} />
              <Route path="/tab5" component={Tab5} />
              <Route path="/mycart" component={MyCart} />
              <Route path="/mealkit-details/:id" component={MealkitDetails} />
              <Route path="/recipe-details/:id" component={RecipeDetails} />
              <Route path="/product-details/:id" component={ProductDetails} />
              <Route path="/payment-options" component={PaymentOptions} />
              <Route path="/courier/home" component={CourierHome} />
              <Route path="/courier/:type/:id" component={CourierDelivery} />
              <Route path="/courier/confirm-pickup/:type/:id" component={ConfirmPickup} />
              <Route path="/courier/confirm-delivery/:id" component={ConfirmDelivery} />
              <Route path="/courier/deliveries" component={CourierDeliveries} />
              <Route path="/courier/delivery-batch/:batchNumber" component={DeliveryBatchDetails} />
              <Route path="/warehouse/dashboard" component={Dashboard} />
              <Route path="/warehouse/order/:id" component={OrderDetail} />
              <Route exact path="/">
                <Redirect to="/tab1" />
              </Route>
            </IonRouterOutlet>
            {shouldShowTabs() && <Navbar />}
          </>
        ) : (
          <IonRouterOutlet>
            <Route path="/login" component={Login} />
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
          </IonRouterOutlet>
        )}
      </IonContent>
    </>
  );
};

export default AppContent;
