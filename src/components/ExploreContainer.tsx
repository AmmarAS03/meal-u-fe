import './ExploreContainer.css';
import FilterIcon from "../../public/icon/filter"
import FilterOverlayOld from './FilterOverlay/filterOverlayOld';
import { IonButton, IonIcon }  from '@ionic/react';
import { useState } from 'react';

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const handleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  }

  return (
    <>
    <div style={{display: "flex", justifyContent: "flex-end"}}>
        <IonButton size="small" onClick={handleFilter}>
          <FilterIcon />
        </IonButton>
    </div>
    { isFilterVisible ? (
      <div className="container">
        <strong>{name}</strong>
        <p>Explore <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
       </div>
    ) : (
      <div className='filter'>
        <FilterOverlayOld />
      </div>
  )}
    </>
  );
};

export default ExploreContainer;
