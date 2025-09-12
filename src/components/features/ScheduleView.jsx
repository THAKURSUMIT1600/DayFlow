import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, Trash2, Plus } from "lucide-react";
import ScheduleItem from "./ScheduleItem.jsx";
import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import EditActivityModal from "./EditActivityModal.jsx";
import { useWeekend } from "../../hooks/useWeekend.js";
import "./ScheduleView.css";

// Sortable wrapper for schedule items
const SortableScheduleItem = ({ item, onRemove, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ScheduleItem
        item={item}
        onRemove={onRemove}
        onEdit={onEdit}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};

// Day schedule component
const DaySchedule = ({
  day,
  dayName,
  items,
  onReorder,
  onRemove,
  onEdit,
  onClear,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newOrder = arrayMove(items, oldIndex, newIndex);
      onReorder(day, newOrder);
    }
  };

  const getTotalDuration = () => {
    return items.reduce((total, item) => total + (item.duration || 0), 0);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card className="day-schedule" padding="large">
      <div className="day-schedule__header">
        <div className="day-schedule__title-section">
          <h3 className="day-schedule__title">
            <Calendar size={20} />
            {dayName}
          </h3>
          <div className="day-schedule__stats">
            <span className="day-schedule__count">
              {items.length} {items.length === 1 ? "activity" : "activities"}
            </span>
          </div>
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="small"
            onClick={() => onClear(day)}
            className="day-schedule__clear-button"
          >
            <Trash2 size={16} />
            Clear
          </Button>
        )}
      </div>

      <div className="day-schedule__content">
        {items.length === 0 ? (
          <div className="day-schedule__empty">
            <div className="day-schedule__empty-icon">📅</div>
            <h4 className="day-schedule__empty-title">No activities planned</h4>
            <p className="day-schedule__empty-message">
              Add activities from the browser to start planning your{" "}
              {dayName.toLowerCase()}.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="day-schedule__items">
                {items.map((item) => (
                  <SortableScheduleItem
                    key={item.id}
                    item={item}
                    onRemove={onRemove}
                    onEdit={onEdit}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </Card>
  );
};

const ScheduleView = ({ onAddActivity }) => {
  const {
    schedule,
    actions,
    activeDays = ["saturday", "sunday"],
  } = useWeekend();
  const [editingItem, setEditingItem] = useState(null);

  const handleReorder = (day, newOrder) => {
    actions.reorderSchedule(day, newOrder);
  };

  const handleRemove = (itemId, day) => {
    actions.removeFromSchedule(itemId, day);
  };

  const handleEdit = (item) => {
    // Find which day this item belongs to
    let itemDay = "saturday"; // default fallback

    for (const day of activeDays) {
      if (
        schedule[day] &&
        schedule[day].some((scheduleItem) => scheduleItem.id === item.id)
      ) {
        itemDay = day;
        break;
      }
    }

    // Add the day information to the item for the edit modal
    const itemWithDay = {
      ...item,
      day: itemDay,
    };
    setEditingItem(itemWithDay);
  };

  const handleEditSave = (itemId, day, updates) => {
    actions.updateScheduleItem(itemId, day, updates);
  };

  const handleEditClose = () => {
    setEditingItem(null);
  };

  const handleClear = (day) => {
    if (
      window.confirm(
        `Are you sure you want to clear all activities for ${day}?`
      )
    ) {
      actions.clearSchedule(day);
    }
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to clear your entire weekend schedule?"
      )
    ) {
      actions.clearSchedule();
    }
  };

  const getTotalActivities = () => {
    return activeDays.reduce((total, day) => {
      return total + (schedule[day]?.length || 0);
    }, 0);
  };

  return (
    <div className="schedule-view">
      <div className="schedule-view__header">
        <div className="schedule-view__title-section">
          <h2 className="schedule-view__title">Your Weekend Schedule</h2>
          <p className="schedule-view__subtitle">
            {getTotalActivities() === 0
              ? "Start building your perfect weekend by adding activities"
              : `${getTotalActivities()} ${
                  getTotalActivities() === 1 ? "activity" : "activities"
                } planned`}
          </p>
        </div>

        <div className="schedule-view__actions">
          <Button
            variant="outline"
            onClick={onAddActivity}
            className="schedule-view__add-button"
          >
            <Plus size={16} />
            Add Activity
          </Button>

          {getTotalActivities() > 0 && (
            <Button
              variant="ghost"
              onClick={handleClearAll}
              className="schedule-view__clear-all-button"
            >
              <Trash2 size={16} />
              Clear All
            </Button>
          )}
        </div>
      </div>

      <div className="schedule-view__days">
        {activeDays.map((day) => {
          const dayName = day.charAt(0).toUpperCase() + day.slice(1);
          return (
            <DaySchedule
              key={day}
              day={day}
              dayName={dayName}
              items={schedule[day] || []}
              onReorder={handleReorder}
              onRemove={(itemId) => handleRemove(itemId, day)}
              onEdit={handleEdit}
              onClear={handleClear}
            />
          );
        })}
      </div>

      <EditActivityModal
        item={editingItem}
        isOpen={!!editingItem}
        onClose={handleEditClose}
        onSave={handleEditSave}
      />
    </div>
  );
};

export default ScheduleView;
