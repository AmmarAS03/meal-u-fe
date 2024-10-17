import React, { useState, useEffect } from 'react';
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
    IonChip,
    IonToast,
} from '@ionic/react';
import { BsPencilSquare } from 'react-icons/bs';
import { fetchProductDetails, ProductData } from '../../api/productApi';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import { useParams, useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { useAddCartItem } from '../../api/cartApi';

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const history = useHistory();

    const { getToken } = useAuth();
    const token = getToken() || "";
    const addCartItem = useAddCartItem();

    useEffect(() => {
        const loadProductDetails = async () => {
            try {
                const data = await fetchProductDetails(parseInt(id), token);
                setProduct(data);
            } catch (err) {
                setError('Failed to load product details');
            } finally {
                setLoading(false);
            }
        };

        loadProductDetails();
    }, [id, token]);

    const handleAddToCart = () => {
        if (!product) return;

        const payload = {
            item_type: 'product' as const,
            quantity: 1,
            product_id: product.id,
        };

        addCartItem.mutate(payload, {
            onSuccess: () => {
                setToastMessage('Product added to cart successfully');
                setShowToast(true);
            },
            onError: (error) => {
                setToastMessage(`Failed to add product to cart: ${error.message}`);
                setShowToast(true);
            },
        });
    };

    if (loading) {
        return (
            <IonPage>
                <IonContent>
                    <div className="flex items-center justify-center h-full">
                        <IonText className="text-gray-500">Loading...</IonText>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    if (error || !product) {
        return (
            <IonPage>
                <IonContent>
                    <div className="flex items-center justify-center h-full">
                        <IonText color="danger" className="text-red-500">{error || 'Product not found'}</IonText>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    const handleRecipeClick = (recipeId: number) => {
        history.push(`/recipe-details/${recipeId}`);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/products" />
                    </IonButtons>
                    <IonTitle>Product Details</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <div className="pb-20">
                    <div className="w-full h-64 overflow-hidden">
                        <IonImg src={product.image || "/img/no-photo.png"} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex justify-between items-start p-4">
                        <h1 className="text-2xl font-bold text-[#0A2533] m-0">{product.name}</h1>
                        <div className="pt-2">
                            <IonText className="text-base text-[#48525F]">${product.price_per_unit}/{product.unit_id}</IonText>
                        </div>
                    </div>
                    <div className="flex flex-wrap px-4 gap-2">
                        {product.dietary_details.map((detail: string, index: number) => (
                            <IonChip key={index} className="text-[#7862FC] border border-[#7862FC] bg-transparent rounded-full px-2.5 py-1 text-sm">{detail}</IonChip>
                        ))}
                    </div>
                    
                    <div className="p-4">
                        <IonText className="text-base text-[#0A2533] leading-relaxed">{product.description}</IonText>
                    </div>

                    <div className="px-4 mt-4">
                        <h2 className="text-lg font-bold text-[#0A2533]">Recipes featuring this product</h2>
                    </div>
                    <div className="flex overflow-x-auto gap-4 px-4 pb-4 scrollbar-hide">
                        {product.recipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                id={recipe.id}
                                imageSrc={recipe.image}
                                title={recipe.name}
                                onClick={() => handleRecipeClick(recipe.id)}
                            />
                        ))}
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md z-10 flex items-center gap-3 rounded-t-3xl">
                    <button 
                        className="flex-grow bg-[#7862FC] text-white py-3 px-4 rounded-2xl font-semibold text-base font-sans"
                        onClick={handleAddToCart}
                        disabled={addCartItem.isPending}
                    >
                        {addCartItem.isPending ? 'Adding...' : 'Add to cart'}
                    </button>
                    <div className="w-12 h-12 flex items-center justify-center font-sans">
                        <BsPencilSquare className="w-8 h-8 text-[#7862FC]" />
                    </div>
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

export default ProductDetails;
