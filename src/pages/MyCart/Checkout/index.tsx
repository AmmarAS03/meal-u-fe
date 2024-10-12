import CheckoutDetailsCard from './checkout-details-card';
import { Dispatch, SetStateAction, useEffect } from 'react';
import styles from './checkout.module.css';
import { useOrder } from '../../../contexts/orderContext';

interface CheckoutProps {
    subTotal: number;
    total: number;
    setTotal: Dispatch<SetStateAction<number>>;
}

const Checkout: React.FC<CheckoutProps> = ({subTotal, total, setTotal}) => {
    const { deliveryLocationDetails, deliveryTimeSlotDetails } = useOrder();


    // TODO: change with delivery fee from BE when ready
    useEffect(() => {
      const calculateTotal = () => {
          const newTotal = subTotal + 10;
          setTotal(newTotal);
      };
      calculateTotal();
    }, [subTotal, total]);

    return (
        <>
          <div className={styles.subsection}>
            <div className={styles.title}>Delivery to</div>
            <CheckoutDetailsCard data1={deliveryLocationDetails.name} data2={deliveryLocationDetails.branch} button="Change Address" />
          </div>

          <div className={styles.subsection}>
            <div className={styles.title}>Set Time</div>
            <CheckoutDetailsCard data1={deliveryTimeSlotDetails.name} data2={deliveryTimeSlotDetails.end_time} button="Change Time" />
          </div>
        </>
    )
}

export default Checkout;