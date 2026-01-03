import { NextRequest, NextResponse } from 'next/server';
import { db, tasks, schedule_blocks } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET /api/tasks/[id] - Fetch a single task
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const task = await db.query.tasks.findFirst({
            where: eq(tasks.id, id),
            with: {
                project: true
            }
        });

        if (!task) {
            return NextResponse.json(
                { success: false, error: 'Task not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, task });
    } catch (error: any) {
        console.error('Error fetching task:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PATCH /api/tasks/[id] - Update a task
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Build update object (only include provided fields)
        const updates: Record<string, any> = {};

        if (body.task_title !== undefined) updates.task_title = body.task_title.trim();
        if (body.task_description !== undefined) updates.task_description = body.task_description;
        if (body.time_estimate !== undefined) updates.time_estimate = parseInt(body.time_estimate);
        if (body.priority_score !== undefined) updates.priority_score = parseInt(body.priority_score);
        if (body.deadline_date !== undefined) updates.deadline_date = body.deadline_date ? new Date(body.deadline_date) : null;
        if (body.project_id !== undefined) updates.project_id = body.project_id;
        if (body.tags !== undefined) updates.tags = body.tags;
        if (body.notes !== undefined) updates.notes = body.notes;
        if (body.status !== undefined) {
            updates.status = body.status;
            // Set completed_at when status changes to completed
            if (body.status === 'completed') {
                updates.completed_at = new Date();
            } else if (body.status === 'pending') {
                updates.completed_at = null;
            }
        }

        updates.updated_at = new Date();

        if (Object.keys(updates).length === 0) {
            return NextResponse.json(
                { success: false, error: 'No valid fields to update' },
                { status: 400 }
            );
        }

        const [updatedTask] = await db.update(tasks)
            .set(updates)
            .where(eq(tasks.id, id))
            .returning();

        // Fetch with project details
        const taskWithProject = await db.query.tasks.findFirst({
            where: eq(tasks.id, updatedTask.id),
            with: {
                project: true
            }
        });

        return NextResponse.json({
            success: true,
            task: taskWithProject,
            message: 'Task updated successfully'
        });
    } catch (error: any) {
        console.error('Error updating task:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // First delete any schedule blocks for this task
        await db.delete(schedule_blocks)
            .where(eq(schedule_blocks.task_id, id));

        // Then delete the task
        await db.delete(tasks)
            .where(eq(tasks.id, id));

        return NextResponse.json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting task:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
