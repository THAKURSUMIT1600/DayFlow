// Custom hook to use weekend context (with enhanced context compatibility)
import { useContext } from "react";
import { WeekendContext } from "../context/WeekendContext.jsx";
import { EnhancedWeekendContext } from "../context/enhancedWeekendContext.js";

export const useWeekend = () => {
  // Always call both hooks to maintain hook order consistency
  const enhancedContext = useContext(EnhancedWeekendContext);
  const originalContext = useContext(WeekendContext);

  // Prefer enhanced context if available
  if (enhancedContext) {
    return enhancedContext;
  }

  // Fallback to original context
  if (originalContext) {
    return originalContext;
  }

  throw new Error(
    "useWeekend must be used within a WeekendProvider or EnhancedWeekendProvider"
  );
};
