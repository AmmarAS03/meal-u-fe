import React, { useState, useEffect } from "react";
import CategoryMobile from "./categoryMobile/CategoryMobile";
import CategoryWeb from "./categoryWeb/CategoryWeb";

function Category() {
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
    return <CategoryMobile />;
  }

  return <CategoryWeb />;
}

export default Category;