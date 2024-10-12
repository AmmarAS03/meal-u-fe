import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
} from "@ionic/react";

function UserMobile() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="ion-hide-sm-up">
          <IonTitle>My Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding font-sans">
        <div className="flex justify-center">
          <p>@Joel Mulai Disini</p>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default UserMobile;
