export interface TimezoneData {
  id: string;
  name: string;
  city: string;
  country: string;
  offset: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const TIMEZONE_DATA: TimezoneData[] = [
  {
    id: 'UTC',
    name: 'Coordinated Universal Time',
    city: 'UTC',
    country: 'Universal',
    offset: '+00:00',
    coordinates: { lat: 0, lng: 0 }
  },
  {
    id: 'America/New_York',
    name: 'Eastern Time',
    city: 'New York',
    country: 'United States',
    offset: '-05:00',
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: 'America/Chicago',
    name: 'Central Time',
    city: 'Chicago',
    country: 'United States',
    offset: '-06:00',
    coordinates: { lat: 41.8781, lng: -87.6298 }
  },
  {
    id: 'America/Denver',
    name: 'Mountain Time',
    city: 'Denver',
    country: 'United States',
    offset: '-07:00',
    coordinates: { lat: 39.7392, lng: -104.9903 }
  },
  {
    id: 'America/Los_Angeles',
    name: 'Pacific Time',
    city: 'Los Angeles',
    country: 'United States',
    offset: '-08:00',
    coordinates: { lat: 34.0522, lng: -118.2437 }
  },
  {
    id: 'Europe/London',
    name: 'Greenwich Mean Time',
    city: 'London',
    country: 'United Kingdom',
    offset: '+00:00',
    coordinates: { lat: 51.5074, lng: -0.1278 }
  },
  {
    id: 'Europe/Paris',
    name: 'Central European Time',
    city: 'Paris',
    country: 'France',
    offset: '+01:00',
    coordinates: { lat: 48.8566, lng: 2.3522 }
  },
  {
    id: 'Europe/Berlin',
    name: 'Central European Time',
    city: 'Berlin',
    country: 'Germany',
    offset: '+01:00',
    coordinates: { lat: 52.5200, lng: 13.4050 }
  },
  {
    id: 'Asia/Tokyo',
    name: 'Japan Standard Time',
    city: 'Tokyo',
    country: 'Japan',
    offset: '+09:00',
    coordinates: { lat: 35.6762, lng: 139.6503 }
  },
  {
    id: 'Asia/Dubai',
    name: 'Gulf Standard Time',
    city: 'Dubai',
    country: 'UAE',
    offset: '+04:00',
    coordinates: { lat: 25.2048, lng: 55.2708 }
  },
  {
    id: 'Australia/Sydney',
    name: 'Australian Eastern Time',
    city: 'Sydney',
    country: 'Australia',
    offset: '+11:00',
    coordinates: { lat: -33.8688, lng: 151.2093 }
  },
  {
    id: 'Asia/Singapore',
    name: 'Singapore Standard Time',
    city: 'Singapore',
    country: 'Singapore',
    offset: '+08:00',
    coordinates: { lat: 1.3521, lng: 103.8198 }
  },
  {
    id: 'America/Sao_Paulo',
    name: 'Brasília Time',
    city: 'São Paulo',
    country: 'Brazil',
    offset: '-03:00',
    coordinates: { lat: -23.5505, lng: -46.6333 }
  },
  {
    id: 'Africa/Cairo',
    name: 'Eastern European Time',
    city: 'Cairo',
    country: 'Egypt',
    offset: '+02:00',
    coordinates: { lat: 30.0444, lng: 31.2357 }
  },
  {
    id: 'Asia/Mumbai',
    name: 'India Standard Time',
    city: 'Mumbai',
    country: 'India',
    offset: '+05:30',
    coordinates: { lat: 19.0760, lng: 72.8777 }
  }
];

export const getTimezoneByCity = (city: string): TimezoneData | undefined => {
  return TIMEZONE_DATA.find(tz => 
    tz.city.toLowerCase().includes(city.toLowerCase()) ||
    tz.country.toLowerCase().includes(city.toLowerCase())
  );
};

export const searchTimezones = (query: string): TimezoneData[] => {
  if (!query) return TIMEZONE_DATA;
  
  const lowerQuery = query.toLowerCase();
  return TIMEZONE_DATA.filter(tz => 
    tz.city.toLowerCase().includes(lowerQuery) ||
    tz.country.toLowerCase().includes(lowerQuery) ||
    tz.name.toLowerCase().includes(lowerQuery)
  );
};
