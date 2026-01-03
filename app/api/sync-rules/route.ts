import { NextRequest, NextResponse } from 'next/server';
import { db, rules, sync_logs } from '@/lib/db';

/**
 * API Route: Sync Rules from Apple Reminders
 * 
 * POST /api/sync-rules
 * 
 * This endpoint receives rules data from the local Python bridge script
 * that reads Apple Reminders and performs an upsert operation.
 */

interface ReminderRule {
  rule_name: string;
  criteria_logic: string;
  source_id: string; // Apple Reminder ID
}

interface SyncPayload {
  sync_timestamp: string;
  rules: ReminderRule[];
}

export async function POST(request: NextRequest) {
  try {
    // Step 1: Verify authentication
    const authHeader = request.headers.get('Authorization');
    const expectedToken = `Bearer ${process.env.API_SECRET_KEY}`;

    if (!authHeader || authHeader !== expectedToken) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or missing API key' },
        { status: 401 }
      );
    }

    // Step 2: Parse request body
    const body: SyncPayload = await request.json();

    if (!body.rules || !Array.isArray(body.rules)) {
      return NextResponse.json(
        { error: 'Invalid payload: rules array is required' },
        { status: 400 }
      );
    }

    // Step 3: Upsert rules (update if exists, insert if new)
    const upsertPromises = body.rules.map(async (rule) => {
      return db.insert(rules)
        .values({
          rule_name: rule.rule_name,
          criteria_logic: rule.criteria_logic,
          source_id: rule.source_id,
          updated_at: new Date()
        })
        .onConflictDoUpdate({
          target: rules.source_id,
          set: {
            rule_name: rule.rule_name,
            criteria_logic: rule.criteria_logic,
            updated_at: new Date()
          }
        });
    });

    try {
      await Promise.all(upsertPromises);
    } catch (error: any) {
      console.error('Upsert errors:', error);
      return NextResponse.json(
        {
          error: 'Failed to sync some rules',
          details: [error.message]
        },
        { status: 500 }
      );
    }

    // Step 4: Log the sync
    await db.insert(sync_logs).values({
      sync_timestamp: body.sync_timestamp ? new Date(body.sync_timestamp) : new Date(),
      rules_synced: body.rules.length,
      status: 'success'
    });

    // Step 5: Return success response
    return NextResponse.json({
      success: true,
      message: `Successfully synced ${body.rules.length} rules`,
      processed: body.rules.length,
      timestamp: body.sync_timestamp
    });

  } catch (error) {
    console.error('Sync error:', error);

    // Log failed sync
    try {
      await db.insert(sync_logs).values({
        sync_timestamp: new Date(),
        rules_synced: 0,
        status: 'error',
        error_message: error instanceof Error ? error.message : 'Unknown error'
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Return 405 for non-POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to sync rules.' },
    { status: 405 }
  );
}
