import * as dotenv from 'dotenv';
// Load environment variables before importing db
dotenv.config({ path: '.env.local' });

import { db } from '../lib/db';
import { projects, tasks } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

const PROJECT_NAME = "MARU LEAD GRADER - 30-DAY PLAN";
const PROJECT_DESC = "Revenue Execution Plan: Lead Magnet → Service Sale. Goal: 3 paying customers by Feb 5, 2026.";
const PROJECT_COLOR = "#ef4444"; // Red for urgency
const PROJECT_ICON = "target";

// Helper to parse date strings like "Jan 6, 2026 10:00 AM"
function parseDate(dateStr: string): Date {
    // Assuming current year 2026 as per plan
    return new Date(dateStr);
}

const TASKS = [
    // WEEK 1: COMPLETE THE FUNNEL
    // MONDAY JAN 6
    {
        title: "Test full user flow",
        desc: "Submit own website through grader. Check PDF generation, email delivery, data capture. Document what works/broken. Fix blockers.",
        priority: 90, // URGENT
        time: 60,
        deadline: "2026-01-06T10:00:00",
        tags: ["Week 1", "Urgent", "Product"]
    },
    {
        title: "Review current submissions",
        desc: "Check how many submissions so far, identify real prospects, document patterns.",
        priority: 90,
        time: 60,
        deadline: "2026-01-06T11:00:00",
        tags: ["Week 1", "Urgent", "Sales"]
    },
    {
        title: "Define 3 service packages",
        desc: "Define Starter (Quick Win), Growth (Lead Gen System), Premium (Full Stack). Include scope, deliverables, timeline, outcomes.",
        priority: 90,
        time: 120,
        deadline: "2026-01-06T13:00:00",
        tags: ["Week 1", "Urgent", "Strategy"]
    },
    {
        title: "Create service package one-pagers",
        desc: "Create PDF for each package using Canva. Include problem solved, what you get, price, timeline.",
        priority: 90,
        time: 120,
        deadline: "2026-01-06T16:00:00",
        tags: ["Week 1", "Urgent", "Marketing"]
    },
    {
        title: "Set up Calendly",
        desc: "Set up free account, 30-min 'Website Audit Review' meetings, buffer time, Zoom/Meet link.",
        priority: 90,
        time: 60,
        deadline: "2026-01-06T17:00:00",
        tags: ["Week 1", "Urgent", "Admin"]
    },
    {
        title: "Create discovery call script",
        desc: "Opening (review score), Questions (impact, budget), Presentation (package fit), Close (next step).",
        priority: 90,
        time: 60,
        deadline: "2026-01-06T18:00:00",
        tags: ["Week 1", "Urgent", "Sales"]
    },
    // TUESDAY JAN 7
    {
        title: "Choose email automation tool",
        desc: "Select Mailchimp, Sendinblue, or Gmail+Streak. Set up account, connect to lead grader.",
        priority: 70, // HIGH
        time: 60,
        deadline: "2026-01-07T10:00:00",
        tags: ["Week 1", "High", "Tech"]
    },
    {
        title: "Write follow-up email sequence",
        desc: "Write Email 0 (PDF), Email 1 (Observation), Email 2 (Case Study), Email 3 (Call CTA).",
        priority: 70,
        time: 180,
        deadline: "2026-01-07T13:00:00",
        tags: ["Week 1", "High", "Marketing"]
    },
    {
        title: "Set up email automation",
        desc: "Load sequences, test triggers, verify links and personalization.",
        priority: 70,
        time: 180,
        deadline: "2026-01-07T17:00:00",
        tags: ["Week 1", "High", "Tech"]
    },
    {
        title: "Create tracking spreadsheet",
        desc: "Columns: Name, Company, Email, Website, Score, Date, Status, Call Booked, Notes.",
        priority: 70,
        time: 60,
        deadline: "2026-01-07T18:00:00",
        tags: ["Week 1", "High", "Admin"]
    },
    // WEDNESDAY JAN 8
    {
        title: "Write 5 LinkedIn posts for Week 1-2",
        desc: "Topics: SA SMB audit results, bounce rates, wasted budget, scorecard infographic, case study teaser.",
        priority: 50, // MEDIUM
        time: 180,
        deadline: "2026-01-08T12:00:00",
        tags: ["Week 1", "Medium", "Content"]
    },
    {
        title: "Create case study template",
        desc: "Before/After format, metrics, customer quote section.",
        priority: 50,
        time: 120,
        deadline: "2026-01-08T14:00:00",
        tags: ["Week 1", "Medium", "Content"]
    },
    {
        title: "Design simple one-page website section",
        desc: "Add to maruonline.com. Headline, subhead, form/iframe, social proof.",
        priority: 50,
        time: 180,
        deadline: "2026-01-08T17:00:00",
        tags: ["Week 1", "Medium", "Web"]
    },
    {
        title: "Create LinkedIn banner with CTA",
        desc: "Canva template. Text: 'Free Website Grader -> [URL]'. Update profile.",
        priority: 50,
        time: 60,
        deadline: "2026-01-08T18:00:00",
        tags: ["Week 1", "Medium", "Design"]
    },
    // THURSDAY JAN 9
    {
        title: "Build target list - 50 SA SMBs",
        desc: "LinkedIn search: Business owners, marketing managers. Industries: Services, B2B, Retail. Check websites for issues.",
        priority: 70,
        time: 180,
        deadline: "2026-01-09T12:00:00",
        tags: ["Week 1", "High", "Sales"]
    },
    {
        title: "Write outreach message templates",
        desc: "Template A (Direct), Template B (Soft intro), Template C (Value first).",
        priority: 70,
        time: 120,
        deadline: "2026-01-09T14:00:00",
        tags: ["Week 1", "High", "Sales"]
    },
    {
        title: "Set up LinkedIn outreach tracking",
        desc: "Add columns to spreadsheet: Sent Date, Template, Response, Grader Submitted, Call Booked.",
        priority: 70,
        time: 60,
        deadline: "2026-01-09T15:00:00",
        tags: ["Week 1", "High", "Admin"]
    },
    {
        title: "Prepare personal website audit examples",
        desc: "Manually review 10 target sites. Create quick audit notes for personalized outreach.",
        priority: 70,
        time: 180,
        deadline: "2026-01-09T18:00:00",
        tags: ["Week 1", "High", "Sales"]
    },
    // FRIDAY JAN 10
    {
        title: "Post LinkedIn Post #1",
        desc: "Use pre-written post. Pin to profile. Share to groups.",
        priority: 90,
        time: 30,
        deadline: "2026-01-10T09:30:00",
        tags: ["Week 1", "Urgent", "Marketing"]
    },
    {
        title: "Send 20 connection requests",
        desc: "Personalized note, mention company. Track in spreadsheet.",
        priority: 90,
        time: 120,
        deadline: "2026-01-10T11:30:00",
        tags: ["Week 1", "Urgent", "Sales"]
    },
    {
        title: "Send 10 direct messages",
        desc: "To existing connections. Use Template A. Track responses.",
        priority: 90,
        time: 120,
        deadline: "2026-01-10T13:30:00",
        tags: ["Week 1", "Urgent", "Sales"]
    },
    {
        title: "Engage with LinkedIn content",
        desc: "Comment on 10 posts from target audience. Thoughtful comments.",
        priority: 90,
        time: 60,
        deadline: "2026-01-10T15:00:00",
        tags: ["Week 1", "Urgent", "Marketing"]
    },
    {
        title: "Follow up on any responses",
        desc: "Reply to interested leads. Send grader link. Offer walkthrough.",
        priority: 90,
        time: 120,
        deadline: "2026-01-10T17:00:00",
        tags: ["Week 1", "Urgent", "Sales"]
    },
    {
        title: "End of day review",
        desc: "Review responses, grader submissions. Plan for tomorrow.",
        priority: 90,
        time: 60,
        deadline: "2026-01-10T18:00:00",
        tags: ["Week 1", "Urgent", "Review"]
    },
    // SATURDAY JAN 11
    {
        title: "LinkedIn Post #2",
        desc: "Post second pre-written post. Respond to comments.",
        priority: 50,
        time: 60,
        deadline: "2026-01-11T11:00:00",
        tags: ["Week 1", "Medium", "Marketing"]
    },
    {
        title: "Week 1 metrics review",
        desc: "Review grader submissions, outreach stats, response rate, calls booked.",
        priority: 50,
        time: 120,
        deadline: "2026-01-11T13:00:00",
        tags: ["Week 1", "Medium", "Review"]
    },
    {
        title: "Plan Week 2 outreach targets",
        desc: "Add 30 more companies to list. Refine targeting.",
        priority: 50,
        time: 60,
        deadline: "2026-01-11T14:00:00",
        tags: ["Week 1", "Medium", "Planning"]
    },

    // WEEK 2: SCALE OUTREACH + FIRST CALLS
    // MONDAY JAN 13
    {
        title: "Review all grader submissions from Week 1",
        desc: "Analyze submissions, note low/high scores. Prepare follow-ups.",
        priority: 70,
        time: 60,
        deadline: "2026-01-13T10:00:00",
        tags: ["Week 2", "High", "Sales"]
    },
    {
        title: "Personal follow-up emails to all submitters",
        desc: "Send personalized emails with specific observations and call CTA.",
        priority: 70,
        time: 180,
        deadline: "2026-01-13T13:00:00",
        tags: ["Week 2", "High", "Sales"]
    },
    {
        title: "LinkedIn outreach - 30 new messages",
        desc: "Mix of connection requests and DMs. A/B test templates.",
        priority: 70,
        time: 180,
        deadline: "2026-01-13T17:00:00",
        tags: ["Week 2", "High", "Sales"]
    },
    {
        title: "Engage on LinkedIn",
        desc: "Comment on 15 posts. Share insights. Natural CTA.",
        priority: 70,
        time: 60,
        deadline: "2026-01-13T18:00:00",
        tags: ["Week 2", "High", "Marketing"]
    },
    // TUESDAY JAN 14
    {
        title: "LinkedIn Post #3",
        desc: "Share insight from grader submissions (e.g., '8/10 had this flaw').",
        priority: 90,
        time: 30,
        deadline: "2026-01-14T09:30:00",
        tags: ["Week 2", "Urgent", "Marketing"]
    },
    {
        title: "Conduct discovery calls",
        desc: "Use script, take notes, present package, ask for sale. Track objections.",
        priority: 90,
        time: 390, // 6.5 hours
        deadline: "2026-01-14T16:00:00",
        tags: ["Week 2", "Urgent", "Sales"]
    },
    {
        title: "Send proposal/quote after each call",
        desc: "Personalize proposal based on call. Include scope, price, next steps.",
        priority: 90,
        time: 120,
        deadline: "2026-01-14T18:00:00",
        tags: ["Week 2", "Urgent", "Sales"]
    },
    // WEDNESDAY JAN 15
    {
        title: "Continue LinkedIn outreach - 35 messages",
        desc: "Focus on best performing template. Target similar profiles.",
        priority: 70,
        time: 180,
        deadline: "2026-01-15T12:00:00",
        tags: ["Week 2", "High", "Sales"]
    },
    {
        title: "Follow up on proposals sent",
        desc: "Call or email to check status. Handle objections. Ask for commitment.",
        priority: 70,
        time: 120,
        deadline: "2026-01-15T14:00:00",
        tags: ["Week 2", "High", "Sales"]
    },
    {
        title: "Respond to all grader submissions",
        desc: "Personal email within 2 hours. Offer call.",
        priority: 70,
        time: 120,
        deadline: "2026-01-15T16:00:00",
        tags: ["Week 2", "High", "Sales"]
    },
    {
        title: "Create urgency campaign",
        desc: "Email non-bookers: '3 slots left this week'. Create scarcity.",
        priority: 70,
        time: 120,
        deadline: "2026-01-15T18:00:00",
        tags: ["Week 2", "High", "Marketing"]
    },
    // THURSDAY JAN 16
    {
        title: "LinkedIn Post #4",
        desc: "Share website mistake infographic.",
        priority: 90,
        time: 30,
        deadline: "2026-01-16T09:30:00",
        tags: ["Week 2", "Urgent", "Marketing"]
    },
    {
        title: "More discovery calls",
        desc: "Goal: Book 3-5 calls. Refine pitch.",
        priority: 90,
        time: 390,
        deadline: "2026-01-16T16:00:00",
        tags: ["Week 2", "Urgent", "Sales"]
    },
    {
        title: "Close first customer",
        desc: "Follow up aggressively. Offer immediate start. Flex price if needed.",
        priority: 90,
        time: 120,
        deadline: "2026-01-16T18:00:00",
        tags: ["Week 2", "Urgent", "Sales", "Milestone"]
    },
    // FRIDAY JAN 17
    {
        title: "Follow up on all outstanding proposals",
        desc: "Final push for Week 2 commitments.",
        priority: 70,
        time: 180,
        deadline: "2026-01-17T12:00:00",
        tags: ["Week 2", "High", "Sales"]
    },
    {
        title: "More LinkedIn outreach - 20 messages",
        desc: "Keep pipeline full.",
        priority: 70,
        time: 120,
        deadline: "2026-01-17T14:00:00",
        tags: ["Week 2", "High", "Sales"]
    },
    {
        title: "Week 2 comprehensive review",
        desc: "Metrics: Submissions, calls, proposals, customers. Analysis: Conversion rates, templates, objections.",
        priority: 70,
        time: 180,
        deadline: "2026-01-17T17:00:00",
        tags: ["Week 2", "High", "Review"]
    },
    {
        title: "Plan Week 3 strategy",
        desc: "Scale if customer closed, or pivot if 0 customers.",
        priority: 70,
        time: 60,
        deadline: "2026-01-17T18:00:00",
        tags: ["Week 2", "High", "Planning"]
    },
    // SATURDAY JAN 18
    {
        title: "LinkedIn Post #5",
        desc: "Share win or valuable insight.",
        priority: 30, // LOW
        time: 60,
        deadline: "2026-01-18T11:00:00",
        tags: ["Week 2", "Low", "Marketing"]
    },
    {
        title: "Write 5 more posts for Week 3-4",
        desc: "Batch content creation.",
        priority: 30,
        time: 120,
        deadline: "2026-01-18T13:00:00",
        tags: ["Week 2", "Low", "Content"]
    },

    // WEEK 3: SCALE + DELIVER
    // MONDAY JAN 20
    {
        title: "Critical checkpoint meeting with self",
        desc: "Decide: Continue or pivot based on customer count.",
        priority: 90,
        time: 60,
        deadline: "2026-01-20T10:00:00",
        tags: ["Week 3", "Urgent", "Strategy"]
    },
    {
        title: "Customer kickoff (if applicable)",
        desc: "Onboarding call, set expectations, get access.",
        priority: 90,
        time: 120,
        deadline: "2026-01-20T12:00:00",
        tags: ["Week 3", "Urgent", "Delivery"]
    },
    {
        title: "LinkedIn outreach - 40 messages",
        desc: "Scale volume. Add social proof if available.",
        priority: 90,
        time: 240,
        deadline: "2026-01-20T16:00:00",
        tags: ["Week 3", "Urgent", "Sales"]
    },
    {
        title: "Imani VA outreach",
        desc: "Contact Imani VA for scaling help.",
        priority: 90,
        time: 60,
        deadline: "2026-01-20T17:00:00",
        tags: ["Week 3", "Urgent", "Partnership"]
    },
    {
        title: "Update grader with social proof",
        desc: "Add 'Join 50+ businesses', testimonials, trust badges.",
        priority: 90,
        time: 60,
        deadline: "2026-01-20T18:00:00",
        tags: ["Week 3", "Urgent", "Web"]
    },
    // TUESDAY JAN 21
    {
        title: "Work on customer deliverables",
        desc: "Protect this time. Deliver quality work.",
        priority: 70,
        time: 240,
        deadline: "2026-01-21T13:00:00",
        tags: ["Week 3", "High", "Delivery"]
    },
    {
        title: "Discovery calls with new leads",
        desc: "Book 3-5 calls. Close aggressively.",
        priority: 70,
        time: 180,
        deadline: "2026-01-21T17:00:00",
        tags: ["Week 3", "High", "Sales"]
    },
    {
        title: "Evening outreach batch",
        desc: "15 more messages. Follow up on responses.",
        priority: 70,
        time: 60,
        deadline: "2026-01-21T18:00:00",
        tags: ["Week 3", "High", "Sales"]
    },
    // WEDNESDAY JAN 22
    {
        title: "Imani VA partnership call",
        desc: "Propose trial: They handle onboarding. Define revenue split.",
        priority: 50,
        time: 60,
        deadline: "2026-01-22T10:00:00",
        tags: ["Week 3", "Medium", "Partnership"]
    },
    {
        title: "Document customer onboarding process",
        desc: "Checklist, templates, tools. Prepare for handoff.",
        priority: 50,
        time: 120,
        deadline: "2026-01-22T12:00:00",
        tags: ["Week 3", "Medium", "Ops"]
    },
    {
        title: "LinkedIn outreach - 35 messages",
        desc: "Keep pipeline flowing.",
        priority: 50,
        time: 180,
        deadline: "2026-01-22T15:00:00",
        tags: ["Week 3", "Medium", "Sales"]
    },
    {
        title: "Create simple referral program",
        desc: "Offer 10% off for referrals. Email customers.",
        priority: 50,
        time: 120,
        deadline: "2026-01-22T17:00:00",
        tags: ["Week 3", "Medium", "Marketing"]
    },
    {
        title: "More discovery calls",
        desc: "At least 1-2 calls.",
        priority: 50,
        time: 60,
        deadline: "2026-01-22T18:00:00",
        tags: ["Week 3", "Medium", "Sales"]
    },
    // THURSDAY JAN 23
    {
        title: "Customer delivery work",
        desc: "Stay on track. Over-deliver.",
        priority: 90,
        time: 180,
        deadline: "2026-01-23T12:00:00",
        tags: ["Week 3", "Urgent", "Delivery"]
    },
    {
        title: "Aggressive follow-up on open proposals",
        desc: "Create urgency: 'Rates going up Feb 1'. Close 1-2 more.",
        priority: 90,
        time: 180,
        deadline: "2026-01-23T15:00:00",
        tags: ["Week 3", "Urgent", "Sales"]
    },
    {
        title: "More discovery calls",
        desc: "Schedule as many as possible.",
        priority: 90,
        time: 180,
        deadline: "2026-01-23T18:00:00",
        tags: ["Week 3", "Urgent", "Sales"]
    },
    // FRIDAY JAN 24
    {
        title: "Customer check-ins",
        desc: "Get feedback, identify upsells, ask for testimonials.",
        priority: 70,
        time: 120,
        deadline: "2026-01-24T11:00:00",
        tags: ["Week 3", "High", "Delivery"]
    },
    {
        title: "Week 3 metrics review",
        desc: "Targets: 2-3 customers, 5+ leads, R15-30k MRR.",
        priority: 70,
        time: 120,
        deadline: "2026-01-24T13:00:00",
        tags: ["Week 3", "High", "Review"]
    },
    {
        title: "Final outreach push for week",
        desc: "25 more messages.",
        priority: 70,
        time: 180,
        deadline: "2026-01-24T16:00:00",
        tags: ["Week 3", "High", "Sales"]
    },
    {
        title: "Plan Week 4 (final push)",
        desc: "Goal: 3 customers minimum. Strategy for final week.",
        priority: 70,
        time: 120,
        deadline: "2026-01-24T18:00:00",
        tags: ["Week 3", "High", "Planning"]
    },
    // SATURDAY JAN 25
    {
        title: "Create Week 4 LinkedIn content",
        desc: "Success stories, tips, CTAs.",
        priority: 30,
        time: 120,
        deadline: "2026-01-25T12:00:00",
        tags: ["Week 3", "Low", "Content"]
    },
    {
        title: "Update website with results",
        desc: "Add customer count, testimonials.",
        priority: 30,
        time: 60,
        deadline: "2026-01-25T13:00:00",
        tags: ["Week 3", "Low", "Web"]
    },

    // WEEK 4: FINAL PUSH
    // MONDAY JAN 27
    {
        title: "Morning motivation/strategy session",
        desc: "Review gap to goal. Focus on closest pipeline leads.",
        priority: 90,
        time: 60,
        deadline: "2026-01-27T10:00:00",
        tags: ["Week 4", "Urgent", "Strategy"]
    },
    {
        title: "Super aggressive follow-up",
        desc: "Call EVERYONE. Offer 20% off setup for signing by Friday.",
        priority: 90,
        time: 180,
        deadline: "2026-01-27T13:00:00",
        tags: ["Week 4", "Urgent", "Sales"]
    },
    {
        title: "LinkedIn outreach - 50 messages",
        desc: "Max volume. Test video messages.",
        priority: 90,
        time: 240,
        deadline: "2026-01-27T17:00:00",
        tags: ["Week 4", "Urgent", "Sales"]
    },
    {
        title: "Discovery calls",
        desc: "Convert immediately.",
        priority: 90,
        time: 60,
        deadline: "2026-01-27T18:00:00",
        tags: ["Week 4", "Urgent", "Sales"]
    },
    // TUESDAY JAN 28
    {
        title: "Customer work (if applicable)",
        desc: "Don't neglect existing customers.",
        priority: 90,
        time: 120,
        deadline: "2026-01-28T11:00:00",
        tags: ["Week 4", "Urgent", "Delivery"]
    },
    {
        title: "All-day sales sprint",
        desc: "Calls, close deals. Extreme urgency mode.",
        priority: 90,
        time: 420,
        deadline: "2026-01-28T18:00:00",
        tags: ["Week 4", "Urgent", "Sales"]
    },
    // WEDNESDAY JAN 29
    {
        title: "Review all open opportunities",
        desc: "Identify closest to yes. Plan to overcome objections.",
        priority: 90,
        time: 60,
        deadline: "2026-01-29T10:00:00",
        tags: ["Week 4", "Urgent", "Sales"]
    },
    {
        title: "Personalized video pitches",
        desc: "Record 5-min Loom for top 5 prospects. Direct CTA.",
        priority: 90,
        time: 180,
        deadline: "2026-01-29T13:00:00",
        tags: ["Week 4", "Urgent", "Sales"]
    },
    {
        title: "Follow-up calls on videos",
        desc: "Call 1 hour after sending. Close the deal.",
        priority: 90,
        time: 240,
        deadline: "2026-01-29T17:00:00",
        tags: ["Week 4", "Urgent", "Sales"]
    },
    {
        title: "Set up invoicing",
        desc: "Prepare invoices. 50% upfront.",
        priority: 90,
        time: 60,
        deadline: "2026-01-29T18:00:00",
        tags: ["Week 4", "Urgent", "Admin"]
    },
    // THURSDAY JAN 30
    {
        title: "Emergency discount offers",
        desc: "If not at 3 customers: 'Final 24 hours - 30% off setup'.",
        priority: 90,
        time: 180,
        deadline: "2026-01-30T12:00:00",
        tags: ["Week 4", "Urgent", "Sales"]
    },
    {
        title: "All remaining discovery calls",
        desc: "Book as many as possible. Same-day close.",
        priority: 90,
        time: 300,
        deadline: "2026-01-30T17:00:00",
        tags: ["Week 4", "Urgent", "Sales"]
    },
    {
        title: "Evening pipeline review",
        desc: "Check customer count and revenue. Plan for tomorrow.",
        priority: 90,
        time: 60,
        deadline: "2026-01-30T18:00:00",
        tags: ["Week 4", "Urgent", "Review"]
    },
    // FRIDAY JAN 31
    {
        title: "Final conversion attempts",
        desc: "Last chance calls. Close whatever you can.",
        priority: 90,
        time: 240,
        deadline: "2026-01-31T13:00:00",
        tags: ["Week 4", "Urgent", "Sales"]
    },
    {
        title: "January final metrics",
        desc: "Actual results vs targets. Analysis.",
        priority: 90,
        time: 120,
        deadline: "2026-01-31T15:00:00",
        tags: ["Week 4", "Urgent", "Review"]
    },
    {
        title: "GO/NO-GO decision",
        desc: "Critical decision point. Success, partial success, or pivot.",
        priority: 90,
        time: 120,
        deadline: "2026-01-31T17:00:00",
        tags: ["Week 4", "Urgent", "Strategy"]
    },
    {
        title: "February planning",
        desc: "Set February goals and strategy.",
        priority: 90,
        time: 60,
        deadline: "2026-01-31T18:00:00",
        tags: ["Week 4", "Urgent", "Planning"]
    },
    // SATURDAY FEB 1
    {
        title: "Deep reflection session",
        desc: "Learnings, surprises, path forward.",
        priority: 50,
        time: 120,
        deadline: "2026-02-01T12:00:00",
        tags: ["Week 4", "Medium", "Strategy"]
    },
    {
        title: "Create February execution plan",
        desc: "Detailed week-by-week plan for next month.",
        priority: 50,
        time: 120,
        deadline: "2026-02-01T14:00:00",
        tags: ["Week 4", "Medium", "Planning"]
    }
];

