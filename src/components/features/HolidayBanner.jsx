import React from "react";
import { Calendar, MapPin, Star, Clock } from "lucide-react";
import "./HolidayBanner.css";

const HolidayBanner = ({ upcomingHolidays = [], onPlanWeekend }) => {
  if (!upcomingHolidays || upcomingHolidays.length === 0) {
    return null;
  }

  const nextLongWeekend = upcomingHolidays[0];
  const { triggerHoliday, duration, daysUntil, suggestions } = nextLongWeekend;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
  };

  const getDurationText = (duration) => {
    if (duration === 3) return "3-day";
    if (duration === 4) return "4-day";
    return `${duration}-day`;
  };

  const getUrgencyClass = (days) => {
    if (days <= 7) return "urgent";
    if (days <= 14) return "soon";
    return "upcoming";
  };

  return (
    <div className={`holiday-banner ${getUrgencyClass(daysUntil)}`}>
      <div className="holiday-banner-header">
        <div className="holiday-info">
          <Calendar className="holiday-icon" />
          <div className="holiday-details">
            <h3 className="holiday-title">
              {triggerHoliday.name} - {getDurationText(duration)} Weekend!
            </h3>
            <p className="holiday-dates">
              {formatDate(nextLongWeekend.startDate)} -{" "}
              {formatDate(nextLongWeekend.endDate)}
              <span className="days-until">
                {daysUntil === 0
                  ? "Today!"
                  : daysUntil === 1
                  ? "Tomorrow!"
                  : `${daysUntil} days away`}
              </span>
            </p>
          </div>
        </div>
      </div>

      {suggestions && suggestions.length > 0 && (
        <div className="holiday-suggestions">
          <h4 className="suggestions-title">
            <Star className="suggestions-icon" />
            Perfect for:
          </h4>
          <div className="suggestions-list">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <span key={index} className="suggestion-tag">
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      )}

      {upcomingHolidays.length > 1 && (
        <div className="more-holidays">
          <Clock className="more-holidays-icon" />
          <span>
            {upcomingHolidays.length - 1} more long weekend
            {upcomingHolidays.length > 2 ? "s" : ""} coming up
          </span>
        </div>
      )}
    </div>
  );
};

export default HolidayBanner;
