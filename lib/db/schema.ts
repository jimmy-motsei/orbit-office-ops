import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    boolean,
    integer,
    date,
    time
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// =============================================
// Table: emails
// =============================================
export const emails = pgTable('emails', {
    id: uuid('id').defaultRandom().primaryKey(),
    email_id: varchar('email_id', { length: 255 }).unique().notNull(),
    source: varchar('source', { length: 50 }).notNull(), // 'gmail' or 'outlook'
    sender_email: varchar('sender_email', { length: 255 }).notNull(),
    sender_name: varchar('sender_name', { length: 255 }),
    subject: text('subject').notNull(),
    body_snippet: text('body_snippet'),
    body_full: text('body_full'),
    received_at: timestamp('received_at', { withTimezone: true }).notNull(),
    is_read: boolean('is_read').default(false),
    is_processed: boolean('is_processed').default(false),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// =============================================
// Table: rules
// =============================================
export const rules = pgTable('rules', {
    id: uuid('id').defaultRandom().primaryKey(),
    rule_name: varchar('rule_name', { length: 255 }).notNull(),
    criteria_logic: text('criteria_logic').notNull(),
    source_id: varchar('source_id', { length: 255 }).unique(), // Apple Reminders ID
    priority_override: integer('priority_override'),
    tag: varchar('tag', { length: 100 }),
    is_active: boolean('is_active').default(true),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// =============================================
// Table: projects
// =============================================
export const projects = pgTable('projects', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    color: varchar('color', { length: 7 }).default('#06b6d4'),
    icon: varchar('icon', { length: 50 }).default('folder'),
    is_active: boolean('is_active').default(true),
    sort_order: integer('sort_order').default(0),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// =============================================
// Table: tasks
// =============================================
export const tasks = pgTable('tasks', {
    id: uuid('id').defaultRandom().primaryKey(),
    email_id: uuid('email_id').references(() => emails.id, { onDelete: 'cascade' }),
    project_id: uuid('project_id').references(() => projects.id, { onDelete: 'set null' }),
    task_title: varchar('task_title', { length: 500 }).notNull(),
    task_description: text('task_description'),
    time_estimate: integer('time_estimate').notNull(), // in minutes
    priority_score: integer('priority_score').notNull(),
    deadline_date: timestamp('deadline_date', { withTimezone: true }),
    lead_time_buffer_days: integer('lead_time_buffer_days').default(0),
    ai_reasoning: text('ai_reasoning'),
    tags: varchar('tags', { length: 100 }).array(),
    status: varchar('status', { length: 50 }).default('pending'),
    source: varchar('source', { length: 50 }).default('ai'),
    notes: text('notes'),
    completed_at: timestamp('completed_at', { withTimezone: true }),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// =============================================
// Table: schedule_blocks
// =============================================
export const schedule_blocks = pgTable('schedule_blocks', {
    id: uuid('id').defaultRandom().primaryKey(),
    task_id: uuid('task_id').references(() => tasks.id, { onDelete: 'cascade' }),
    start_time: timestamp('start_time', { withTimezone: true }).notNull(),
    end_time: timestamp('end_time', { withTimezone: true }).notNull(),
    duration_minutes: integer('duration_minutes').notNull(),
    is_split_session: boolean('is_split_session').default(false),
    session_index: integer('session_index'),
    calendar_synced: boolean('calendar_synced').default(false),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// =============================================
// Table: availability_blocks
// =============================================
export const availability_blocks = pgTable('availability_blocks', {
    id: uuid('id').defaultRandom().primaryKey(),
    block_date: date('block_date').notNull(),
    start_time: time('start_time').notNull(),
    end_time: time('end_time').notNull(),
    capacity_minutes: integer('capacity_minutes').notNull(),
    used_minutes: integer('used_minutes').default(0),
    is_recurring: boolean('is_recurring').default(false),
    recurrence_pattern: varchar('recurrence_pattern', { length: 50 }),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// =============================================
// Table: sync_logs
// =============================================
export const sync_logs = pgTable('sync_logs', {
    id: uuid('id').defaultRandom().primaryKey(),
    sync_timestamp: timestamp('sync_timestamp', { withTimezone: true }).defaultNow(),
    rules_synced: integer('rules_synced').default(0),
    status: varchar('status', { length: 50 }),
    error_message: text('error_message'),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// =============================================
// Relations
// =============================================
export const emailsRelations = relations(emails, ({ many }) => ({
    tasks: many(tasks),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
    tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
    email: one(emails, {
        fields: [tasks.email_id],
        references: [emails.id],
    }),
    project: one(projects, {
        fields: [tasks.project_id],
        references: [projects.id],
    }),
    schedule_blocks: many(schedule_blocks),
}));

export const scheduleBlocksRelations = relations(schedule_blocks, ({ one }) => ({
    task: one(tasks, {
        fields: [schedule_blocks.task_id],
        references: [tasks.id],
    }),
}));
