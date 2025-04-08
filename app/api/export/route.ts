import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { parse } from 'json2csv';

export async function GET() {
  const { data, error } = await supabase.from('weather_requests').select('*');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const csv = parse(data);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=weather_data.csv',
    },
  });
}