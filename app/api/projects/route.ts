import { NextRequest, NextResponse } from 'next/server';
import { db, projects } from '@/lib/db';
import { eq, asc, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';


// GET /api/projects - Fetch all projects
export async function GET() {
    try {
        const data = await db.query.projects.findMany({
            where: eq(projects.is_active, true),
            orderBy: [asc(projects.sort_order)]
        });

        return NextResponse.json({
            success: true,
            projects: data || [],
            count: data?.length || 0
        });
    } catch (error: any) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.name) {
            return NextResponse.json(
                { success: false, error: 'Project name is required' },
                { status: 400 }
            );
        }

        // Get highest sort_order
        const existingProjects = await db.select({ sort_order: projects.sort_order })
            .from(projects)
            .orderBy(desc(projects.sort_order))
            .limit(1);

        const nextSortOrder = (existingProjects?.[0]?.sort_order || 0) + 1;

        const newProject = {
            name: body.name.trim(),
            description: body.description || null,
            color: body.color || '#06b6d4',
            icon: body.icon || 'folder',
            sort_order: nextSortOrder,
        };

        const [insertedProject] = await db.insert(projects)
            .values(newProject)
            .returning();

        return NextResponse.json({
            success: true,
            project: insertedProject,
            message: 'Project created successfully'
        });
    } catch (error: any) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
