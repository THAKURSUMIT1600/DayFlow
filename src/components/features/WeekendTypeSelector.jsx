import React, { useState } from "react";
import { Calendar, Clock, ChevronDown, CheckCircle } from "lucide-react";
import { WEEKEND_TYPES } from "../../constants/weekendConstants.js";
import "./WeekendTypeSelector.css";

const WeekendTypeSelector = ({
  currentType = WEEKEND_TYPES.REGULAR,
  activeDays = [],
  onTypeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customDays, setCustomDays] = useState(
    currentType === WEEKEND_TYPES.CUSTOM ? activeDays : []
  );

  const weekendTypeOptions = [
    {
      type: WEEKEND_TYPES.REGULAR,
      label: "2-Day Weekend",
      description: "Saturday & Sunday",
      days: ["saturday", "sunday"],
      icon: "📅",
      duration: "2 days",
    },
    {
      type: WEEKEND_TYPES.LONG,
      label: "3-Day Weekend",
      description: "Friday, Saturday & Sunday",
      days: ["friday", "saturday", "sunday"],
      icon: "🌟",
      duration: "3 days",
    },
    {
      type: WEEKEND_TYPES.EXTENDED,
      label: "4-Day Weekend",
      description: "Friday to Monday",
      days: ["friday", "saturday", "sunday", "monday"],
      icon: "🎉",
      duration: "4 days",
    },
    {
      type: WEEKEND_TYPES.CUSTOM,
      label: "Custom Weekend",
      description: "Choose your own days",
      days: [],
      icon: "⚙️",
      duration: "flexible",
    },
  ];

  const dayNames = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  };

  const allDays = Object.keys(dayNames);

  const getCurrentOption = () => {
    return (
      weekendTypeOptions.find((option) => option.type === currentType) ||
      weekendTypeOptions[0]
    );
  };

  const handleTypeSelect = (option) => {
    if (option.type === WEEKEND_TYPES.CUSTOM) {
      // Initialize custom days with current active days if switching to custom
      if (currentType !== WEEKEND_TYPES.CUSTOM) {
        setCustomDays(
          activeDays.length > 0 ? activeDays : ["saturday", "sunday"]
        );
      }
      // Don't close dropdown for custom selection
    } else {
      onTypeChange(option.type);
      setIsOpen(false);
    }
  };

  const handleCustomDayToggle = (day) => {
    const newCustomDays = customDays.includes(day)
      ? customDays.filter((d) => d !== day)
      : [...customDays, day];

    setCustomDays(newCustomDays);
  };

  const applyCustomDays = () => {
    if (customDays.length === 0) {
      alert("Please select at least one day for your custom weekend.");
      return;
    }

    onTypeChange(WEEKEND_TYPES.CUSTOM, customDays);
    setIsOpen(false);
  };

  const formatActiveDays = (days) => {
    if (!days || days.length === 0) return "No days selected";

    if (days.length === 1) {
      return dayNames[days[0]];
    } else if (days.length === 2) {
      return `${dayNames[days[0]]} & ${dayNames[days[1]]}`;
    } else {
      const lastDay = days[days.length - 1];
      const otherDays = days.slice(0, -1);
      return `${otherDays.map((day) => dayNames[day]).join(", ")} & ${
        dayNames[lastDay]
      }`;
    }
  };

  const currentOption = getCurrentOption();

  return (
    <div className="weekend-type-selector">
      <div className="selector-header">
        <h3 className="selector-title">
          <Calendar className="selector-icon" />
          Weekend Duration
        </h3>
        <p className="selector-description">
          Choose how many days you want to plan for your weekend
        </p>
      </div>

      <div className={`dropdown ${isOpen ? "open" : ""}`}>
        <button className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
          <div className="trigger-content">
            <span className="type-icon">{currentOption.icon}</span>
            <div className="type-info">
              <span className="type-label">{currentOption.label}</span>
              <span className="type-description">
                {currentType === WEEKEND_TYPES.CUSTOM
                  ? formatActiveDays(activeDays)
                  : currentOption.description}
              </span>
            </div>
            <div className="type-duration">
              <Clock className="duration-icon" />
              <span className="duration-text">
                {currentType === WEEKEND_TYPES.CUSTOM
                  ? `${activeDays.length} day${
                      activeDays.length !== 1 ? "s" : ""
                    }`
                  : currentOption.duration}
              </span>
            </div>
          </div>
          <ChevronDown
            className={`dropdown-arrow ${isOpen ? "rotated" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            {weekendTypeOptions.map((option) => (
              <div key={option.type} className="dropdown-section">
                <button
                  className={`dropdown-option ${
                    currentType === option.type ? "selected" : ""
                  }`}
                  onClick={() => handleTypeSelect(option)}
                >
                  <span className="option-icon">{option.icon}</span>
                  <div className="option-info">
                    <span className="option-label">{option.label}</span>
                    <span className="option-description">
                      {option.description}
                    </span>
                  </div>
                  <div className="option-duration">
                    <span className="duration-badge">{option.duration}</span>
                  </div>
                  {currentType === option.type && (
                    <CheckCircle className="selected-icon" />
                  )}
                </button>

                {option.type === WEEKEND_TYPES.CUSTOM && isOpen && (
                  <div className="custom-days-selector">
                    <p className="custom-days-title">
                      Select your weekend days:
                    </p>
                    <div className="days-grid">
                      {allDays.map((day) => (
                        <button
                          key={day}
                          className={`day-button ${
                            customDays.includes(day) ? "selected" : ""
                          }`}
                          onClick={() => handleCustomDayToggle(day)}
                        >
                          <span className="day-name">{dayNames[day]}</span>
                          <span className="day-short">
                            {day.substring(0, 3).toUpperCase()}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="custom-actions">
                      <button
                        className="apply-custom-btn"
                        onClick={applyCustomDays}
                        disabled={customDays.length === 0}
                      >
                        Apply Custom Weekend ({customDays.length} day
                        {customDays.length !== 1 ? "s" : ""})
                      </button>
                      <button
                        className="cancel-custom-btn"
                        onClick={() => setIsOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="current-schedule-info">
        <div className="schedule-summary">
          <h4 className="summary-title">Current Weekend Schedule</h4>
          <div className="active-days-list">
            {activeDays.map((day, index) => (
              <span key={day} className="active-day">
                {dayNames[day]}
                {index < activeDays.length - 1 && (
                  <span className="day-separator">•</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekendTypeSelector;
