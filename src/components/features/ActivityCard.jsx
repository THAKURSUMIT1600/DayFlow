import React from "react";
import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";
import { CATEGORY_COLORS, MOOD_COLORS } from "../../data/activities.js";
import { Plus, Clock, Heart } from "lucide-react";
import "./ActivityCard.css";

const ActivityCard = ({ activity, onAddToSchedule, showAddButton = true }) => {
  const categoryColor = CATEGORY_COLORS[activity.category];
  const moodColor = MOOD_COLORS[activity.mood];

  const handleAddClick = (e) => {
    e.stopPropagation();
    onAddToSchedule?.(activity);
  };

  return (
    <Card className="activity-card" hover>
      <div className="activity-card__header">
        <div className="activity-card__icon-container">
          <span className="activity-card__icon">{activity.icon}</span>
        </div>
        <div className="activity-card__title-section">
          <h3 className="activity-card__title">{activity.name}</h3>
          <div className="activity-card__badges">
            <span
              className="activity-card__category-badge"
              style={{ backgroundColor: categoryColor }}
            >
              {activity.category}
            </span>
            <span
              className="activity-card__mood-badge"
              style={{ backgroundColor: moodColor }}
            >
              <Heart size={12} />
              {activity.mood}
            </span>
          </div>
        </div>
      </div>

      <p className="activity-card__description">{activity.description}</p>

      <div className="activity-card__footer">
        <div className="activity-card__meta">
          <div className="activity-card__time-slot">
            Best for: {activity.preferredTimeSlot}
          </div>
        </div>

        {showAddButton && (
          <Button
            variant="primary"
            size="small"
            onClick={handleAddClick}
            className="activity-card__add-button"
          >
            <Plus size={16} />
            Add
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ActivityCard;
