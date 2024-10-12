import React from "react";
import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonButton,
  IonInput,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
} from "@ionic/react";
import LocationIcon from "../../../../public/icon/location-icon";
import { heart } from "ionicons/icons";

function HomeWeb() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="ion-hide-sm-up">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1"></IonBackButton>
          </IonButtons>
          <IonTitle>Order</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="content-container">
          <div className="order-card">
            <img
              src="/img/Card.png"
              alt="Order card"
              className="order-card-image"
            />
          </div>
          <div className="header-category">
            <h3>Category</h3>
            <p style={{ color: '#7862FC' }}>See All</p>
          </div>
          <div className="category-button-wrapper">
            <IonButton shape="round">Breakfast</IonButton>
            <IonButton shape="round">Lunch</IonButton>
            <IonButton shape="round">Dinner</IonButton>
            <IonButton shape="round">Snack</IonButton>
            <IonButton shape="round">Pasta</IonButton>
            <IonButton shape="round">Asian</IonButton>
          </div>
          <div className="header-category">
            <h3>Popular Recipes</h3>
            <p style={{ color: '#7862FC' }}>See All</p>
          </div>
          <div className="order-card-wrapper">
            <IonCard style={{ maxWidth: "250px", margin: "auto" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  paddingTop: "5px",
                }}
              >
                <img
                  alt="Silhouette of mountains"
                  src="/img/food-image.png"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    maxWidth: "200px",
                  }}
                />
              </div>
              <IonCardHeader>
                <IonCardSubtitle>
                  Healthy Taco Salad with fresh vegetable
                </IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>120Kcal</IonCardContent>
              <IonButton size="small">
                <IonIcon icon={heart}></IonIcon>
              </IonButton>
            </IonCard>

            <IonCard style={{ maxWidth: "250px", margin: "auto" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  paddingTop: "5px",
                }}
              >
                <img
                  alt="Silhouette of mountains"
                  src="/img/food-image.png"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    maxWidth: "200px",
                  }}
                />
              </div>
              <IonCardHeader>
                <IonCardSubtitle>
                  Healthy Taco Salad with fresh vegetable
                </IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>120Kcal</IonCardContent>
              <IonButton size="small">
                <IonIcon icon={heart}></IonIcon>
              </IonButton>
            </IonCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default HomeWeb;
