import React, { useState } from "react";
import { WeekendProvider } from "./context/WeekendContext.jsx";
import Layout from "./components/layout/Layout.jsx";
import Header from "./components/layout/Header.jsx";
import ActivityBrowser from "./components/features/ActivityBrowser.jsx";
import ScheduleView from "./components/features/ScheduleView.jsx";
import DaySelector from "./components/features/DaySelector.jsx";
import QuickAddModal from "./components/features/QuickAddModal.jsx";
import WeekendMoodTracker from "./components/features/WeekendMoodTracker.jsx";
import WeatherIntegration from "./components/features/WeatherIntegration.jsx";
import { useWeekend } from "./hooks/useWeekend.js";
import "./App.css";

// Main app content component
const AppContent = () => {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showDaySelector, setShowDaySelector] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [highlightBrowser, setHighlightBrowser] = useState(false);
  const { actions } = useWeekend();

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    setShowDaySelector(true);
  };

  const handleDaySelectorClose = () => {
    setShowDaySelector(false);
    setSelectedActivity(null);
  };

  const handleDaySelectorConfirm = (
    activity,
    day,
    timeSlot,
    additionalData = {}
  ) => {
    actions.addToSchedule(activity, day, timeSlot, additionalData);
    setShowDaySelector(false);
    setSelectedActivity(null);
  };

  const handleAddActivityClick = () => {
    // Show the quick add modal for faster activity selection
    setShowQuickAdd(true);

    // Also highlight the activity browser as a secondary option
    setHighlightBrowser(true);

    // Clear highlight after 3 seconds
    setTimeout(() => {
      setHighlightBrowser(false);
    }, 3000);
  };

  const handleQuickAddClose = () => {
    setShowQuickAdd(false);
  };

  const handleQuickAddSelect = (activity) => {
    setSelectedActivity(activity);
    setShowDaySelector(true);
  };

  const handleMoodChange = (moodId) => {
    // You could filter activities based on mood here
    console.log("Current mood:", moodId);
  };

  return (
    <>
      <Layout
        header={<Header />}
        sidebar={
          <ActivityBrowser
            onActivitySelect={handleActivitySelect}
            highlight={highlightBrowser}
          />
        }
      >
        {/* Weekend Mood Tracker */}
        <WeekendMoodTracker onMoodChange={handleMoodChange} />

        {/* Weather Integration */}
        <WeatherIntegration />

        {/* Main Schedule View */}
        <ScheduleView onAddActivity={handleAddActivityClick} />
      </Layout>

      <DaySelector
        activity={selectedActivity}
        isOpen={showDaySelector}
        onClose={handleDaySelectorClose}
        onConfirm={handleDaySelectorConfirm}
      />

      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={handleQuickAddClose}
        onActivitySelect={handleQuickAddSelect}
      />
    </>
  );
};

// Main App component
function App() {
  return (
    <WeekendProvider>
      <AppContent />
    </WeekendProvider>
  );
}

export default App;
