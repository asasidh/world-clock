import React from 'react';
import moment from 'moment-timezone';
import { Circle } from 'lucide-react';
import type { TimezoneData } from '../data/timezones';

interface ClockProps {
  timezone: TimezoneData;
  currentTime: Date;
  isOptimalMeetingTime?: boolean;
}

const Clock: React.FC<ClockProps> = ({
  timezone,
  currentTime,
  isOptimalMeetingTime = false
}) => {
  const timeInZone = moment(currentTime).tz(timezone.id);
  
  // Get current location timezone
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const isCurrentLocation = timezone.id === localTimezone || 
                           (timezone.id.includes('America/Chicago') && localTimezone.includes('America/Chicago'));
  
  // Determine day label (Today, Next Day, Previous Day) based on local date
  let dayLabel = 'Today';
  
  // Get local date and timezone date for comparison
  const localDate = moment(currentTime).format('YYYY-MM-DD');
  const zonedDate = timeInZone.format('YYYY-MM-DD');
  
  // Compare dates to determine if it's next day or previous day
  if (zonedDate > localDate) {
    dayLabel = 'Next Day';
  } else if (zonedDate < localDate) {
    dayLabel = 'Previous Day';
  }

  return (
    <>
      <div className="city-label">
        <div className="city-with-indicator">
          <Circle 
            size={12} 
            className={`status-indicator ${isOptimalMeetingTime ? 'optimal' : ''}`} 
            fill={isOptimalMeetingTime ? "#48bb78" : "#f56565"}
          />
          <span>{timezone.city}</span>
        </div>
      </div>
      
      <div className="day-label">
        {isCurrentLocation ? 'Today' : dayLabel}
      </div>
      
      <div className="time-large">
        {timeInZone.format('h:mm')}
        <span className="ampm">{timeInZone.format('A')}</span>
      </div>
      
      <div className="timezone-code-right">
        {timeInZone.format('z')}
      </div>
    </>
  );
};

export default Clock;
