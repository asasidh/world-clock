import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimeSliderProps {
  currentTime: Date;
  onTimeChange: (time: Date) => void;
  isLive: boolean;
  onToggleLive: () => void;
  onReset: () => void;
}

const TimeSlider: React.FC<TimeSliderProps> = ({
  currentTime,
  onTimeChange,
  isLive,
  onToggleLive,
  onReset
}) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const totalMinutes = parseInt(e.target.value);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const newTime = new Date(currentTime);
    newTime.setHours(hours, minutes, 0, 0);
    onTimeChange(newTime);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const newTime = new Date(selectedDate);
    newTime.setHours(currentTime.getHours(), currentTime.getMinutes(), 0, 0);
    onTimeChange(newTime);
  };

  // Convert current time to total minutes (0-1439 for 24 hours in 15-minute increments)
  const currentTotalMinutes = currentTime.getHours() * 60 + Math.floor(currentTime.getMinutes() / 15) * 15;
  const currentDate = currentTime.toISOString().split('T')[0];
  
  // Get actual current time for live indicator
  const actualCurrentTime = new Date();
  const actualCurrentMinutes = actualCurrentTime.getHours() * 60 + Math.floor(actualCurrentTime.getMinutes() / 15) * 15;
  
  // Helper function to format time from minutes
  const formatTimeFromMinutes = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="time-slider">
      <div className="time-controls">
        <button 
          className={`control-btn ${isLive ? 'active' : ''}`}
          onClick={onToggleLive}
          title={isLive ? 'Pause live time' : 'Resume live time'}
        >
          {isLive ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <button 
          className="control-btn"
          onClick={onReset}
          title="Reset to current time"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="slider-container">
        <div className="date-picker">
          <input
            type="date"
            value={currentDate}
            onChange={handleDateChange}
            disabled={isLive}
          />
        </div>

        <div className="hour-slider">
          <div className="time-display-header">
            <label>Selected Time: {formatTimeFromMinutes(currentTotalMinutes)}</label>
            {!isLive && (
              <span className="time-difference">
                {currentTime.toLocaleString([], { 
                  weekday: 'short',
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            )}
          </div>
          <div className="slider-container-wrapper">
            <input
              type="range"
              min="0"
              max="1425"
              step="15"
              value={currentTotalMinutes}
              onChange={handleSliderChange}
              disabled={isLive}
              className="slider"
              title={`Set time to ${formatTimeFromMinutes(currentTotalMinutes)}`}
            />
            {isLive && (
              <div 
                className="live-time-indicator"
                style={{ left: `${(actualCurrentMinutes / 1425) * 100}%` }}
                title={`Current time: ${formatTimeFromMinutes(actualCurrentMinutes)}`}
              />
            )}
          </div>
          <div className="hour-labels">
            <span>12:00 AM</span>
            <span>6:00 AM</span>
            <span>12:00 PM</span>
            <span>6:00 PM</span>
            <span>11:45 PM</span>
          </div>
          <div className="slider-info">
            <small>Drag to change time in 15-minute increments</small>
          </div>
        </div>
      </div>

      <div className="meeting-planner">
        <div className="optimal-time">
          <h4>Meeting Planner</h4>
        </div>
      </div>
    </div>
  );
};

export default TimeSlider;
