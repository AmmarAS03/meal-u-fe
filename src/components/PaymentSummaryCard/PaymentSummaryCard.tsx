import styles from './PaymentSummaryCard.module.css';

interface PaymentSummaryCardProps {
    subTotal: number;
    fee: number;
    total: number;
}

const PaymentSummaryCard: React.FC<PaymentSummaryCardProps> = ({subTotal, fee, total}) => {
    return (
        <div className={styles.card}>
                <div className={styles.column}>
                  <div className={styles.row_two_columns}>
                    <div className={styles.column}>Sub Total</div>
                    <div className={styles.column}>${subTotal}</div>
                  </div>
                  <div className={styles.row_two_columns}>
                    <div className={styles.column}>Fee and Delivery</div>
                    <div className={styles.column}>${fee <= 0 ? " - " : fee}</div>
                  </div>
                  <div className={styles.row_two_columns}>
                    <div className={styles.column}>Total Price</div>
                    <div className={styles.column}>${total <= 0 ? " - " : total}</div>
                  </div>
                </div>
              </div>
    )
}

export default PaymentSummaryCard;