import React from 'react';
import { IonCard, IonCardContent, IonImg, IonText, IonIcon, IonChip } from '@ionic/react';
import { chevronForward } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

interface LongRecipeCardProps {
    id: number;
    name: string;
    image: string;
    dietaryDetails: string[];
    price: number;
}

const LongRecipeCard: React.FC<LongRecipeCardProps> = ({ id, name, image, dietaryDetails, price }) => {
    const history = useHistory();

    const handleClick = () => {
        history.push(`/recipe-details/${id}`);
    };

    return (
        <IonCard className="bg-white rounded-2xl shadow-md mx-4 my-2 font-sans">
            <IonCardContent className="flex items-center p-3">
                <div className="w-16 h-16 overflow-hidden rounded-xl mr-4">
                    <IonImg src={image} alt={name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                    <IonText className="font-semibold text-base text-[#0A2533] block mb-1 truncate max-w-[180px]">{name}</IonText>
                    <div className="flex flex-wrap mb-1">
                        {dietaryDetails.map((detail, index) => (
                            <IonChip key={index} className="text-[#7862FC] border border-[#7862FC] bg-transparent rounded-full px-2.5 py-1 text-sm mr-1 mb-1">{detail}</IonChip>
                        ))}
                    </div>
                    <IonText className="text-sm text-[#0A2533] font-semibold">${price.toFixed(2)}</IonText>
                </div>
                <div className="flex items-center justify-center w-8 h-8 bg-[#0F2930] rounded-lg" onClick={handleClick}>
                    <IonIcon icon={chevronForward} className="text-white text-lg" />
                </div>
            </IonCardContent>
        </IonCard>
    );
};

export default LongRecipeCard;