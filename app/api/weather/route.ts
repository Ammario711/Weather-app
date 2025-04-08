import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    console.error('API key missing');
    return NextResponse.json({ error: 'API key missing' }, { status: 500 });
  }

  if (!location) {
    return NextResponse.json({ error: 'Location required' }, { status: 400 });
  }

  try {
    const currentUrl = `https://api.weatherbit.io/v2.0/current?city=${encodeURIComponent(location)}&key=${apiKey}&units=M`;
    const forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?city=${encodeURIComponent(location)}&key=${apiKey}&units=M&days=7`;

    const [currentRes, forecastRes] = await Promise.all([
      axios.get(currentUrl),
      axios.get(forecastUrl),
    ]);

    const current = currentRes.data.data[0];
    let forecast = forecastRes.data.data;

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      forecast = forecast.filter((day: { datetime: string }) => {
        const dayDate = new Date(day.datetime);
        dayDate.setHours(0, 0, 0, 0);
        return dayDate >= startDate && dayDate <= endDate;
      });
    } else {
      forecast = [];
    }

    return NextResponse.json({
      current,
      forecast,
    });
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error('Weatherbit API Error:', axiosError.response?.data || axiosError.message);
    return NextResponse.json(
      {
        error: 'Weather fetch failed',
        details: axiosError.response?.data || axiosError.message || 'Unknown error',
      },
      { status: axiosError.response?.status || 500 }
    );
  }
}