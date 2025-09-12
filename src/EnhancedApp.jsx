import React, { useState } from "react";
import { EnhancedWeekendProvider } from "./context/EnhancedWeekendContext.jsx";
import { useEnhancedWeekend } from "./context/enhancedWeekendContext.js";
import Layout from "./components/layout/Layout.jsx";
import Header from "./components/layout/Header.jsx";
import ActivityBrowser from "./components/features/ActivityBrowser.jsx";
import ScheduleView from "./components/features/ScheduleView.jsx";
import DaySelector from "./components/features/DaySelector.jsx";
import QuickAddModal from "./components/features/QuickAddModal.jsx";
import WeekendMoodTracker from "./components/features/WeekendMoodTracker.jsx";
import WeatherIntegration from "./components/features/WeatherIntegration.jsx";
import HolidayBanner from "./components/features/HolidayBanner.jsx";
import WeekendTypeSelector from "./components/features/WeekendTypeSelector.jsx";
import { WEEKEND_TYPES } from "./constants/weekendConstants.js";
import "./App.css";

// Enhanced app content component
const EnhancedAppContent = () => {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showDaySelector, setShowDaySelector] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [highlightBrowser, setHighlightBrowser] = useState(false);

  const { actions, weekendType, activeDays, upcomingHolidays } =
    useEnhancedWeekend();

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
    setShowQuickAdd(true);
    setHighlightBrowser(true);
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
    console.log("Current mood:", moodId);
  };

  const handleWeekendTypeChange = (type, customDays = null) => {
    actions.setWeekendType(type, customDays);
  };

  const handlePlanWeekend = (longWeekend) => {
    // Auto-configure for the long weekend
    const duration = longWeekend.duration;

    let weekendType = WEEKEND_TYPES.REGULAR;
    if (duration === 3) weekendType = WEEKEND_TYPES.LONG;
    else if (duration >= 4) weekendType = WEEKEND_TYPES.EXTENDED;

    actions.setWeekendType(weekendType);

    // You could also auto-add suggested activities here
    console.log(
      `Planning ${duration}-day weekend for ${longWeekend.triggerHoliday.name}`
    );
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
        {/* Holiday Banner for upcoming long weekends */}
        <HolidayBanner
          upcomingHolidays={upcomingHolidays}
          onPlanWeekend={handlePlanWeekend}
        />

        {/* Weekend Type Selector */}
        <WeekendTypeSelector
          currentType={weekendType}
          activeDays={activeDays}
          onTypeChange={handleWeekendTypeChange}
        />

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

// Enhanced App component
function EnhancedApp() {
  return (
    <EnhancedWeekendProvider>
      <EnhancedAppContent />
    </EnhancedWeekendProvider>
  );
}

export default EnhancedApp;
