import React, { useState } from "react";
import { Calendar, Sparkles, Database, Menu } from "lucide-react";
import Button from "../ui/Button.jsx";
import StorageManager from "../features/StorageManager.jsx";
import "./Header.css";

const Header = () => {
  const [showStorageManager, setShowStorageManager] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header__content">
          <div className="header__brand">
            <div className="header__logo">
              <div className="header__logo-container">
                <Sparkles className="header__logo-icon" size={28} />
              </div>
              <div className="header__logo-text-container">
                <span className="header__logo-text">Weekendly</span>
                <p className="header__tagline">Your perfect weekend planner</p>
              </div>
            </div>
          </div>

          <div className="header__actions">
            <div className="header__weekend-badge">
              <Calendar size={18} />
              <span className="header__weekend-text">This Weekend</span>
            </div>
            <Button
              variant="ghost"
              size="small"
              onClick={() => setShowStorageManager(true)}
              className="header__action-button"
              title="Data Management"
            >
              <Database size={18} />
            </Button>
          </div>
        </div>
      </header>

      <StorageManager
        isOpen={showStorageManager}
        onClose={() => setShowStorageManager(false)}
      />
    </>
  );
};

export default Header;
