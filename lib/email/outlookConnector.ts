/**
 * Microsoft Outlook/Graph API Connector
 * 
 * Handles OAuth2 authentication and email fetching from Outlook/Microsoft 365
 */

import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';

interface OutlookCredentials {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  refreshToken?: string;
}

interface EmailMessage {
  email_id: string;
  source: 'outlook';
  sender_email: string;
  sender_name: string;
  subject: string;
  body_snippet: string;
  body_full: string;
  received_at: string;
}

/**
 * Create authenticated Microsoft Graph client
 */
export function createOutlookClient(credentials: OutlookCredentials): Client {
  const { clientId, clientSecret, tenantId } = credentials;
  
  const credential = new ClientSecretCredential(
    tenantId,
    clientId,
    clientSecret
  );
  
  return Client.initWithMiddleware({
    authProvider: {
      getAccessToken: async () => {
        const token = await credential.getToken('https://graph.microsoft.com/.default');
        return token.token;
      }
    }
  });
}

/**
 * Fetch unread emails from the last N minutes
 */
export async function fetchUnreadEmails(
  client: Client,
  minutesAgo: number = 30
): Promise<EmailMessage[]> {
  try {
    const filterDate = new Date(Date.now() - minutesAgo * 60 * 1000);
    const filterDateString = filterDate.toISOString();
    
    const response = await client
      .api('/me/messages')
      .filter(`isRead eq false and receivedDateTime ge ${filterDateString}`)
      .select('id,subject,from,receivedDateTime,bodyPreview,body')
      .top(50)
      .orderby('receivedDateTime DESC')
      .get();
    
    const messages = response.value || [];
    
    return messages.map(parseOutlookMessage).filter(Boolean) as EmailMessage[];
    
  } catch (error) {
    console.error('Outlook fetch error:', error);
    throw new Error(`Failed to fetch Outlook messages: ${error}`);
  }
}

/**
 * Parse Microsoft Graph API response into our email format
 */
function parseOutlookMessage(message: any): EmailMessage | null {
  try {
    const senderEmail = message.from?.emailAddress?.address || '';
    const senderName = message.from?.emailAddress?.name || senderEmail;
    
    const bodyContent = message.body?.content || '';
    const bodyType = message.body?.contentType || 'text';
    
    // Strip HTML if body is HTML
    let bodyFull = bodyContent;
    if (bodyType === 'html') {
      bodyFull = bodyContent.replace(/<[^>]*>/g, ''); // Simple HTML strip
    }
    
    return {
      email_id: message.id,
      source: 'outlook',
      sender_email: senderEmail,
      sender_name: senderName,
      subject: message.subject || '',
      body_snippet: (message.bodyPreview || '').substring(0, 500),
      body_full: bodyFull.substring(0, 10000),
      received_at: message.receivedDateTime
    };
    
  } catch (error) {
    console.error('Error parsing Outlook message:', error);
    return null;
  }
}

/**
 * Mark email as read
 */
export async function markAsRead(client: Client, emailId: string): Promise<void> {
  try {
    await client
      .api(`/me/messages/${emailId}`)
      .patch({
        isRead: true
      });
  } catch (error) {
    console.error(`Failed to mark email ${emailId} as read:`, error);
  }
}

/**
 * Generate OAuth2 authorization URL
 */
export function getAuthUrl(clientId: string, tenantId: string): string {
  const redirectUri = encodeURIComponent('http://localhost:3000/api/auth/outlook/callback');
  const scopes = encodeURIComponent('https://graph.microsoft.com/Mail.Read offline_access');
  
  return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?` +
    `client_id=${clientId}` +
    `&response_type=code` +
    `&redirect_uri=${redirectUri}` +
    `&response_mode=query` +
    `&scope=${scopes}`;
}
