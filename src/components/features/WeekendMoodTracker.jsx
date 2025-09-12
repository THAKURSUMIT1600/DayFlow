import React, { useState, useEffect } from "react";
import { Heart, Brain, Zap, Coffee, Sun, Moon, Sparkles } from "lucide-react";
import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";
import { useWeekend } from "../../hooks/useWeekend.js";
import "./WeekendMoodTracker.css";

const MOOD_OPTIONS = [
  {
    id: "energetic",
    icon: Zap,
    label: "Energetic",
    color: "#ff6b6b",
    suggestions: ["adventure", "sports", "outdoor"],
  },
  {
    id: "relaxed",
    icon: Coffee,
    label: "Relaxed",
    color: "#4ecdc4",
    suggestions: ["chill", "indoor", "wellness"],
  },
  {
    id: "social",
    icon: Heart,
    label: "Social",
    color: "#45b7d1",
    suggestions: ["social", "food", "entertainment"],
  },
  {
    id: "creative",
    icon: Brain,
    label: "Creative",
    color: "#96ceb4",
    suggestions: ["creative", "cultural", "learning"],
  },
  {
    id: "adventurous",
    icon: Sun,
    label: "Adventurous",
    color: "#feca57",
    suggestions: ["adventure", "outdoor", "sports"],
  },
  {
    id: "peaceful",
    icon: Moon,
    label: "Peaceful",
    color: "#a55eea",
    suggestions: ["wellness", "nature", "chill"],
  },
  {
    id: "spontaneous",
    icon: Sparkles,
    label: "Spontaneous",
    color: "#fd79a8",
    suggestions: ["entertainment", "social", "adventure"],
  },
];

const WeekendMoodTracker = ({ onMoodChange }) => {
  const { filteredActivities } = useWeekend();
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodSuggestions, setMoodSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (selectedMood) {
      const mood = MOOD_OPTIONS.find((m) => m.id === selectedMood);
      if (mood) {
        // Filter activities based on mood preferences
        const suggestions = filteredActivities
          .filter((activity) =>
            mood.suggestions.some(
              (suggestion) =>
                activity.category.toLowerCase().includes(suggestion) ||
                activity.mood.toLowerCase().includes(suggestion) ||
                activity.name.toLowerCase().includes(suggestion) ||
                activity.description.toLowerCase().includes(suggestion)
            )
          )
          .slice(0, 6); // Limit to 6 suggestions

        setMoodSuggestions(suggestions);
        setShowSuggestions(true);
      }
    }
  }, [selectedMood, filteredActivities]);

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
    onMoodChange?.(moodId);
  };

  return (
    <Card className="mood-tracker" padding="large">
      <div className="mood-tracker__header">
        <h3 className="mood-tracker__title">
          <Brain size={20} />
          How are you feeling this weekend?
        </h3>
        <p className="mood-tracker__subtitle">
          Get personalized activity suggestions based on your mood
        </p>
      </div>

      <div className="mood-tracker__options">
        {MOOD_OPTIONS.map((mood) => {
          const IconComponent = mood.icon;
          const isSelected = selectedMood === mood.id;

          return (
            <button
              key={mood.id}
              className={`mood-option ${
                isSelected ? "mood-option--selected" : ""
              }`}
              onClick={() => handleMoodSelect(mood.id)}
              style={{
                "--mood-color": mood.color,
              }}
            >
              <div className="mood-option__icon">
                <IconComponent size={24} />
              </div>
              <span className="mood-option__label">{mood.label}</span>
            </button>
          );
        })}
      </div>

      {showSuggestions && moodSuggestions.length > 0 && (
        <div className="mood-suggestions">
          <h4 className="mood-suggestions__title">
            <Sparkles size={16} />
            Perfect for your{" "}
            {MOOD_OPTIONS.find(
              (m) => m.id === selectedMood
            )?.label.toLowerCase()}{" "}
            mood
          </h4>
          <div className="mood-suggestions__grid">
            {moodSuggestions.map((activity) => (
              <div key={activity.id} className="mood-suggestion">
                <span className="mood-suggestion__icon">{activity.icon}</span>
                <div className="mood-suggestion__content">
                  <h5 className="mood-suggestion__name">{activity.name}</h5>
                  <p className="mood-suggestion__category">
                    {activity.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="small"
            onClick={() => setShowSuggestions(false)}
            className="mood-suggestions__hide"
          >
            Hide Suggestions
          </Button>
        </div>
      )}
    </Card>
  );
};

export default WeekendMoodTracker;
