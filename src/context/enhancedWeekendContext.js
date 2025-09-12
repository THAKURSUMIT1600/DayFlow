import { createContext, useContext } from "react";

// Create context
export const EnhancedWeekendContext = createContext();

// Custom hook
export const useEnhancedWeekend = () => {
  const context = useContext(EnhancedWeekendContext);
  if (!context) {
    throw new Error(
      "useEnhancedWeekend must be used within an EnhancedWeekendProvider"
    );
  }
  return context;
};
