import React, { useState } from "react";
import { X, Calendar, Clock, Edit3, Save } from "lucide-react";
import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import {
  TIME_SLOTS,
  CATEGORY_COLORS,
  MOOD_COLORS,
} from "../../data/activities.js";
import "./EditActivityModal.css";

const EditActivityModal = ({ item, isOpen, onClose, onSave }) => {
  const [customNotes, setCustomNotes] = useState(item?.customNotes || "");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    item?.timeSlot || TIME_SLOTS.MORNING
  );
  const [startTime, setStartTime] = useState(item?.startTime || "");
  const [endTime, setEndTime] = useState(item?.endTime || "");
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

  // Update state when item changes
  React.useEffect(() => {
    if (item) {
      setCustomNotes(item.customNotes || "");
      setSelectedTimeSlot(item.timeSlot || TIME_SLOTS.MORNING);
      const newStartTime = item.startTime || "";
      const newEndTime = item.endTime || "";
      setStartTime(newStartTime);
      setEndTime(newEndTime);
      validateTimes(newStartTime, newEndTime);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSave = () => {
    // Validate times before saving
    if (!validateTimes(startTime, endTime)) {
      return; // Don't proceed if validation fails
    }

    const updates = {
      customNotes,
      timeSlot: selectedTimeSlot,
      startTime,
      endTime,
    };
    onSave(item.id, item.day, updates);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const categoryColor = CATEGORY_COLORS[item.category];
  const moodColor = MOOD_COLORS[item.mood];

  return (
    <div className="edit-activity-overlay" onClick={handleOverlayClick}>
      <div className="edit-activity-modal">
        <Card className="edit-activity-card" padding="large">
          <div className="edit-activity__header">
            <h3 className="edit-activity__title">
              <Edit3 size={20} />
              Edit Activity
            </h3>
            <Button
              variant="ghost"
              size="small"
              onClick={onClose}
              className="edit-activity__close-button"
            >
              <X size={20} />
            </Button>
          </div>

          <div className="edit-activity__activity-info">
            <div className="edit-activity__activity-icon">{item.icon}</div>
            <div className="edit-activity__activity-details">
              <h4 className="edit-activity__activity-name">{item.name}</h4>
              <p className="edit-activity__activity-description">
                {item.description}
              </p>
              <div className="edit-activity__activity-badges">
                <span
                  className="edit-activity__category-badge"
                  style={{ backgroundColor: categoryColor }}
                >
                  {item.category}
                </span>
                <span
                  className="edit-activity__mood-badge"
                  style={{ backgroundColor: moodColor }}
                >
                  {item.mood}
                </span>
              </div>
              <div className="edit-activity__activity-meta"></div>
            </div>
          </div>

          <div className="edit-activity__form">
            <div className="edit-activity__section">
              <h4 className="edit-activity__section-title">
                <Clock size={16} />
                Time Preference
              </h4>
              <div className="edit-activity__time-options">
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

            <div className="edit-activity__section">
              <h4 className="edit-activity__section-title">
                <Calendar size={16} />
                Specific Times (Optional)
              </h4>
              <div className="edit-activity__time-inputs">
                <div className="edit-activity__time-input-group">
                  <label
                    htmlFor="start-time"
                    className="edit-activity__time-label"
                  >
                    Start Time
                  </label>
                  <input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={handleStartTimeChange}
                    className={`edit-activity__time-input ${
                      timeError ? "edit-activity__time-input--error" : ""
                    }`}
                  />
                </div>
                <div className="edit-activity__time-input-group">
                  <label
                    htmlFor="end-time"
                    className="edit-activity__time-label"
                  >
                    End Time
                  </label>
                  <input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={handleEndTimeChange}
                    className={`edit-activity__time-input ${
                      timeError ? "edit-activity__time-input--error" : ""
                    }`}
                  />
                </div>
              </div>
              {timeError && (
                <div className="edit-activity__time-error">{timeError}</div>
              )}
            </div>

            <div className="edit-activity__section">
              <h4 className="edit-activity__section-title">Personal Notes</h4>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Add any personal notes, reminders, or details about this activity..."
                className="edit-activity__notes-input"
                rows={3}
              />
            </div>
          </div>

          <div className="edit-activity__actions">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              <Save size={16} />
              Save Changes
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EditActivityModal;
