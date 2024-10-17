import { useState, useEffect } from "react";
import CommunityMobile from "./CommunityMobile/CommunityMobile";
import CommunityWeb from "./CommunityWeb/CommunityWeb";

function Community() {
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
    return <CommunityMobile />;
  }

  return <CommunityWeb />;
}

export default Community;
