import React from 'react';
import { IonCard, IonCardContent, IonImg, IonText, IonIcon } from '@ionic/react';
import { chevronForward } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

interface LongIngredientCardProps {
    id: number;
    name: string;
    image: string;
    quantity: string;
    price: string;
}

const LongIngredientCard: React.FC<LongIngredientCardProps> = ({ id, name, image, quantity, price }) => {
    const history = useHistory();

    const handleClick = () => {
        history.push(`/product-details/${id}`);
    };

    return (
        <IonCard className="bg-white rounded-2xl shadow-md mx-4 my-2 font-sans">
            <IonCardContent className="flex items-center p-3">
                <div className="w-16 h-16 overflow-hidden rounded-xl mr-4">
                    <IonImg src={image} alt={name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                    <IonText className="font-semibold text-base text-[#0A2533] block mb-1 truncate max-w-[180px]">{name}</IonText>
                    <IonText className="text-sm text-[#0A2533] font-medium block mb-1">{quantity}</IonText>
                    <IonText className="text-xs text-[#97A2B0]">{price}</IonText>
                </div>
                <div 
                    className="flex items-center justify-center w-8 h-8 bg-[#0F2930] rounded-lg cursor-pointer" 
                    onClick={handleClick}
                >
                    <IonIcon icon={chevronForward} className="text-white text-lg" />
                </div>
            </IonCardContent>
        </IonCard>
    );
};

export default LongIngredientCard;