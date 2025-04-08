'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import WeatherDisplay from '@/components/weather-display';
import ForecastDisplay from '@/components/forecast-display';
import QueryProvider from '@/components/query-provider';

export default function Home() {
  const [location, setLocation] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [weatherType, setWeatherType] = useState<'current' | 'range'>('current');

  const { data: weather, error, refetch } = useQuery({
    queryKey: ['weather', location, weatherType, dateStart, dateEnd],
    queryFn: async () => {
      if (weatherType === 'range') {
        if (!dateStart || !dateEnd) {
          throw new Error('Start and end dates are required for range weather');
        }
        const start = new Date(dateStart);
        const end = new Date(dateEnd);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          throw new Error('Invalid date format');
        }
        const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays > 5) {
          throw new Error('Date range cannot exceed 5 days');
        }
        if (start > end) {
          throw new Error('End date must be after start date');
        }
      }

      // Save to database
      const crudRes = await fetch('/api/crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          ...(weatherType === 'range' && {
            dateRangeStart: dateStart,
            dateRangeEnd: dateEnd,
          }),
        }),
      });
      if (!crudRes.ok) {
        const errorData = await crudRes.json();
        throw new Error(errorData.error || 'Failed to save weather data');
      }
      await crudRes.json();

      // Fetch weather with date range if applicable
      const url =
        weatherType === 'range'
          ? `/api/weather?location=${encodeURIComponent(location)}&start=${dateStart}&end=${dateEnd}`
          : `/api/weather?location=${encodeURIComponent(location)}`;
      const weatherRes = await fetch(url);
      if (!weatherRes.ok) throw new Error('Failed to fetch weather');
      return weatherRes.json();
    },
    enabled: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const handleExport = async (format: string) => {
    const res = await fetch(`/api/export?format=${format}`);
    if (!res.ok) {
      console.error('Export failed:', await res.text());
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `weather_data.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <QueryProvider>
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Weather App</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city or zip code"
            className="w-full"
          />
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="weatherType"
                value="current"
                checked={weatherType === 'current'}
                onChange={() => setWeatherType('current')}
              />
              Current Weather
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="weatherType"
                value="range"
                checked={weatherType === 'range'}
                onChange={() => setWeatherType('range')}
              />
              Date Range Weather (Max 5 Days)
            </label>
          </div>
          {weatherType === 'range' && (
            <div className="flex flex-col gap-2">
              <Input
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                placeholder="Start Date"
              />
              <Input
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                placeholder="End Date"
              />
            </div>
          )}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={!location || (weatherType === 'range' && (!dateStart || !dateEnd))}
            >
              Get Weather
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Export Data</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('json')}>JSON</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>CSV</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </form>
        {error && <p className="text-red-500">Error: {error.message}</p>}
        {weather && (
          <>
            <WeatherDisplay weather={weather.current} />
            {weatherType === 'range' && weather.forecast && (
              <ForecastDisplay forecast={weather.forecast} />
            )}
          </>
        )}
      </main>
    </QueryProvider>
  );
}