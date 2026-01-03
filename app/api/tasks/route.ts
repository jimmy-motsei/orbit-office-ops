import { NextRequest, NextResponse } from 'next/server';
import { db, tasks } from '@/lib/db';
import { eq, desc, and } from 'drizzle-orm';

// GET /api/tasks - Fetch all tasks with optional filters
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const status = searchParams.get('status') || 'pending';
        const projectId = searchParams.get('project_id');
        const limit = parseInt(searchParams.get('limit') || '100');

        // Build where conditions
        const conditions = [];

        if (status !== 'all') {
            conditions.push(eq(tasks.status, status));
        }

        if (projectId) {
            conditions.push(eq(tasks.project_id, projectId));
        }

        const data = await db.query.tasks.findMany({
            where: conditions.length > 0 ? and(...conditions) : undefined,
            orderBy: [desc(tasks.priority_score)],
            limit: limit,
            with: {
                project: true
            }
        });

        return NextResponse.json({
            success: true,
            tasks: data || [],
            count: data?.length || 0
        });
    } catch (error: any) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST /api/tasks - Create a new manual task
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const { task_title, time_estimate, priority_score } = body;

        if (!task_title || !time_estimate) {
            return NextResponse.json(
                { success: false, error: 'Task title and time estimate are required' },
                { status: 400 }
            );
        }

        // Build task object
        const newTask = {
            task_title: task_title.trim(),
            task_description: body.task_description || null,
            time_estimate: parseInt(time_estimate),
            priority_score: parseInt(priority_score) || 50,
            deadline_date: body.deadline_date ? new Date(body.deadline_date) : null,
            project_id: body.project_id || null,
            tags: body.tags || [],
            notes: body.notes || null,
            source: 'manual', // Mark as manually created
            status: 'pending',
        };

        const [insertedTask] = await db.insert(tasks)
            .values(newTask)
            .returning();

        // Fetch the task with project details
        const taskWithProject = await db.query.tasks.findFirst({
            where: eq(tasks.id, insertedTask.id),
            with: {
                project: true
            }
        });

        return NextResponse.json({
            success: true,
            task: taskWithProject,
            message: 'Task created successfully'
        });
    } catch (error: any) {
        console.error('Error creating task:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
