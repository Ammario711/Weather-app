"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { ForecastData } from "@/lib/types"
import { motion } from "framer-motion"

interface ForecastDisplayProps {
  forecast: ForecastData[]
}

export default function ForecastDisplay({ forecast }: ForecastDisplayProps) {
  // Format date to show day name (e.g., "Mon", "Tue")
  const formatDay = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()

    // If it's today, return "Today" instead of the day name
    if (date.toDateString() === today.toDateString()) {
      return "Today"
    }

    return date.toLocaleDateString("en-US", { weekday: "short" })
  }

  // Format date to show month and day (e.g., "Apr 8")
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="mt-8">
      <h3 className="mb-5 text-xl font-medium tracking-tight">5-Day Forecast</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {forecast.map((day, index) => (
          <motion.div
            key={day.datetime}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-0">
                <div className="bg-gradient-to-b from-sky-50 to-white p-3 text-center dark:from-slate-900 dark:to-slate-800">
                  <p className="text-lg font-medium">{formatDay(day.datetime)}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(day.datetime)}</p>
                </div>

                <div className="flex justify-center py-4">
                  <img
                    src={`https://cdn.weatherbit.io/static/img/icons/${day.weather.icon}.png`}
                    alt={day.weather.description}
                    width={50}
                    height={50}
                    className="drop-shadow-sm transition-transform duration-300 hover:scale-110"
                  />
                </div>

                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-xs font-medium">High</div>
                    <div className="text-xs font-medium">Low</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{Math.round(day.max_temp)}°</span>
                    <div className="h-1 w-16 rounded-full bg-slate-200">
                      <div
                        className="h-1 rounded-full bg-gradient-to-r from-blue-400 to-sky-400"
                        style={{
                          width: "100%",
                        }}
                      ></div>
                    </div>
                    <span className="text-lg font-semibold text-slate-500">{Math.round(day.min_temp)}°</span>
                  </div>

                  <p className="mt-3 text-center text-xs capitalize">{day.weather.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
