import { IonButton } from '@ionic/react';

interface ButtomButtonProps {
    title: string;
}

const BottomButton: React.FC<ButtomButtonProps> = ({title}) => {
  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      alignContent: "center",
      justifyContent: "center",
    }}>
      <IonButton>{title}</IonButton>
    </div>
  );
};

export default BottomButton;