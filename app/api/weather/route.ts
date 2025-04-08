import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    console.error('API key missing');
    return NextResponse.json({ error: 'API key missing' }, { status: 500 });
  }

  try {
    let currentUrl = `https://api.weatherbit.io/v2.0/current?key=${apiKey}&units=M`;
    let forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?key=${apiKey}&units=M&days=5`;

    if (lat && lon) {
      currentUrl += `&lat=${lat}&lon=${lon}`;
      forecastUrl += `&lat=${lat}&lon=${lon}`;
    } else if (location) {
      currentUrl += `&city=${location}`;
      forecastUrl += `&city=${location}`;
    } else {
      return NextResponse.json({ error: 'Location or coordinates required' }, { status: 400 });
    }

    const [currentRes, forecastRes] = await Promise.all([
      axios.get(currentUrl),
      axios.get(forecastUrl),
    ]);

    return NextResponse.json({
      current: currentRes.data.data[0], // Weatherbit nests current data in "data" array
      forecast: forecastRes.data.data, // Forecast is an array of daily data
    });
  } catch (error: any) {
    console.error('Weatherbit API Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Weather fetch failed', details: error.response?.data || error.message },
      { status: error.response?.status || 400 }
    );
  }
}