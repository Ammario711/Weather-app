import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { WeatherRequest } from '@/lib/types';

export async function POST(request: Request) {
  const { location, date_range_start, date_range_end, temperature }: WeatherRequest = await request.json();

  if (!location || !date_range_start || !date_range_end) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const startDate = new Date(date_range_start);
  const endDate = new Date(date_range_end);
  if (startDate > endDate) {
    return NextResponse.json({ error: 'Invalid date range' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('weather_requests')
    .insert([{ location, date_range_start, date_range_end, temperature }])
    .select();

  return error
    ? NextResponse.json({ error: error.message }, { status: 500 })
    : NextResponse.json(data, { status: 201 });
}

export async function GET() {
  const { data, error } = await supabase.from('weather_requests').select('*');
  return error
    ? NextResponse.json({ error: error.message }, { status: 500 })
    : NextResponse.json(data);
}

export async function PUT(request: Request) {
  const { id, temperature }: Partial<WeatherRequest> = await request.json();
  if (!id || !temperature) {
    return NextResponse.json({ error: 'ID and temperature required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('weather_requests')
    .update({ temperature })
    .eq('id', id);

  return error
    ? NextResponse.json({ error: error.message }, { status: 500 })
    : NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { id }: { id: number } = await request.json();
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  const { error } = await supabase.from('weather_requests').delete().eq('id', id);
  return error
    ? NextResponse.json({ error: error.message }, { status: 500 })
    : NextResponse.json({ success: true });
}