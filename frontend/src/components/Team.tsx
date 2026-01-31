import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { HiMail, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { teamApi } from '@/api';
import { teamMembers as fallbackMembers } from '@/data';

interface TeamMember {
    _id?: string;
    id?: string;
    name: string;
    role: string;
    bio: string;
    image: string;
    year?: string;
    social: {
        linkedin?: string;
        github?: string;
        email?: string;
    };
    order?: number;
    displayInTop6?: boolean;
}

const DISPLAY_COUNT = 6;

export default function Team() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch team members from API
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await teamApi.getAll();
                const data = response.data;
                // Handle both array response and object with data property
                const memberList = Array.isArray(data) ? data : (data.data || data);
                if (memberList && memberList.length > 0) {
                    setMembers(memberList);
                } else {
                    // Fallback to static data
                    setMembers(fallbackMembers as TeamMember[]);
                }
            } catch (error) {
                console.error('Error fetching team members:', error);
                // Fallback to static data
                setMembers(fallbackMembers as TeamMember[]);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, []);

    // Get members to display (first 6 or all)
    const visibleMembers = isExpanded ? members : members.slice(0, DISPLAY_COUNT);
    const hiddenCount = Math.max(0, members.length - DISPLAY_COUNT);
    const hasMore = members.length > DISPLAY_COUNT;

    return (
        <section id="team" className="py-24 bg-[var(--color-bg)]" ref={ref}>
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-[var(--color-accent)] font-semibold text-sm uppercase tracking-wider">
                        Our Team
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text)] mt-3 mb-6">
                        Meet the{' '}
                        <span className="text-[var(--color-accent)]">Leaders</span>
                    </h2>
                    <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
                        The passionate individuals driving innovation and building a thriving developer community.
                    </p>
                </motion.div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {/* Team Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {visibleMembers.map((member, index) => (
                                <motion.div
                                    key={member._id || member.id || index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group"
                                >
                                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 text-center transition-all duration-300 hover:border-[var(--color-accent)] hover:shadow-xl hover:-translate-y-2">
                                        {/* Avatar */}
                                        <div className="relative w-32 h-32 mx-auto mb-6">
                                            <div className="w-full h-full rounded-full overflow-hidden border-4 border-[var(--color-accent)]/20 group-hover:border-[var(--color-accent)] transition-colors">
                                                <img
                                                    src={member.image}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    onError={(e) => {
                                                        // Fallback to initials on image error
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                            {/* Role Badge */}
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--color-accent)] text-white text-xs font-semibold whitespace-nowrap">
                                                {member.role}
                                            </div>
                                        </div>

                                        {/* Name & Info */}
                                        <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                                            {member.name}
                                        </h3>
                                        {member.year && (
                                            <p className="text-[var(--color-accent)] text-sm mb-3">
                                                Batch of {member.year}
                                            </p>
                                        )}
                                        <p className="text-[var(--color-text-secondary)] text-sm mb-6 line-clamp-2">
                                            {member.bio}
                                        </p>

                                        {/* Social Links */}
                                        <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {member.social?.linkedin && (
                                                <motion.a
                                                    href={member.social.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 rounded-lg bg-[var(--color-surface-elevated)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-accent)] hover:text-white transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FaLinkedin size={18} />
                                                </motion.a>
                                            )}
                                            {member.social?.github && (
                                                <motion.a
                                                    href={member.social.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 rounded-lg bg-[var(--color-surface-elevated)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-accent)] hover:text-white transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FaGithub size={18} />
                                                </motion.a>
                                            )}

                                            {member.social?.email && (
                                                <motion.a
                                                    href={`mailto:${member.social.email}`}
                                                    className="w-10 h-10 rounded-lg bg-[var(--color-surface-elevated)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-accent)] hover:text-white transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <HiMail size={18} />
                                                </motion.a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Show More / Show Less Button */}
                        {hasMore && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="mt-12 text-center"
                            >
                                <motion.button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] font-semibold hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isExpanded ? (
                                        <>
                                            Show Less
                                            <HiChevronUp className="w-5 h-5" />
                                        </>
                                    ) : (
                                        <>
                                            Show More ({hiddenCount} more)
                                            <HiChevronDown className="w-5 h-5" />
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        )}
                    </>
                )}

                {/* Join Team CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <p className="text-[var(--color-text-secondary)] mb-6">
                        Want to be part of our team? We're always looking for passionate individuals.
                    </p>
                    <motion.a
                        href="#contact"
                        className="inline-flex px-8 py-3 rounded-xl bg-[var(--color-accent)] text-white font-semibold hover:bg-[var(--color-accent-dark)] transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Join the Team
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}

