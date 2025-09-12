import React, { useState } from "react";
import { X, Calendar, Clock, FileText } from "lucide-react";
import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import { TIME_SLOTS } from "../../data/activities.js";
import { useWeekend } from "../../hooks/useWeekend.js";
import "./DaySelector.css";

const DaySelector = ({ activity, isOpen, onClose, onConfirm }) => {
  const { activeDays = ["saturday", "sunday"] } = useWeekend();
  const [selectedDay, setSelectedDay] = useState(activeDays[0] || "saturday");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    activity?.preferredTimeSlot || TIME_SLOTS.MORNING
  );
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [customNotes, setCustomNotes] = useState("");
  const [timeError, setTimeError] = useState("");

  // Validation function for times
  const validateTimes = (start, end) => {
    if (!start && !end) {
      setTimeError("");
      return true; // Both empty is valid (optional)
    }

    if (start && !end) {
      setTimeError("Please provide an end time");
      return false;
    }

    if (!start && end) {
      setTimeError("Please provide a start time");
      return false;
    }

    if (start && end) {
      const startDate = new Date(`2000-01-01T${start}`);
      const endDate = new Date(`2000-01-01T${end}`);

      if (endDate <= startDate) {
        setTimeError("End time must be after start time");
        return false;
      }
    }

    setTimeError("");
    return true;
  };

  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    validateTimes(newStartTime, endTime);
  };

  const handleEndTimeChange = (e) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);
    validateTimes(startTime, newEndTime);
  };

  if (!isOpen || !activity) return null;

  const handleConfirm = () => {
    // Validate times before confirming
    if (!validateTimes(startTime, endTime)) {
      return; // Don't proceed if validation fails
    }

    onConfirm(activity, selectedDay, selectedTimeSlot, {
      startTime,
      endTime,
      customNotes,
    });
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="day-selector-overlay" onClick={handleOverlayClick}>
      <div className="day-selector-modal">
        <Card className="day-selector-card" padding="large">
          <div className="day-selector__header">
            <h3 className="day-selector__title">Add to Schedule</h3>
            <Button
              variant="ghost"
              size="small"
              onClick={onClose}
              className="day-selector__close-button"
            >
              <X size={20} />
            </Button>
          </div>

          <div className="day-selector__activity">
            <div className="day-selector__activity-icon">{activity.icon}</div>
            <div className="day-selector__activity-info">
              <h4 className="day-selector__activity-name">{activity.name}</h4>
              <p className="day-selector__activity-description">
                {activity.description}
              </p>
              <div className="day-selector__activity-meta"></div>
            </div>
          </div>

          <div className="day-selector__options">
            <div className="day-selector__section">
              <h4 className="day-selector__section-title">
                <Calendar size={16} />
                Choose Day
              </h4>
              <div className="day-selector__day-options">
                {activeDays.map((day, index) => {
                  const dayName = day.charAt(0).toUpperCase() + day.slice(1);
                  return (
                    <button
                      key={day}
                      className={`day-option ${
                        selectedDay === day ? "day-option--active" : ""
                      }`}
                      onClick={() => setSelectedDay(day)}
                    >
                      <div className="day-option__name">{dayName}</div>
                      <div className="day-option__date">Day {index + 1}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="day-selector__section">
              <h4 className="day-selector__section-title">
                <Clock size={16} />
                Preferred Time
              </h4>
              <div className="day-selector__time-options">
                {Object.values(TIME_SLOTS).map((timeSlot) => (
                  <button
                    key={timeSlot}
                    className={`time-option ${
                      selectedTimeSlot === timeSlot ? "time-option--active" : ""
                    }`}
                    onClick={() => setSelectedTimeSlot(timeSlot)}
                  >
                    {timeSlot}
                  </button>
                ))}
              </div>
            </div>

            <div className="day-selector__section">
              <h4 className="day-selector__section-title">
                <Calendar size={16} />
                Specific Times (Optional)
              </h4>
              <div className="day-selector__time-inputs">
                <div className="day-selector__time-input-group">
                  <label
                    htmlFor="start-time"
                    className="day-selector__time-label"
                  >
                    Start Time
                  </label>
                  <input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={handleStartTimeChange}
                    className={`day-selector__time-input ${
                      timeError ? "day-selector__time-input--error" : ""
                    }`}
                  />
                </div>
                <div className="day-selector__time-input-group">
                  <label
                    htmlFor="end-time"
                    className="day-selector__time-label"
                  >
                    End Time
                  </label>
                  <input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={handleEndTimeChange}
                    className={`day-selector__time-input ${
                      timeError ? "day-selector__time-input--error" : ""
                    }`}
                  />
                </div>
              </div>
              {timeError && (
                <div className="day-selector__time-error">{timeError}</div>
              )}
            </div>

            <div className="day-selector__section">
              <h4 className="day-selector__section-title">
                <FileText size={16} />
                Personal Notes
              </h4>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Add any personal notes, reminders, or details about this activity..."
                className="day-selector__notes-input"
                rows={3}
              />
            </div>
          </div>

          <div className="day-selector__actions">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              Add to{" "}
              {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DaySelector;
