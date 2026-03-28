import { useFloatingButton } from "@/context/FloatingButtonContext";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const { position, setVisible } = useFloatingButton("back-to-top", 1);

  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible, setVisible]);

  useEffect(() => {
    const findScrollElement = () => {
      const baseViewScroll = document.querySelector(
        ".base-view .overflow-y-auto"
      );
      if (baseViewScroll) return baseViewScroll;
      const tabPanels = document.querySelector(
        ".base-view-tabs .p-tabview-panels"
      );
      if (tabPanels) return tabPanels;

      return null;
    };

    const toggleVisibility = () => {
      const scrollElement = findScrollElement();
      if (scrollElement && scrollElement.scrollTop > 0) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    let retryCount = 0;
    const maxRetries = 5;
    let scrollElement: Element | null = null;

    const attachListener = () => {
      scrollElement = findScrollElement();

      if (scrollElement) {
        scrollElement.addEventListener("scroll", toggleVisibility);
        toggleVisibility();
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(attachListener, 100);
      }
    };

    const timer = setTimeout(attachListener, 50);

    return () => {
      clearTimeout(timer);
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", toggleVisibility);
      }
    };
  }, [location.pathname]);

  const scrollToTop = () => {
    const scrollElement =
      document.querySelector(".base-view .overflow-y-auto") ||
      document.querySelector(".base-view-tabs .p-tabview-panels");
    if (scrollElement) {
      scrollElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed right-6 z-50 w-14 h-14 p-3.5 flex justify-center items-center rounded-full bg-blue-400 hover:bg-blue-500 text-white shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Back to top"
          style={{ bottom: `${position}px` }}
        >
          <i
            className="pi pi-arrow-up"
            style={{ fontSize: 18, fontWeight: 800 }}
          ></i>
        </button>
      )}
    </>
  );
};

export default BackToTop;
