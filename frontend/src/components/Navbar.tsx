import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useThemeStore } from '@/stores/themeStore';
import { navItems } from '@/data';
import logoImage from '@/assets/logo.jpg';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useThemeStore();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-[var(--color-bg)]/90 backdrop-blur-lg shadow-lg'
                : 'bg-transparent'
                }`}
        >
            <nav className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <motion.a
                        href="#home"
                        className="flex items-center gap-3"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="w-10 h-10 rounded-xl overflow-hidden">
                            <img src={logoImage} alt="Coding Council" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xl font-bold text-[var(--color-text)]">
                            Coding<span className="text-[var(--color-accent)]">Council</span>
                        </span>
                    </motion.a>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navItems.map((item) => (
                            <motion.a
                                key={item.href}
                                href={item.href}
                                className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors font-medium"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {item.label}
                            </motion.a>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <motion.button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-[var(--color-surface-elevated)] text-[var(--color-text)] hover:bg-[var(--color-accent)] hover:text-white transition-colors"
                            whileHover={{ scale: 1.1, rotate: 180 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
                        </motion.button>

                        {/* CTA Button */}
                        <motion.a
                            href="#contact"
                            className="hidden md:flex px-5 py-2 rounded-lg bg-[var(--color-accent)] text-white font-semibold hover:bg-[var(--color-accent-dark)] transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Join Us
                        </motion.a>

                        {/* Mobile Menu Toggle */}
                        <motion.button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg bg-[var(--color-surface-elevated)] text-[var(--color-text)]"
                            whileTap={{ scale: 0.9 }}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden overflow-hidden"
                        >
                            <div className="py-4 space-y-2">
                                {navItems.map((item, index) => (
                                    <motion.a
                                        key={item.href}
                                        href={item.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-4 py-3 rounded-lg text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)] transition-colors font-medium"
                                    >
                                        {item.label}
                                    </motion.a>
                                ))}
                                <motion.a
                                    href="#contact"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: navItems.length * 0.1 }}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-4 py-3 rounded-lg bg-[var(--color-accent)] text-white font-semibold text-center"
                                >
                                    Join Us
                                </motion.a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </motion.header>
    );
}
