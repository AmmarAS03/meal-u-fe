import React, { useEffect, useState, useMemo } from "react";
import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonAvatar,
  IonButton,
  IonIcon,
  useIonViewDidEnter,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { gridOutline, heartOutline } from "ionicons/icons";
import { useUserProfile, useLikedRecipes } from "../../../api/userApi";
import {
  useRecipesByCreator,
  useCommunityRecipesList,
} from "../../../api/recipeApi";
import CommunityCard from "../../../components/CommunityCard/CommunityCard";
import SkeletonCommunityCard from "../../../components/CommunityCard/SkeletonCommunityCard";
import { useQueryClient } from "@tanstack/react-query";

type CombinedItemData = {
  id: number;
  creator: { name: string; profile_picture: string };
  name: string;
  description: string;
  serving_size?: number;
  meal_type?: string;
  cooking_time?: number;
  created_at: string;
  image: string;
  dietary_details: string[];
  total_price?: number;
  likes_count: number;
  comments_count: number;
  is_like?: boolean;
  type: "recipe" | "mealkit";
};

function UserMobile() {
  const history = useHistory();
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
    refetch: refetchUser,
  } = useUserProfile();
  const [activeIcon, setActiveIcon] = useState("grid");
  const creatorId = user ? user.id : 0;
  const { data: userRecipes = [], isFetching: isCreatorRecipesFetching } =
    useRecipesByCreator(creatorId);
  const {
    data: communityRecipes = [],
    isFetching: isCommunityRecipesFetching,
  } = useCommunityRecipesList();
  const { data: likedRecipesData, isFetching: isLikedFetching } =
    useLikedRecipes();

  useIonViewDidEnter(() => {
    refetchUser();
  });

  useEffect(() => {
    refetchUser();
  }, [refetchUser]);

  const transformItemData = (
    item: any,
    type: "recipe" | "mealkit"
  ): CombinedItemData => {
    return {
      id: item.id,
      creator: item.creator,
      name: item.name,
      description: item.description || "",
      serving_size: item.serving_size,
      meal_type: item.meal_type,
      cooking_time: item.cooking_time,
      created_at: item.created_at,
      image: item.image,
      dietary_details: item.dietary_details || [],
      total_price: item.total_price,
      likes_count: item.likes_count ?? 0,
      comments_count: item.comments_count ?? 0,
      is_like: item.is_like || false,
      type: type,
    };
  };

  const likedItems = useMemo(() => {
    if (!likedRecipesData) return [];
    return [
      ...(likedRecipesData.liked_recipes?.map((item) =>
        transformItemData(
          {
            ...item.recipe,
            likes_count: item.likes_count,
            comments_count: item.comments_count,
            is_like: true,
          },
          "recipe"
        )
      ) || []),
      ...(likedRecipesData.liked_mealkits?.map((item) =>
        transformItemData(
          {
            ...item.mealkit,
            likes_count: item.likes_count,
            comments_count: item.comments_count,
            is_like: true,
          },
          "mealkit"
        )
      ) || []),
    ];
  }, [likedRecipesData]);

  const filteredItems = useMemo(() => {
    if (activeIcon === "grid") {
      const userRecipeIds = new Set(userRecipes.map((recipe) => recipe.id));
      return communityRecipes
        .filter((recipe) => userRecipeIds.has(recipe.id))
        .map((recipe) => transformItemData(recipe, "recipe"));
    } else if (activeIcon === "heart") {
      return likedItems;
    }
    return [];
  }, [activeIcon, userRecipes, communityRecipes, likedItems]);

  const handleEditProfile = () => {
    history.push("/edit-profile");
  };

  if (isUserLoading) return <p>Loading...</p>;
  if (userError) return <p>Error loading profile.</p>;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="ion-hide-sm-up">
          <IonTitle>My Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding font-sans">
        {user && (
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <IonAvatar
              style={{
                width: "120px",
                height: "120px",
                margin: "0 auto",
                border: "3px solid #6c63ff",
                borderRadius: "60px",
                overflow: "hidden",
              }}
            >
              <img
                src={user.image || "public/img/no-photo.png"}
                alt="Profile"
                style={{ width: "100%", height: "100%" }}
              />
            </IonAvatar>
            <h2
              style={{
                margin: "15px 0 5px 0",
                fontSize: "1.5em",
                fontWeight: "bold",
              }}
            >
              {user.first_name} {user.last_name}
            </h2>
            <p style={{ margin: "0 0 15px 0", color: "#000" }}>{user.email}</p>
            <IonButton
              color="primary"
              style={{
                width: "218px",
                height: "35px",
                borderRadius: "17.5px",
                marginBottom: "20px",
                backgroundColor: "#6c63ff",
                fontWeight: "bold",
                fontSize: "14px",
                textTransform: "none",
              }}
              onClick={handleEditProfile}
            >
              Edit Profile
            </IonButton>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            margin: "20px 0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "90%",
              maxWidth: "500px",
              padding: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: "25px",
              background: "#fff",
            }}
          >
            <IonIcon
              icon={gridOutline}
              style={{
                fontSize: "24px",
                color: activeIcon === "grid" ? "#7862FC" : "#000",
                cursor: "pointer",
              }}
              onClick={() => setActiveIcon("grid")}
            />
            <IonIcon
              icon={heartOutline}
              style={{
                fontSize: "24px",
                color: activeIcon === "heart" ? "#7862FC" : "#000",
                cursor: "pointer",
              }}
              onClick={() => setActiveIcon("heart")}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "50px",
          }}
        >
          {isCreatorRecipesFetching ||
          isCommunityRecipesFetching ||
          isLikedFetching ? (
            <>
              <SkeletonCommunityCard />
              <SkeletonCommunityCard />
              <SkeletonCommunityCard />
            </>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div style={{ width: "100%" }}>
                <CommunityCard key={item.id} recipe={item} />
              </div>
            ))
          ) : (
            <p>No recipes found.</p>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}

export default UserMobile;
