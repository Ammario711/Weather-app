import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parse } from 'json2csv';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'json'; // Default to JSON

  try {
    const data = await prisma.weatherRequest.findMany();
    const serializedData = data.map((item) => ({
      id: Number(item.id), // Convert BigInt to number
      location: item.location,
      dateRangeStart: item.dateRangeStart?.toISOString().split('T')[0] || null,
      dateRangeEnd: item.dateRangeEnd?.toISOString().split('T')[0] || null,
      temperatures: item.temperatures || [], // Already JSON-compatible
      createdAt: item.createdAt.toISOString(),
    }));

    switch (format.toLowerCase()) {
      case 'json':
        return NextResponse.json(serializedData, {
          headers: {
            'Content-Disposition': 'attachment; filename=weather_data.json',
          },
        });

      case 'csv':
        const csvFields = [
          'id',
          'location',
          'dateRangeStart',
          'dateRangeEnd',
          'createdAt',
          {
            label: 'Temperatures',
            value: (row: any) =>
              row.temperatures.map((t: { date: string; temp: number }) => `${t.date}:${t.temp}`).join(';'),
          },
        ];
        const csv = parse(serializedData, { fields: csvFields });
        return new NextResponse(csv, {
          status: 200,
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename=weather_data.csv',
          },
        });

      

      default:
        return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
    }
  } catch (error) {
    console.error('Export Error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}