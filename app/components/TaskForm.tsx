'use client';

import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import {
    Clock,
    Flag,
    Calendar as CalendarIcon,
    Folder,
    Tag,
    FileText,
    Loader2
} from 'lucide-react';

interface Project {
    id: string;
    name: string;
    color: string;
    icon: string;
}

interface TaskFormData {
    task_title: string;
    task_description: string;
    time_estimate: number;
    priority_score: number;
    deadline_date: string;
    project_id: string | null;
    tags: string[];
    notes: string;
}

interface TaskFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TaskFormData) => Promise<void>;
    initialData?: Partial<TaskFormData>;
    mode: 'create' | 'edit';
}

const TIME_PRESETS = [
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '2 hours', value: 120 },
    { label: '4 hours', value: 240 },
    { label: '8 hours', value: 480 },
];

const PRIORITY_PRESETS = [
    { label: 'Low', value: 25, color: 'text-slate-400' },
    { label: 'Medium', value: 50, color: 'text-cyan-400' },
    { label: 'High', value: 75, color: 'text-orange-400' },
    { label: 'Urgent', value: 95, color: 'text-red-400' },
];

export function TaskForm({ isOpen, onClose, onSubmit, initialData, mode }: TaskFormProps) {
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [tagInput, setTagInput] = useState('');

    const [formData, setFormData] = useState<TaskFormData>({
        task_title: '',
        task_description: '',
        time_estimate: 30,
        priority_score: 50,
        deadline_date: '',
        project_id: null,
        tags: [],
        notes: '',
        ...initialData,
    });

    // Reset form when opened with new data
    useEffect(() => {
        if (isOpen) {
            setFormData({
                task_title: '',
                task_description: '',
                time_estimate: 30,
                priority_score: 50,
                deadline_date: '',
                project_id: null,
                tags: [],
                notes: '',
                ...initialData,
            });
        }
    }, [isOpen, initialData]);

    // Fetch projects
    useEffect(() => {
        async function fetchProjects() {
            try {
                const res = await fetch('/api/projects');
                const data = await res.json();
                if (data.success) {
                    setProjects(data.projects);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        }
        if (isOpen) fetchProjects();
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.task_title.trim()) {
            return;
        }

        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error submitting task:', error);
        } finally {
            setLoading(false);
        }
    };

    const addTag = () => {
        const tag = tagInput.trim().toLowerCase();
        if (tag && !formData.tags.includes(tag)) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tagToRemove)
        }));
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={mode === 'create' ? 'Add New Task' : 'Edit Task'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Task Title */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Task Title *
                    </label>
                    <input
                        type="text"
                        value={formData.task_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, task_title: e.target.value }))}
                        placeholder="What needs to be done?"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                        required
                        autoFocus
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        <FileText className="w-4 h-4 inline mr-1" />
                        Description
                    </label>
                    <textarea
                        value={formData.task_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, task_description: e.target.value }))}
                        placeholder="Add details about this task..."
                        rows={2}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors resize-none"
                    />
                </div>

                {/* Time Estimate & Priority Row */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Time Estimate */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            <Clock className="w-4 h-4 inline mr-1" />
                            Time Estimate *
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {TIME_PRESETS.map((preset) => (
                                <button
                                    key={preset.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, time_estimate: preset.value }))}
                                    className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${formData.time_estimate === preset.value
                                            ? 'bg-cyan-500 border-cyan-500 text-white'
                                            : 'bg-slate-900 border-slate-600 text-slate-300 hover:border-cyan-500'
                                        }`}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            <Flag className="w-4 h-4 inline mr-1" />
                            Priority
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {PRIORITY_PRESETS.map((preset) => (
                                <button
                                    key={preset.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, priority_score: preset.value }))}
                                    className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${Math.abs(formData.priority_score - preset.value) < 15
                                            ? 'bg-cyan-500 border-cyan-500 text-white'
                                            : 'bg-slate-900 border-slate-600 text-slate-300 hover:border-cyan-500'
                                        }`}
                                >
                                    <span className={preset.color}>{preset.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Deadline & Project Row */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Deadline */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            <CalendarIcon className="w-4 h-4 inline mr-1" />
                            Deadline
                        </label>
                        <input
                            type="date"
                            value={formData.deadline_date ? formData.deadline_date.split('T')[0] : ''}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                deadline_date: e.target.value ? new Date(e.target.value).toISOString() : ''
                            }))}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                        />
                    </div>

                    {/* Project */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            <Folder className="w-4 h-4 inline mr-1" />
                            Project
                        </label>
                        <select
                            value={formData.project_id || ''}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                project_id: e.target.value || null
                            }))}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                        >
                            <option value="">No Project</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Tag className="w-4 h-4 inline mr-1" />
                        Tags
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            placeholder="Add a tag..."
                            className="flex-1 px-4 py-2 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                        <button
                            type="button"
                            onClick={addTag}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white transition-colors"
                        >
                            Add
                        </button>
                    </div>
                    {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-400 text-sm flex items-center gap-1"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-white"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Notes
                    </label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Additional notes..."
                        rows={2}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors resize-none"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 text-slate-300 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !formData.task_title.trim()}
                        className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {mode === 'create' ? 'Create Task' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
