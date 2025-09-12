import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import ActivityCard from "./ActivityCard.jsx";
import Button from "../ui/Button.jsx";
import { useWeekend } from "../../hooks/useWeekend.js";
import { ACTIVITY_CATEGORIES, MOODS } from "../../data/activities.js";
import "./ActivityBrowser.css";

const ActivityBrowser = ({ onActivitySelect, highlight = false }) => {
  const { filteredActivities, filters, searchTerm, actions } = useWeekend();
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e) => {
    actions.setSearch(e.target.value);
  };

  const handleCategoryFilter = (category) => {
    const newCategory = filters.category === category ? null : category;
    actions.setFilter("category", newCategory);
  };

  const handleMoodFilter = (mood) => {
    const newMood = filters.mood === mood ? null : mood;
    actions.setFilter("mood", newMood);
  };

  const clearFilters = () => {
    actions.setFilter("category", null);
    actions.setFilter("mood", null);
    actions.setSearch("");
  };

  const hasActiveFilters = filters.category || filters.mood || searchTerm;

  return (
    <div
      className={`activity-browser ${
        highlight ? "activity-browser--highlighted" : ""
      }`}
    >
      <div className="activity-browser__header">
        <h2 className="activity-browser__title">Choose Your Activities</h2>
        <p className="activity-browser__subtitle">
          Browse and select activities to build your perfect weekend
        </p>
        {highlight && (
          <div className="activity-browser__highlight-message">
            👆 Click "Add" on any activity below to add it to your schedule!
          </div>
        )}
      </div>

      <div className="activity-browser__controls">
        <div className="activity-browser__search">
          <div className="search-input-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>

        <div className="activity-browser__filter-controls">
          <Button
            variant={showFilters ? "primary" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="filter-toggle"
          >
            <Filter size={16} />
            Filters
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="clear-filters"
            >
              <X size={16} />
              Clear
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="activity-browser__filters">
          <div className="filter-section">
            <h4 className="filter-section__title">Categories</h4>
            <div className="filter-chips">
              {Object.values(ACTIVITY_CATEGORIES).map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`filter-chip ${
                    filters.category === category ? "filter-chip--active" : ""
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4 className="filter-section__title">Moods</h4>
            <div className="filter-chips">
              {Object.values(MOODS).map((mood) => (
                <button
                  key={mood}
                  onClick={() => handleMoodFilter(mood)}
                  className={`filter-chip ${
                    filters.mood === mood ? "filter-chip--active" : ""
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="activity-browser__results">
        <div className="activity-browser__results-header">
          <span className="results-count">
            {filteredActivities.length}{" "}
            {filteredActivities.length === 1 ? "activity" : "activities"} found
          </span>
        </div>

        <div className="activity-browser__grid">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onAddToSchedule={onActivitySelect}
            />
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="no-results">
            <div className="no-results__icon">🔍</div>
            <h3 className="no-results__title">No activities found</h3>
            <p className="no-results__message">
              Try adjusting your search terms or filters to find more
              activities.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityBrowser;
