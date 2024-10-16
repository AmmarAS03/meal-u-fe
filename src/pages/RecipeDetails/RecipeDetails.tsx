import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonImg,
  IonText,
  IonIcon,
  IonButton,
  IonChip,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonSkeletonText,
  IonToast,
  IonInput,
} from "@ionic/react";
import {
  heartOutline,
  chatbubbleOutline,
  shareOutline,
  bookmarkOutline,
  time,
  restaurant,
  flame,
  fastFood,
  pencil,
} from "ionicons/icons";
import LongIngredientCard from "../../components/LongIngredientCard/LongIngredientCard";
import {
  fetchRecipeDetails,
  RecipeData,
  useAddRecipeComment,
  useRecipeComments,
  useRecipeStats,
  useLikeRecipe,
} from "../../api/recipeApi";
import { useAuth } from "../../contexts/authContext";
import { BsPencilSquare } from "react-icons/bs";
import { useAddCartItem } from "../../api/cartApi";
import { DietaryProvider, useDietary } from "../../contexts/dietaryContext";
import { useOrder } from "../../contexts/orderContext";
import { useLikedRecipes } from "../../api/userApi";
import LoveIcon from "../../../public/icon/love-icon";

const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { checkDietaryCompatibility, showIncompatibleFoodWarning } =
    useDietary();
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { data: recipeStats, isFetching: isRecipeStatsFetching , refetch: refetchLikedStats } =
    useRecipeStats(parseInt(id));
  const { getUnitFromId } = useOrder();

  const likeRecipeMutation = useLikeRecipe();

  const {
    data: likedRecipesData,
    isFetching: isLikedFetching,
    refetch: refetchLikedRecipes,
  } = useLikedRecipes();


  const [isLiked, setIsLiked] = useState(false);

  const { getToken } = useAuth();
  const token = getToken();
  const addCartItem = useAddCartItem();

  const [newComment, setNewComment] = useState("");
  const addComment = useAddRecipeComment(parseInt(id));
  const { data: comments, isLoading: isLoadingComments } = useRecipeComments(
    parseInt(id)
  );
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    if (comments) {
      setCommentCount(comments.length);
    }
  }, [comments]);

  useEffect(() => {
    if (likedRecipesData?.liked_recipes && id) {
      const isRecipeLiked = likedRecipesData.liked_recipes.some(
        (likedRecipe) => likedRecipe.recipe.id === parseInt(id)
      );
      setIsLiked(isRecipeLiked);
    }
  }, [likedRecipesData, id]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment.mutate(
        { comment: newComment },
        {
          onSuccess: () => {
            setNewComment("");
            setToastMessage("Comment added successfully");
            setShowToast(true);
          },
          onError: (error) => {
            setToastMessage(`Failed to add comment: ${error.message}`);
            setShowToast(true);
          },
        }
      );
    }
  };

  useEffect(() => {
    const loadRecipe = async () => {
      if (!token) {
        setError("No authentication token available");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchRecipeDetails(parseInt(id), token);
        setRecipe(data);
      } catch (err) {
        setError("Failed to load recipe details");
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id, token]);

  const handleAddToCart = () => {
    if (!recipe) return;

    const isCompatible = checkDietaryCompatibility(recipe.dietary_details);

    if (!isCompatible) {
      showIncompatibleFoodWarning(
        () => {
          addToCart();
        },
        () => {
          console.log("User cancelled adding incompatible recipe to cart");
        }
      );
    } else {
      addToCart();
    }
  };

  const addToCart = () => {
    const payload = {
      item_type: "recipe" as const,
      quantity: 1,
      recipe_id: recipe!.id,
      recipe_ingredients: recipe!.ingredients.map((ingredient) => ({
        ingredient_id: ingredient.ingredient.id,
        preparation_type_id: ingredient.preparation_type?.id || null,
        quantity: 1,
      })),
    };

    addCartItem.mutate(payload, {
      onSuccess: () => {
        setToastMessage("Recipe added to cart successfully");
        setShowToast(true);
      },
      onError: (error) => {
        setToastMessage(`Failed to add recipe to cart: ${error.message}`);
        setShowToast(true);
      },
    });
  };

  const handleLike = async () => {
    if (!recipe) return;

    try {
      await likeRecipeMutation.mutateAsync(recipe.id);
      setIsLiked(!isLiked);
      refetchLikedRecipes();
      refetchLikedStats();
      // Optionally, you can also update the likes count here
      // You might want to refetch the recipe stats or update it optimistically
    } catch (error) {
      console.error("Failed to like/unlike the recipe", error);
      setToastMessage("Failed to update like status");
      setShowToast(true);
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent>
          <IonSkeletonText animated className="w-full h-full" />
        </IonContent>
      </IonPage>
    );
  }

  if (error || !recipe) {
    return (
      <IonPage>
        <IonContent>
          <IonText color="danger">{error || "Recipe not found"}</IonText>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader collapse="fade">
        <IonToolbar className="font-sans">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/recipes" />
          </IonButtons>
          <IonTitle>{recipe.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="pb-24 font-sans">
          <div className="flex items-center p-4 justify-between">
            <div className="flex items-center gap-3">
              <IonAvatar>
                <img
                  src={recipe.creator.profile_picture || "/default-avatar.png"}
                  alt={recipe.creator.name}
                  className="max-h-12"
                />
              </IonAvatar>
              <div>
                <IonText className="font-bold text-base block">
                  {recipe.creator.name}
                </IonText>
              </div>
            </div>
          </div>
          <div className="w-full h-64 overflow-hidden">
            <IonImg
              src={recipe.image || "/food-placeholder.png"}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex justify-between items-center px-4 py-2.5 border-b border-gray-200 mt-1">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6" onClick={handleLike}>
                  <LoveIcon width="28" height="28" liked={isLiked}/>
                </div>
                <IonText>{recipeStats?.likes_count}</IonText>
              </div>
              <div className="flex items-center gap-2">
                <IonIcon icon={chatbubbleOutline} className="w-6 h-6" />
                <IonText>{commentCount}</IonText>
              </div>
            </div>
          </div>
          <div className="flex items-start justify-between p-4">
            <h1 className="text-2xl font-bold m-0">{recipe.name}</h1>
            <div className="flex items-center gap-1 text-gray-600 pt-2">
              <IonIcon icon={time} />
              <div className="text-xs whitespace-nowrap">
                <IonText>{recipe.cooking_time} mins</IonText>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap px-4 gap-2">
            {recipe.dietary_details.map((detail, index) => (
              <IonChip
                key={index}
                className="text-[#7862FC] border border-[#7862FC] bg-transparent rounded-full px-2.5 py-1 text-sm"
              >
                {detail}
              </IonChip>
            ))}
          </div>
          <div className="flex justify-start p-4 gap-3">
            <div className="flex items-center gap-3">
              <IonIcon
                icon={fastFood}
                className="bg-[#E6EBF2] text-[#0A2533] p-2 rounded-lg text-2xl"
              />
              <IonText className="text-[#0A2533] font-normal text-base w-24">
                {recipe.nutrition_details
                  ? recipe.nutrition_details.carbohydrate_per_serving
                  : "--"}
                g carbs
              </IonText>
            </div>
            <div className="flex items-center gap-3">
              <IonIcon
                icon={restaurant}
                className="bg-[#E6EBF2] text-[#0A2533] p-2 rounded-lg text-2xl"
              />
              <IonText className="text-[#0A2533] font-normal text-base w-24">
                {recipe.nutrition_details
                  ? recipe.nutrition_details.protein_per_serving
                  : "--"}
                g proteins
              </IonText>
            </div>
          </div>
          <div className="flex justify-start p-4 gap-3">
            <div className="flex items-center gap-3">
              <IonIcon
                icon={flame}
                className="bg-[#E6EBF2] text-[#0A2533] p-2 rounded-lg text-2xl"
              />
              <IonText className="text-[#0A2533] font-normal text-base w-24">
                {recipe.nutrition_details
                  ? recipe.nutrition_details.energy_per_serving
                  : "--"}{" "}
                Kcal
              </IonText>
            </div>
            <div className="flex items-center gap-3">
              <IonIcon
                icon={fastFood}
                className="bg-[#E6EBF2] text-[#0A2533] p-2 rounded-lg text-2xl"
              />
              <IonText className="text-[#0A2533] font-normal text-base w-24">
                {recipe.nutrition_details
                  ? recipe.nutrition_details.fat_total_per_serving
                  : "--"}
                g fats
              </IonText>
            </div>
          </div>
          <div className="px-4">
            <div className="bg-[#F1F5F5] rounded-2xl p-3.5">
              <IonText>{recipe.description}</IonText>
            </div>
          </div>
          <div className="px-4 mt-4">
            <h2 className="font-bold text-base">Steps</h2>
          </div>
          <IonList>
            {recipe.instructions.map((step, index) => (
              <IonItem key={index}>
                <IonLabel className="whitespace-normal">
                  {index + 1}. {step}
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
          <div className="px-4 mt-4">
            <h2 className="font-bold text-base">Ingredients</h2>
          </div>
          {recipe.ingredients.map((ingredient, index) => (
            <LongIngredientCard
              key={index}
              id={ingredient.ingredient.product_id}
              name={ingredient.ingredient.name}
              image={ingredient.ingredient.image || "/img/no-photo.png"}
              quantity={`${ingredient.ingredient.unit_size} ${getUnitFromId(
                ingredient.ingredient.unit_id
              )}`}
              price={`$${ingredient.price.toFixed(2)}`}
            />
          ))}
          <div className="px-4 mt-8 mb-24">
            <h2 className="text-xl font-bold mb-4">Comments</h2>
            <div className="space-y-4">
              {isLoadingComments ? (
                <div className="animate-pulse bg-gray-200 h-20 rounded-md"></div>
              ) : comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center mb-2">
                      <img
                        src={comment.user_details.profile_picture}
                        alt="User"
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <p className="font-semibold">
                          {comment.is_creator
                            ? "Author"
                            : comment.user_details.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.commented_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700">{comment.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
            <div className="mt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
                className="w-full bg-white p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7862FC] focus:border-transparent"
                rows={3}
              />
              <button
                onClick={handleAddComment}
                disabled={addComment.isPending}
                className="mt-2 w-full bg-[#7862FC] text-white py-2 px-4 rounded-md font-semibold hover:bg-[#6a56de] transition-colors duration-300"
              >
                {addComment.isPending ? "Adding..." : "Add Comment"}
              </button>
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md z-10 flex items-center gap-3 rounded-t-3xl">
          <button
            className="flex-grow bg-[#7862FC] text-white py-3 px-4 rounded-2xl font-semibold text-base font-sans"
            onClick={handleAddToCart}
            disabled={addCartItem.isPending}
          >
            {addCartItem.isPending
              ? "Adding..."
              : `Add Recipe to cart ($${recipe.total_price.toFixed(2)})`}
          </button>
        </div>
      </IonContent>
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        position="top"
      />
    </IonPage>
  );
};

export default RecipeDetails;
