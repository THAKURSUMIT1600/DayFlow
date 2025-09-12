import React from "react";
import { X, Plus } from "lucide-react";
import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import ActivityCard from "./ActivityCard.jsx";
import { useWeekend } from "../../hooks/useWeekend.js";
import "./QuickAddModal.css";

const QuickAddModal = ({ isOpen, onClose, onActivitySelect }) => {
  const { activities } = useWeekend();

  if (!isOpen) return null;

  // Get popular/recommended activities (first 6 activities)
  const popularActivities = activities.slice(0, 6);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleActivitySelect = (activity) => {
    onActivitySelect(activity);
    onClose();
  };

  return (
    <div className="quick-add-overlay" onClick={handleOverlayClick}>
      <div className="quick-add-modal">
        <Card className="quick-add-card" padding="large">
          <div className="quick-add__header">
            <h3 className="quick-add__title">
              <Plus size={20} />
              Quick Add Activity
            </h3>
            <Button
              variant="ghost"
              size="small"
              onClick={onClose}
              className="quick-add__close-button"
            >
              <X size={20} />
            </Button>
          </div>

          <p className="quick-add__subtitle">
            Choose from popular activities or browse all activities in the
            sidebar
          </p>

          <div className="quick-add__activities">
            <h4 className="quick-add__section-title">Popular Activities</h4>
            <div className="quick-add__grid">
              {popularActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onAddToSchedule={handleActivitySelect}
                  showAddButton={true}
                />
              ))}
            </div>
          </div>

          <div className="quick-add__footer">
            <Button variant="outline" onClick={onClose}>
              Browse All Activities
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuickAddModal;
