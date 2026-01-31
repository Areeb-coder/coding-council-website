import { useState, useEffect, type ReactNode } from 'react';
import {
    HiCalendar,
    HiUserGroup,
    HiMail,
    HiClipboardList,
    HiLogout,
    HiMenu,
    HiX,
    HiHome,
    HiCog,
    HiDocumentText,
    HiStar
} from 'react-icons/hi';
import { useAuthStore } from '@/stores/authStore';

interface AdminLayoutProps {
    children: ReactNode;
    title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const { user, logout } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const currentPath = window.location.pathname;

    const menuItems = [
        { label: 'Dashboard', icon: HiHome, href: '/admin/dashboard' },
        { label: 'Events', icon: HiCalendar, href: '/admin/events' },
        { label: 'Team', icon: HiUserGroup, href: '/admin/team' },
        { label: 'Blog', icon: HiDocumentText, href: '/admin/blog' },
        { label: 'Reviews', icon: HiStar, href: '/admin/reviews' },
        { label: 'Registrations', icon: HiClipboardList, href: '/admin/registrations' },
        { label: 'Messages', icon: HiMail, href: '/admin/messages' },
        { label: 'Settings', icon: HiCog, href: '/admin/settings' },
    ];

    const handleLogout = async () => {
        await logout();
        window.location.replace('/admin/login');
    };

    // Handle responsive behavior
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            // Keep sidebar open on desktop, closed on mobile by default
            if (!mobile) {
                setSidebarOpen(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Close sidebar on mobile when clicking a link
    const handleNavClick = () => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg)] flex">
            {/* Mobile Overlay */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
                        className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)] rounded-lg transition-colors"
                        aria-label="Close sidebar"
                    >
                        <HiX size={24} />
                    </button>
                </div>

                {/* Menu */}
                <nav className="p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                    {menuItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={handleNavClick}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentPath === item.href
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
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
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
            <div className={`flex-1 min-w-0 transition-all duration-300 ${sidebarOpen && !isMobile ? 'lg:ml-64' : ''}`}>
                {/* Header */}
                <header className="sticky top-0 z-30 h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-4 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)] rounded-lg transition-colors"
                            aria-label="Toggle sidebar"
                        >
                            <HiMenu size={24} />
                        </button>
                        <h1 className="text-lg md:text-xl font-semibold text-[var(--color-text)] truncate">{title}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <a
                            href="/"
                            target="_blank"
                            className="hidden sm:block text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                        >
                            View Website →
                        </a>
                    </div>
                </header>

                {/* Content */}
                <main className="p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
