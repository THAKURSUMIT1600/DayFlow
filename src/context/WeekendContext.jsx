import React, { createContext, useReducer, useEffect } from "react";
import { DEFAULT_ACTIVITIES } from "../data/activities.js";

// Action types
const ActionTypes = {
  ADD_TO_SCHEDULE: "ADD_TO_SCHEDULE",
  REMOVE_FROM_SCHEDULE: "REMOVE_FROM_SCHEDULE",
  UPDATE_SCHEDULE_ITEM: "UPDATE_SCHEDULE_ITEM",
  REORDER_SCHEDULE: "REORDER_SCHEDULE",
  CLEAR_SCHEDULE: "CLEAR_SCHEDULE",
  SET_FILTER: "SET_FILTER",
  SET_SEARCH: "SET_SEARCH",
  LOAD_SCHEDULE: "LOAD_SCHEDULE",
};

// Storage key
const STORAGE_KEY = "weekendly-schedule";

// Initial state
const initialState = {
  activities: DEFAULT_ACTIVITIES,
  schedule: {
    saturday: [],
    sunday: [],
  },
  filters: {
    category: null,
    mood: null,
  },
  searchTerm: "",
};

// Reducer function
function weekendReducer(state, action) {
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
      };

      return {
        ...state,
        schedule: {
          ...state.schedule,
          [day]: [...state.schedule[day], newScheduleItem],
        },
      };
    }

    case ActionTypes.REMOVE_FROM_SCHEDULE: {
      const { itemId, day } = action.payload;
      return {
        ...state,
        schedule: {
          ...state.schedule,
          [day]: state.schedule[day].filter((item) => item.id !== itemId),
        },
      };
    }

    case ActionTypes.UPDATE_SCHEDULE_ITEM: {
      const { itemId, day, updates } = action.payload;
      return {
        ...state,
        schedule: {
          ...state.schedule,
          [day]: state.schedule[day].map((item) =>
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
        return {
          ...state,
          schedule: {
            saturday: [],
            sunday: [],
          },
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
        schedule: action.payload,
      };
    }

    default:
      return state;
  }
}

// Create context
export const WeekendContext = createContext();

// Simple storage utilities
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

const exportData = () => {
  try {
    const data = loadFromStorage();
    if (data) {
      const exportObj = {
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        schedule: data,
      };
      return JSON.stringify(exportObj, null, 2);
    }
    return null;
  } catch (error) {
    console.error("Error exporting data:", error);
    return null;
  }
};

const importData = (jsonString) => {
  try {
    const importedData = JSON.parse(jsonString);

    // Validate the imported data structure
    if (!importedData.schedule) {
      throw new Error("Invalid backup format: missing schedule data");
    }

    // Validate schedule structure
    const schedule = importedData.schedule;
    if (
      !schedule.saturday ||
      !schedule.sunday ||
      !Array.isArray(schedule.saturday) ||
      !Array.isArray(schedule.sunday)
    ) {
      throw new Error("Invalid backup format: invalid schedule structure");
    }

    // Save the imported schedule to localStorage
    saveToStorage(schedule);
    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
};

// Provider component
export const WeekendProvider = ({ children }) => {
  const [state, dispatch] = useReducer(weekendReducer, initialState);

  // Load schedule from localStorage on mount
  useEffect(() => {
    const savedSchedule = loadFromStorage();
    if (savedSchedule) {
      console.log("Loading schedule from localStorage:", savedSchedule);
      dispatch({ type: ActionTypes.LOAD_SCHEDULE, payload: savedSchedule });
    }
  }, []);

  // Save schedule to localStorage whenever it changes
  useEffect(() => {
    // Only save if there are activities in the schedule
    if (
      state.schedule.saturday.length > 0 ||
      state.schedule.sunday.length > 0
    ) {
      console.log("Saving schedule to localStorage:", state.schedule);
      saveToStorage(state.schedule);
    }
  }, [state.schedule]);

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
      // Also clear from localStorage when clearing schedule
      if (!day) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        const currentSchedule = { ...state.schedule, [day]: [] };
        if (
          currentSchedule.saturday.length === 0 &&
          currentSchedule.sunday.length === 0
        ) {
          localStorage.removeItem(STORAGE_KEY);
        } else {
          saveToStorage(currentSchedule);
        }
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

    // Export data functionality
    exportData: () => {
      return exportData();
    },

    // Import data functionality
    importData: (jsonString) => {
      const success = importData(jsonString);
      if (success) {
        // Reload data from localStorage after successful import
        const importedSchedule = loadFromStorage();
        if (importedSchedule) {
          dispatch({
            type: ActionTypes.LOAD_SCHEDULE,
            payload: importedSchedule,
          });
        }
      }
      return success;
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
  };

  return (
    <WeekendContext.Provider value={value}>{children}</WeekendContext.Provider>
  );
};
