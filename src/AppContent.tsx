// AppContent.tsx
import { Redirect, Route, useLocation } from "react-router-dom";
import {
  IonContent,
  IonHeader,
  IonRouterOutlet,
} from "@ionic/react";
import Tab1 from "./pages/Tab-1/Tab1";
import Tab2 from "./pages/Community";
import Tab4 from "./pages/Orders/Orders";
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
import Community from "./pages/Community";
import Home from "./pages/Home";
import { useAuth } from "./contexts/authContext";
import MealkitDetails from "./pages/MealkitDetails/MealkitDetails";
import CreateRecipe from "./pages/Community/Create/Recipe";
import CreateMealkit from "./pages/Community/Create/Mealkit";
import CourierHome from "./pages/Courier/CourierHome/CourierHome";
import CourierDelivery from "./pages/Courier/CourierDelivery/CourierDelivery";
import ConfirmPickup from "./pages/Courier/ConfirmPickUp/ConfirmPickUp";
import ConfirmDelivery from "./pages/Courier/ConfirmDelivery/ConfirmDelivery";
import Orders from "./pages/Orders/Orders";
import QRReader from "./pages/QR-Reader/QR-Reader";
import User from "./pages/User";
import EditProfile from "./pages/EditProfile/EditProfile";
import CourierDeliveries from "./pages/Courier/CourierDeliveries/CourierDeliveries";
import DeliveryBatchDetails from "./pages/Courier/DeliveryBatchDetails/DeliveryBatchDetails";
import Dashboard from "./pages/Warehouse/Dashboard/Dashboard";
import OrderDetail from "./pages/Warehouse/OrderDetail/OrderDetail";
import AllOrders from "./pages/Warehouse/Orders";
import DeliveryStatus from "./pages/DeliveryStatus/DeliveryStatus";

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const shouldShowTabs = () => {
    const noTabRoutes = ['/categories', '/mycart', '/login', '/qr-reader' ];
    const noTabPrefixes = ['/order/', '/product-details/', '/recipe-details/', '/payment-options/', '/mealkit-details/', '/courier/delivery/', '/courier/pickup/', '/courier/confirm-pickup/', '/courier/confirm-delivery/', '/community/create/', '/order-status/'];

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
              <Route exact path="/tab1/subpage" component={SubPage} />
              <Route exact path="/order/:category" component={Order} />
              <Route exact path="/categories" component={Category} />
              <Route path="/community" component={Community} />
              <Route exact path="/home" component={Home} />
              <Route exact path="/community" component={Tab2} />
              <Route path="/community/create/recipe" component={CreateRecipe} />
              <Route path="/community/create/mealkit" component={CreateMealkit} />
              <Route path="/tab4" component={Orders} />
              <Route path="/user" component={User} />
              <Route path="/edit-profile" component={EditProfile} />
              <Route path="/mycart" component={MyCart} />
              <Route path="/mealkit-details/:id" component={MealkitDetails} />
              <Route path="/recipe-details/:id" component={RecipeDetails} />
              <Route path="/product-details/:id" component={ProductDetails} />
              <Route path="/payment-options/:id" component={PaymentOptions} />
              <Route path="/courier/home" component={CourierHome} />
              <Route path="/courier/:type/:id" component={CourierDelivery} />
              <Route path="/courier/confirm-pickup/:type/:id" component={ConfirmPickup} />
              <Route path="/courier/confirm-delivery/:id" component={ConfirmDelivery} />
              <Route path="/order-status/:id" component={DeliveryStatus} />
              <Route path="/qr-reader" component={QRReader} />
              <Route path="/courier/deliveries" component={CourierDeliveries} />
              <Route path="/courier/delivery-batch/:batchNumber" component={DeliveryBatchDetails} />
              <Route path="/warehouse/dashboard" component={Dashboard} />
              <Route path="/warehouse/order/:id" component={OrderDetail} />
              <Route path="/warehouse/orders" component={AllOrders} />
              <Route exact path="/">
                <Redirect to="/home" />
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