async function seed() {
    console.log("🌱 Starting seed for Revenue Execution Plan...");

    try {
        // 1. Create Project
        console.log(`Creating project: ${PROJECT_NAME}...`);

        // Check if project exists first
        const existingProject = await db.query.projects.findFirst({
            where: eq(projects.name, PROJECT_NAME)
        });

        let projectId;

        if (existingProject) {
            console.log("Project already exists. Using existing ID.");
            projectId = existingProject.id;
        } else {
            const [newProject] = await db.insert(projects).values({
                name: PROJECT_NAME,
                description: PROJECT_DESC,
                color: PROJECT_COLOR,
                icon: PROJECT_ICON,
                is_active: true,
                sort_order: 0
            }).returning();
            projectId = newProject.id;
            console.log(`Project created with ID: ${projectId}`);
        }

        // 2. Create Tasks
        console.log(`Creating ${TASKS.length} tasks...`);

        const taskValues = TASKS.map(task => ({
            project_id: projectId,
            task_title: task.title,
            task_description: task.desc,
            priority_score: task.priority,
            time_estimate: task.time,
            deadline_date: parseDate(task.deadline),
            tags: task.tags,
            status: 'pending',
            source: 'manual', // Explicitly mark as manual/imported
            created_at: new Date(),
            updated_at: new Date()
        }));

        // Insert in batches if needed, but for ~50 tasks, one go is fine
        await db.insert(tasks).values(taskValues);

        console.log("✅ Seed completed successfully!");
        process.exit(0);

    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    }
}

seed();
