import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiLightningBolt, HiUserGroup, HiCode, HiAcademicCap } from 'react-icons/hi';
import { stats } from '@/data';

function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const duration = 2000;
            const increment = end / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);

            return () => clearInterval(timer);
        }
    }, [isInView, end]);

    return (
        <span ref={ref}>
            {count}{suffix}
        </span>
    );
}

export default function About() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: '-100px' });

    const values = [
        {
            icon: HiLightningBolt,
            title: 'Innovation',
            description: 'We push boundaries and embrace cutting-edge technologies to solve real-world problems.',
        },
        {
            icon: HiUserGroup,
            title: 'Community',
            description: 'A supportive network of developers helping each other grow and succeed together.',
        },
        {
            icon: HiCode,
            title: 'Excellence',
            description: 'We strive for quality in everything we build, from code to community events.',
        },
        {
            icon: HiAcademicCap,
            title: 'Learning',
            description: 'Continuous growth through workshops, mentorship, and hands-on project experience.',
        },
    ];

    const statsData = [
        { value: stats.members, label: 'Active Members', suffix: '+' },
        { value: stats.events, label: 'Events Hosted', suffix: '+' },
        { value: stats.workshops, label: 'Workshops', suffix: '+' },
        { value: stats.projects, label: 'Projects Built', suffix: '+' },
    ];

    return (
        <section id="about" className="py-24 bg-[var(--color-bg)]" ref={containerRef}>
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-[var(--color-accent)] font-semibold text-sm uppercase tracking-wider">
                        About Us
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text)] mt-3 mb-6">
                        Empowering Developers to{' '}
                        <span className="text-[var(--color-accent)]">Build the Future</span>
                    </h2>
                    <p className="text-[var(--color-text-secondary)] text-lg max-w-3xl mx-auto">
                        Coding Council is a premier developer community dedicated to fostering innovation,
                        collaboration, and technical excellence. We bring together passionate developers
                        to learn, build, and grow together.
                    </p>
                </motion.div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {values.map((value, index) => (
                        <motion.div
                            key={value.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 h-full transition-all duration-300 hover:border-[var(--color-accent)] hover:shadow-lg hover:-translate-y-2">
                                <div className="w-14 h-14 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center mb-6 group-hover:bg-[var(--color-accent)] transition-colors">
                                    <value.icon className="w-7 h-7 text-[var(--color-accent)] group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-[var(--color-text-secondary)]">
                                    {value.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-3xl p-8 md:p-12"
                >
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {statsData.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-text)] mb-2">
                                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="text-[var(--color-text-secondary)] font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Mission Statement */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-20 text-center"
                >
                    <div className="max-w-4xl mx-auto">
                        <p className="text-2xl md:text-3xl font-medium text-[var(--color-text)] leading-relaxed">
                            "Our mission is to create a{' '}
                            <span className="text-[var(--color-accent)]">thriving ecosystem</span>{' '}
                            where developers can collaborate, innovate, and transform ideas into{' '}
                            <span className="text-[var(--color-accent)]">impactful solutions</span>."
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
