import React, { useReducer, useEffect } from "react";
import { DEFAULT_ACTIVITIES } from "../data/activities.js";
import holidayService from "../services/holidayService.js";
import {
  WEEKEND_TYPES,
  getDefaultDays,
  ActionTypes,
  STORAGE_KEY,
} from "../constants/weekendConstants.js";
import { EnhancedWeekendContext } from "./enhancedWeekendContext.js";

// Initial state
const getInitialState = () => {
  const defaultDays = getDefaultDays(WEEKEND_TYPES.REGULAR);
  const schedule = {};
  defaultDays.forEach((day) => {
    schedule[day] = [];
  });

  return {
    activities: DEFAULT_ACTIVITIES,
    schedule,
    weekendType: WEEKEND_TYPES.REGULAR,
    activeDays: defaultDays,
    filters: {
      category: null,
      mood: null,
    },
    searchTerm: "",
    upcomingHolidays: [],
    location: "Delhi",
    userPreferences: {
      interests: [],
      budget: "medium",
      groupSize: 2,
    },
  };
};

// Reducer function
function enhancedWeekendReducer(state, action) {
  switch (action.type) {
    case ActionTypes.ADD_TO_SCHEDULE: {
      const { activity, day, timeSlot, additionalData = {} } = action.payload;
      const newScheduleItem = {
        ...activity,
        id: `${activity.id}-${Date.now()}`,
        originalId: activity.id,
        day,
        timeSlot,
        startTime: additionalData.startTime || null,
        endTime: additionalData.endTime || null,
        customNotes: additionalData.customNotes || "",
        suggestedLocation: additionalData.suggestedLocation || null,
      };

      return {
        ...state,
        schedule: {
          ...state.schedule,
          [day]: [...(state.schedule[day] || []), newScheduleItem],
        },
      };
    }

    case ActionTypes.REMOVE_FROM_SCHEDULE: {
      const { itemId, day } = action.payload;
      return {
        ...state,
        schedule: {
          ...state.schedule,
          [day]: (state.schedule[day] || []).filter(
            (item) => item.id !== itemId
          ),
        },
      };
    }

    case ActionTypes.UPDATE_SCHEDULE_ITEM: {
      const { itemId, day, updates } = action.payload;
      return {
        ...state,
        schedule: {
          ...state.schedule,
          [day]: (state.schedule[day] || []).map((item) =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
        },
      };
    }

    case ActionTypes.REORDER_SCHEDULE: {
      const { day, newOrder } = action.payload;
      return {
        ...state,
        schedule: {
          ...state.schedule,
          [day]: newOrder,
        },
      };
    }

    case ActionTypes.CLEAR_SCHEDULE: {
      const { day } = action.payload;
      if (day) {
        return {
          ...state,
          schedule: {
            ...state.schedule,
            [day]: [],
          },
        };
      } else {
        const clearedSchedule = {};
        state.activeDays.forEach((activeDay) => {
          clearedSchedule[activeDay] = [];
        });
        return {
          ...state,
          schedule: clearedSchedule,
        };
      }
    }

    case ActionTypes.SET_FILTER: {
      const { filterType, value } = action.payload;
      return {
        ...state,
        filters: {
          ...state.filters,
          [filterType]: value,
        },
      };
    }

    case ActionTypes.SET_SEARCH: {
      return {
        ...state,
        searchTerm: action.payload,
      };
    }

    case ActionTypes.LOAD_SCHEDULE: {
      return {
        ...state,
        ...action.payload,
      };
    }

    case ActionTypes.SET_WEEKEND_TYPE: {
      const { weekendType, customDays } = action.payload;
      const activeDays = customDays || getDefaultDays(weekendType);

      // Create new schedule with active days, preserving existing data where possible
      const newSchedule = {};
      activeDays.forEach((day) => {
        newSchedule[day] = state.schedule[day] || [];
      });

      return {
        ...state,
        weekendType,
        activeDays,
        schedule: newSchedule,
      };
    }

    case ActionTypes.SET_SMART_SUGGESTIONS: {
      return {
        ...state,
        smartSuggestions: action.payload,
      };
    }

    case ActionTypes.SET_UPCOMING_HOLIDAYS: {
      return {
        ...state,
        upcomingHolidays: action.payload,
      };
    }

    case ActionTypes.SET_LOCATION: {
      return {
        ...state,
        location: action.payload,
      };
    }

    default:
      return state;
  }
}

// Create context

// Storage utilities
const saveToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return null;
  }
};

