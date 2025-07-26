import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment-timezone';
import './App.css';
import Clock from './components/Clock';
import { TIMEZONE_DATA } from './data/timezones';
import type { TimezoneData } from './data/timezones';
import { Plus, ChevronLeft, ChevronRight, RefreshCw, GripVertical, X, ExternalLink } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Define the type for draggable items
interface DragItem {
  index: number;
  id: string;
  type: string;
}

// Draggable Clock component
const DraggableClock: React.FC<{
  timezone: TimezoneData;
  currentTime: Date;
  index: number;
  moveTimezone: (dragIndex: number, hoverIndex: number) => void;
  onRemove?: () => void;
  isOptimalMeetingTime: boolean;
}> = ({ timezone, currentTime, index, moveTimezone, onRemove, isOptimalMeetingTime }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'timezone',
    item: { index, id: timezone.id, type: 'timezone' } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const [, drop] = useDrop<DragItem>({
    accept: 'timezone',
    hover: (item, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;
      
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      
      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      
      // Time to actually perform the action
      moveTimezone(dragIndex, hoverIndex);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  
  drag(drop(ref));
  
  return (
    <div 
      ref={ref} 
      className={`clock-compact ${isDragging ? 'is-dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="drag-handle">
        <GripVertical size={16} color="#475569" />
      </div>
      
      {onRemove && (
        <button className="remove-btn-compact" onClick={onRemove}>
          <X size={12} />
        </button>
      )}
      
      <Clock 
        timezone={timezone} 
        currentTime={currentTime} 
        isOptimalMeetingTime={isOptimalMeetingTime} 
      />
    </div>
  );
};

const WorldClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLive, setIsLive] = useState(true);
  // Helper function to safely find timezone or use India time as fallback
  const safelyFindTimezone = (predicate: (tz: TimezoneData) => boolean): TimezoneData => {
    return TIMEZONE_DATA.find(predicate) || TIMEZONE_DATA.find(tz => tz.id.includes('Asia/Kolkata')) || TIMEZONE_DATA[0];
  };

  // Find India timezone explicitly and create Mumbai timezone
  const indiaTimezone = TIMEZONE_DATA.find(tz => tz.id.includes('Asia/Kolkata'));
  // Create Mumbai timezone based on Kolkata (they share the same timezone)
  const mumbaiTimezone: TimezoneData = indiaTimezone ? {
    ...indiaTimezone,
    id: 'Asia/Kolkata', // Keep the same ID
    city: 'Mumbai',
    name: 'India Standard Time (Mumbai)'
  } : {
    id: 'Asia/Kolkata',
    name: 'India Standard Time',
    city: 'Mumbai',
    country: 'India',
    offset: '+05:30',
    coordinates: { lat: 19.0760, lng: 72.8777 } // Mumbai coordinates
  };
  
  const [selectedTimezones, setSelectedTimezones] = useState<TimezoneData[]>([
    // Current location timezone (using local timezone)
    safelyFindTimezone(tz => tz.id === Intl.DateTimeFormat().resolvedOptions().timeZone || 
                            tz.id.includes('America/Chicago')),
    safelyFindTimezone(tz => tz.city === 'New York' || tz.id.includes('America/New_York')),
    safelyFindTimezone(tz => tz.id.includes('America/Los_Angeles')),
    // Ensure Mumbai is included directly
    mumbaiTimezone,
    safelyFindTimezone(tz => tz.id.includes('Europe/London')),
  ]);
  const [showTimezoneSelector, setShowTimezoneSelector] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(moment());

  // Update time every second when live
  useEffect(() => {
    if (!isLive) return;
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isLive]);

  const handleAddTimezone = useCallback((timezone: TimezoneData) => {
    // Check if timezone is already in the list (including Mumbai special case)
    const alreadyExists = selectedTimezones.some(
      tz => tz.id === timezone.id || 
           (tz.city === 'Mumbai' && timezone.city === 'Mumbai')
    );
    
    if (!alreadyExists) {
      setSelectedTimezones(prev => [...prev, timezone]);
    }
    setShowTimezoneSelector(false);
  }, [selectedTimezones]);

  const handleRemoveTimezone = useCallback((timezoneId: string) => {
    setSelectedTimezones(prev => prev.filter(tz => tz.id !== timezoneId));
  }, []);
  
  const moveTimezone = useCallback((dragIndex: number, hoverIndex: number) => {
    setSelectedTimezones(prevTimezones => {
      const newTimezones = [...prevTimezones];
      const draggedTimezone = newTimezones[dragIndex];
      
      // Remove the dragged item
      newTimezones.splice(dragIndex, 1);
      // Insert it at the new position
      newTimezones.splice(hoverIndex, 0, draggedTimezone);
      
      return newTimezones;
    });
  }, []);

  // Find optimal meeting times (business hours overlap)
  const findOptimalMeetingTimes = useCallback(() => {
    const businessHours = { start: 9, end: 17 };
    const optimalTimes: string[] = [];
    
    selectedTimezones.forEach(tz => {
      const timeInZone = moment(currentTime).tz(tz.id);
      const hour = timeInZone.hour();
      
      if (hour >= businessHours.start && hour <= businessHours.end) {
        optimalTimes.push(tz.id);
      }
    });
    
    return optimalTimes;
  }, [currentTime, selectedTimezones]);

  const optimalTimezones = findOptimalMeetingTimes();
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const startOfMonth = moment(currentMonth).startOf('month');
    const endOfMonth = moment(currentMonth).endOf('month');
    const startDate = moment(startOfMonth).startOf('week');
    const endDate = moment(endOfMonth).endOf('week');
    
    const days = [];
    let day = startDate.clone();
    
    while (day.isSameOrBefore(endDate)) {
      days.push(day.clone());
      day.add(1, 'day');
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarDays();
  const today = moment().format('D');
  const currentMonthName = currentMonth.format('MMMM YYYY');
  
  const nextMonth = () => {
    setCurrentMonth(moment(currentMonth).add(1, 'month'));
  };
  
  const prevMonth = () => {
    setCurrentMonth(moment(currentMonth).subtract(1, 'month'));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="world-clock-compact">
      {/* Calendar Header */}
      <div className="calendar-header">
        <button className="month-nav" onClick={prevMonth}>
          <ChevronLeft size={16} />
        </button>
        <h2 className="current-month">{currentMonthName}</h2>
        <div className="header-controls">
          <button 
            className="float-window-btn" 
            onClick={() => {
              // Open as floating window
              const url = window.location.href;
              // Calculate optimal window size based on content
              const clockCount = selectedTimezones.length;
              // Increase base height and per-clock height to ensure no scrolling
              const estimatedHeight = 300 + (clockCount * 120); // Header + clocks + extra padding
              const windowFeatures = `popup=yes,width=400,height=${estimatedHeight},left=100,top=100,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=no`;
              window.open(url, 'WorldClockApp', windowFeatures);
            }}
            title="Open in floating window"
          >
            <ExternalLink size={14} />
          </button>
          <button className="month-nav" onClick={nextMonth}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      {/* Calendar Days */}
      <div className="calendar-grid">
        <div className="weekday-header">Sun</div>
        <div className="weekday-header">Mon</div>
        <div className="weekday-header">Tue</div>
        <div className="weekday-header">Wed</div>
        <div className="weekday-header">Thu</div>
        <div className="weekday-header">Fri</div>
        <div className="weekday-header">Sat</div>
        
        {calendarDays.map((day, index) => {
          const isCurrentMonth = day.month() === currentMonth.month();
          const isToday = day.format('D') === today && day.month() === moment().month();
          const isSelected = day.format('D') === moment(currentTime).format('D') && 
                            day.month() === moment(currentTime).month();
          
          return (
            <div 
              key={index} 
              className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => {
                const newDate = new Date(currentTime);
                newDate.setDate(parseInt(day.format('D')));
                newDate.setMonth(day.month());
                setCurrentTime(newDate);
                setIsLive(false);
              }}
            >
              {day.format('D')}
            </div>
          );
        })}
      </div>
      
      {/* Time Slider (moved to top) */}
      <div className="time-slider-compact">
        <button 
          className={`reset-button ${!isLive ? 'active' : ''}`}
          onClick={() => {
            setCurrentTime(new Date());
            setIsLive(true);
          }}
          title="Reset to current time"
          disabled={isLive}
        >
          <RefreshCw size={14} />
        </button>
        <div className="time-display-container">
          <div className="time-display-value">
            {moment(currentTime).format('h:mm A')}
          </div>
        </div>
        <input 
          type="range" 
          min="0" 
          max="1425" 
          step="15"
          value={moment(currentTime).hours() * 60 + moment(currentTime).minutes()}
          onChange={(e) => {
            const totalMinutes = parseInt(e.target.value);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            const newTime = new Date(currentTime);
            newTime.setHours(hours, minutes, 0, 0);
            setCurrentTime(newTime);
            setIsLive(false);
          }}
          className="slider-compact"
        />
      </div>
      
      {/* Clock Display */}
      <div className="clocks-compact">
        {selectedTimezones.map((timezone, index) => (
          <DraggableClock
            key={timezone.id}
            timezone={timezone}
            currentTime={currentTime}
            index={index}
            moveTimezone={moveTimezone}
            onRemove={selectedTimezones.length > 1 ? () => handleRemoveTimezone(timezone.id) : undefined}
            isOptimalMeetingTime={optimalTimezones.includes(timezone.id)}
          />
        ))}
        
        <button className="add-timezone-btn" onClick={() => setShowTimezoneSelector(!showTimezoneSelector)}>
          <Plus size={16} />
        </button>
      </div>
      
      {/* Timezone Selector */}
      {showTimezoneSelector && (
        <div className="timezone-selector">
          <div className="timezone-list">
            {/* Top 30 major timezones */}
            {[
              // North America
              ...TIMEZONE_DATA.filter(tz => 
                tz.id.includes('America/New_York') || 
                tz.id.includes('America/Los_Angeles') || 
                tz.id.includes('America/Chicago') || 
                tz.id.includes('America/Toronto') || 
                tz.id.includes('America/Mexico_City') || 
                tz.id.includes('America/Vancouver')
              ),
              // Europe
              ...TIMEZONE_DATA.filter(tz => 
                tz.id.includes('Europe/London') || 
                tz.id.includes('Europe/Paris') || 
                tz.id.includes('Europe/Berlin') || 
                tz.id.includes('Europe/Madrid') || 
                tz.id.includes('Europe/Rome') || 
                tz.id.includes('Europe/Moscow') ||
                tz.id.includes('Europe/Zurich')
              ),
              // Asia
              ...TIMEZONE_DATA.filter(tz => 
                tz.id.includes('Asia/Dubai') || 
                tz.id.includes('Asia/Kolkata') || 
                tz.id.includes('Asia/Singapore') || 
                tz.id.includes('Asia/Tokyo') || 
                tz.id.includes('Asia/Hong_Kong') || 
                tz.id.includes('Asia/Shanghai') || 
                tz.id.includes('Asia/Seoul')
              ),
              // Australia & Pacific
              ...TIMEZONE_DATA.filter(tz => 
                tz.id.includes('Australia/Sydney') || 
                tz.id.includes('Pacific/Auckland') ||
                tz.id.includes('Australia/Melbourne')
              ),
              // South America & Africa
              ...TIMEZONE_DATA.filter(tz => 
                tz.id.includes('America/Sao_Paulo') || 
                tz.id.includes('Africa/Johannesburg') || 
                tz.id.includes('Africa/Cairo')
              ),
              // Add Mumbai as an option in the selector (with unique ID to prevent conflicts)
              {
                ...(TIMEZONE_DATA.find(tz => tz.id.includes('Asia/Kolkata')) || {
                  id: 'Asia/Kolkata',
                  name: 'India Standard Time',
                  city: 'Kolkata',
                  country: 'India',
                  offset: '+05:30',
                  coordinates: { lat: 22.5726, lng: 88.3639 }
                }),
                id: 'Asia/Mumbai', // Use a slightly different ID to prevent conflicts
                city: 'Mumbai',
                name: 'India Standard Time (Mumbai)'
              }
            ]
            .filter(tz => {
              // Filter out timezones that are already selected
              // Special handling for Mumbai which shares ID with Kolkata
              return !selectedTimezones.some(selected => 
                selected.id === tz.id || 
                (tz.city === 'Mumbai' && selected.city === 'Mumbai')
              );
            })
            .map(timezone => (
              <div 
                key={timezone.id} 
                className="timezone-option"
                onClick={() => handleAddTimezone(timezone)}
              >
                {timezone.city}, {timezone.country}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </DndProvider>
  );
};

export default WorldClock;
