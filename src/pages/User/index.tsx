import { useState, useEffect } from "react";
import UserMobile from "./UserMobile/UserMobile";
import UserWeb from "./UserWeb/UserWeb";

function User() {
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
    return <UserMobile />;
  }

  return <UserWeb />;
}

export default User;
