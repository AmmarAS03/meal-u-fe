import React, { Dispatch } from 'react';
import { IonButton, IonCheckbox, IonChip, IonIcon, IonLabel, IonRange } from '@ionic/react';
import { close } from 'ionicons/icons';
import styles from './overlay.module.css';
import { DietaryDetail, MealType } from '../../api/productApi';

const FilterOverlay = ({
  onClose,
  onApplyFilter,
  dietary,
  setDietary,
  applyDietary,
  setApplyDietary,
  meals,
  setMeals,
  priceRange,
  setPriceRange,
  dietaryRequirements,
  mealTypes
}:{
  onClose: () => void,
  onApplyFilter: (filters: any) => void,
  dietary: number[],
  setDietary: Dispatch<React.SetStateAction<number[]>>,
  // applyDietary: boolean,
  // setApplyDietary: Dispatch<React.SetStateAction<boolean>>,
  meals: number[],
  setMeals: Dispatch<React.SetStateAction<number[]>>,
  priceRange: {min: number, max: number},
  setPriceRange: React.Dispatch<React.SetStateAction<{min: number; max: number;}>>,
  dietaryRequirements: DietaryDetail[],
  mealTypes: MealType[]
}) => {
  const handleDietaryToggle = (id: any) => {
    setDietary(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleMealToggle = (id: any) => {
    setMeals(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleApplyFilter = () => {
    onApplyFilter({ dietary, applyDietary, meals, priceRange });
    onClose();
  };

  const handleClearFilter = () => {
    setDietary([]);
    setApplyDietary(false);
    setMeals([]);
    setPriceRange({ min: 0, max: 100 });
  };

  return (
    <div className={styles.mainContainer}>
      {/* <button className={styles.closeButton} onClick={onClose}>
        <IonIcon icon={close} />
      </button> */}
      <div className={styles.mainSection}>
        <div className={styles.subsection}>
          <div className={styles.subsectionTitle}>Dietary Requirements</div>
          <div className={styles.nodesContainer}>
            {dietaryRequirements?.map((item) => (
              <IonChip 
                key={item.id} 
                onClick={() => handleDietaryToggle(item.id)}
                color={dietary.includes(item.id) ? 'primary' : 'medium'}
              >
                <IonLabel>{item.name}</IonLabel>
              </IonChip>
            ))}
          </div>
          <IonCheckbox 
            checked={applyDietary} 
            onIonChange={e => setApplyDietary(e.detail.checked)}
            className={styles.checkbox}
          >
            Apply my dietary requirements
          </IonCheckbox>
        </div>
        <div className={styles.subsection}>
          <div className={styles.subsectionTitle}>Meal Type</div>
          <div className={styles.nodesContainer}>
            {mealTypes?.map((item) => (
              <IonChip
                key={item.id}
                onClick={() => handleMealToggle(item.id)}
                color={meals.includes(item.name) ? 'primary' : 'medium'}
              >
                <IonLabel>{item.name}</IonLabel>
              </IonChip>
            ))}
          </div>
        </div>
        <div className={styles.subsection}>
          <div className={styles.subsectionTitle}>Price Range</div>
          <IonRange 
            aria-label="Dual Knobs Range"
            className={styles.priceRangeSlider}
            dualKnobs={true}
            min={0}
            max={100}
            step={1}
            pin={true}
            pinFormatter={(value) => `$${value}`}
            value={{lower: priceRange.min, upper: priceRange.max}}
            onIonChange={(e) => {
              const rangeValue = e.detail.value;
              if (typeof rangeValue === 'object' && rangeValue !== null && 'lower' in rangeValue && 'upper' in rangeValue) {
                setPriceRange({
                  min: rangeValue.lower,
                  max: rangeValue.upper
                });
              }
            }}
          >
            <IonLabel className={styles.priceRangeLabel} slot="start">${priceRange.min}</IonLabel>
            <IonLabel className={styles.priceRangeLabel} slot="end">${priceRange.max}</IonLabel>
          </IonRange>
        </div>
      </div>
      <div className={styles.bottomButtons}>
        <IonButton expand="block" fill="clear" onClick={handleClearFilter}>Clear</IonButton>
        <IonButton expand="block" onClick={handleApplyFilter}>Apply</IonButton>
      </div>
    </div>
  );
};

export default FilterOverlay;