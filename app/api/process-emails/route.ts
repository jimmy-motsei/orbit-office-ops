import { NextRequest, NextResponse } from 'next/server';
import { db, emails, rules, tasks } from '@/lib/db';
import { eq, asc } from 'drizzle-orm';
import { classifyEmail } from '@/lib/ai/emailClassifier';

/**
 * API Route: Process Emails into Tasks
 * 
 * POST /api/process-emails
 * 
 * Fetches unprocessed emails, classifies them with AI, and creates tasks.
 * Can be triggered manually or via cron.
 */

export const maxDuration = 300; // 5 minutes for AI processing

export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('Authorization');
    const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

    if (authHeader !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Step 1: Fetch unprocessed emails
    const unprocessedEmails = await db.select()
      .from(emails)
      .where(eq(emails.is_processed, false))
      .orderBy(asc(emails.received_at))
      .limit(20);

    if (!unprocessedEmails || unprocessedEmails.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No unprocessed emails',
        processed: 0
      });
    }

    console.log(`📧 Processing ${unprocessedEmails.length} emails...`);

    // Step 2: Fetch active rules
    const activeRules = await db.select()
      .from(rules)
      .where(eq(rules.is_active, true));

    // Step 3: Process each email
    let tasksCreated = 0;
    let emailsSkipped = 0;
    const errors: string[] = [];

    for (const email of unprocessedEmails) {
      try {
        console.log(`Classifying: "${email.subject}"`);

        // Classify email with AI
        const classification = await classifyEmail(email, activeRules || []);

        // Skip if AI determined it's not actionable
        if (classification.should_skip) {
          console.log(`⏭️  Skipping: ${classification.ai_reasoning}`);
          emailsSkipped++;

          // Mark as processed
          await db.update(emails)
            .set({ is_processed: true })
            .where(eq(emails.id, email.id));

          continue;
        }

        // Step 4: Create task
        try {
          await db.insert(tasks).values({
            email_id: email.id,
            sender_name: email.sender_name || '',
            task_title: classification.task_title,
            task_description: classification.task_description,
            time_estimate: classification.estimated_minutes,
            priority_score: classification.priority_score,
            deadline_date: classification.deadline_date ? new Date(classification.deadline_date) : null,
            lead_time_buffer_days: classification.lead_time_buffer_days,
            ai_reasoning: classification.ai_reasoning,
            tags: classification.tags,
            status: 'pending'
          });
        } catch (taskError: any) {
          console.error('Failed to create task:', taskError);
          errors.push(`Email ${email.id}: ${taskError.message}`);
          continue;
        }

        console.log(`✅ Created task: "${classification.task_title}" (${classification.estimated_minutes}min, priority: ${classification.priority_score})`);

        // Mark email as processed
        await db.update(emails)
          .set({ is_processed: true })
          .where(eq(emails.id, email.id));

        tasksCreated++;

        // Rate limiting: wait 500ms between API calls
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`Error processing email ${email.id}:`, error);
        errors.push(`Email ${email.id}: ${error}`);
      }
    }

    // Step 5: Return summary
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      emails_processed: unprocessedEmails.length,
      tasks_created: tasksCreated,
      emails_skipped: emailsSkipped,
      errors: errors.length > 0 ? errors : undefined
    };

    console.log('✅ Processing complete:', response);

    return NextResponse.json(response);

  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Allow GET for manual testing
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const headers = new Headers(request.headers);
  headers.set('Authorization', `Bearer ${process.env.CRON_SECRET}`);

  return POST(
    new NextRequest(request.url, {
      method: 'POST',
      headers
    })
  );
}
