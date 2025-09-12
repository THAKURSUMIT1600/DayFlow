import React from "react";
import "./Card.css";

const Card = ({
  children,
  className = "",
  hover = false,
  padding = "medium",
  ...props
}) => {
  const baseClasses = "card";
  const hoverClass = hover ? "card--hover" : "";
  const paddingClass = `card--padding-${padding}`;

  const classes = [baseClasses, hoverClass, paddingClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
