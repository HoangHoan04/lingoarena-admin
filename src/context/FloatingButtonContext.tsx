import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface FloatingButton {
  id: string;
  priority: number;
  visible: boolean;
}

interface FloatingButtonContextType {
  registerButton: (id: string, priority: number) => void;
  unregisterButton: (id: string) => void;
  setButtonVisibility: (id: string, visible: boolean) => void;
  getButtonPosition: (id: string) => number;
}

const FloatingButtonContext = createContext<
  FloatingButtonContextType | undefined
>(undefined);

export const FloatingButtonProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [buttons, setButtons] = useState<Map<string, FloatingButton>>(
    new Map()
  );

  const registerButton = useCallback((id: string, priority: number) => {
    setButtons((prev) => {
      const newMap = new Map(prev);
      if (!newMap.has(id)) {
        newMap.set(id, { id, priority, visible: true });
      }
      return newMap;
    });
  }, []);

  const unregisterButton = useCallback((id: string) => {
    setButtons((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const setButtonVisibility = useCallback((id: string, visible: boolean) => {
    setButtons((prev) => {
      const newMap = new Map(prev);
      const button = newMap.get(id);
      if (button && button.visible !== visible) {
        newMap.set(id, { ...button, visible });
        return newMap;
      }
      return prev;
    });
  }, []);

  const getButtonPosition = useCallback(
    (id: string): number => {
      const BASE_BOTTOM = 20;
      const BUTTON_HEIGHT = 55;
      const BUTTON_GAP = 15;

      const visibleButtons = Array.from(buttons.values())
        .filter((btn) => btn.visible)
        .sort((a, b) => a.priority - b.priority);

      const index = visibleButtons.findIndex((btn) => btn.id === id);

      if (index === -1) return BASE_BOTTOM;

      return BASE_BOTTOM + (BUTTON_HEIGHT + BUTTON_GAP) * index;
    },
    [buttons]
  );

  const value = useMemo(
    () => ({
      registerButton,
      unregisterButton,
      setButtonVisibility,
      getButtonPosition,
    }),
    [registerButton, unregisterButton, setButtonVisibility, getButtonPosition]
  );

  return (
    <FloatingButtonContext.Provider value={value}>
      {children}
    </FloatingButtonContext.Provider>
  );
};

export const useFloatingButton = (id: string, priority: number) => {
  const context = useContext(FloatingButtonContext);

  if (!context) {
    throw new Error(
      "useFloatingButton must be used within FloatingButtonProvider"
    );
  }

  const {
    registerButton,
    unregisterButton,
    getButtonPosition,
    setButtonVisibility,
  } = context;

  useEffect(() => {
    registerButton(id, priority);
    return () => {
      unregisterButton(id);
    };
  }, [id, priority, registerButton, unregisterButton]);

  const position = getButtonPosition(id);
  const setVisible = useCallback(
    (visible: boolean) => {
      setButtonVisibility(id, visible);
    },
    [id, setButtonVisibility]
  );

  return {
    position,
    setVisible,
  };
};
