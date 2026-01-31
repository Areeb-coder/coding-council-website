import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiMail, HiPhone, HiLocationMarker, HiCheck, HiExclamation } from 'react-icons/hi';
import { FaLinkedin, FaInstagram, FaGithub, FaWhatsapp } from 'react-icons/fa';
import { socialLinks } from '@/data';

const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().optional(),
    subject: z.string().min(5, 'Subject must be at least 5 characters'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));
            console.log('Form submitted:', data);
            setSubmitStatus('success');
            reset();
            setTimeout(() => setSubmitStatus('idle'), 5000);
        } catch {
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus('idle'), 5000);
        }
    };

    const contactInfo = [
        {
            icon: HiMail,
            label: 'Email',
            value: socialLinks.email,
            href: `mailto:${socialLinks.email}`,
        },
        {
            icon: HiPhone,
            label: 'WhatsApp',
            value: 'Chat with us',
            href: socialLinks.whatsapp,
        },
        {
            icon: HiLocationMarker,
            label: 'Location',
            value: 'Jamia Millia Islamia, New Delhi',
            href: '#',
        },
    ];

    const socialButtons = [
        { icon: FaLinkedin, href: socialLinks.linkedin, label: 'LinkedIn', color: 'hover:bg-blue-600' },
        { icon: FaInstagram, href: socialLinks.instagram, label: 'Instagram', color: 'hover:bg-pink-600' },
        { icon: FaGithub, href: socialLinks.github, label: 'GitHub', color: 'hover:bg-gray-700' },
        { icon: FaWhatsapp, href: socialLinks.whatsapp, label: 'WhatsApp', color: 'hover:bg-green-600' },
    ];

    return (
        <section id="contact" className="py-24 bg-[var(--color-bg)]" ref={ref}>
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-[var(--color-accent)] font-semibold text-sm uppercase tracking-wider">
                        Contact Us
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text)] mt-3 mb-6">
                        Let's{' '}
                        <span className="text-[var(--color-accent)]">Connect</span>
                    </h2>
                    <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
                        Have a question or want to collaborate? Reach out to us and we'll get back to you soon.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8">
                            <h3 className="text-2xl font-semibold text-[var(--color-text)] mb-6">
                                Send us a message
                            </h3>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                        Your Name *
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        {...register('name')}
                                        className={`w-full px-4 py-3 rounded-xl bg-[var(--color-bg)] border ${errors.name ? 'border-red-500' : 'border-[var(--color-border)]'
                                            } text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none transition-colors`}
                                        placeholder="John Doe"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        {...register('email')}
                                        className={`w-full px-4 py-3 rounded-xl bg-[var(--color-bg)] border ${errors.email ? 'border-red-500' : 'border-[var(--color-border)]'
                                            } text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none transition-colors`}
                                        placeholder="john@example.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                                    )}
                                </div>

                                {/* Subject */}
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        id="subject"
                                        type="text"
                                        {...register('subject')}
                                        className={`w-full px-4 py-3 rounded-xl bg-[var(--color-bg)] border ${errors.subject ? 'border-red-500' : 'border-[var(--color-border)]'
                                            } text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none transition-colors`}
                                        placeholder="How can we help?"
                                    />
                                    {errors.subject && (
                                        <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
                                    )}
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        {...register('message')}
                                        className={`w-full px-4 py-3 rounded-xl bg-[var(--color-bg)] border ${errors.message ? 'border-red-500' : 'border-[var(--color-border)]'
                                            } text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none transition-colors resize-none`}
                                        placeholder="Tell us more..."
                                    />
                                    {errors.message && (
                                        <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${submitStatus === 'success'
                                        ? 'bg-green-500 text-white'
                                        : submitStatus === 'error'
                                            ? 'bg-red-500 text-white'
                                            : 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]'
                                        }`}
                                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                >
                                    {isSubmitting ? (
                                        <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : submitStatus === 'success' ? (
                                        <>
                                            <HiCheck size={20} /> Message Sent!
                                        </>
                                    ) : submitStatus === 'error' ? (
                                        <>
                                            <HiExclamation size={20} /> Failed to send
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="space-y-8"
                    >
                        {/* Info Cards */}
                        <div className="space-y-4">
                            {contactInfo.map((info, index) => (
                                <motion.a
                                    key={info.label}
                                    href={info.href}
                                    target={info.href.startsWith('http') ? '_blank' : undefined}
                                    rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                    className="flex items-center gap-4 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-accent)] transition-colors group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center group-hover:bg-[var(--color-accent)] transition-colors">
                                        <info.icon className="w-6 h-6 text-[var(--color-accent)] group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[var(--color-text-muted)]">{info.label}</p>
                                        <p className="text-[var(--color-text)] font-medium">{info.value}</p>
                                    </div>
                                </motion.a>
                            ))}
                        </div>

                        {/* Social Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8"
                        >
                            <h4 className="text-xl font-semibold text-[var(--color-text)] mb-6">
                                Follow us on social media
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {socialButtons.map(({ icon: Icon, href, label, color }) => (
                                    <motion.a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-12 h-12 rounded-xl bg-[var(--color-surface-elevated)] flex items-center justify-center text-[var(--color-text-secondary)] ${color} hover:text-white transition-all`}
                                        whileHover={{ scale: 1.1, y: -3 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label={label}
                                    >
                                        <Icon size={22} />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Map Placeholder */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden h-48"
                        >
                            <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center">
                                <div className="text-center">
                                    <HiLocationMarker size={40} className="mx-auto mb-2 text-[var(--color-accent)] opacity-50" />
                                    <p className="text-sm text-[var(--color-text-secondary)] opacity-70">Jamia Millia Islamia, New Delhi</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
