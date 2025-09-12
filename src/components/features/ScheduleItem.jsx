import React from "react";
import { Trash2, Clock, Edit3 } from "lucide-react";
import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import { CATEGORY_COLORS, MOOD_COLORS } from "../../data/activities.js";
import "./ScheduleItem.css";

const ScheduleItem = ({
  item,
  onRemove,
  onEdit,
  isDragging = false,
  dragHandleProps = {},
}) => {
  const categoryColor = CATEGORY_COLORS[item.category];
  const moodColor = MOOD_COLORS[item.mood];

  // Calculate duration based on start and end times
  const calculateDuration = () => {
    if (item.startTime && item.endTime) {
      const start = new Date(`2000-01-01T${item.startTime}`);
      const end = new Date(`2000-01-01T${item.endTime}`);
      const diffMs = end - start;

      if (diffMs > 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(
          (diffMs % (1000 * 60 * 60)) / (1000 * 60)
        );

        if (diffHours > 0 && diffMinutes > 0) {
          return `${diffHours}h ${diffMinutes}m`;
        } else if (diffHours > 0) {
          return `${diffHours} hour${diffHours > 1 ? "s" : ""}`;
        } else if (diffMinutes > 0) {
          return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
        }
      }
    }

    // Fallback to default estimated time
    return item.estimatedTime;
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove?.(item.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.(item);
  };

  return (
    <Card
      className={`schedule-item ${isDragging ? "schedule-item--dragging" : ""}`}
      padding="medium"
      {...dragHandleProps}
    >
      <div className="schedule-item__content">
        <div className="schedule-item__header">
          <div className="schedule-item__icon-container">
            <span className="schedule-item__icon">{item.icon}</span>
          </div>
          <div className="schedule-item__title-section">
            <h4 className="schedule-item__title">{item.name}</h4>
            <div className="schedule-item__badges">
              <span
                className="schedule-item__category-badge"
                style={{ backgroundColor: categoryColor }}
              >
                {item.category}
              </span>
              <span
                className="schedule-item__mood-badge"
                style={{ backgroundColor: moodColor }}
              >
                {item.mood}
              </span>
            </div>
          </div>
        </div>

        <div className="schedule-item__meta">
          <div className="schedule-item__duration">
            <Clock size={14} />
            <span>{calculateDuration()}</span>
          </div>
          {item.timeSlot && (
            <div className="schedule-item__time-slot">{item.timeSlot}</div>
          )}
          {item.startTime && item.endTime && (
            <div className="schedule-item__specific-time">
              {item.startTime} - {item.endTime}
            </div>
          )}
        </div>

        {item.customNotes && (
          <div className="schedule-item__notes">
            <p>{item.customNotes}</p>
          </div>
        )}

        <div className="schedule-item__actions">
          <Button
            variant="ghost"
            size="small"
            onClick={handleEdit}
            className="schedule-item__edit-button"
          >
            <Edit3 size={14} />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={handleRemove}
            className="schedule-item__remove-button"
          >
            <Trash2 size={14} />
            Remove
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ScheduleItem;
