import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaStar } from 'react-icons/fa';
import { projects } from '@/data';

export default function Projects() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="projects" className="py-24 bg-[var(--color-bg-secondary)]" ref={ref}>
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-[var(--color-accent)] font-semibold text-sm uppercase tracking-wider">
                        Projects
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text)] mt-3 mb-6">
                        What We've{' '}
                        <span className="text-[var(--color-accent)]">Built</span>
                    </h2>
                    <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
                        Explore the innovative projects created by our community members during hackathons and workshops.
                    </p>
                </motion.div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[var(--color-accent)] hover:shadow-xl hover:-translate-y-2 h-full flex flex-col">
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                                            {project.githubUrl && (
                                                <motion.a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/30 transition-colors"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FaGithub /> Code
                                                </motion.a>
                                            )}
                                            {project.liveUrl && (
                                                <motion.a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-[var(--color-accent-dark)] transition-colors"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FaExternalLinkAlt /> Demo
                                                </motion.a>
                                            )}
                                        </div>
                                    </div>

                                    {project.featured && (
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-accent-secondary)] text-white">
                                                Featured
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <h3 className="text-xl font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                                            {project.title}
                                        </h3>
                                        <div className="flex items-center gap-1 text-[var(--color-accent-secondary)]">
                                            <FaStar />
                                            <span className="text-sm font-medium">{project.stars}</span>
                                        </div>
                                    </div>

                                    <p className="text-[var(--color-text-secondary)] text-sm mb-4 flex-1">
                                        {project.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 rounded-md text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Creator */}
                                    <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border)]">
                                        <img
                                            src={project.creator.avatar}
                                            alt={project.creator.name}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <span className="text-sm text-[var(--color-text-secondary)]">
                                            by <span className="text-[var(--color-text)] font-medium">{project.creator.name}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View All CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 text-center"
                >
                    <motion.a
                        href="#"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] font-semibold hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        View All Projects
                        <FaGithub />
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}
