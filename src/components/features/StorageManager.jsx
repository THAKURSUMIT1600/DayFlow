import React, { useState } from "react";
import { Download, Upload, Database, X } from "lucide-react";
import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import { useWeekend } from "../../hooks/useWeekend.js";
import "./StorageManager.css";

const StorageManager = ({ isOpen, onClose }) => {
  const {
    actions,
    schedule,
    activeDays = ["saturday", "sunday"],
  } = useWeekend();
  const [message, setMessage] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState("");

  if (!isOpen) return null;

  const handleExport = () => {
    try {
      const data = actions.exportData();
      if (data) {
        // Create download link
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `weekendly-backup-${
          new Date().toISOString().split("T")[0]
        }.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setMessage("Data exported successfully!");
      } else {
        setMessage("No data to export.");
      }
    } catch (error) {
      console.error("Export error:", error);
      setMessage("Failed to export data.");
    }
  };

  const handleImport = () => {
    if (!importData.trim()) {
      setMessage("Please paste your backup data first.");
      return;
    }

    const success = actions.importData(importData);
    if (success) {
      setMessage("Data imported successfully!");
      setImportData("");
      setShowImport(false);
      // Optional: close the modal after successful import
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setMessage(
        "Failed to import data. Please check the format and try again."
      );
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImportData(e.target.result);
        setMessage("File loaded. Click 'Import Data' to proceed.");
      };
      reader.onerror = () => {
        setMessage("Error reading file. Please try again.");
      };
      reader.readAsText(file);
    }
  };

  const getScheduleStats = () => {
    const stats = {};
    let total = 0;

    activeDays.forEach((day) => {
      const count = schedule[day]?.length || 0;
      stats[day] = count;
      total += count;
    });

    return { ...stats, total, activeDays };
  };

  const stats = getScheduleStats();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="storage-manager-overlay" onClick={handleOverlayClick}>
      <div className="storage-manager-modal">
        <Card className="storage-manager-card" padding="large">
          <div className="storage-manager__header">
            <h3 className="storage-manager__title">
              <Database size={20} />
              Data Management
            </h3>
            <Button
              variant="ghost"
              size="small"
              onClick={onClose}
              className="storage-manager__close"
            >
              <X size={20} />
            </Button>
          </div>

          <div className="storage-manager__content">
            {/* Storage Status */}
            <div className="storage-manager__section">
              <h4 className="storage-manager__section-title">Current Data</h4>
              <div className="storage-manager__status">
                <div className="status-item">
                  <span className="status-label">Activities Saved:</span>
                  <span className="status-value">
                    {stats.total} total (
                    {activeDays.map((day, index) => {
                      const dayName =
                        day.charAt(0).toUpperCase() + day.slice(1);
                      const count = stats[day] || 0;
                      return (
                        <span key={day}>
                          {count} {dayName}
                          {index < activeDays.length - 1 ? ", " : ""}
                        </span>
                      );
                    })}
                    )
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Storage:</span>
                  <span className="status-value enabled">
                    Auto-saving enabled
                  </span>
                </div>
              </div>
            </div>

            {/* Export Action */}
            <div className="storage-manager__section">
              <h4 className="storage-manager__section-title">Export Backup</h4>
              <p className="storage-manager__description">
                Download your weekend schedule as a JSON file. This backup can
                be used to restore your data later.
              </p>
              <div className="storage-manager__actions">
                <Button
                  variant="primary"
                  onClick={handleExport}
                  className="action-button"
                  disabled={stats.total === 0}
                >
                  <Download size={16} />
                  Export Backup
                </Button>
              </div>
              {stats.total === 0 && (
                <p className="storage-manager__warning">
                  No activities to export. Add some activities to your schedule
                  first.
                </p>
              )}
            </div>

            {/* Import Section */}
            <div className="storage-manager__section">
              <h4 className="storage-manager__section-title">Import Backup</h4>
              <p className="storage-manager__description">
                Restore your weekend schedule from a previously exported backup
                file. This will replace your current schedule.
              </p>
              <div className="storage-manager__actions">
                <Button
                  variant="outline"
                  onClick={() => setShowImport(!showImport)}
                  className="action-button"
                >
                  <Upload size={16} />
                  {showImport ? "Hide Import" : "Import Backup"}
                </Button>
              </div>
            </div>

            {/* Import Form */}
            {showImport && (
              <div className="storage-manager__section">
                <h4 className="storage-manager__section-title">
                  Select Import Method
                </h4>

                {/* File Upload */}
                <div className="storage-manager__import-method">
                  <p className="storage-manager__method-title">Upload File:</p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="storage-manager__file-input"
                  />
                </div>

                {/* Text Input */}
                <div className="storage-manager__import-method">
                  <p className="storage-manager__method-title">
                    Or paste backup data:
                  </p>
                  <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder="Paste your exported backup data here..."
                    className="storage-manager__import-textarea"
                    rows={6}
                  />
                </div>

                {/* Import Actions */}
                <div className="storage-manager__import-actions">
                  <Button
                    variant="primary"
                    onClick={handleImport}
                    disabled={!importData.trim()}
                  >
                    Import Data
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowImport(false);
                      setImportData("");
                      setMessage("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Message Display */}
            {message && (
              <div className="storage-manager__message">{message}</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StorageManager;
