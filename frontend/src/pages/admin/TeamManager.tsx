import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiPlus,
    HiPencil,
    HiTrash,
    HiSearch,
    HiX,
    HiRefresh
} from 'react-icons/hi';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { teamApi } from '@/api';

interface TeamMember {
    _id: string;
    name: string;
    role: string;
    image?: string;
    email?: string;
    phone?: string;
    year?: string;
    bio?: string;
    linkedin?: string;
    github?: string;
    order?: number;
    active: boolean;
}

const defaultMember: Partial<TeamMember> = {
    name: '',
    role: '',
    email: '',
    phone: '',
    year: '',
    bio: '',
    linkedin: '',
    github: '',
    image: '',
    active: true,
};

const roles = [
    'President',
    'Vice President',
    'General Secretary',
    'Tech Lead',
    'Design Lead',
    'Event Coordinator',
    'Marketing Head',
    'Content Head',
    'Social Media Manager',
    'Core Member',
    'Member',
];

export default function TeamManager() {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [formData, setFormData] = useState<Partial<TeamMember>>(defaultMember);
    const [saving, setSaving] = useState(false);

    // Fetch team from API
    const fetchTeam = async () => {
        setLoading(true);
        try {
            const response = await teamApi.getAll({ all: true });
            setTeam(response.data || []);
        } catch (error) {
            console.error('Failed to fetch team:', error);
            toast.error('Failed to load team members');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    // Filter team by search query
    const filteredTeam = team.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
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
    const openModal = (member?: TeamMember) => {
        if (member) {
            setEditingMember(member);
            setFormData({ ...member });
        } else {
            setEditingMember(null);
            setFormData(defaultMember);
        }
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setEditingMember(null);
        setFormData(defaultMember);
    };

    // Save member (create or update)
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.role) {
            toast.error('Name and role are required');
            return;
        }

        setSaving(true);
        try {
            if (editingMember) {
                await teamApi.update(editingMember._id, formData);
                toast.success('Team member updated successfully');
            } else {
                await teamApi.create(formData);
                toast.success('Team member added successfully');
            }
            closeModal();
            fetchTeam();
        } catch (error) {
            console.error('Failed to save team member:', error);
            toast.error('Failed to save team member');
        } finally {
            setSaving(false);
        }
    };

    // Delete member
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this team member?')) return;

        try {
            await teamApi.delete(id);
            toast.success('Team member deleted successfully');
            setTeam(team.filter(m => m._id !== id));
        } catch (error) {
            console.error('Failed to delete team member:', error);
            toast.error('Failed to delete team member');
        }
    };

    // Get initials from name
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <AdminLayout title="Team Management">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search team members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="form-input pl-10"
                        />
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => fetchTeam()}
                        className="btn btn-secondary"
                        title="Refresh"
                    >
                        <HiRefresh size={18} />
                    </button>
                    <button
                        onClick={() => openModal()}
                        className="btn btn-primary"
                    >
                        <HiPlus size={18} /> Add Member
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
                    {/* Team Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredTeam.map((member) => (
                            <motion.div
                                key={member._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-accent)] transition-colors"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    {member.image ? (
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-accent)]/20"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white font-bold text-xl">
                                            {getInitials(member.name)}
                                        </div>
                                    )}
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => openModal(member)}
                                            className="btn btn-ghost btn-sm"
                                            title="Edit"
                                        >
                                            <HiPencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(member._id)}
                                            className="btn btn-ghost btn-sm hover:!bg-red-500/10 hover:!text-red-500"
                                            title="Delete"
                                        >
                                            <HiTrash size={16} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-[var(--color-text)] truncate">{member.name}</h3>
                                <p className="text-[var(--color-accent)] text-sm mb-2">{member.role}</p>
                                {member.year && (
                                    <p className="text-[var(--color-text-muted)] text-sm">Batch of {member.year}</p>
                                )}

                                {/* Social Links */}
                                {(member.linkedin || member.github) && (
                                    <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--color-border)]">
                                        {member.linkedin && (
                                            <a
                                                href={member.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-ghost btn-sm"
                                                title="LinkedIn"
                                            >
                                                <FaLinkedin size={16} />
                                            </a>
                                        )}
                                        {member.github && (
                                            <a
                                                href={member.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-ghost btn-sm"
                                                title="GitHub"
                                            >
                                                <FaGithub size={16} />
                                            </a>
                                        )}
                                    </div>
                                )}

                                <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                                    <span className={`text-xs px-2 py-1 rounded-full ${member.active ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                                        {member.active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredTeam.length === 0 && (
                        <div className="text-center py-12 text-[var(--color-text-muted)]">
                            {searchQuery ? 'No team members match your search' : 'No team members found. Add your first team member!'}
                        </div>
                    )}
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
                                    {editingMember ? 'Edit Team Member' : 'Add Team Member'}
                                </h2>
                                <button onClick={closeModal} className="btn btn-ghost">
                                    <HiX size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSave}>
                                <div className="modal-body space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label className="form-label">Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name || ''}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            placeholder="Full name"
                                            required
                                        />
                                    </div>

                                    {/* Role & Year */}
                                    <div className="admin-form-grid">
                                        <div>
                                            <label className="form-label">Role *</label>
                                            <select
                                                name="role"
                                                value={formData.role || ''}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                required
                                            >
                                                <option value="">Select role</option>
                                                {roles.map(role => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="form-label">Year/Batch</label>
                                            <input
                                                type="text"
                                                name="year"
                                                value={formData.year || ''}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                placeholder="e.g., 2024"
                                            />
                                        </div>
                                    </div>

                                    {/* Email & Phone */}
                                    <div className="admin-form-grid">
                                        <div>
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email || ''}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone || ''}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                placeholder="+91 9876543210"
                                            />
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div>
                                        <label className="form-label">Bio</label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio || ''}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            rows={2}
                                            placeholder="Short bio..."
                                            maxLength={200}
                                        />
                                    </div>

                                    {/* Social Links */}
                                    <div className="admin-form-grid">
                                        <div>
                                            <label className="form-label">LinkedIn URL</label>
                                            <input
                                                type="url"
                                                name="linkedin"
                                                value={formData.linkedin || ''}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                placeholder="https://linkedin.com/in/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">GitHub URL</label>
                                            <input
                                                type="url"
                                                name="github"
                                                value={formData.github || ''}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                placeholder="https://github.com/..."
                                            />
                                        </div>
                                    </div>

                                    {/* Image URL */}
                                    <div>
                                        <label className="form-label">Profile Image URL</label>
                                        <input
                                            type="url"
                                            name="image"
                                            value={formData.image || ''}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            placeholder="https://example.com/photo.jpg"
                                        />
                                    </div>

                                    {/* Active */}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="active"
                                            id="active"
                                            checked={formData.active ?? true}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 accent-[var(--color-accent)]"
                                        />
                                        <label htmlFor="active" className="text-[var(--color-text)]">Active Member</label>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" onClick={closeModal} className="btn btn-secondary">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        {saving ? 'Saving...' : (editingMember ? 'Update Member' : 'Add Member')}
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
