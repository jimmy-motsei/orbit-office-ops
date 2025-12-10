# Orbit - Personal Work Operating System

A personal work management system that aggregates inputs from multiple email accounts, filters them through custom criteria, and autonomously schedules work 1–2 weeks in advance.

## Tech Stack

- **Frontend:** Next.js 15 (App Router)
- **Backend:** Vercel Serverless Functions
- **Database:** Supabase (PostgreSQL)
- **AI:** OpenAI GPT-4o / Anthropic Claude 3.5
- **Deployment:** Vercel

## Features

- 📧 Multi-inbox email aggregation (Gmail, Outlook)
- 🎯 Custom filtering rules via Apple Reminders
- 🤖 AI-powered task estimation and prioritization
- 📅 Autonomous 2-week advance scheduling
- ⏰ Lead-time aware planning with safety buffers

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- Vercel account

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# API Security
API_SECRET_KEY=your_secret_key_for_reminders_sync

# OAuth (Gmail/Outlook)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
```

### Database Setup

Run the Supabase migrations:

```bash
# Create tables
psql -h your-supabase-host -U postgres -d postgres -f supabase/migrations/001_initial_schema.sql
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
orbit-office-ops/
├── app/
│   ├── api/              # Vercel API routes
│   │   ├── ingest/       # Email ingestion endpoint
│   │   ├── sync-rules/   # Apple Reminders sync endpoint
│   │   └── schedule/     # Scheduling endpoint
│   ├── dashboard/        # Main dashboard UI
│   └── layout.tsx
├── lib/
│   ├── supabase/         # Database client
│   ├── scheduler/        # Scheduling algorithm
│   ├── ai/               # LLM integrations
│   └── email/            # Email connectors
├── scripts/
│   └── reminders_bridge.py  # macOS Reminders sync script
└── supabase/
    └── migrations/       # Database schema
```

## Apple Reminders Bridge

The system syncs rules from Apple Reminders using a local Python script:

```bash
cd scripts
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python reminders_bridge.py
```

Set up macOS Automation to run this script daily.

## Deployment

Deploy to Vercel:

```bash
vercel --prod
```

## License

MIT
