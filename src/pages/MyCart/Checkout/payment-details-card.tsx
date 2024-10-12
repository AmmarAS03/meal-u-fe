import styles from './checkout.module.css';

interface PaymentDetailsCardProps {
    subTotal: number;
    fee: number | null;
    total: number | null;
}

const PaymentDetailsCard: React.FC<PaymentDetailsCardProps> = ({subTotal, fee, total}) => {
    return (
        <div className={styles.card}>
                <div className={styles.column}>
                  <div className={styles.row_two_columns}>
                    <div className={styles.column}>Sub Total</div>
                    <div className={styles.column}>${subTotal}</div>
                  </div>
                  <div className={styles.row_two_columns}>
                    <div className={styles.column}>Fee and Delivery</div>
                    <div className={styles.column}>${fee ? fee : "-"}</div>
                  </div>
                  <div className={styles.row_two_columns}>
                    <div className={styles.column}>Total Price</div>
                    <div className={styles.column}>${total ? total : "-"}</div>
                  </div>
                </div>
              </div>
    )
}

export default PaymentDetailsCard;