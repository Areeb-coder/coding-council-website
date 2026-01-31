import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { HiMail, HiArrowUp } from 'react-icons/hi';
import { socialLinks, navItems } from '@/data';
import logoImage from '@/assets/logo.jpg';

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[var(--color-primary)] text-[var(--color-text)] border-t border-[var(--color-border)]">
            {/* Main Footer */}
            <div className="container mx-auto px-4 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <a href="#home" className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl overflow-hidden">
                                <img src={logoImage} alt="Coding Council Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-2xl font-bold">
                                Coding<span className="text-[var(--color-accent)]">Council</span>
                            </span>
                        </a>
                        <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                            Jamia Millia Islamia's Official Coding Society. Join us to learn, build, and grow together.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: FaLinkedin, href: socialLinks.linkedin, label: 'LinkedIn' },
                                { icon: FaGithub, href: socialLinks.github, label: 'GitHub' },
                                { icon: FaInstagram, href: socialLinks.instagram, label: 'Instagram' },
                                { icon: FaWhatsapp, href: socialLinks.whatsapp, label: 'WhatsApp' },
                            ].map(({ icon: Icon, href, label }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-lg bg-[var(--color-surface-elevated)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-accent)] hover:text-white transition-all border border-[var(--color-border)]"
                                    whileHover={{ scale: 1.1, y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label={label}
                                >
                                    <Icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {navItems.map((item) => (
                                <li key={item.href}>
                                    <a
                                        href={item.href}
                                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Resources</h4>
                        <ul className="space-y-3">
                            {['Blog', 'Tutorials', 'Projects', 'Documentation'].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Stay Connected</h4>
                        <div className="space-y-4 mb-6">
                            <a
                                href={`mailto:${socialLinks.email}`}
                                className="flex items-center gap-3 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                            >
                                <HiMail size={20} />
                                <span>{socialLinks.email}</span>
                            </a>
                            <a
                                href={socialLinks.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                            >
                                <FaWhatsapp size={20} />
                                <span>WhatsApp Community</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[var(--color-border)]">
                <div className="container mx-auto px-4 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-[var(--color-text-muted)] text-sm text-center md:text-left">
                            © {currentYear} Coding Council. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                            <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to Top Button */}
            <motion.button
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[var(--color-accent)] text-white shadow-lg flex items-center justify-center z-40"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Back to top"
            >
                <HiArrowUp size={24} />
            </motion.button>
        </footer>
    );
}
