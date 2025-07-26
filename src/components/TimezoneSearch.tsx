import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { searchTimezones } from '../data/timezones';
import type { TimezoneData } from '../data/timezones';

interface TimezoneSearchProps {
  onAddTimezone: (timezone: TimezoneData) => void;
  existingTimezones: string[];
}

const TimezoneSearch: React.FC<TimezoneSearchProps> = ({
  onAddTimezone,
  existingTimezones
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TimezoneData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const searchResults = searchTimezones(query)
        .filter(tz => !existingTimezones.includes(tz.id))
        .slice(0, 8);
      setResults(searchResults);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, existingTimezones]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddTimezone = (timezone: TimezoneData) => {
    onAddTimezone(timezone);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="timezone-search" ref={searchRef}>
      <div className="search-input-container">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Add timezone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          className="search-input"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="search-results">
          {results.map((timezone) => (
            <div
              key={timezone.id}
              className="search-result"
              onClick={() => handleAddTimezone(timezone)}
            >
              <div className="result-info">
                <span className="city">{timezone.city}</span>
                <span className="country">{timezone.country}</span>
              </div>
              <button className="add-btn" title="Add timezone">
                <Plus size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {isOpen && query.length > 0 && results.length === 0 && (
        <div className="search-results">
          <div className="no-results">
            No timezones found for "{query}"
          </div>
        </div>
      )}
    </div>
  );
};

export default TimezoneSearch;
