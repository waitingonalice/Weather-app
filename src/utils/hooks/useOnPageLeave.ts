import { useEffect } from "react";

/** Custom hook to detect and execute a callback function when user leaves the page */
export const useOnPageLeave = (callback: () => void) => {
  useEffect(() => {
    return () => {
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") callback();
      });
    };
  });
};
