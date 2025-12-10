/**
 * Orbit Scheduler Engine
 * 
 * Implements a heuristic scheduling algorithm that:
 * 1. Calculates task urgency based on priority and deadline proximity
 * 2. Implements bin-packing to fill availability slots
 * 3. Respects lead-time buffers
 * 4. Splits large tasks into manageable sessions
 */

import { addDays, differenceInDays, parseISO, format } from 'date-fns';

// =============================================
// Types
// =============================================

export interface Task {
  id: string;
  estimated_minutes: number;
  deadline_date: string; // ISO 8601 format
  priority_score: number; // 0-100
  lead_time_buffer_days: number;
  task_title?: string;
}

export interface AvailabilityBlock {
  start: string; // ISO 8601 timestamp
  end: string;   // ISO 8601 timestamp
  capacity_minutes?: number;
}

export interface ScheduledTask {
  taskId: string;
  assignedSlot: {
    start: string;
    end: string;
  };
  sessionIndex?: number; // For split tasks
}

export interface UnscheduledTask {
  taskId: string;
  reason: string;
}

export interface ScheduleResult {
  schedule: ScheduledTask[];
  unscheduled: UnscheduledTask[];
}

// =============================================
// Core Algorithm
// =============================================

/**
 * Calculate urgency score combining priority and deadline proximity
 * Formula: (Priority * 0.6) + ((1 / DaysUntilDue) * 100 * 0.4)
 */
export function calculateUrgency(task: Task, currentDate: Date = new Date()): number {
  const deadlineDate = parseISO(task.deadline_date);
  const daysUntilDue = differenceInDays(deadlineDate, currentDate);
  
  // Handle overdue or immediate tasks
  if (daysUntilDue <= 0) {
    return 10000; // Maximum urgency
  }
  
  const priorityComponent = task.priority_score * 0.6;
  const deadlineComponent = (1 / daysUntilDue) * 100 * 0.4;
  
  return priorityComponent + deadlineComponent;
}

/**
 * Check if a task can be scheduled within its deadline considering lead-time buffer
 */
function isWithinDeadlineWindow(
  task: Task,
  proposedStartTime: Date,
  currentDate: Date = new Date()
): boolean {
  const deadlineDate = parseISO(task.deadline_date);
  const effectiveDeadline = addDays(deadlineDate, -task.lead_time_buffer_days);
  
  return proposedStartTime <= effectiveDeadline;
}

/**
 * Split a large task into multiple sessions
 * Minimum chunk size: 30 minutes
 */
function splitTask(task: Task, maxSessionMinutes: number = 120): number[] {
  const MIN_CHUNK_MINUTES = 30;
  
  if (task.estimated_minutes <= maxSessionMinutes) {
    return [task.estimated_minutes];
  }
  
  const numSessions = Math.ceil(task.estimated_minutes / maxSessionMinutes);
  const baseSessionMinutes = Math.floor(task.estimated_minutes / numSessions);
  const remainder = task.estimated_minutes % numSessions;
  
  const sessions: number[] = [];
  for (let i = 0; i < numSessions; i++) {
    const sessionMinutes = baseSessionMinutes + (i < remainder ? 1 : 0);
    if (sessionMinutes >= MIN_CHUNK_MINUTES) {
      sessions.push(sessionMinutes);
    }
  }
  
  return sessions;
}

/**
 * Main scheduling algorithm
 * Uses weighted shortest job first with bin packing
 */
