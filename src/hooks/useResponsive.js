import { useEffect, useState } from "react";

function useResponsive() {
  const [mobile, setMobile] = useState(
    window.innerWidth < 900
  );

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 900);
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  return mobile;
}

export default useResponsive;