import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/client';

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
    
    // Step 3: Get Supabase client with service role
    const supabase = getServiceSupabase();
    
    // Step 4: Upsert rules (update if exists, insert if new)
    const upsertPromises = body.rules.map(async (rule) => {
      return supabase
        .from('rules')
        .upsert(
          {
            rule_name: rule.rule_name,
            criteria_logic: rule.criteria_logic,
            source_id: rule.source_id,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'source_id' // Use source_id as unique identifier
          }
        );
    });
    
    const results = await Promise.all(upsertPromises);
    
    // Check for errors
    const errors = results.filter(r => r.error);
    if (errors.length > 0) {
      console.error('Upsert errors:', errors);
      return NextResponse.json(
        { 
          error: 'Failed to sync some rules',
          details: errors.map(e => e.error?.message)
        },
        { status: 500 }
      );
    }
    
    // Step 5: Log the sync
    await supabase.from('sync_logs').insert({
      sync_timestamp: body.sync_timestamp,
      rules_synced: body.rules.length,
      status: 'success'
    });
    
    // Step 6: Return success response
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
      const supabase = getServiceSupabase();
      await supabase.from('sync_logs').insert({
        sync_timestamp: new Date().toISOString(),
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
