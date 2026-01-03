import { NextRequest, NextResponse } from 'next/server';
import { db, schedule_blocks } from '@/lib/db';
import { and, gte, lte, asc } from 'drizzle-orm';

// GET /api/schedule - Fetch schedule blocks within a date range
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const start = searchParams.get('start');
        const end = searchParams.get('end');

        if (!start || !end) {
            return NextResponse.json(
                { success: false, error: 'Start and end dates are required' },
                { status: 400 }
            );
        }

        const data = await db.query.schedule_blocks.findMany({
            where: and(
                gte(schedule_blocks.start_time, new Date(start)),
                lte(schedule_blocks.start_time, new Date(end))
            ),
            orderBy: [asc(schedule_blocks.start_time)]
        });

        return NextResponse.json({
            success: true,
            schedule: data || [],
            count: data?.length || 0
        });
    } catch (error: any) {
        console.error('Error fetching schedule:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
