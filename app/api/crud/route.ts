import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import axios from 'axios';
import { WeatherRequest } from '@/lib/types';

const serializeBigInt = (data: any) => {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    )
  );
};

export async function POST(request: Request) {
  const body: WeatherRequest = await request.json();
  console.log('Incoming request body:', body);

  const { location, dateRangeStart, dateRangeEnd } = body;

  if (!location) {
    console.error('Validation failed: Location missing');
    return NextResponse.json({ error: 'Location is required' }, { status: 400 });
  }

  let startDate: Date | null = null;
  let endDate: Date | null = null;
  if (dateRangeStart && dateRangeEnd) {
    startDate = new Date(dateRangeStart);
    endDate = new Date(dateRangeEnd);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate > endDate) {
      console.error('Validation failed: Invalid date range');
      return NextResponse.json({ error: 'Invalid date range' }, { status: 400 });
    }
    const diffDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 5) {
      console.error('Validation failed: Date range exceeds 5 days');
      return NextResponse.json({ error: 'Date range cannot exceed 5 days' }, { status: 400 });
    }
  } else if (dateRangeStart || dateRangeEnd) {
    console.error('Validation failed: Both dates required');
    return NextResponse.json({ error: 'Both start and end dates must be provided' }, { status: 400 });
  }

  const weatherApiKey = process.env.WEATHER_API_KEY;
  if (!weatherApiKey) {
    return NextResponse.json({ error: 'Weather API key missing' }, { status: 500 });
  }

  try {
    let temperatures: { date: string; temp: number }[] = [];

    if (startDate && endDate) {
      // Fetch forecast for range
      const forecastRes = await axios.get(
        `https://api.weatherbit.io/v2.0/forecast/daily?city=${encodeURIComponent(location)}&key=${weatherApiKey}&units=M&days=7`
      );
      const forecastData = forecastRes.data.data;

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      temperatures = forecastData
        .filter((day: { datetime: string }) => {
          const dayDate = new Date(day.datetime);
          dayDate.setHours(0, 0, 0, 0);
          return dayDate >= startDate && dayDate <= endDate;
        })
        .map((day: { datetime: string; temp: number }) => ({
          date: day.datetime,
          temp: day.temp,
        }));
    } else {
      // Fetch current for single day
      const currentRes = await axios.get(
        `https://api.weatherbit.io/v2.0/current?city=${encodeURIComponent(location)}&key=${weatherApiKey}&units=M`
      );
      temperatures = [
        {
          date: new Date().toISOString().split('T')[0], // Today’s date
          temp: currentRes.data.data[0].temp,
        },
      ];
    }

    const data = await prisma.weatherRequest.create({
      data: {
        location,
        dateRangeStart: startDate,
        dateRangeEnd: endDate,
        temperatures: temperatures.length > 0 ? temperatures : null,
      },
    });

    const serializedData = serializeBigInt(data);
    return NextResponse.json(serializedData, { status: 201 });
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to save data', details: error.response?.data || error.message },
      { status: error.response?.status || 500 }
    );
  }
}

// GET, PUT, DELETE unchanged (for now)
export async function GET() {
  try {
    const data = await prisma.weatherRequest.findMany();
    const serializedData = serializeBigInt(data);
    return NextResponse.json(serializedData);
  } catch (error) {
    console.error('Prisma Error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { id, temperatures }: Partial<WeatherRequest> & { temperatures?: { date: string; temp: number }[] } = await request.json();
  if (!id || !temperatures) {
    return NextResponse.json({ error: 'ID and temperatures required' }, { status: 400 });
  }

  try {
    const data = await prisma.weatherRequest.update({
      where: { id: Number(id) },
      data: { temperatures },
    });
    const serializedData = serializeBigInt(data);
    return NextResponse.json(serializedData);
  } catch (error) {
    console.error('Prisma Error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { id }: { id: number } = await request.json();
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  try {
    await prisma.weatherRequest.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Prisma Error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}