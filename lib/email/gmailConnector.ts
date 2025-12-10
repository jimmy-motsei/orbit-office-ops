/**
 * Gmail API Connector
 * 
 * Handles OAuth2 authentication and email fetching from Gmail
 */

import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

interface GmailCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

interface EmailMessage {
  email_id: string;
  source: 'gmail';
  sender_email: string;
  sender_name: string;
  subject: string;
  body_snippet: string;
  body_full: string;
  received_at: string;
}

/**
 * Create authenticated Gmail client
 */
export function createGmailClient(credentials: GmailCredentials) {
  const { clientId, clientSecret, refreshToken } = credentials;
  
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'http://localhost:3000/api/auth/gmail/callback'
  );
  
  oauth2Client.setCredentials({
    refresh_token: refreshToken
  });
  
  return google.gmail({ version: 'v1', auth: oauth2Client });
}

/**
 * Fetch unread emails from the last N minutes
 */
export async function fetchUnreadEmails(
  gmail: any,
  minutesAgo: number = 30
): Promise<EmailMessage[]> {
  try {
    const after = Math.floor((Date.now() - minutesAgo * 60 * 1000) / 1000);
    
    // Search for unread emails
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: `is:unread after:${after}`,
      maxResults: 50
    });
    
    const messages = response.data.messages || [];
    
    if (messages.length === 0) {
      return [];
    }
    
    // Fetch full details for each message
    const emailPromises = messages.map(async (message: any) => {
      const details = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'full'
      });
      
      return parseGmailMessage(details.data);
    });
    
    const emails = await Promise.all(emailPromises);
    return emails.filter(Boolean) as EmailMessage[];
    
  } catch (error) {
    console.error('Gmail fetch error:', error);
    throw new Error(`Failed to fetch Gmail messages: ${error}`);
  }
}

/**
 * Parse Gmail API response into our email format
 */
function parseGmailMessage(message: any): EmailMessage | null {
  try {
    const headers = message.payload.headers;
    const getHeader = (name: string) => 
      headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || '';
    
    const from = getHeader('From');
    const senderMatch = from.match(/^(.*?)\s*<(.+?)>$/) || [];
    const senderName = senderMatch[1] || from;
    const senderEmail = senderMatch[2] || from;
    
    const subject = getHeader('Subject');
    const date = getHeader('Date');
    
    // Get body content
    let bodySnippet = message.snippet || '';
    let bodyFull = '';
    
    if (message.payload.body.data) {
      bodyFull = Buffer.from(message.payload.body.data, 'base64').toString('utf-8');
    } else if (message.payload.parts) {
      // Handle multipart messages
      const textPart = message.payload.parts.find((p: any) => p.mimeType === 'text/plain');
      if (textPart?.body.data) {
        bodyFull = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
      }
    }
    
    return {
      email_id: message.id,
      source: 'gmail',
      sender_email: senderEmail,
      sender_name: senderName,
      subject,
      body_snippet: bodySnippet.substring(0, 500),
      body_full: bodyFull.substring(0, 10000), // Limit to 10k chars
      received_at: new Date(date || message.internalDate).toISOString()
    };
    
  } catch (error) {
    console.error('Error parsing Gmail message:', error);
    return null;
  }
}

/**
 * Mark email as read
 */
export async function markAsRead(gmail: any, emailId: string): Promise<void> {
  try {
    await gmail.users.messages.modify({
      userId: 'me',
      id: emailId,
      requestBody: {
        removeLabelIds: ['UNREAD']
      }
    });
  } catch (error) {
    console.error(`Failed to mark email ${emailId} as read:`, error);
  }
}

/**
 * Generate OAuth2 authorization URL
 */
export function getAuthUrl(clientId: string, clientSecret: string): string {
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'http://localhost:3000/api/auth/gmail/callback'
  );
  
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
}

/**
 * Exchange authorization code for tokens
 */
export async function getTokensFromCode(
  clientId: string,
  clientSecret: string,
  code: string
): Promise<any> {
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'http://localhost:3000/api/auth/gmail/callback'
  );
  
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}
