import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react"

const CreatorProfile: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="ion-hide-sm-up">
          <IonTitle>Creator'sProfile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding font-sans">
      </IonContent>
    </IonPage>
  )
}

export default CreatorProfile;