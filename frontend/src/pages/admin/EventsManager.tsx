import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiPlus,
    HiPencil,
    HiTrash,
    HiCalendar,
    HiX,
    HiSearch,
    HiLocationMarker,
    HiClock,
    HiRefresh,
    HiExternalLink
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { eventsApi } from '@/api';

interface Event {
    _id: string;
    title: string;
    description: string;
    shortDescription: string;
    date: string;
    endDate?: string;
    time?: string;
    location?: string;
    mode: 'Online' | 'Offline' | 'Hybrid';
    status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
    category: 'Hackathon' | 'Workshop' | 'Sprint' | 'Meetup' | 'Competition' | 'Seminar' | 'Webinar' | 'Other';
    registrationLimit?: number;
    featured?: boolean;
    image: string;
    registrationLink?: string;
    registrations?: number;
}

const defaultEvent: Partial<Event> = {
    title: '',
    description: '',
    shortDescription: '',
    date: '',
    time: '',
    location: '',
    mode: 'Offline',
    status: 'Upcoming',
    category: 'Workshop',
    registrationLimit: 100,
    featured: false,
    image: '',
    registrationLink: '',
};

const categories = ['Hackathon', 'Workshop', 'Sprint', 'Meetup', 'Competition', 'Seminar', 'Webinar', 'Other'];
const statuses = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'];
const modes = ['Online', 'Offline', 'Hybrid'];

