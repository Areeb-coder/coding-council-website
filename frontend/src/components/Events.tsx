import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { HiCalendar, HiLocationMarker, HiUserGroup, HiClock, HiExternalLink, HiX } from 'react-icons/hi';
import { eventsApi, settingsApi } from '@/api';
import { pastEvents as fallbackPast, upcomingEvents as fallbackUpcoming } from '@/data';
import type { Event } from '@/types';

interface ApiEvent {
    _id?: string;
    id?: string;
    title: string;
    description: string;
    shortDescription: string;
    date: string;
    endDate?: string;
    time: string;
    mode: 'Online' | 'Offline' | 'Hybrid';
    location?: string;
    category: string;
    status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
    image: string;
    registrationLink?: string;
    externalLink?: string;
    maxParticipants?: number;
    participants?: number;
    participantsInfo?: string;
    tags: string[];
    winners?: any[]; // Using any[] here to avoid importing Winner in the local interface scope if not needed, or just import it.
    featured?: boolean;
}

interface EventCardProps {
    event: Event | ApiEvent;
    index: number;
    onViewDetails?: (event: Event | ApiEvent) => void;
}

function EventCard({ event, index, onViewDetails }: EventCardProps) {
    const isUpcoming = event.status === 'Upcoming';
    const apiEvent = event as ApiEvent;

    const handleAction = () => {
        if (isUpcoming) {
            if (apiEvent.registrationLink) {
                window.open(apiEvent.registrationLink, '_blank');
            }
        } else {
            if (event.externalLink) {
                window.open(event.externalLink, '_blank');
            } else if (onViewDetails) {
                onViewDetails(event);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
        >
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[var(--color-accent)] hover:shadow-xl hover:-translate-y-2">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isUpcoming
                            ? 'bg-[var(--color-accent)] text-white'
                            : 'bg-[var(--color-surface)] text-[var(--color-text)]'
                            }`}>
                            {event.status}
                        </span>
                    </div>

                    {/* Category */}
                    <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                            {event.category}
                        </span>
                    </div>

                    {/* Mode Badge */}
                    <div className="absolute bottom-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.mode === 'Online' ? 'bg-blue-500' :
                            event.mode === 'Hybrid' ? 'bg-purple-500' : 'bg-orange-500'
                            } text-white`}>
                            {event.mode}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <h3 className="text-xl font-semibold text-[var(--color-text)] mb-3 group-hover:text-[var(--color-accent)] transition-colors">
                        {event.title}
                    </h3>

                    <p className="text-[var(--color-text-secondary)] text-sm mb-4 line-clamp-2">
                        {event.shortDescription}
                    </p>

                    {/* Meta Info */}
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                            <HiCalendar className="w-4 h-4" />
                            <span>{new Date(event.date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}</span>
                        </div>
                        {event.location && (
                            <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                                <HiLocationMarker className="w-4 h-4" />
                                <span>{event.location}</span>
                            </div>
                        )}
                        {(event.participantsInfo || event.participants) && (
                            <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                                <HiUserGroup className="w-4 h-4" />
                                <span>{event.participantsInfo || `${event.participants}+ Participants`}</span>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {event.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 rounded-md text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                            >
                                {tag}
                            </span>
                        ))}
                        {event.tags.length > 3 && (
                            <span className="px-2 py-1 rounded-md text-xs bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]">
                                +{event.tags.length - 3}
                            </span>
                        )}
                    </div>

                    {/* Action Button */}
                    <motion.button
                        onClick={handleAction}
                        disabled={isUpcoming && !apiEvent.registrationLink && apiEvent.registrationLink !== '#'}
                        className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${isUpcoming
                            ? apiEvent.registrationLink
                                ? 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]'
                                : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] cursor-not-allowed'
                            : 'bg-[var(--color-surface-elevated)] text-[var(--color-text)] hover:bg-[var(--color-accent)] hover:text-white'
                            }`}
                        whileHover={isUpcoming && !apiEvent.registrationLink ? {} : { scale: 1.02 }}
                        whileTap={isUpcoming && !apiEvent.registrationLink ? {} : { scale: 0.98 }}
                    >
                        {isUpcoming
                            ? apiEvent.registrationLink ? 'Register Now' : 'Registration Closed'
                            : 'View Details'
                        }
                        <HiExternalLink className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

function CountdownTimer({ targetDate, serverTimeOffset }: { targetDate: string; serverTimeOffset: number }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            // Use server time offset for accurate countdown
            const now = Date.now() + serverTimeOffset;
            const difference = new Date(targetDate).getTime() - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [targetDate, serverTimeOffset]);

    return (
        <div className="flex gap-4">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="text-center">
                    <div className="w-16 h-16 rounded-xl bg-[var(--color-accent)] flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{value.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)] mt-1 capitalize">{unit}</span>
                </div>
            ))}
        </div>
    );
}

interface EventResultsModalProps {
    event: Event | ApiEvent;
    onClose: () => void;
}

function EventResultsModal({ event, onClose }: EventResultsModalProps) {
    const winners = event.winners;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative h-32 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] p-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                        <HiX className="w-6 h-6" />
                    </button>
                    <div className="mt-4">
                        <h2 className="text-2xl font-bold text-white mb-1">{event.title} — Results</h2>
                        <p className="text-white/80 text-sm">Congratulations to all the participating teams!</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                    {winners && winners.length > 0 ? (
                        <div className="space-y-6">
                            {winners.map((winner, index) => (
                                <motion.div
                                    key={winner.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start gap-4 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-colors"
                                >
                                    <div className="text-3xl mt-1">
                                        {winner.prize.includes('Winner') || winner.prize.includes('1st') ? '🥇' :
                                            winner.prize.includes('Runner Up') || winner.prize.includes('2nd') ? '🥈' : '🥉'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                            <h3 className="font-bold text-lg text-[var(--color-text)]">
                                                {winner.name}
                                            </h3>
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                                                {winner.prize}
                                            </span>
                                        </div>
                                        <p className="text-[var(--color-text-secondary)] text-sm mb-3">
                                            {winner.description}
                                        </p>
                                        {winner.githubUrl && (
                                            <a
                                                href={winner.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] hover:underline"
                                            >
                                                View GitHub Repository
                                                <HiExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-[var(--color-text-secondary)]">Results for this event will be announced soon.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-[var(--color-surface-elevated)] border-t border-[var(--color-border)] flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] font-semibold hover:bg-[var(--color-accent)] hover:text-white transition-colors"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function Events() {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [upcomingEvents, setUpcomingEvents] = useState<(Event | ApiEvent)[]>([]);
    const [pastEvents, setPastEvents] = useState<(Event | ApiEvent)[]>([]);
    const [loading, setLoading] = useState(true);
    const [serverTimeOffset, setServerTimeOffset] = useState(0);
    const [selectedEvent, setSelectedEvent] = useState<Event | ApiEvent | null>(null);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    // Fetch events and server time
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch server time for countdown sync
                try {
                    const timeRes = await settingsApi.getServerTime();
                    const serverTime = timeRes.data.data.timestamp;
                    setServerTimeOffset(serverTime - Date.now());
                } catch {
                    console.log('Using local time for countdown');
                }

                // Fetch upcoming events
                try {
                    const upcomingRes = await eventsApi.getAll({ status: 'Upcoming', limit: 10 });
                    const upcomingData = upcomingRes.data.events;
                    if (upcomingData && upcomingData.length > 0) {
                        setUpcomingEvents(upcomingData);
                    } else {
                        setUpcomingEvents(fallbackUpcoming);
                    }
                } catch {
                    setUpcomingEvents(fallbackUpcoming);
                }

                // Fetch past events
                try {
                    const pastRes = await eventsApi.getAll({ status: 'Completed', limit: 10 });
                    const pastData = pastRes.data.events;
                    if (pastData && pastData.length > 0) {
                        setPastEvents(pastData);
                    } else {
                        setPastEvents(fallbackPast);
                    }
                } catch {
                    setPastEvents(fallbackPast);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const featuredUpcoming = upcomingEvents.find(e => e.featured);
    const displayEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

    const handleFeaturedRegistration = () => {
        if (featuredUpcoming && (featuredUpcoming as ApiEvent).registrationLink) {
            window.open((featuredUpcoming as ApiEvent).registrationLink, '_blank');
        }
    };

    return (
        <section id="events" className="py-24 bg-[var(--color-bg-secondary)]" ref={ref}>
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <span className="text-[var(--color-accent)] font-semibold text-sm uppercase tracking-wider">
                        Events
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text)] mt-3 mb-6">
                        Learn, Build, and{' '}
                        <span className="text-[var(--color-accent)]">Compete</span>
                    </h2>
                    <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
                        Join our hackathons, workshops, and coding sprints to level up your skills
                        and connect with fellow developers.
                    </p>
                </motion.div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {/* Featured Event with Countdown */}
                        {featuredUpcoming && activeTab === 'upcoming' && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="mb-16"
                            >
                                <div className="relative bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-3xl overflow-hidden">
                                    <div className="absolute inset-0">
                                        <img
                                            src={featuredUpcoming.image}
                                            alt={featuredUpcoming.title}
                                            className="w-full h-full object-cover opacity-30"
                                        />
                                    </div>
                                    <div className="relative p-8 md:p-12 flex flex-col lg:flex-row items-center gap-8">
                                        <div className="flex-1 text-center lg:text-left">
                                            <span className="inline-block px-4 py-1 rounded-full bg-[var(--color-accent)] text-white text-sm font-semibold mb-4">
                                                Featured Event
                                            </span>
                                            <h3 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
                                                {featuredUpcoming.title}
                                            </h3>
                                            <p className="text-[var(--color-text-secondary)] mb-6 max-w-xl">
                                                {featuredUpcoming.shortDescription}
                                            </p>
                                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[var(--color-text-muted)] mb-6">
                                                <span className="flex items-center gap-2">
                                                    <HiCalendar /> {new Date(featuredUpcoming.date).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <HiClock /> {(featuredUpcoming as Event).time || '9:00 AM'}
                                                </span>
                                                {featuredUpcoming.location && (
                                                    <span className="flex items-center gap-2">
                                                        <HiLocationMarker /> {featuredUpcoming.location}
                                                    </span>
                                                )}
                                            </div>
                                            <motion.button
                                                onClick={handleFeaturedRegistration}
                                                className="px-8 py-3 rounded-xl bg-[var(--color-accent)] text-white font-semibold hover:bg-[var(--color-accent-dark)] transition-colors"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Register Now
                                            </motion.button>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <p className="text-[var(--color-text-muted)] text-sm mb-2 text-center">Event starts in:</p>
                                            <CountdownTimer
                                                targetDate={featuredUpcoming.date}
                                                serverTimeOffset={serverTimeOffset}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Tab Switcher */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex justify-center mb-12"
                        >
                            <div className="inline-flex bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-1">
                                {(['upcoming', 'past'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === tab
                                            ? 'bg-[var(--color-accent)] text-white'
                                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                                            }`}
                                    >
                                        {tab === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Events Grid */}
                        {displayEvents.length === 0 ? (
                            <div className="text-center py-12 text-[var(--color-text-muted)]">
                                No {activeTab} events found.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {displayEvents.map((event, index) => (
                                    <EventCard
                                        key={(event as ApiEvent)._id || event.id}
                                        event={event}
                                        index={index}
                                        onViewDetails={(event) => setSelectedEvent(event)}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Event Results Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <EventResultsModal
                        event={selectedEvent}
                        onClose={() => setSelectedEvent(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}
