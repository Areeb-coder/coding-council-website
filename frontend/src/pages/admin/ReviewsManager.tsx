import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiPlus,
    HiPencil,
    HiTrash,
    HiSearch,
    HiX,
    HiRefresh,
    HiCheck,
    HiBan,
    HiStar,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { reviewsApi } from '@/api';

interface Review {
    _id: string;
    authorName: string;
    authorRole?: string;
    authorCompany?: string;
    content: string;
    rating: number;
    authorPhoto?: string;
    isApproved: boolean;
    isFeatured: boolean;
    createdAt: string;
}

const defaultReview: Partial<Review> = {
    authorName: '',
    authorRole: '',
    authorCompany: '',
    content: '',
    rating: 5,
    authorPhoto: '',
};

export default function ReviewsManager() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentReview, setCurrentReview] = useState<Partial<Review>>(defaultReview);
    const [isEditing, setIsEditing] = useState(false);

    // Fetch reviews from API
    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await reviewsApi.getAdmin({ status: statusFilter === 'all' ? undefined : statusFilter });
            setReviews(response.data.data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [statusFilter]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentReview(prev => ({
            ...prev,
            [name]: name === 'rating' ? parseInt(value) : value,
        }));
    };

    // Open modal for create/edit
    const openModal = (review?: Review) => {
        if (review) {
            setCurrentReview(review);
            setIsEditing(true);
        } else {
            setCurrentReview(defaultReview);
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentReview(defaultReview);
        setIsEditing(false);
    };

    // Save review (create or update)
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentReview._id) {
                await reviewsApi.update(currentReview._id, currentReview);
                toast.success('Review updated successfully');
            } else {
                await reviewsApi.create(currentReview);
                toast.success('Review created successfully');
            }
            closeModal();
            fetchReviews();
        } catch (error) {
            console.error('Error saving review:', error);
            toast.error('Failed to save review');
        }
    };

    // Delete review
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;
        try {
            await reviewsApi.delete(id);
            toast.success('Review deleted successfully');
            fetchReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('Failed to delete review');
        }
    };

    // Toggle approval
    const handleToggleApproval = async (id: string, currentStatus: boolean) => {
        try {
            await reviewsApi.approve(id, !currentStatus);
            toast.success(`Review ${!currentStatus ? 'approved' : 'rejected'}`);
            fetchReviews();
        } catch (error) {
            console.error('Error toggling approval:', error);
            toast.error('Failed to update review status');
        }
    };

    // Toggle featured
    const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
        try {
            await reviewsApi.feature(id, !currentStatus);
            toast.success(`Review ${!currentStatus ? 'featured' : 'unfeatured'}`);
            fetchReviews();
        } catch (error) {
            console.error('Error toggling featured:', error);
            toast.error('Failed to update featured status');
        }
    };

    // Filter reviews by search
    const filteredReviews = reviews.filter(review =>
        review.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Render star rating
    const renderStars = (rating: number) => {
        return Array(5).fill(0).map((_, i) => (
            <HiStar
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

    return (
        <AdminLayout title="Reviews Manager">
            {/* Header Actions */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search reviews..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="form-input pl-10 w-full sm:w-64"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'all' | 'approved' | 'pending')}
                        className="form-input w-full sm:w-40"
                    >
                        <option value="all">All Reviews</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={fetchReviews} className="btn btn-secondary flex-1 sm:flex-none">
                        <HiRefresh className="w-5 h-5" />
                    </button>
                    <button onClick={() => openModal()} className="btn btn-primary flex-1 sm:flex-none">
                        <HiPlus className="w-5 h-5" />
                        <span>Add Review</span>
                    </button>
                </div>
            </div>

            {/* Reviews List */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="p-8 text-center text-[var(--color-text-muted)]">
                        No reviews found. Add your first review!
                    </div>
                ) : (
                    <div className="divide-y divide-[var(--color-border)]">
                        {filteredReviews.map((review) => (
                            <div key={review._id} className="p-4 hover:bg-[var(--color-surface-elevated)] transition-colors">
                                <div className="flex items-start gap-4">
                                    {/* Author Photo */}
                                    <div className="w-12 h-12 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white font-semibold flex-shrink-0">
                                        {review.authorPhoto ? (
                                            <img src={review.authorPhoto} alt={review.authorName} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            review.authorName.split(' ').map(n => n[0]).join('').toUpperCase()
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-semibold text-[var(--color-text)]">{review.authorName}</h3>
                                            {review.authorRole && (
                                                <span className="text-sm text-[var(--color-text-muted)]">
                                                    {review.authorRole}{review.authorCompany && ` at ${review.authorCompany}`}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 my-1">
                                            {renderStars(review.rating)}
                                        </div>
                                        <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">{review.content}</p>

                                        {/* Status Badges */}
                                        <div className="flex gap-2 mt-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${review.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {review.isApproved ? 'Approved' : 'Pending'}
                                            </span>
                                            {review.isFeatured && (
                                                <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleToggleApproval(review._id, review.isApproved)}
                                            className={`p-2 rounded-lg transition-colors ${review.isApproved ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                            title={review.isApproved ? 'Reject' : 'Approve'}
                                        >
                                            {review.isApproved ? <HiBan className="w-4 h-4" /> : <HiCheck className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => handleToggleFeatured(review._id, review.isFeatured)}
                                            className={`p-2 rounded-lg transition-colors ${review.isFeatured ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                            title={review.isFeatured ? 'Unfeature' : 'Feature'}
                                        >
                                            <HiStar className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => openModal(review)}
                                            className="p-2 rounded-lg bg-[var(--color-surface-elevated)] text-[var(--color-text)] hover:bg-[var(--color-accent)] hover:text-white transition-colors"
                                        >
                                            <HiPencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(review._id)}
                                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                        >
                                            <HiTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h2 className="text-xl font-semibold text-[var(--color-text)]">
                                    {isEditing ? 'Edit Review' : 'Add New Review'}
                                </h2>
                                <button onClick={closeModal} className="btn-ghost p-2">
                                    <HiX className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSave}>
                                <div className="modal-body space-y-4">
                                    <div className="admin-form-grid">
                                        <div>
                                            <label className="form-label">Author Name *</label>
                                            <input
                                                type="text"
                                                name="authorName"
                                                value={currentReview.authorName || ''}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Rating *</label>
                                            <select
                                                name="rating"
                                                value={currentReview.rating || 5}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                required
                                            >
                                                {[1, 2, 3, 4, 5].map(n => (
                                                    <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="admin-form-grid">
                                        <div>
                                            <label className="form-label">Author Role</label>
                                            <input
                                                type="text"
                                                name="authorRole"
                                                value={currentReview.authorRole || ''}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                placeholder="e.g., Software Engineer"
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Company</label>
                                            <input
                                                type="text"
                                                name="authorCompany"
                                                value={currentReview.authorCompany || ''}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                placeholder="e.g., Google"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="form-label">Author Photo URL</label>
                                        <input
                                            type="url"
                                            name="authorPhoto"
                                            value={currentReview.authorPhoto || ''}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    <div>
                                        <label className="form-label">Review Content *</label>
                                        <textarea
                                            name="content"
                                            value={currentReview.content || ''}
                                            onChange={handleInputChange}
                                            className="form-input min-h-[120px]"
                                            required
                                            maxLength={1000}
                                            placeholder="What did they say about Coding Council?"
                                        />
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" onClick={closeModal} className="btn btn-secondary">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {isEditing ? 'Update' : 'Create'} Review
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
