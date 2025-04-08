export interface WeatherData {
  city_name: string
  temp: number
  app_temp: number
  weather: {
    description: string
    icon: string
  }
  rh: number
  wind_spd: number
  clouds: number
  sunrise?: string
  sunset?: string
}

export interface ForecastData {
  datetime: string
  max_temp: number
  min_temp: number
  weather: {
    description: string
    icon: string
  }
}
