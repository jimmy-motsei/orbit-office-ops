import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/client';
import { createGmailClient, fetchUnreadEmails as fetchGmail } from '@/lib/email/gmailConnector';
import { createOutlookClient, fetchUnreadEmails as fetchOutlook } from '@/lib/email/outlookConnector';

/**
 * API Route: Ingest Emails
 * 
 * POST /api/ingest-email
 * 
 * Fetches unread emails from Gmail and Outlook, stores them in Supabase.
 * Designed to be triggered by Vercel Cron every 30 minutes.
 */

export const maxDuration = 60; // 60 seconds max execution time

export async function POST(request: NextRequest) {
  try {
    // Step 1: Verify cron secret (security)
    const authHeader = request.headers.get('Authorization');
    const expectedToken = `Bearer ${process.env.CRON_SECRET}`;
    
    if (authHeader !== expectedToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const supabase = getServiceSupabase();
    let totalIngested = 0;
    const errors: string[] = [];
    
    // Step 2: Fetch from Gmail
    try {
      if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_REFRESH_TOKEN) {
        console.log('📧 Fetching Gmail...');
        
        const gmailClient = createGmailClient({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN!
        });
        
        const gmailMessages = await fetchGmail(gmailClient, 30);
        console.log(`Found ${gmailMessages.length} Gmail messages`);
        
        // Insert into database
        for (const email of gmailMessages) {
          const { error } = await supabase
            .from('emails')
            .upsert(
              {
                ...email,
                is_read: false,
                is_processed: false
              },
              {
                onConflict: 'email_id',
                ignoreDuplicates: true
              }
            );
          
          if (!error) totalIngested++;
          else errors.push(`Gmail ${email.email_id}: ${error.message}`);
        }
      } else {
        console.log('⚠ Gmail credentials not configured');
      }
    } catch (error) {
      console.error('Gmail error:', error);
      errors.push(`Gmail: ${error}`);
    }
    
    // Step 3: Fetch from Outlook
    try {
      if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_TENANT_ID) {
        console.log('📧 Fetching Outlook...');
        
        const outlookClient = createOutlookClient({
          clientId: process.env.MICROSOFT_CLIENT_ID!,
          clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
          tenantId: process.env.MICROSOFT_TENANT_ID!
        });
        
        const outlookMessages = await fetchOutlook(outlookClient, 30);
        console.log(`Found ${outlookMessages.length} Outlook messages`);
        
        // Insert into database
        for (const email of outlookMessages) {
          const { error } = await supabase
            .from('emails')
            .upsert(
              {
                ...email,
                is_read: false,
                is_processed: false
              },
              {
                onConflict: 'email_id',
                ignoreDuplicates: true
              }
            );
          
          if (!error) totalIngested++;
          else errors.push(`Outlook ${email.email_id}: ${error.message}`);
        }
      } else {
        console.log('⚠ Outlook credentials not configured');
      }
    } catch (error) {
      console.error('Outlook error:', error);
      errors.push(`Outlook: ${error}`);
    }
    
    // Step 4: Return summary
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      ingested: totalIngested,
      errors: errors.length > 0 ? errors : undefined
    };
    
    console.log('✅ Ingestion complete:', response);
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Ingestion error:', error);
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
  
  // Create a new request with Authorization header
  const headers = new Headers(request.headers);
  headers.set('Authorization', `Bearer ${process.env.CRON_SECRET}`);
  
  return POST(
    new NextRequest(request.url, {
      method: 'POST',
      headers
    })
  );
}
