import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { HiChevronLeft, HiChevronRight, HiStar } from 'react-icons/hi';
import { reviewsApi } from '@/api';
import { testimonials as fallbackTestimonials } from '@/data';

interface Review {
    _id?: string;
    id?: string;
    authorName: string;
    authorRole?: string;
    authorCompany?: string;
    content: string;
    rating: number;
    authorPhoto?: string;
    image?: string;
    name?: string;
    role?: string;
    company?: string;
}

export default function Testimonials() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch approved reviews from API
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await reviewsApi.getAll();
                const data = response.data.data;
                if (data && data.length > 0) {
                    setReviews(data);
                } else {
                    // Fallback to static testimonials
                    setReviews(fallbackTestimonials.map(t => ({
                        ...t,
                        authorName: t.name,
                        authorRole: t.role,
                        authorCompany: t.company,
                        authorPhoto: t.image,
                    })));
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
                // Fallback to static testimonials
                setReviews(fallbackTestimonials.map(t => ({
                    ...t,
                    authorName: t.name,
                    authorRole: t.role,
                    authorCompany: t.company,
                    authorPhoto: t.image,
                })));
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const nextTestimonial = () => {
        if (reviews.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % reviews.length);
        }
    };

    const prevTestimonial = () => {
        if (reviews.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
        }
    };

    // Get current review with fallback properties
    const currentReview = reviews[currentIndex];
    const displayName = currentReview?.authorName || currentReview?.name || 'Anonymous';
    const displayRole = currentReview?.authorRole || currentReview?.role || '';
    const displayCompany = currentReview?.authorCompany || currentReview?.company;
    const displayImage = currentReview?.authorPhoto || currentReview?.image;
    const displayRating = currentReview?.rating || 5;
    const displayContent = currentReview?.content || '';

    return (
        <section id="testimonials" className="py-24 bg-[var(--color-bg-secondary)]" ref={ref}>
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-[var(--color-accent)] font-semibold text-sm uppercase tracking-wider">
                        Testimonials
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text)] mt-3 mb-6">
                        What Our{' '}
                        <span className="text-[var(--color-accent)]">Community Says</span>
                    </h2>
                    <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
                        Hear from developers who have grown with Coding Council.
                    </p>
                </motion.div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-12 text-[var(--color-text-muted)]">
                        No testimonials available.
                    </div>
                ) : (
                    /* Testimonial Carousel */
                    <div className="relative max-w-4xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.4 }}
                                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 md:p-12"
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-6 justify-center">
                                    {[...Array(5)].map((_, i) => (
                                        <HiStar
                                            key={i}
                                            className={`w-6 h-6 ${i < displayRating
                                                ? 'text-yellow-400'
                                                : 'text-gray-600'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Quote */}
                                <blockquote className="text-xl md:text-2xl text-[var(--color-text)] text-center mb-8 leading-relaxed">
                                    "{displayContent}"
                                </blockquote>

                                {/* Author */}
                                <div className="flex items-center justify-center gap-4">
                                    {displayImage ? (
                                        <img
                                            src={displayImage}
                                            alt={displayName}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-[var(--color-accent)]"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white font-bold text-xl">
                                            {displayName.charAt(0)}
                                        </div>
                                    )}
                                    <div className="text-left">
                                        <p className="font-semibold text-[var(--color-text)]">
                                            {displayName}
                                        </p>
                                        <p className="text-sm text-[var(--color-text-secondary)]">
                                            {displayRole}
                                        </p>
                                        {displayCompany && (
                                            <p className="text-sm text-[var(--color-accent)]">
                                                {displayCompany}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevTestimonial}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                            aria-label="Previous testimonial"
                        >
                            <HiChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextTestimonial}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                            aria-label="Next testimonial"
                        >
                            <HiChevronRight size={24} />
                        </button>

                        {/* Dots */}
                        <div className="flex justify-center gap-2 mt-8">
                            {reviews.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex
                                        ? 'bg-[var(--color-accent)]'
                                        : 'bg-[var(--color-border)] hover:bg-[var(--color-accent)]/50'
                                        }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
