import Link from 'next/link';
import { Calendar, Mail, Brain, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-6xl">🪐</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Orbit
          </h1>
          
          <p className="text-2xl md:text-3xl text-slate-300 mb-4">
            Your Personal Work Operating System
          </p>
          
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
            Aggregates emails from multiple inboxes, applies AI-powered filtering, 
            and autonomously schedules your work 1-2 weeks in advance.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link 
              href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/50"
            >
              Open Dashboard
            </Link>
            
            <a 
              href="https://github.com/yourusername/orbit"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 rounded-full font-bold text-lg transition-all border border-slate-600"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24">
          <FeatureCard
            icon={<Mail className="w-8 h-8" />}
            title="Multi-Inbox"
            description="Aggregates emails from Gmail and Outlook automatically"
            color="cyan"
          />
          
          <FeatureCard
            icon={<Brain className="w-8 h-8" />}
            title="AI Processing"
            description="GPT-4o analyzes emails and estimates time required"
            color="blue"
          />
          
          <FeatureCard
            icon={<Calendar className="w-8 h-8" />}
            title="Smart Scheduling"
            description="Autonomously plans work 1-2 weeks ahead with lead-time buffers"
            color="purple"
          />
          
          <FeatureCard
            icon={<Sparkles className="w-8 h-8" />}
            title="Apple Reminders"
            description="Define custom rules in Apple Reminders for filtering"
            color="pink"
          />
        </div>

        {/* How It Works */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          
          <div className="space-y-6">
            <Step
              number="1"
              title="Email Ingestion"
              description="Every 30 minutes, Orbit fetches unread emails from your connected Gmail and Outlook accounts."
            />
            
            <Step
              number="2"
              title="AI Classification"
              description="GPT-4o analyzes each email, extracts deadlines, estimates time required, and assigns priority scores."
            />
            
            <Step
              number="3"
              title="Smart Scheduling"
              description="The bin-packing algorithm schedules tasks across your available time, respecting lead-time buffers and priorities."
            />
            
            <Step
              number="4"
              title="Stay in Sync"
              description="Define custom filtering rules in Apple Reminders that automatically sync to your Orbit instance."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'cyan' | 'blue' | 'purple' | 'pink';
}) {
  const colors: Record<string, string> = {
    cyan: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/50',
    blue: 'from-blue-500/20 to-indigo-500/20 border-blue-500/50',
    purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/50',
    pink: 'from-pink-500/20 to-rose-500/20 border-pink-500/50'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-6 hover:scale-105 transition-transform`}>
      <div className="text-white mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: any) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-xl font-bold">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-slate-400">{description}</p>
      </div>
    </div>
  );
}
