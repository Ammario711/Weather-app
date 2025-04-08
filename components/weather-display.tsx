"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { WeatherData } from "@/lib/types"
import { Cloud, Droplets, Thermometer, Wind, MapPin, Clock } from "lucide-react"

interface WeatherDisplayProps {
  weather: WeatherData
}

export default function WeatherDisplay({ weather }: WeatherDisplayProps) {
  const [currentTime, setCurrentTime] = useState<string>("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  // Determine background gradient based on weather condition
  const getWeatherGradient = () => {
    const icon = weather.weather.icon

    if (icon.includes("c0") || icon.includes("01")) return "from-sky-400 to-blue-500" // Clear
    if (icon.includes("c02") || icon.includes("c03")) return "from-blue-400 to-indigo-500" // Partly cloudy
    if (icon.includes("c04")) return "from-slate-400 to-slate-600" // Cloudy
    if (icon.includes("r")) return "from-blue-600 to-slate-700" // Rain
    if (icon.includes("s")) return "from-indigo-500 to-purple-600" // Snow
    if (icon.includes("t")) return "from-slate-700 to-slate-900" // Thunderstorm

    return "from-sky-500 to-blue-600" // Default
  }

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardContent className="p-0">
        <div className={`bg-gradient-to-br ${getWeatherGradient()} p-8 text-white relative overflow-hidden`}>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <h2 className="text-3xl font-bold tracking-tight">{weather.city_name}</h2>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4" />
                <span>{currentTime}</span>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={`https://cdn.weatherbit.io/static/img/icons/${weather.weather.icon}.png`}
                  alt={weather.weather.description}
                  className="h-24 w-24 drop-shadow-lg"
                />
                <div className="text-6xl font-extralight tracking-tighter">{Math.round(weather.temp)}°</div>
              </div>

              <div className="text-right">
                <p className="text-lg font-medium capitalize">{weather.weather.description}</p>
                <div className="mt-1 flex items-center justify-end gap-3">
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-4 w-4" />
                    <span className="text-sm">Feels like {Math.round(weather.app_temp)}°</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800">
            <Droplets className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">Humidity</p>
              <p className="text-lg font-semibold">{weather.rh}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800">
            <Wind className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">Wind</p>
              <p className="text-lg font-semibold">{weather.wind_spd.toFixed(1)} m/s</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800">
            <Cloud className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">Cloud Cover</p>
              <p className="text-lg font-semibold">{weather.clouds}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800">
            <div className="flex flex-col items-center">
              <Thermometer className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Temperature</p>
              <p className="text-lg font-semibold">
                {weather.temp > 0 ? "+" : ""}
                {Math.round(weather.temp)}°C
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
