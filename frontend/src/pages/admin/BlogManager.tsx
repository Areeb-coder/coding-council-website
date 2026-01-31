import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiPlus,
    HiPencil,
    HiTrash,
    HiSearch,
    HiX,
    HiEye,
    HiDocumentText
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';

interface BlogPost {
    _id: string;
    title: string;
    excerpt?: string;
    content: string;
    author: string;
    category: string;
    tags: string[];
    image?: string;
    status: 'Draft' | 'Published';
    featured: boolean;
    views?: number;
    createdAt: string;
    publishedAt?: string;
}

const defaultPost: Partial<BlogPost> = {
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Technology',
    tags: [],
    image: '',
    status: 'Draft',
    featured: false,
};

const categories = ['Technology', 'Events', 'Tutorials', 'News', 'Announcements', 'Projects'];

// Mock data - will be replaced with API later
const mockPosts: BlogPost[] = [
    {
        _id: '1',
        title: 'Getting Started with React 19',
        excerpt: 'Learn the new features in React 19',
        content: 'Full content here...',
        author: 'Admin',
        category: 'Technology',
        tags: ['React', 'JavaScript', 'Web Development'],
        status: 'Published',
        featured: true,
        views: 245,
        createdAt: '2026-01-15',
        publishedAt: '2026-01-16'
    },
    {
        _id: '2',
        title: 'AI Hackathon 2026 Recap',
        excerpt: 'Highlights from our recent hackathon',
        content: 'Full content here...',
        author: 'Admin',
        category: 'Events',
        tags: ['Hackathon', 'AI', 'Event'],
        status: 'Published',
        featured: false,
        views: 180,
        createdAt: '2026-01-10',
        publishedAt: '2026-01-12'
    },
];

export default function BlogManager() {
    const [posts, setPosts] = useState<BlogPost[]>(mockPosts);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [formData, setFormData] = useState<Partial<BlogPost>>(defaultPost);
    const [saving, setSaving] = useState(false);
    const [tagsInput, setTagsInput] = useState('');

    // Filter posts
    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Handle form changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    // Open modal
    const openModal = (post?: BlogPost) => {
        if (post) {
            setEditingPost(post);
            setFormData({ ...post });
            setTagsInput(post.tags?.join(', ') || '');
        } else {
            setEditingPost(null);
            setFormData(defaultPost);
            setTagsInput('');
        }
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setEditingPost(null);
        setFormData(defaultPost);
        setTagsInput('');
    };

    // Save post
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.content) {
            toast.error('Title and content are required');
            return;
        }

        setSaving(true);
        try {
            const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
            const postData = {
                ...formData,
                tags,
                author: formData.author || 'Admin',
                createdAt: formData.createdAt || new Date().toISOString(),
            };

            if (editingPost) {
                setPosts(posts.map(p => p._id === editingPost._id ? { ...p, ...postData } as BlogPost : p));
                toast.success('Post updated successfully');
            } else {
                const newPost = {
                    ...postData,
                    _id: Date.now().toString(),
                    views: 0,
                } as BlogPost;
                setPosts([newPost, ...posts]);
                toast.success('Post created successfully');
            }
            closeModal();
        } catch (error) {
            toast.error('Failed to save post');
        } finally {
            setSaving(false);
        }
    };

    // Delete post
    const handleDelete = (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        setPosts(posts.filter(p => p._id !== id));
        toast.success('Post deleted successfully');
    };

    const statusColors: Record<string, string> = {
        Draft: 'bg-gray-500/10 text-gray-500',
        Published: 'bg-green-500/10 text-green-500',
    };

    return (
        <AdminLayout title="Blog Management">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search posts..."
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
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                    </select>
                    <button
                        onClick={() => openModal()}
                        className="btn btn-primary"
                    >
                        <HiPlus size={18} /> New Post
                    </button>
                </div>
            </div>

            {/* Posts Table */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
                <div className="admin-table-responsive">
                    <table className="w-full min-w-[600px]">
                        <thead className="bg-[var(--color-bg)]">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-medium text-[var(--color-text-muted)]">Title</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-[var(--color-text-muted)]">Category</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-[var(--color-text-muted)]">Status</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-[var(--color-text-muted)]">Views</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-[var(--color-text-muted)]">Date</th>
                                <th className="text-right px-6 py-4 text-sm font-medium text-[var(--color-text-muted)]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {filteredPosts.map((post) => (
                                <tr key={post._id} className="hover:bg-[var(--color-bg)]/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                                                <HiDocumentText className="text-[var(--color-accent)]" />
                                            </div>
                                            <div className="min-w-0">
                                                <span className="font-medium text-[var(--color-text)] block truncate">{post.title}</span>
                                                {post.featured && (
                                                    <span className="text-xs text-[var(--color-accent)]">Featured</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[var(--color-text-secondary)]">{post.category}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[post.status]}`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                                        <span className="flex items-center gap-1">
                                            <HiEye size={14} /> {post.views || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openModal(post)}
                                                className="btn btn-ghost"
                                                title="Edit"
                                            >
                                                <HiPencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post._id)}
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

                {filteredPosts.length === 0 && (
                    <div className="text-center py-12 text-[var(--color-text-muted)]">
                        {searchQuery ? 'No posts match your search' : 'No posts found. Create your first post!'}
                    </div>
                )}
            </div>

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
                            style={{ maxWidth: '700px' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h2 className="text-xl font-semibold text-[var(--color-text)]">
                                    {editingPost ? 'Edit Post' : 'Create Post'}
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
                                            placeholder="Post title"
                                            required
                                        />
                                    </div>

                                    {/* Excerpt */}
                                    <div>
                                        <label className="form-label">Excerpt</label>
                                        <input
                                            type="text"
                                            name="excerpt"
                                            value={formData.excerpt || ''}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            placeholder="Short summary..."
                                            maxLength={200}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <label className="form-label">Content *</label>
                                        <textarea
                                            name="content"
                                            value={formData.content || ''}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            rows={6}
                                            placeholder="Write your post content..."
                                            required
                                        />
                                    </div>

                                    {/* Category & Status */}
                                    <div className="admin-form-grid">
                                        <div>
                                            <label className="form-label">Category</label>
                                            <select
                                                name="category"
                                                value={formData.category || 'Technology'}
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
                                                value={formData.status || 'Draft'}
                                                onChange={handleInputChange}
                                                className="form-input"
                                            >
                                                <option value="Draft">Draft</option>
                                                <option value="Published">Published</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <label className="form-label">Tags (comma separated)</label>
                                        <input
                                            type="text"
                                            value={tagsInput}
                                            onChange={e => setTagsInput(e.target.value)}
                                            className="form-input"
                                            placeholder="React, JavaScript, Tutorial"
                                        />
                                    </div>

                                    {/* Featured Image URL */}
                                    <div>
                                        <label className="form-label">Featured Image URL</label>
                                        <input
                                            type="url"
                                            name="image"
                                            value={formData.image || ''}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            placeholder="https://example.com/image.jpg"
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
                                        <label htmlFor="featured" className="text-[var(--color-text)]">Featured Post</label>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" onClick={closeModal} className="btn btn-secondary">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        {saving ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}
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
