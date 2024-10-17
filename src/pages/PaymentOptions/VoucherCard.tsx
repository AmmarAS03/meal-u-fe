import { IonCard, IonCardContent, IonLabel, IonSelect, IonSelectOption, IonToggle } from '@ionic/react';
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useUserProfile } from '../../api/userApi';

interface VoucherCardProps {
  useVoucher: boolean;
  setUseVoucher: Dispatch<SetStateAction<boolean>>;
}

const VoucherCard: React.FC<VoucherCardProps> = ({useVoucher, setUseVoucher}) => {
  const { data: user } = useUserProfile();
  const [userHasVoucher, setUserHasVoucher] = useState(false);

  useMemo(() => {
    const checkUserVoucher = () => {
      if (user) {
        if (parseFloat(user.voucher_credits) > 0) {
          setUserHasVoucher(true);
        } else {
          setUserHasVoucher(false);
        }
      }
    };

    checkUserVoucher();
  }, [user, user?.voucher_credits]);

  const handleToggle = (e: boolean) => {
    setUseVoucher(e);
  }

  return (
    <>
    <h2 className="text-2xl font-bold text-[#000000] mb-4 px-4">Vouchers</h2>
    <IonCard className="bg-white rounded-2xl shadow-md mb-3">
      <IonCardContent>
        {userHasVoucher ? (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-center">
              You have {user?.voucher_credits} voucher credits. Would you like to use them?
            </p>
            <IonToggle
              color="tertiary"
              justify="space-between"
              onIonChange={(e) => handleToggle(e.detail.checked)}
            >
              Use Voucher
            </IonToggle>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <p>You don't have any voucher credits.</p>
          </div>
        )}
      </IonCardContent>
    </IonCard>
  </>
  )
}

export default VoucherCard;