// Provider component
export const EnhancedWeekendProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    enhancedWeekendReducer,
    getInitialState()
  );

  // Load schedule from localStorage on mount
  useEffect(() => {
    const savedData = loadFromStorage();
    if (savedData) {
      console.log("Loading enhanced schedule from localStorage:", savedData);
      dispatch({ type: ActionTypes.LOAD_SCHEDULE, payload: savedData });
    }
  }, []);

  // Load upcoming holidays on mount
  useEffect(() => {
    const loadHolidays = async () => {
      try {
        const holidays =
          holidayService.getUpcomingLongWeekendsWithSuggestions(5);
        dispatch({
          type: ActionTypes.SET_UPCOMING_HOLIDAYS,
          payload: holidays,
        });
      } catch (error) {
        console.error("Error loading holidays:", error);
      }
    };

    loadHolidays();
  }, []);

  // Save schedule to localStorage whenever it changes
  useEffect(() => {
    const hasActivities = state.activeDays.some(
      (day) => state.schedule[day] && state.schedule[day].length > 0
    );

    if (hasActivities) {
      console.log("Saving enhanced schedule to localStorage:", state);
      saveToStorage({
        schedule: state.schedule,
        weekendType: state.weekendType,
        activeDays: state.activeDays,
        location: state.location,
        userPreferences: state.userPreferences,
      });
    }
  }, [state]);

  // Action creators
  const actions = {
    addToSchedule: (activity, day, timeSlot, additionalData = {}) => {
      dispatch({
        type: ActionTypes.ADD_TO_SCHEDULE,
        payload: { activity, day, timeSlot, additionalData },
      });
    },

    removeFromSchedule: (itemId, day) => {
      dispatch({
        type: ActionTypes.REMOVE_FROM_SCHEDULE,
        payload: { itemId, day },
      });
    },

    updateScheduleItem: (itemId, day, updates) => {
      dispatch({
        type: ActionTypes.UPDATE_SCHEDULE_ITEM,
        payload: { itemId, day, updates },
      });
    },

    reorderSchedule: (day, newOrder) => {
      dispatch({
        type: ActionTypes.REORDER_SCHEDULE,
        payload: { day, newOrder },
      });
    },

    clearSchedule: (day = null) => {
      dispatch({
        type: ActionTypes.CLEAR_SCHEDULE,
        payload: { day },
      });

      if (!day) {
        localStorage.removeItem(STORAGE_KEY);
      }
    },

    setFilter: (filterType, value) => {
      dispatch({
        type: ActionTypes.SET_FILTER,
        payload: { filterType, value },
      });
    },

    setSearch: (searchTerm) => {
      dispatch({
        type: ActionTypes.SET_SEARCH,
        payload: searchTerm,
      });
    },

    setWeekendType: (weekendType, customDays = null) => {
      dispatch({
        type: ActionTypes.SET_WEEKEND_TYPE,
        payload: { weekendType, customDays },
      });
    },

    setLocation: (location) => {
      dispatch({
        type: ActionTypes.SET_LOCATION,
        payload: location,
      });
    },

    // Holiday utilities
    checkForLongWeekends: () => {
      return holidayService.getUpcomingLongWeekendsWithSuggestions(3);
    },

    // Export/Import functionality
    exportData: () => {
      const exportObj = {
        version: "2.0.0",
        timestamp: new Date().toISOString(),
        schedule: state.schedule,
        weekendType: state.weekendType,
        activeDays: state.activeDays,
        location: state.location,
        userPreferences: state.userPreferences,
      };
      return JSON.stringify(exportObj, null, 2);
    },

    importData: (jsonString) => {
      try {
        const importedData = JSON.parse(jsonString);

        if (!importedData.schedule) {
          throw new Error("Invalid backup format: missing schedule data");
        }

        saveToStorage(importedData);
        dispatch({ type: ActionTypes.LOAD_SCHEDULE, payload: importedData });
        return true;
      } catch (error) {
        console.error("Error importing data:", error);
        return false;
      }
    },
  };

  // Computed values
  const filteredActivities = state.activities.filter((activity) => {
    const matchesSearch =
      activity.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      activity.description
        .toLowerCase()
        .includes(state.searchTerm.toLowerCase());

    const matchesCategory =
      !state.filters.category || activity.category === state.filters.category;
    const matchesMood =
      !state.filters.mood || activity.mood === state.filters.mood;

    return matchesSearch && matchesCategory && matchesMood;
  });

  const value = {
    ...state,
    filteredActivities,
    actions,
    // Utility methods
    isLongWeekend: state.activeDays.length >= 3,
    weekendDuration: state.activeDays.length,
    nextHoliday: holidayService.getNextHoliday(),
  };

  return (
    <EnhancedWeekendContext.Provider value={value}>
      {children}
    </EnhancedWeekendContext.Provider>
  );
};
