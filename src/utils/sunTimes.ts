export interface SunTimes {
  sunrise: Date;
  sunset: Date;
  dayLength: number; // in hours
}

// Simplified sunrise/sunset calculation using astronomical formulas
export const calculateSunTimes = (lat: number, lng: number, date: Date): SunTimes => {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  
  // Solar declination
  const declination = 23.45 * Math.sin((360 * (284 + dayOfYear) / 365) * Math.PI / 180);
  
  // Hour angle
  const latRad = lat * Math.PI / 180;
  const declRad = declination * Math.PI / 180;
  
  const hourAngle = Math.acos(-Math.tan(latRad) * Math.tan(declRad)) * 180 / Math.PI;
  
  // Calculate sunrise and sunset times
  const solarNoon = 12 - (lng / 15);
  const sunriseHour = solarNoon - (hourAngle / 15);
  const sunsetHour = solarNoon + (hourAngle / 15);
  
  const sunrise = new Date(date);
  sunrise.setHours(Math.floor(sunriseHour), Math.floor((sunriseHour % 1) * 60), 0, 0);
  
  const sunset = new Date(date);
  sunset.setHours(Math.floor(sunsetHour), Math.floor((sunsetHour % 1) * 60), 0, 0);
  
  const dayLength = (sunset.getTime() - sunrise.getTime()) / (1000 * 60 * 60);
  
  return {
    sunrise,
    sunset,
    dayLength
  };
};

export const formatSunTime = (date: Date): string => {
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

export const isDayTime = (currentTime: Date, sunTimes: SunTimes): boolean => {
  return currentTime >= sunTimes.sunrise && currentTime <= sunTimes.sunset;
};
