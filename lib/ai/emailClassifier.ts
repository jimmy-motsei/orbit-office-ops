/**
 * AI Email Classifier
 * 
 * Uses OpenAI GPT-4o to analyze emails and create tasks with time estimates,
 * priorities, and deadlines.
 */

import OpenAI from 'openai';
import { parseISO, addDays, startOfDay } from 'date-fns';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface Email {
  sender_email: string;
  sender_name: string;
  subject: string;
  body_snippet: string;
  body_full: string;
  received_at: string;
}

interface Rule {
  rule_name: string;
  criteria_logic: string;
  priority_override?: number;
  tag?: string;
}

interface ClassificationResult {
  task_title: string;
  task_description: string;
  estimated_minutes: number;
  priority_score: number;
  deadline_date: string | null;
  lead_time_buffer_days: number;
  tags: string[];
  ai_reasoning: string;
  should_skip: boolean; // True if email is spam/not actionable
}

/**
 * Classify an email and extract task information
 */
export async function classifyEmail(
  email: Email,
  rules: Rule[] = []
): Promise<ClassificationResult> {
  try {
    const prompt = buildClassificationPrompt(email, rules);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 800
    });
    
    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('Empty response from OpenAI');
    }
    
    const result = JSON.parse(response);
    
    // Validate and normalize the result
    return normalizeClassification(result, email);
    
  } catch (error) {
    console.error('Classification error:', error);
    
    // Fallback classification
    return {
      task_title: email.subject || 'Untitled Task',
      task_description: email.body_snippet,
      estimated_minutes: 30,
      priority_score: 50,
      deadline_date: null,
      lead_time_buffer_days: 1,
      tags: [],
      ai_reasoning: `Error in classification: ${error}. Using fallback values.`,
      should_skip: false
    };
  }
}

/**
 * System prompt for the AI
 */
const SYSTEM_PROMPT = `You are an expert task analyzer for a personal productivity system. Your job is to analyze emails and extract actionable task information.

For each email, determine:
1. **Task Title**: A clear, actionable title (max 100 chars)
2. **Estimated Time**: Realistic completion time in minutes (15, 30, 60, 90, 120, 180, 240, etc.)
3. **Priority Score**: 0-100 based on urgency and importance
   - 90-100: Critical/urgent (due today/tomorrow)
   - 70-89: High priority (due this week)
   - 50-69: Medium priority (due within 2 weeks)
   - 30-49: Low priority (no clear deadline)
   - 0-29: Very low/optional
4. **Deadline**: Extract any explicit or implicit deadlines. Return ISO 8601 format or null.
5. **Lead Time Buffer**: Days to finish before deadline (0-5)
   - 0: No buffer needed
   - 1-2: Standard buffer
   - 3-5: Complex tasks needing review time
6. **Should Skip**: True if this is spam, newsletter, automated notification, or not actionable

Be conservative with time estimates (round up). If uncertain about deadline, return null.

Return ONLY valid JSON with this exact structure:
{
  "task_title": "string",
  "task_description": "string",
  "estimated_minutes": number,
  "priority_score": number,
  "deadline_date": "ISO 8601 string or null",
  "lead_time_buffer_days": number,
  "tags": ["array", "of", "strings"],
  "ai_reasoning": "Why you made these choices",
  "should_skip": boolean
}`;

/**
 * Build the classification prompt
 */
function buildClassificationPrompt(email: Email, rules: Rule[]): string {
  let prompt = `Analyze this email:\n\n`;
  prompt += `From: ${email.sender_name} <${email.sender_email}>\n`;
  prompt += `Subject: ${email.subject}\n`;
  prompt += `Received: ${email.received_at}\n\n`;
  prompt += `Body:\n${email.body_full || email.body_snippet}\n\n`;
  
  if (rules.length > 0) {
    prompt += `Apply these custom rules:\n`;
    rules.forEach(rule => {
      prompt += `- ${rule.rule_name}: ${rule.criteria_logic}\n`;
    });
    prompt += `\n`;
  }
  
  prompt += `Current date: ${new Date().toISOString()}\n\n`;
  prompt += `Classify this email and extract task information.`;
  
  return prompt;
}

/**
 * Normalize and validate the AI response
 */
function normalizeClassification(
  result: any,
  email: Email
): ClassificationResult {
  // Ensure estimated_minutes is valid
  let estimatedMinutes = parseInt(result.estimated_minutes) || 30;
  estimatedMinutes = Math.max(15, Math.min(480, estimatedMinutes)); // 15min - 8hrs
  
  // Ensure priority_score is valid
  let priorityScore = parseInt(result.priority_score) || 50;
  priorityScore = Math.max(0, Math.min(100, priorityScore));
  
  // Parse deadline
  let deadlineDate: string | null = null;
  if (result.deadline_date && result.deadline_date !== 'null') {
    try {
      const parsed = parseISO(result.deadline_date);
      deadlineDate = parsed.toISOString();
    } catch {
      // Try to parse relative dates like "tomorrow", "friday", etc.
      deadlineDate = parseRelativeDate(result.deadline_date);
    }
  }
  
  // Ensure lead_time_buffer_days is valid
  let leadTimeBuffer = parseInt(result.lead_time_buffer_days) || 1;
  leadTimeBuffer = Math.max(0, Math.min(5, leadTimeBuffer));
  
  return {
    task_title: result.task_title || email.subject || 'Untitled Task',
    task_description: result.task_description || email.body_snippet,
    estimated_minutes: estimatedMinutes,
    priority_score: priorityScore,
    deadline_date: deadlineDate,
    lead_time_buffer_days: leadTimeBuffer,
    tags: Array.isArray(result.tags) ? result.tags : [],
    ai_reasoning: result.ai_reasoning || 'No reasoning provided',
    should_skip: result.should_skip === true
  };
}

/**
 * Parse relative date strings
 */
function parseRelativeDate(dateString: string): string | null {
  const today = startOfDay(new Date());
  const lower = dateString.toLowerCase();
  
  if (lower.includes('today')) {
    return today.toISOString();
  }
  
  if (lower.includes('tomorrow')) {
    return addDays(today, 1).toISOString();
  }
  
  if (lower.includes('next week') || lower.includes('monday')) {
    return addDays(today, 7).toISOString();
  }
  
  if (lower.includes('friday')) {
    // Find next Friday
    const dayOfWeek = today.getDay();
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
    return addDays(today, daysUntilFriday).toISOString();
  }
  
  return null;
}

/**
 * Batch classify multiple emails
 */
export async function classifyEmailsBatch(
  emails: Email[],
  rules: Rule[] = [],
  batchSize: number = 5
): Promise<Map<string, ClassificationResult>> {
  const results = new Map<string, ClassificationResult>();
  
  // Process in batches to avoid rate limits
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    const batchPromises = batch.map(async (email, index) => {
      // Add small delay between requests
      await new Promise(resolve => setTimeout(resolve, index * 200));
      const classification = await classifyEmail(email, rules);
      return { email, classification };
    });
    
    const batchResults = await Promise.all(batchPromises);
    batchResults.forEach(({ email, classification }) => {
      // Use sender_email + subject as unique key
      const key = `${email.sender_email}_${email.subject}`;
      results.set(key, classification);
    });
  }
  
  return results;
}
