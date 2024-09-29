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
} from '@ionic/react';
import { heartOutline, chatbubbleOutline, shareOutline, bookmarkOutline } from 'ionicons/icons';
import { BsPencilSquare } from 'react-icons/bs';
import LongRecipeCard from '../../components/LongRecipeCard/LongRecipeCard';
import { fetchMealkitDetails, MealkitDetailsData } from '../../api/mealkitApi';
import { useAuth } from '../../contexts/authContext';

const MealkitDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [mealkit, setMealkit] = useState<MealkitDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { getToken } = useAuth();
    const token = getToken();

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
            <IonHeader>
                <IonToolbar>
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
                                <IonText className="text-sm text-gray-600">Followers: N/A</IonText>
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
                                <IonText className="text-sm text-[#0A2533]">N/A</IonText>
                            </div>
                            <div className="flex items-center gap-2">
                                <IonIcon icon={chatbubbleOutline} className="w-6 h-6"></IonIcon>
                                <IonText className="text-sm text-[#0A2533]">N/A</IonText>
                            </div>
                            <div className="flex items-center gap-2">
                                <IonIcon icon={shareOutline} className="w-6 h-6"></IonIcon>
                            </div>
                        </div>
                        <div>
                            <IonIcon icon={bookmarkOutline} className="w-6 h-6"></IonIcon>
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
                    <div className="px-4 mt-4">
                        <h2 className="text-lg font-bold text-[#0A2533]">Comments</h2>
                    </div>
                    <IonText className="px-4">No comments available.</IonText>
                </div>
                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md z-10 flex items-center gap-3 rounded-t-3xl">
                    <button className="flex-grow bg-[#7862FC] text-white py-3 px-4 rounded-2xl font-semibold text-base font-sans">
                        Add Mealkit to cart (${mealkit.total_price.toFixed(2)})
                    </button>
                    <div className="w-12 h-12 flex items-center justify-center font-sans">
                        <BsPencilSquare className="w-8 h-8 text-[#7862FC]" />
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default MealkitDetails;