"use client"

import type React from "react"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Loader2 } from "lucide-react"
import WeatherDisplay from "@/components/weather-display"
import ForecastDisplay from "@/components/forecast-display"

export default function Home() {
  const [location, setLocation] = useState("")
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null)

  const {
    data: weather,
    error,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["weather", location, coords],
    queryFn: async () => {
      const query = coords ? `lat=${coords.lat}&lon=${coords.lon}` : `location=${encodeURIComponent(location)}`
      const res = await fetch(`/api/weather?${query}`)
      if (!res.ok) throw new Error("Failed to fetch weather")
      return res.json()
    },
    enabled: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCoords(null)
    refetch()
  }

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude })
        setLocation("")
        refetch()
      },
      () => alert("Location access denied"),
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Weather Forecast</h1>
        <p className="text-muted-foreground">Get accurate weather information for any location</p>
      </div>

      <div className="mx-auto mb-8 max-w-2xl rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 p-6 shadow-sm dark:from-slate-900 dark:to-slate-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter city or zip code"
              className="pl-10 pr-4"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button type="submit" disabled={!location || isRefetching} className="w-full sm:w-auto">
              {isRefetching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                "Get Weather"
              )}
            </Button>
            <Button variant="outline" onClick={getCurrentLocation} disabled={isRefetching} className="w-full sm:w-auto">
              <MapPin className="mr-2 h-4 w-4" />
              Use Current Location
            </Button>
          </div>
        </form>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
          <p>Error: {(error as Error).message}</p>
        </div>
      )}

      {weather && (
        <div className="space-y-6">
          <WeatherDisplay weather={weather.current} />
          <ForecastDisplay forecast={weather.forecast} />
        </div>
      )}

      {!weather && !error && (
        <div className="mt-12 text-center text-muted-foreground">
          <p>Enter a location to see the weather forecast</p>
        </div>
      )}
    </main>
  )
}
