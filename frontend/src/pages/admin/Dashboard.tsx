import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    HiCalendar,
    HiUserGroup,
    HiMail,
    HiClipboardList,
    HiLogout,
    HiMenu,
    HiX,
    HiHome,
    HiCog
} from 'react-icons/hi';
import { useAuthStore } from '@/stores/authStore';

interface StatCard {
    label: string;
    value: number;
    icon: typeof HiCalendar;
    color: string;
}

export default function AdminDashboard() {
    const { user, logout } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Mock stats - in real app, fetch from API
    const stats: StatCard[] = [
        { label: 'Upcoming Events', value: 3, icon: HiCalendar, color: 'from-blue-500 to-blue-600' },
        { label: 'Team Members', value: 6, icon: HiUserGroup, color: 'from-green-500 to-green-600' },
        { label: 'Registrations', value: 156, icon: HiClipboardList, color: 'from-purple-500 to-purple-600' },
        { label: 'New Messages', value: 12, icon: HiMail, color: 'from-orange-500 to-orange-600' },
    ];

    const menuItems = [
        { label: 'Dashboard', icon: HiHome, href: '/admin/dashboard', active: true },
        { label: 'Events', icon: HiCalendar, href: '/admin/events' },
        { label: 'Team', icon: HiUserGroup, href: '/admin/team' },
        { label: 'Registrations', icon: HiClipboardList, href: '/admin/registrations' },
        { label: 'Messages', icon: HiMail, href: '/admin/messages' },
        { label: 'Settings', icon: HiCog, href: '/admin/settings' },
    ];

    const handleLogout = async () => {
        await logout();
        window.location.href = '/admin/login';
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg)] flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--color-border)]">
                    <a href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-info)] flex items-center justify-center">
                            <span className="text-white font-bold text-lg">&lt;/&gt;</span>
                        </div>
                        <span className="font-bold text-[var(--color-text)]">Admin</span>
                    </a>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    >
                        <HiX size={24} />
                    </button>
                </div>

                {/* Menu */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${item.active
                                ? 'bg-[var(--color-accent)] text-white'
                                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]'
                                }`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </a>
                    ))}
                </nav>

                {/* User */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--color-border)]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white font-bold">
                            {user?.name?.[0] || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--color-text)] truncate">
                                {user?.name || 'Admin'}
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)] truncate">
                                {user?.email || 'admin@codingcouncil.com'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-colors"
                    >
                        <HiLogout size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
                {/* Header */}
                <header className="h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-4 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] lg:hidden"
                        >
                            <HiMenu size={24} />
                        </button>
                        <h1 className="text-xl font-semibold text-[var(--color-text)]">Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <a
                            href="/"
                            target="_blank"
                            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
                        >
                            View Website →
                        </a>
                    </div>
                </header>

                {/* Content */}
                <main className="p-4 lg:p-8">
                    {/* Welcome */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-[var(--color-text)]">
                            Welcome back, {user?.name || 'Admin'}! 👋
                        </h2>
                        <p className="text-[var(--color-text-secondary)] mt-1">
                            Here's what's happening with Coding Council today.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-3xl font-bold text-[var(--color-text)]">{stat.value}</span>
                                </div>
                                <p className="text-[var(--color-text-secondary)]">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <a
                                    href="/admin/events"
                                    className="p-4 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors text-center"
                                >
                                    <HiCalendar className="w-8 h-8 mx-auto mb-2 text-[var(--color-accent)]" />
                                    <span className="text-sm text-[var(--color-text)]">Create Event</span>
                                </a>
                                <a
                                    href="/admin/team"
                                    className="p-4 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors text-center"
                                >
                                    <HiUserGroup className="w-8 h-8 mx-auto mb-2 text-[var(--color-accent)]" />
                                    <span className="text-sm text-[var(--color-text)]">Add Member</span>
                                </a>
                                <a
                                    href="/admin/registrations"
                                    className="p-4 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors text-center"
                                >
                                    <HiClipboardList className="w-8 h-8 mx-auto mb-2 text-[var(--color-accent)]" />
                                    <span className="text-sm text-[var(--color-text)]">View Registrations</span>
                                </a>
                                <a
                                    href="/admin/messages"
                                    className="p-4 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors text-center"
                                >
                                    <HiMail className="w-8 h-8 mx-auto mb-2 text-[var(--color-accent)]" />
                                    <span className="text-sm text-[var(--color-text)]">Check Messages</span>
                                </a>
                            </div>
                        </div>

                        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                {[
                                    { action: 'New registration for AI Hackathon', time: '2 minutes ago' },
                                    { action: 'Event "Cloud Bootcamp" updated', time: '1 hour ago' },
                                    { action: 'New contact message received', time: '3 hours ago' },
                                    { action: 'Team member "Priya" added', time: 'Yesterday' },
                                ].map((activity, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                                        <span className="text-sm text-[var(--color-text)]">{activity.action}</span>
                                        <span className="text-xs text-[var(--color-text-muted)]">{activity.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
