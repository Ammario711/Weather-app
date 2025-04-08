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
  temp: number; // Added for consistency
  weather: {
    description: string;
    icon: string;
  };
}

export interface WeatherRequest {
  id?: number; // Matches serialized BigInt-to-number output
  location: string;
  dateRangeStart?: string | Date | null;
  dateRangeEnd?: string | Date | null;
  temperatures?: { date: string; temp: number }[] | null;
  createdAt?: string | Date;
}