'use client';

import { useState, useEffect, useCallback } from 'react';
import { format, startOfWeek, addDays, parseISO } from 'date-fns';
import {
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  CheckCircle2,
  Folder,
  Filter
} from 'lucide-react';
import { TaskForm } from '../components/TaskForm';

interface Project {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface Task {
  id: string;
  task_title: string;
  task_description?: string;
  time_estimate: number;
  priority_score: number;
  deadline_date: string | null;
  status: string;
  tags: string[];
  project_id: string | null;
  source?: string;
  notes?: string;
  projects?: Project;
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Modal states
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filter states
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      // Fetch projects
      const projectsRes = await fetch('/api/projects');
      const projectsData = await projectsRes.json();

      // Build tasks URL with filters
      const tasksUrl = new URL('/api/tasks', window.location.origin);
      tasksUrl.searchParams.set('limit', '100');

      if (!showCompleted) {
        tasksUrl.searchParams.set('status', 'pending');
      } else {
        tasksUrl.searchParams.set('status', 'all');
      }

      if (selectedProject) {
        tasksUrl.searchParams.set('project_id', selectedProject);
      }

      const tasksRes = await fetch(tasksUrl.toString());
      const tasksData = await tasksRes.json();

      // Fetch schedule for this week
      const weekEnd = addDays(weekStart, 7);
      const scheduleUrl = new URL('/api/schedule', window.location.origin);
      scheduleUrl.searchParams.set('start', weekStart.toISOString());
      scheduleUrl.searchParams.set('end', weekEnd.toISOString());

      const scheduleRes = await fetch(scheduleUrl.toString());
      const scheduleData = await scheduleRes.json();

