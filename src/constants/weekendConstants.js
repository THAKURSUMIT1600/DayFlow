// Weekend types and constants
export const WEEKEND_TYPES = {
  REGULAR: "regular", // Saturday-Sunday
  LONG: "long", // Friday-Sunday
  EXTENDED: "extended", // Thursday-Sunday or Friday-Monday
  CUSTOM: "custom", // User-defined days
};

// Get default weekend days based on type
export const getDefaultDays = (type) => {
  switch (type) {
    case WEEKEND_TYPES.REGULAR:
      return ["saturday", "sunday"];
    case WEEKEND_TYPES.LONG:
      return ["friday", "saturday", "sunday"];
    case WEEKEND_TYPES.EXTENDED:
      return ["friday", "saturday", "sunday", "monday"];
    default:
      return ["saturday", "sunday"];
  }
};

// Action types
export const ActionTypes = {
  ADD_TO_SCHEDULE: "ADD_TO_SCHEDULE",
  REMOVE_FROM_SCHEDULE: "REMOVE_FROM_SCHEDULE",
  UPDATE_SCHEDULE_ITEM: "UPDATE_SCHEDULE_ITEM",
  REORDER_SCHEDULE: "REORDER_SCHEDULE",
  CLEAR_SCHEDULE: "CLEAR_SCHEDULE",
  SET_FILTER: "SET_FILTER",
  SET_SEARCH: "SET_SEARCH",
  LOAD_SCHEDULE: "LOAD_SCHEDULE",
  SET_WEEKEND_TYPE: "SET_WEEKEND_TYPE",
  SET_SMART_SUGGESTIONS: "SET_SMART_SUGGESTIONS",
  SET_UPCOMING_HOLIDAYS: "SET_UPCOMING_HOLIDAYS",
  SET_LOCATION: "SET_LOCATION",
};

// Storage key
export const STORAGE_KEY = "weekendly-enhanced-schedule";
