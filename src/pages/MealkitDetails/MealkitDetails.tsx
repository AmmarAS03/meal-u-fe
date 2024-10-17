import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
    IonChip,
    IonAvatar,
    IonSkeletonText,
    IonToast,
} from '@ionic/react';
import { heartOutline, chatbubbleOutline } from 'ionicons/icons';
import { BsPencilSquare } from 'react-icons/bs';
import LongRecipeCard from '../../components/LongRecipeCard/LongRecipeCard';
import { fetchMealkitDetails, MealkitDetailsData, useAddMealkitComment, useMealkitComments, useMealkitStats } from '../../api/mealkitApi';
import { useAuth } from '../../contexts/authContext';
import { useAddCartItem } from '../../api/cartApi';
import { DietaryProvider, useDietary } from '../../contexts/dietaryContext';

const MealkitDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const mealkitId = parseInt(id);
    const { checkDietaryCompatibility, showIncompatibleFoodWarning } = useDietary();
    const [mealkit, setMealkit] = useState<MealkitDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const addCartItem = useAddCartItem();

    const { getToken } = useAuth();
    const token = getToken();

    const [newComment, setNewComment] = useState('');
    const addComment = useAddMealkitComment(parseInt(id));
    const { data: comments, isLoading: isLoadingComments } = useMealkitComments(mealkitId);
    const { data: mealkitStats, isFetching: isMealkitStatsFetching } = useMealkitStats(mealkitId);
    const [commentCount, setCommentCount] = useState(0);

    useEffect(() => {
        if (comments) {
            setCommentCount(comments.length);
        }
    }, [comments]);

    useEffect(() => {
        const loadMealkit = async () => {
            if (!token) {
                setError('No authentication token available');
                setLoading(false);
                return;
            }

            try {
                const data = await fetchMealkitDetails(parseInt(id), token);
                setMealkit(data);
            } catch (err) {
                setError('Failed to load mealkit details');
            } finally {
                setLoading(false);
            }
        };

        loadMealkit();
    }, [id, token]);

    const handleAddComment = () => {
        if (newComment.trim()) {
            addComment.mutate({ comment: newComment }, {
                onSuccess: () => {
                    setNewComment('');
                    setToastMessage('Comment added successfully');
                    setShowToast(true);
                },
                onError: (error) => {
                    setToastMessage(`Failed to add comment: ${error.message}`);
                    setShowToast(true);
                },
            });
        }
    };

    const handleAddToCart = () => {
        if (!mealkit) return;
      
        const isCompatible = checkDietaryCompatibility(mealkit.dietary_details);
      
        if (!isCompatible) {
          showIncompatibleFoodWarning(
            () => {
              addToCart();
            },
            () => {
              console.log('User cancelled adding incompatible mealkit to cart');
            }
          );
        } else {
          addToCart();
        }
      };
      
      const addToCart = () => {
        const payload = {
          item_type: 'mealkit' as const,
          item_data: {
            mealkit_id: parseInt(id, 10),
            recipes: mealkit!.recipes.map(recipe => ({
              recipe_id: recipe.id,
              quantity: 1,
              recipe_ingredients: recipe.ingredients.map(ingredient => ({
                ingredient_id: ingredient.ingredient.id,
                preparation_type_id: ingredient.preparation_type?.id || null,
                quantity: 1,
              })),
            })),
          },
          quantity: 1,
        };
      
        addCartItem.mutate(payload, {
          onSuccess: () => {
            setToastMessage('Mealkit added to cart successfully');
            setShowToast(true);
          },
          onError: (error) => {
            setToastMessage(`Failed to add mealkit to cart: ${error.message}`);
            setShowToast(true);
          },
        });
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

    if (error || !mealkit) {
        return (
            <IonPage>
                <IonContent>
                    <IonText color="danger" className="p-4">{error || 'Mealkit not found'}</IonText>
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage>
            <IonHeader collapse='fade'>
                <IonToolbar className='font-sans'>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/mealkits" />
                    </IonButtons>
                    <IonTitle>Mealkit</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <div className="pb-24 font-sans">
                    <div className="flex items-center p-4 justify-between">
                        <div className="flex items-center gap-3">
                            <IonAvatar>
                                <img src={mealkit.creator.profile_picture} alt={mealkit.creator.name} />
                            </IonAvatar>
                            <div>
                                <IonText className="font-bold text-base text-[#0A2533] block">{mealkit.creator.name}</IonText>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-64 overflow-hidden">
                        <IonImg src={mealkit.image} alt={mealkit.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                        <div className="flex items-center gap-5">
                            <div className="flex items-center gap-2">
                                <IonIcon icon={heartOutline} className="w-6 h-6"></IonIcon>
                                <IonText className="text-sm text-[#0A2533]">{mealkitStats ? mealkitStats.likes_count : "N/A"}</IonText>
                            </div>
                            <div className="flex items-center gap-2">
                                <IonIcon icon={chatbubbleOutline} className="w-6 h-6"></IonIcon>
                                <IonText className="text-sm text-[#0A2533]">{commentCount}</IonText>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <h1 className="text-2xl font-bold text-[#0A2533] m-0">{mealkit.name}</h1>
                    </div>
                    <div className="flex flex-wrap px-4 gap-2">
                        {mealkit.dietary_details.map((detail, index) => (
                            <IonChip key={index} className="text-[#7862FC] border border-[#7862FC] bg-transparent rounded-full px-2.5 py-1 text-sm">{detail}</IonChip>
                        ))}
                    </div>
                    <div className="p-4">
                        <IonText className="text-base text-[#0A2533] leading-relaxed">{mealkit.description}</IonText>
                    </div>
                    <div className="px-4 mt-4">
                        <h2 className="text-lg font-bold text-[#0A2533]">Recipes</h2>
                    </div>
                    {mealkit.recipes.map((recipe) => (
                        <LongRecipeCard
                            key={recipe.id}
                            id={recipe.id}
                            name={recipe.name}
                            image={recipe.image}
                            dietaryDetails={recipe.dietary_details}
                            price={recipe.total_price}
                        />
                    ))}
                    <div className="px-4 mt-8 mb-24">
                        <h2 className="text-xl font-bold mb-4">Comments</h2>
                        <div className="space-y-4">
                            {isLoadingComments ? (
                                <div className="animate-pulse bg-gray-200 h-20 rounded-md"></div>
                            ) : comments && comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment.id} className="bg-white rounded-lg p-4 shadow-sm">
                                        <div className="flex items-center mb-2">
                                            <img src={comment.user_details.profile_picture} alt="User" className="w-8 h-8 rounded-full mr-2" />
                                            <div>
                                                <p className="font-semibold">{comment.is_creator ? 'Author' : comment.user_details.name}</p>
                                                <p className="text-xs text-gray-500">{new Date(comment.commented_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-700">{comment.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No comments yet. Be the first to comment!</p>
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
                                {addComment.isPending ? 'Adding...' : 'Add Comment'}
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
                        {addCartItem.isPending ? 'Adding...' : `Add Mealkit to cart ($${mealkit.total_price.toFixed(2)})`}
                    </button>
                    <div className="w-12 h-12 flex items-center justify-center font-sans">
                        <BsPencilSquare className="w-8 h-8 text-[#7862FC]" />
                    </div>
                </div>
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={3000}
                    position="top"
                />
            </IonContent>
        </IonPage>
    );
};

export default MealkitDetails;
