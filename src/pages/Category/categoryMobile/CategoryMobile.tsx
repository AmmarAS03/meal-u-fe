import React, { useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonButton,
  IonButtons,
  IonBackButton,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { CategoryData, useCategoriesList } from "../../../api/categoryApi";

const SHOW_ALL_CATEGORY = {
  id: 0,
  name: "Show All",
  image: "/img/AllFood.png",
};

const CategoryMobile: React.FC = () => {
  const history = useHistory();
  const { data: fetchedCategories = [], isFetching: isCategoriesFetching } =
    useCategoriesList();

  const categories = [SHOW_ALL_CATEGORY, ...fetchedCategories];
  const handleCategoryClick = (categoryName: string) => {
    history.push(`/order/${categoryName}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
          </IonButtons>
          <IonTitle>Categories</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            margin: "10px",
          }}
        >
          <p style={{ fontSize: "16px", fontWeight: "600" }}>
            Craving something specific?
          </p>
          <p style={{ fontSize: "14px", fontWeight: "400" }}>
            Pick a food category to get started!
          </p>
        </div>

        {isCategoriesFetching ? (
          <p>Loading categories...</p>
        ) : (
          <div className="grid grid-cols-3 gap-2.5 w-full md:grid-cols-2 sm:grid-cols-1">
            {categories.map((category: CategoryData) => (
              <IonCard
                key={category.id}
                style={{
                  width: "100%",
                  margin: "0",
                  borderRadius: "10px",
                }}
                onClick={() => handleCategoryClick(category.name)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    padding: "5px",
                    height: "60px",
                    borderRadius: "15px",
                  }}
                >
                  <img
                    alt={`${category.name} category`}
                    src={category.image}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </div>
                <IonCardHeader style={{ padding: "2px" }}>
                  <div>
                    <p
                      style={{
                        margin: "0px",
                        textAlign: "center",
                        fontWeight: "600",
                        color: "#000000",
                        fontSize: "12px",
                      }}
                    >
                      {category.name}
                    </p>
                  </div>
                </IonCardHeader>
              </IonCard>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default CategoryMobile;