      setProjects(projectsData.projects || []);
      setTasks(tasksData.tasks || []);
      setSchedule(scheduleData.schedule || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [weekStart, selectedProject, showCompleted]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handlePreviousWeek = () => {
    setWeekStart(addDays(weekStart, -7));
  };

  const handleNextWeek = () => {
    setWeekStart(addDays(weekStart, 7));
  };

  const handleCreateTask = async (data: any) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to create task');

      await fetchData();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const handleUpdateTask = async (data: any) => {
    if (!editingTask) return;

    try {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to update task');

      await fetchData();
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const handleToggleComplete = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update task');

      // Optimistically update UI
      setTasks(prev => prev.map(t =>
        t.id === task.id ? { ...t, status: newStatus } : t
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
      await fetchData();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete task');

      // Remove from UI
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      await fetchData();
    }
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const totalPendingTime = pendingTasks.reduce((sum, t) => sum + t.time_estimate, 0);
  const scheduledTime = schedule.reduce((sum, s) => sum + s.duration_minutes, 0);
  const utilizationRate = scheduledTime > 0 ? ((scheduledTime / (5 * 480)) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Orbit Dashboard
          </h1>
          <p className="text-slate-400">Your AI-powered work operating system</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            onClick={() => setIsTaskFormOpen(true)}
            className="fab flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl hover:from-cyan-400 hover:to-blue-400"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          icon={<Calendar className="w-5 h-5" />}
          title="Pending Tasks"
          value={pendingTasks.length}
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
          value={pendingTasks.filter(t => t.priority_score >= 70).length}
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
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePreviousWeek}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-slate-400 min-w-[160px] text-center">
                  {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
                </span>
                <button
                  onClick={handleNextWeek}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                Loading schedule...
              </div>
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Tasks</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className={`p-2 rounded-lg transition-colors ${showCompleted
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'hover:bg-slate-700 text-slate-400'
                    }`}
                  title={showCompleted ? 'Hide completed' : 'Show completed'}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedProject(null)}
                  className={`p-2 rounded-lg transition-colors ${!selectedProject
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'hover:bg-slate-700 text-slate-400'
                    }`}
                  title="All projects"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Project Filter Chips */}
            {projects.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(
                      selectedProject === project.id ? null : project.id
                    )}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-all ${selectedProject === project.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                      : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:border-slate-500'
                      }`}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    {project.name}
                  </button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12 text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                Loading tasks...
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Folder className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>No tasks found</p>
                <p className="text-sm mt-2">
                  {selectedProject ? 'Try selecting a different project' : 'Add your first task!'}
                </p>
                <button
                  onClick={() => setIsTaskFormOpen(true)}
                  className="mt-4 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
                >
                  + Add Task
                </button>
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onEdit={(task) => setEditingTask(task)}
                onDelete={handleDeleteTask}
              />
            )}
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={handleCreateTask}
        mode="create"
      />

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskForm
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={handleUpdateTask}
          mode="edit"
          initialData={{
            task_title: editingTask.task_title,
            task_description: editingTask.task_description || '',
            time_estimate: editingTask.time_estimate,
            priority_score: editingTask.priority_score,
            deadline_date: editingTask.deadline_date || '',
            project_id: editingTask.project_id,
            tags: editingTask.tags || [],
            notes: editingTask.notes || '',
          }}
        />
      )}
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
function WeekCalendar({ weekStart, schedule, tasks }: {
  weekStart: Date;
  schedule: ScheduleBlock[];
  tasks: Task[];
}) {
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="grid grid-cols-5 gap-2">
      {days.map((day) => (
        <DayColumn
          key={day.toISOString()}
          date={day}
          schedule={schedule.filter((s) => {
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
function DayColumn({ date, schedule, tasks }: {
  date: Date;
  schedule: ScheduleBlock[];
  tasks: Task[];
}) {
  const totalMinutes = schedule.reduce((sum, s) => sum + s.duration_minutes, 0);
  const isOverCapacity = totalMinutes > 480;
  const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="flex flex-col">
      {/* Day Header */}
      <div className={`text-center mb-3 pb-2 border-b ${isToday ? 'border-cyan-500' : 'border-slate-700'
        }`}>
        <div className={`text-xs uppercase ${isToday ? 'text-cyan-400' : 'text-slate-400'}`}>
          {format(date, 'EEE')}
        </div>
        <div className={`text-lg font-bold ${isToday ? 'text-cyan-400' : ''}`}>
          {format(date, 'd')}
        </div>
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
          schedule.map((block) => {
            const task = tasks.find(t => t.id === block.task_id);
            return task ? (
              <ScheduleCard key={block.id} task={task} block={block} />
            ) : null;
          })
        )}
      </div>
    </div>
  );
}

// Schedule Card Component (for calendar view)
function ScheduleCard({ task, block }: { task: Task; block: ScheduleBlock }) {
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
        <span>{block.duration_minutes}min</span>
      </div>
      {block.session_index && block.session_index > 1 && (
        <div className="text-xs text-cyan-400 mt-1">
          Part {block.session_index}
        </div>
      )}
    </div>
  );
}

// Task List Component
function TaskList({ tasks, onToggleComplete, onEdit, onDelete }: {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}) {
  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`task-item bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-cyan-500 ${task.status === 'completed' ? 'completed' : ''
            }`}
        >
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={task.status === 'completed'}
              onChange={() => onToggleComplete(task)}
              className="task-checkbox mt-1 flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              <h3 className={`task-title font-medium text-sm line-clamp-2 ${task.status === 'completed' ? '' : ''
                }`}>
                {task.task_title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {task.time_estimate}min
                </div>

                <div className={`px-2 py-0.5 rounded-full ${task.priority_score >= 80 ? 'bg-red-500/20 text-red-400' :
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

              {/* Project Badge */}
              {task.projects && (
                <div className="flex items-center gap-1.5 mt-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: task.projects.color }}
                  />
                  <span className="text-xs text-slate-400">{task.projects.name}</span>
                </div>
              )}

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {task.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-slate-600 rounded-full text-slate-300">
                      {tag}
                    </span>
                  ))}
                  {task.tags.length > 2 && (
                    <span className="text-xs text-slate-500">+{task.tags.length - 2}</span>
                  )}
                </div>
              )}

              {/* Source indicator */}
              {task.source === 'manual' && (
                <div className="text-xs text-slate-500 mt-1">
                  ✏️ Manual task
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-600 rounded-lg transition-colors"
                title="Edit task"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-600 rounded-lg transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
