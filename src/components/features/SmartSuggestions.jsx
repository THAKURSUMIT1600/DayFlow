import React, { useState } from "react";
import {
  Cloud,
  MapPin,
  Calendar,
  Star,
  ChevronRight,
  RefreshCw,
  Thermometer,
  Eye,
  Plus,
} from "lucide-react";
import "./SmartSuggestions.css";

const SmartSuggestions = ({
  smartSuggestions = {},
  loading = false,
  onRefresh,
  onAddToSchedule,
  location = "Delhi",
}) => {
  const [activeTab, setActiveTab] = useState("suggestions");
  const {
    weather,
    suggestions = [],
    nearbyPlaces = [],
    upcomingEvents = [],
  } = smartSuggestions;

  const renderWeatherInfo = () => {
    if (!weather) return null;

    return (
      <div className="weather-info">
        <div className="weather-current">
          <div className="weather-main">
            <Thermometer className="weather-icon" />
            <div className="weather-details">
              <span className="temperature">
                {weather.current.temperature}°C
              </span>
              <span className="condition">{weather.current.condition}</span>
            </div>
          </div>
          <div className="weather-metrics">
            <span className="metric">
              <Eye className="metric-icon" />
              {weather.current.humidity}%
            </span>
            <span className="metric">
              <Cloud className="metric-icon" />
              {weather.current.windSpeed} km/h
            </span>
          </div>
        </div>

        {weather.forecast && weather.forecast.length > 0 && (
          <div className="weather-forecast">
            {weather.forecast.slice(0, 3).map((day, index) => (
              <div key={index} className="forecast-day">
                <span className="forecast-date">
                  {new Date(day.date).toLocaleDateString("en-IN", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="forecast-temp">
                  {day.high}°/{day.low}°
                </span>
                <span className="forecast-condition">{day.condition}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSuggestions = () => {
    if (!suggestions || suggestions.length === 0) {
      return (
        <div className="empty-state">
          <Star className="empty-icon" />
          <p>No smart suggestions available</p>
          <button onClick={onRefresh} className="refresh-btn">
            <RefreshCw
              className={`refresh-icon ${loading ? "spinning" : ""}`}
            />
            Refresh Suggestions
          </button>
        </div>
      );
    }

    return (
      <div className="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <div key={index} className={`suggestion-card ${suggestion.type}`}>
            <div className="suggestion-header">
              <span className="suggestion-icon">{suggestion.icon}</span>
              <div className="suggestion-content">
                <h4 className="suggestion-title">{suggestion.title}</h4>
                <p className="suggestion-description">
                  {suggestion.description}
                </p>
              </div>
            </div>
            {suggestion.activities && suggestion.activities.length > 0 && (
              <div className="suggestion-activities">
                {suggestion.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="activity-item">
                    <span className="activity-name">{activity}</span>
                    {onAddToSchedule && (
                      <button
                        className="add-activity-btn"
                        onClick={() =>
                          onAddToSchedule(activity, suggestion.type)
                        }
                        title="Add to schedule"
                      >
                        <Plus className="plus-icon" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderNearbyPlaces = () => {
    if (!nearbyPlaces || nearbyPlaces.length === 0) {
      return (
        <div className="empty-state">
          <MapPin className="empty-icon" />
          <p>No nearby places found</p>
        </div>
      );
    }

    return (
      <div className="places-list">
        {nearbyPlaces.map((place, index) => (
          <div key={index} className="place-card">
            <div className="place-info">
              <h4 className="place-name">{place.name}</h4>
              <p className="place-type">{place.type}</p>
              <div className="place-details">
                <span className="place-rating">
                  <Star className="star-icon" />
                  {place.rating}
                </span>
                <span className="place-distance">{place.distance}</span>
                <span className={`place-price price-level-${place.priceLevel}`}>
                  {"₹".repeat(place.priceLevel || 1)}
                </span>
              </div>
            </div>
            {onAddToSchedule && (
              <button
                className="add-place-btn"
                onClick={() => onAddToSchedule(place.name, "location")}
                title="Add to schedule"
              >
                <Plus className="plus-icon" />
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderUpcomingEvents = () => {
    if (!upcomingEvents || upcomingEvents.length === 0) {
      return (
        <div className="empty-state">
          <Calendar className="empty-icon" />
          <p>No upcoming events found</p>
        </div>
      );
    }

    return (
      <div className="events-list">
        {upcomingEvents.map((event, index) => (
          <div key={index} className="event-card">
            <div className="event-info">
              <h4 className="event-name">{event.name}</h4>
              <p className="event-description">{event.description}</p>
              <div className="event-details">
                <span className="event-date">
                  <Calendar className="detail-icon" />
                  {new Date(event.date).toLocaleDateString("en-IN")} at{" "}
                  {event.time}
                </span>
                <span className="event-venue">
                  <MapPin className="detail-icon" />
                  {event.venue}
                </span>
                <span className="event-price">{event.price}</span>
                <span
                  className={`event-category category-${event.category
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "-")}`}
                >
                  {event.category}
                </span>
              </div>
            </div>
            {onAddToSchedule && (
              <button
                className="add-event-btn"
                onClick={() => onAddToSchedule(event.name, "event")}
                title="Add to schedule"
              >
                <Plus className="plus-icon" />
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  const tabs = [
    { id: "suggestions", label: "Smart Suggestions", icon: Star },
    { id: "places", label: "Nearby Places", icon: MapPin },
    { id: "events", label: "Events", icon: Calendar },
  ];

  return (
    <div className="smart-suggestions">
      <div className="smart-suggestions-header">
        <div className="header-info">
          <h3 className="header-title">Smart Recommendations</h3>
          <span className="location-info">
            <MapPin className="location-icon" />
            {location}
          </span>
        </div>
        <button onClick={onRefresh} className="refresh-btn" disabled={loading}>
          <RefreshCw className={`refresh-icon ${loading ? "spinning" : ""}`} />
          Refresh
        </button>
      </div>

      {renderWeatherInfo()}

      <div className="tabs-container">
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="tab-icon" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {loading ? (
            <div className="loading-state">
              <RefreshCw className="loading-icon spinning" />
              <p>Loading smart suggestions...</p>
            </div>
          ) : (
            <>
              {activeTab === "suggestions" && renderSuggestions()}
              {activeTab === "places" && renderNearbyPlaces()}
              {activeTab === "events" && renderUpcomingEvents()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartSuggestions;