export default function EventsManager() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [formData, setFormData] = useState<Partial<Event>>(defaultEvent);
    const [saving, setSaving] = useState(false);

    // Fetch events from API
    const fetchEvents = async () => {
        setLoading(true);
        try {
            const params: Record<string, unknown> = { limit: 100 };
            if (statusFilter !== 'all') {
                params.status = statusFilter;
            }
            const response = await eventsApi.getAll(params);
            setEvents(response.data.events || []);
        } catch (error) {
            console.error('Failed to fetch events:', error);
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [statusFilter]);

    // Filter events by search query
    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    // Open modal for create/edit
    const openModal = (event?: Event) => {
        if (event) {
            setEditingEvent(event);
            setFormData({
                ...event,
                date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
            });
        } else {
            setEditingEvent(null);
            setFormData(defaultEvent);
        }
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setEditingEvent(null);
        setFormData(defaultEvent);
    };

    // Save event (create or update)
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.date) {
            toast.error('Title and date are required');
            return;
        }

        setSaving(true);
        try {
            if (editingEvent) {
                await eventsApi.update(editingEvent._id, formData);
                toast.success('Event updated successfully');
            } else {
                await eventsApi.create(formData);
                toast.success('Event created successfully');
            }
            closeModal();
            fetchEvents();
        } catch (error) {
            console.error('Failed to save event:', error);
            toast.error('Failed to save event');
        } finally {
            setSaving(false);
        }
    };

    // Delete event
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            await eventsApi.delete(id);
            toast.success('Event deleted successfully');
            setEvents(events.filter(e => e._id !== id));
        } catch (error) {
            console.error('Failed to delete event:', error);
            toast.error('Failed to delete event');
        }
    };

    const statusColors: Record<string, string> = {
        Draft: 'bg-gray-500/10 text-gray-500',
        Upcoming: 'bg-blue-500/10 text-blue-500',
        Ongoing: 'bg-yellow-500/10 text-yellow-500',
        Completed: 'bg-green-500/10 text-green-500',
        Cancelled: 'bg-red-500/10 text-red-500',
    };

    return (
        <AdminLayout title="Events Management">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="form-input pl-10"
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="form-input"
                    >
                        <option value="all">All Status</option>
                        {statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => fetchEvents()}
                        className="btn btn-secondary"
                        title="Refresh"
                    >
                        <HiRefresh size={18} />
                    </button>
                    <button
                        onClick={() => openModal()}
                        className="btn btn-primary"
                    >
                        <HiPlus size={18} /> Add Event
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    {/* Events Table */}
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
                        <div className="admin-table-responsive">
                            <table className="w-full min-w-[600px]">
                                <thead className="bg-[var(--color-bg)]">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-[var(--color-text-muted)]">Event</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-[var(--color-text-muted)]">Date</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-[var(--color-text-muted)]">Category</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-[var(--color-text-muted)]">Status</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-[var(--color-text-muted)]">Mode</th>
                                        <th className="text-right px-6 py-4 text-sm font-medium text-[var(--color-text-muted)]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--color-border)]">
                                    {filteredEvents.map((event) => (
                                        <tr key={event._id} className="hover:bg-[var(--color-bg)]/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                                                        <HiCalendar className="text-[var(--color-accent)]" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <span className="font-medium text-[var(--color-text)] block truncate">{event.title}</span>
                                                        {event.location && (
                                                            <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
                                                                <HiLocationMarker size={12} /> {event.location}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                                                <div className="flex items-center gap-1">
                                                    <HiClock size={14} className="text-[var(--color-text-muted)]" />
                                                    {new Date(event.date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[var(--color-text-secondary)]">{event.category}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[event.status]}`}>
                                                    {event.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-[var(--color-text-secondary)] capitalize">{event.mode}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openModal(event)}
                                                        className="btn btn-ghost"
                                                        title="Edit"
                                                    >
                                                        <HiPencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(event._id)}
                                                        className="btn btn-ghost hover:!bg-red-500/10 hover:!text-red-500"
                                                        title="Delete"
                                                    >
                                                        <HiTrash size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredEvents.length === 0 && (
                            <div className="text-center py-12 text-[var(--color-text-muted)]">
                                {searchQuery ? 'No events match your search' : 'No events found. Create your first event!'}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="modal-content"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h2 className="text-xl font-semibold text-[var(--color-text)]">
                                    {editingEvent ? 'Edit Event' : 'Create Event'}
                                </h2>
                                <button onClick={closeModal} className="btn btn-ghost">
                                    <HiX size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSave}>
                                <div className="modal-body space-y-4">
                                    {/* Title */}
                                    <div>
                                        <label className="form-label">Title *</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title || ''}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            placeholder="Event title"
                                            required
                                        />
                                    </div>

                                    {/* Short Description */}
                                    <div>
                                        <label className="form-label">Short Description *</label>
                                        <input
                                            type="text"
                                            name="shortDescription"
                                            value={formData.shortDescription || ''}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            placeholder="Brief summary (max 200 chars)"
                                            maxLength={200}
                                            required
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="form-label">Description *</label>
                                        <textarea
                                            name="description"
                                            value={formData.description || ''}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            rows={3}
                                            placeholder="Detailed event description..."
                                            required
                                        />
                                    </div>

                                    {/* Image URL */}
                                    <div>
                                        <label className="form-label">Image URL *</label>
                                        <input
                                            type="url"
                                            name="image"
                                            value={formData.image || ''}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            placeholder="https://example.com/image.jpg"
                                            required
                                        />
                                    </div>

                                    {/* Registration Link */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="form-label mb-0">Registration Link</label>
                                            {formData.registrationLink && (
                                                <a
                                                    href={formData.registrationLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1"
                                                >
                                                    <HiExternalLink size={12} /> Preview Link
                                                </a>
                                            )}
                                        </div>
                                        <input
                                            type="url"
                                            name="registrationLink"
                                            value={formData.registrationLink || ''}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            placeholder="https://forms.gle/..."
                                        />
                                    </div>

                                    {/* Date & Time */}
                                    <div className="admin-form-grid">
                                        <div>
                                            <label className="form-label">Date *</label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={formData.date || ''}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Time</label>
                                            <input
                                                type="time"
                                                name="time"
                                                value={formData.time || ''}
                                                onChange={handleInputChange}
                                                className="form-input"
                                            />
                                        </div>
                                    </div>

                                    {/* Category & Status */}
                                    <div className="admin-form-grid">
                                        <div>
                                            <label className="form-label">Category</label>
                                            <select
                                                name="category"
                                                value={formData.category || 'Workshop'}
                                                onChange={handleInputChange}
                                                className="form-input"
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="form-label">Status</label>
                                            <select
                                                name="status"
                                                value={formData.status || 'Upcoming'}
                                                onChange={handleInputChange}
                                                className="form-input"
                                            >
                                                {statuses.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Mode & Location */}
                                    <div className="admin-form-grid">
                                        <div>
                                            <label className="form-label">Mode</label>
                                            <select
                                                name="mode"
                                                value={formData.mode || 'offline'}
                                                onChange={handleInputChange}
                                                className="form-input"
                                            >
                                                {modes.map(mode => (
                                                    <option key={mode} value={mode}>{mode}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="form-label">Location</label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location || ''}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                placeholder="Event location"
                                            />
                                        </div>
                                    </div>

                                    {/* Registration Limit */}
                                    <div>
                                        <label className="form-label">Registration Limit</label>
                                        <input
                                            type="number"
                                            name="registrationLimit"
                                            value={formData.registrationLimit || ''}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            min={1}
                                        />
                                    </div>

                                    {/* Featured */}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            id="featured"
                                            checked={formData.featured || false}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 accent-[var(--color-accent)]"
                                        />
                                        <label htmlFor="featured" className="text-[var(--color-text)]">Featured Event</label>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" onClick={closeModal} className="btn btn-secondary">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        {saving ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
