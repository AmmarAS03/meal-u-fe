import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useState } from "react";
import Cart from "../Cart";
import Checkout from "../Checkout";
import styles from './MyCartWeb.module.css';

const MyCartWebsite: React.FC = () => {
    const [subTotal, setSubTotal] = useState(0);
    const [total, setTotal] = useState(0);

    return(
      <IonPage>
        <IonContent className="no-padding">
          <div className={styles.pageContainer}>
              <div className={styles.cartSection}>
                <div className={styles.cartContainer}>
                  <Cart subTotal={subTotal} setSubTotal={setSubTotal} />
                </div>
              </div>
              <div className={styles.checkoutSection}>
                <div className={styles.checkoutContainer}>
                  <div className={styles.checkoutContainer2}>
                    {/* <Checkout subTotal={subTotal} total={total} setTotal={setTotal} /> */}
                  </div>
                </div>
              </div>
          </div>
        </IonContent>
      </IonPage>
    )
}

export default MyCartWebsite;