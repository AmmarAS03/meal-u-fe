import CheckoutDetailsCard from '../../../components/CheckoutDetailsCard/CheckoutDetailsCard';
import CheckoutTimeDetailsCard from '../../../components/CheckoutDetailsCard/CheckoutTimeDetailsCard';
import CheckoutDateDetailsCard from '../../../components/CheckoutDetailsCard/CheckoutDateDetailsCard';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './checkout.module.css';
import { useOrder } from '../../../contexts/orderContext';

interface CheckoutProps {
}

const Checkout: React.FC<CheckoutProps> = () => {
    const { deliveryLocationDetails, deliveryTimeSlotDetails } = useOrder();

    return (
        <>
          <div className={styles.subsection}>
            <div className={styles.title}>Delivery to</div>
            <CheckoutDetailsCard data1={deliveryLocationDetails.name} data2={deliveryLocationDetails.branch} button="Change Address" />
          </div>

          <div className={styles.subsection}>
            <div className={styles.title}>Set Delivery Date</div>
            <CheckoutDateDetailsCard />
          </div>

          <div className={styles.subsection}>
            <div className={styles.title}>Set Time</div>
            <CheckoutTimeDetailsCard data={deliveryTimeSlotDetails}/>
          </div>
        </>
    )
}

export default Checkout;