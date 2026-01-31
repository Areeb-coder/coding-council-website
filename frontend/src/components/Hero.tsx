import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiChevronDown } from 'react-icons/hi';
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { socialLinks } from '@/data';
import logoImage from '@/assets/logo.jpg';

export default function Hero() {
    const [displayText, setDisplayText] = useState('');
    const fullText = "Jamia Millia Islamia's Official Coding Society";

    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            if (index <= fullText.length) {
                setDisplayText(fullText.slice(0, index));
                index++;
            } else {
                clearInterval(timer);
            }
        }, 50);
        return () => clearInterval(timer);
    }, []);

    const scrollToAbout = () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 lg:pt-24"
        >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-primary)]">
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/10 via-transparent to-[var(--color-info)]/10 animate-gradient" />

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-[var(--color-accent)]/30 rounded-full"
                            initial={{
                                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                            }}
                            animate={{
                                y: [null, Math.random() * -200 - 100],
                                opacity: [0.2, 0.8, 0.2],
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        />
                    ))}
                </div>

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
                        backgroundSize: '50px 50px',
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
                {/* Logo Animation */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', duration: 1, delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden shadow-2xl animate-pulse-glow">
                        <img src={logoImage} alt="Coding Council Logo" className="w-full h-full object-cover" />
                    </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--color-text)] mb-6"
                >
                    Coding<span className="text-[var(--color-accent)]">Council</span>
                </motion.h1>

                {/* Typewriter Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-xl md:text-2xl text-[var(--color-text-secondary)] mb-8 h-8"
                >
                    {displayText}
                    <span className="animate-pulse">|</span>
                </motion.p>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-[var(--color-text-muted)] text-lg max-w-2xl mx-auto mb-12"
                >
                    Join a thriving community of developers, participate in hackathons,
                    workshops, and build projects that matter. Level up your skills with us.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                >
                    <motion.a
                        href="#events"
                        className="px-8 py-4 rounded-xl bg-[var(--color-accent)] text-white font-semibold text-lg shadow-lg hover:bg-[var(--color-accent-dark)] transition-all"
                        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Explore Events
                    </motion.a>
                    <motion.a
                        href="#projects"
                        className="px-8 py-4 rounded-xl bg-white/10 text-white font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        View Projects
                    </motion.a>
                </motion.div>

                {/* Social Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="flex items-center justify-center gap-6"
                >
                    {[
                        { icon: FaGithub, href: socialLinks.github, label: 'GitHub' },
                        { icon: FaLinkedin, href: socialLinks.linkedin, label: 'LinkedIn' },
                        { icon: FaInstagram, href: socialLinks.instagram, label: 'Instagram' },
                        { icon: FaWhatsapp, href: socialLinks.whatsapp, label: 'WhatsApp' },
                    ].map(({ icon: Icon, href, label }) => (
                        <motion.a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-full bg-[var(--color-surface-elevated)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-accent)] hover:text-white transition-all"
                            whileHover={{ scale: 1.2, y: -5 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={label}
                        >
                            <Icon size={24} />
                        </motion.a>
                    ))}
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.button
                onClick={scrollToAbout}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                aria-label="Scroll down"
            >
                <HiChevronDown size={40} />
            </motion.button>
        </section>
    );
}
