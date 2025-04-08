export interface WeatherData {
  city_name: string;
  temp: number;
  app_temp: number;
  weather: {
    description: string;
    icon: string;
  };
  rh: number;
  wind_spd: number;
  clouds: number;
  sunrise?: string;
  sunset?: string;
}

export interface ForecastData {
  datetime: string;
  max_temp: number;
  min_temp: number;
  weather: {
    description: string;
    icon: string;
  };
}

export interface WeatherRequest {
  id?: number; // Optional for inserts (auto-incremented by Supabase)
  location: string;
  date_range_start: string;
  date_range_end: string;
  temperature?: number; // Optional as it might not always be provided
  created_at?: string; // Optional, set by Supabase with default NOW()
}