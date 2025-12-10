'use client';

import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, parseISO } from 'date-fns';
import { supabase } from '@/lib/supabase/client';
import { Calendar, Clock, TrendingUp, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  task_title: string;
  time_estimate: number;
  priority_score: number;
  deadline_date: string | null;
  status: string;
  tags: string[];
}

interface ScheduleBlock {
  id: string;
  task_id: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  session_index?: number;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedule, setSchedule] = useState<ScheduleBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  useEffect(() => {
    fetchData();
  }, [weekStart]);

  async function fetchData() {
    setLoading(true);
    
    // Fetch pending tasks
    const { data: tasksData } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'pending')
      .order('priority_score', { ascending: false })
      .limit(50);

    // Fetch schedule for this week
    const weekEnd = addDays(weekStart, 7);
    const { data: scheduleData } = await supabase
      .from('schedule_blocks')
      .select('*')
      .gte('start_time', weekStart.toISOString())
      .lte('start_time', weekEnd.toISOString())
      .order('start_time', { ascending: true });

    setTasks(tasksData || []);
    setSchedule(scheduleData || []);
    setLoading(false);
  }

  const totalPendingTime = tasks.reduce((sum, t) => sum + t.time_estimate, 0);
  const scheduledTime = schedule.reduce((sum, s) => sum + s.duration_minutes, 0);
  const utilizationRate = scheduledTime > 0 ? ((scheduledTime / (5 * 480)) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Orbit Dashboard
        </h1>
        <p className="text-slate-400">Your AI-powered work operating system</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          icon={<Calendar className="w-5 h-5" />}
          title="Pending Tasks"
          value={tasks.length}
          subtitle="tasks to schedule"
          color="cyan"
        />
        <StatsCard
          icon={<Clock className="w-5 h-5" />}
          title="Total Work"
          value={`${Math.round(totalPendingTime / 60)}h`}
          subtitle={`${totalPendingTime} minutes`}
          color="blue"
        />
        <StatsCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="Utilization"
          value={`${utilizationRate}%`}
          subtitle="of weekly capacity"
          color="green"
        />
        <StatsCard
          icon={<AlertCircle className="w-5 h-5" />}
          title="High Priority"
          value={tasks.filter(t => t.priority_score >= 70).length}
          subtitle="urgent tasks"
          color="red"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Week View Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Week View</h2>
              <div className="text-sm text-slate-400">
                {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-12 text-slate-400">Loading schedule...</div>
            ) : (
              <WeekCalendar 
                weekStart={weekStart} 
                schedule={schedule} 
                tasks={tasks}
              />
            )}
          </div>
        </div>

        {/* Task List */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
            <h2 className="text-2xl font-bold mb-6">Pending Tasks</h2>
            
            {loading ? (
              <div className="text-center py-12 text-slate-400">Loading tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p>No pending tasks</p>
                <p className="text-sm mt-2">All caught up! 🎉</p>
              </div>
            ) : (
              <TaskList tasks={tasks} onTaskUpdate={fetchData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({ icon, title, value, subtitle, color }: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  color: 'cyan' | 'blue' | 'green' | 'red';
}) {
  const colors: Record<string, string> = {
    cyan: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/50',
    blue: 'from-blue-500/20 to-indigo-500/20 border-blue-500/50',
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/50',
    red: 'from-red-500/20 to-orange-500/20 border-red-500/50'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="text-slate-300">{icon}</div>
        <h3 className="text-sm font-medium text-slate-300">{title}</h3>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs text-slate-400">{subtitle}</div>
    </div>
  );
}

// Week Calendar Component
function WeekCalendar({ weekStart, schedule, tasks }: any) {
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));
  
  return (
    <div className="grid grid-cols-5 gap-2">
      {days.map((day) => (
        <DayColumn
          key={day.toISOString()}
          date={day}
          schedule={schedule.filter((s: ScheduleBlock) => {
            const startTime = parseISO(s.start_time);
            return format(startTime, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
          })}
          tasks={tasks}
        />
      ))}
    </div>
  );
}

// Day Column Component
function DayColumn({ date, schedule, tasks }: any) {
  const totalMinutes = schedule.reduce((sum: number, s: ScheduleBlock) => sum + s.duration_minutes, 0);
  const isOverCapacity = totalMinutes > 480; // 8 hours

  return (
    <div className="flex flex-col">
      {/* Day Header */}
      <div className="text-center mb-3 pb-2 border-b border-slate-700">
        <div className="text-xs text-slate-400 uppercase">{format(date, 'EEE')}</div>
        <div className="text-lg font-bold">{format(date, 'd')}</div>
      </div>

      {/* Capacity Bar */}
      <div className="mb-3">
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${isOverCapacity ? 'bg-red-500' : 'bg-cyan-500'} transition-all`}
            style={{ width: `${Math.min((totalMinutes / 480) * 100, 100)}%` }}
          />
        </div>
        <div className="text-xs text-slate-400 mt-1 text-center">
          {Math.round(totalMinutes / 60)}h / 8h
        </div>
      </div>

      {/* Task Cards */}
      <div className="space-y-2 flex-1">
        {schedule.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-4">
            No tasks scheduled
          </div>
        ) : (
          schedule.map((block: ScheduleBlock) => {
            const task = tasks.find((t: Task) => t.id === block.task_id);
            return task ? (
              <TaskCard key={block.id} task={task} block={block} />
            ) : null;
          })
        )}
      </div>
    </div>
  );
}

// Task Card Component
function TaskCard({ task, block }: { task: Task, block: ScheduleBlock }) {
  const priorityColor = 
    task.priority_score >= 80 ? 'bg-red-500/20 border-red-500/50' :
    task.priority_score >= 60 ? 'bg-orange-500/20 border-orange-500/50' :
    'bg-cyan-500/20 border-cyan-500/50';

  return (
    <div className={`${priorityColor} border rounded-lg p-2 cursor-pointer hover:scale-105 transition-transform`}>
      <div className="text-xs font-medium text-white truncate mb-1">
        {task.task_title}
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Clock className="w-3 h-3" />
        <span>{task.time_estimate}min</span>
      </div>
      {block.session_index && (
        <div className="text-xs text-cyan-400 mt-1">
          Session {block.session_index}
        </div>
      )}
    </div>
  );
}

// Task List Component
function TaskList({ tasks, onTaskUpdate }: any) {
  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
      {tasks.map((task: Task) => (
        <div key={task.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-cyan-500 transition-all">
          <div className="mb-2">
            <h3 className="font-medium text-sm line-clamp-2">{task.task_title}</h3>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {task.time_estimate}min
            </div>
            
            <div className={`px-2 py-0.5 rounded-full ${
              task.priority_score >= 80 ? 'bg-red-500/20 text-red-400' :
              task.priority_score >= 60 ? 'bg-orange-500/20 text-orange-400' :
              'bg-cyan-500/20 text-cyan-400'
            }`}>
              P{task.priority_score}
            </div>
            
            {task.deadline_date && (
              <div className="text-xs">
                Due: {format(parseISO(task.deadline_date), 'MMM d')}
              </div>
            )}
          </div>

          {task.tags && task.tags.length > 0 && (
            <div className="flex gap-1 mt-2">
              {task.tags.slice(0, 2).map((tag, i) => (
                <span key={i} className="text-xs px-2 py-0.5 bg-slate-600 rounded-full text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
