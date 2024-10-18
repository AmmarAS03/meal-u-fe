import { useEffect, useState } from 'react';
import MyCartMobile from './MyCart-Mobile';
import MyCartWebsite from './MyCart-Website';

function MyCart() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 576);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (isMobile) {
    return <MyCartMobile />;
  }

  return <MyCartWebsite />;
}
  
export default MyCart;