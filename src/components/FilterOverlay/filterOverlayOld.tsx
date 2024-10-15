import { dietaryRequirements, initialPriceRange, mealTypes } from './dummyData';
import { IonBackButton, IonButton, IonButtons, IonCheckbox, IonChip, IonContent, IonHeader, IonLabel, IonPage, IonRange, IonTitle, IonToolbar} from '@ionic/react';
import styles from './overlay.module.css';
import { useEffect, useState } from 'react';

const FilterOverlayOld: React.FC = () => {
  const [dietary, setDietary] = useState<number[]>([]);
  const [applyDietary, setApplyDietary] = useState(false);
  const [meals, setMeals] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState(initialPriceRange);

  const handleDietaryToggle = (id: number) => {
    setDietary(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleMealToggle = (id: number) => {
    setMeals(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleApplyFilter = () => {
    // Apply filter logic here
    console.log('Filters applied:', { dietary, applyDietary, meals, priceRange });
  };

  const handleClearFilter = () => {
    setDietary([]);
    setApplyDietary(false);
    setMeals([]);
    setPriceRange(initialPriceRange);
  };


  return (
          <div className={styles.mainContainer}>
            <div className={styles.mainSection}>
              <div className={styles.subsection}>
                <div className={styles.subsectionTitle}>Dietary Requirements</div>
                <div className={styles.nodesContainer}>
                  {dietaryRequirements.map((item) => (
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
                  {mealTypes.map((item) => (
                    <IonChip
                      key={item.id}
                      onClick={() => handleMealToggle(item.id)}
                      color={meals.includes(item.id) ? 'primary' : 'medium'}
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
                  pin={true} pinFormatter={(value: number) => `$${value}`}
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
              <div className={styles.bottomButtons}>
                <IonButton expand="block" fill="clear" onClick={handleClearFilter}>Clear</IonButton>
                <div className={styles.mainButton}>
                  <IonButton expand="block" onClick={handleApplyFilter}>Apply</IonButton>
                </div>
              </div>
            </div>
          </div>
  )
}

export default FilterOverlayOld;