export function scheduleTasksfunction(
  tasks: Task[],
  availability: AvailabilityBlock[],
  currentDate: Date = new Date()
): ScheduleResult {
  const schedule: ScheduledTask[] = [];
  const unscheduled: UnscheduledTask[] = [];
  
  // Step 1: Calculate urgency and sort tasks
  const tasksWithUrgency = tasks.map(task => ({
    task,
    urgency: calculateUrgency(task, currentDate)
  }));
  
  tasksWithUrgency.sort((a, b) => b.urgency - a.urgency);
  
  // Step 2: Create availability tracking
  const availabilityTracker = availability.map(block => {
    const start = parseISO(block.start);
    const end = parseISO(block.end);
    const totalMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    
    return {
      start,
      end,
      availableMinutes: totalMinutes,
      usedMinutes: 0
    };
  });
  
  // Step 3: Bin packing loop
  for (const { task, urgency } of tasksWithUrgency) {
    // Check if task should be split
    const sessions = task.estimated_minutes > 120 
      ? splitTask(task) 
      : [task.estimated_minutes];
    
    let scheduledSessions = 0;
    
    for (let sessionIndex = 0; sessionIndex < sessions.length; sessionIndex++) {
      const sessionMinutes = sessions[sessionIndex];
      let scheduled = false;
      
      // Try to find an availability slot
      for (const slot of availabilityTracker) {
        // Check if slot has enough capacity
        if (slot.availableMinutes - slot.usedMinutes < sessionMinutes) {
          continue;
        }
        
        // Calculate proposed start time
        const proposedStart = new Date(slot.start.getTime() + (slot.usedMinutes * 60 * 1000));
        
        // Check deadline constraint with lead-time buffer
        if (!isWithinDeadlineWindow(task, proposedStart, currentDate)) {
          continue;
        }
        
        // Schedule the task
        const proposedEnd = new Date(proposedStart.getTime() + (sessionMinutes * 60 * 1000));
        
        schedule.push({
          taskId: task.id,
          assignedSlot: {
            start: proposedStart.toISOString(),
            end: proposedEnd.toISOString()
          },
          sessionIndex: sessions.length > 1 ? sessionIndex + 1 : undefined
        });
        
        slot.usedMinutes += sessionMinutes;
        scheduledSessions++;
        scheduled = true;
        break;
      }
      
      if (!scheduled) {
        // Could not schedule this session
        break;
      }
    }
    
    // Check if all sessions were scheduled
    if (scheduledSessions < sessions.length) {
      // Remove partially scheduled sessions
      const partialSchedules = schedule.filter(s => s.taskId === task.id);
      schedule.splice(
        schedule.indexOf(partialSchedules[0]),
        partialSchedules.length
      );
      
      unscheduled.push({
        taskId: task.id,
        reason: scheduledSessions === 0 
          ? 'No available capacity within deadline window'
          : 'Insufficient capacity to complete all sessions'
      });
    }
  }
  
  return {
    schedule,
    unscheduled
  };
}

// =============================================
// Utility Functions
// =============================================

/**
 * Generate default availability for next 14 days (Mon-Fri, 9 AM - 5 PM)
 */
export function generateDefaultAvailability(
  startDate: Date = new Date(),
  daysAhead: number = 14
): AvailabilityBlock[] {
  const blocks: AvailabilityBlock[] = [];
  
  for (let i = 0; i < daysAhead; i++) {
    const date = addDays(startDate, i);
    const dayOfWeek = date.getDay();
    
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue;
    }
    
    // 9 AM - 5 PM (480 minutes)
    const startTime = new Date(date);
    startTime.setHours(9, 0, 0, 0);
    
    const endTime = new Date(date);
    endTime.setHours(17, 0, 0, 0);
    
    blocks.push({
      start: startTime.toISOString(),
      end: endTime.toISOString(),
      capacity_minutes: 480
    });
  }
  
  return blocks;
}

/**
 * Calculate total capacity and utilization
 */
export function calculateCapacityStats(
  availability: AvailabilityBlock[],
  schedule: ScheduledTask[]
): {
  totalCapacity: number;
  usedCapacity: number;
  utilizationRate: number;
} {
  const totalCapacity = availability.reduce((sum, block) => {
    const start = parseISO(block.start);
    const end = parseISO(block.end);
    return sum + ((end.getTime() - start.getTime()) / (1000 * 60));
  }, 0);
  
  const usedCapacity = schedule.reduce((sum, scheduled) => {
    const start = parseISO(scheduled.assignedSlot.start);
    const end = parseISO(scheduled.assignedSlot.end);
    return sum + ((end.getTime() - start.getTime()) / (1000 * 60));
  }, 0);
  
  return {
    totalCapacity,
    usedCapacity,
    utilizationRate: (usedCapacity / totalCapacity) * 100
  };
}
