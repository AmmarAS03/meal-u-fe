import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import StatCard from '../../../components/Warehouse/StatCard/StatCard';
import TodaysOrders from '../../../components/Warehouse/TodaysOrders/TodaysOrders';
import UpcomingOrders from '../../../components/Warehouse/UpcomingOrders/UpcomingOrders';

const Dashboard: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="font-sans">
        <div className="pl-24 pr-6 py-6 bg-gray-100 min-h-screen overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Warehouse Dashboard</h1>
            <TodaysOrders />
            <UpcomingOrders />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;