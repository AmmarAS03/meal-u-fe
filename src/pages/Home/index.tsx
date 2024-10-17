import { useState, useEffect } from "react";
import HomeMobile from "./HomeMobile/HomeMobile";
import HomeWeb from "./HomeWeb/HomeWeb";

function Home() {
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
    return <HomeMobile />;
  }

  return <HomeWeb />;
}

export default Home;