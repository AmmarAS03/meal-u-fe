import React, { useEffect, useState } from "react";
import { IonContent, IonHeader, IonPage, useIonRouter } from "@ionic/react";
import { useAuth } from "../../contexts/authContext";
import Sidebar from "../../components/SideBar";

const Warehouse: React.FC = () => {
  const router = useIonRouter();

  return (
    <IonPage>
     <IonContent>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-32 p-8 overflow-y-auto">
            <h1 className="text-2xl font-bold mb-4">Warehouse Dashboard</h1>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Warehouse;
