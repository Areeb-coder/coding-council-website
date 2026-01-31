import { useState } from 'react';
import { HiSearch, HiDownload, HiCheck, HiX } from 'react-icons/hi';
import AdminLayout from './AdminLayout';

interface Registration {
    _id: string;
    name: string;
    email: string;
    phone: string;
    eventTitle: string;
    status: string;
    registeredAt: string;
}

const mockRegistrations: Registration[] = [
    { _id: '1', name: 'John Doe', email: 'john@example.com', phone: '+91 9876543210', eventTitle: 'AI Hackathon 2026', status: 'Confirmed', registeredAt: '2026-01-15' },
    { _id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+91 9876543211', eventTitle: 'AI Hackathon 2026', status: 'Pending', registeredAt: '2026-01-16' },
    { _id: '3', name: 'Bob Wilson', email: 'bob@example.com', phone: '+91 9876543212', eventTitle: 'Cloud Workshop', status: 'Attended', registeredAt: '2026-01-10' },
];

export default function RegistrationsViewer() {
    const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrations);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredRegistrations = registrations.filter(reg => {
        const matchesSearch =
            reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reg.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const updateStatus = (id: string, status: string) => {
        setRegistrations(registrations.map(r =>
            r._id === id ? { ...r, status } : r
        ));
    };

    const statusColors: Record<string, string> = {
        Pending: 'bg-yellow-500/10 text-yellow-500',
        Confirmed: 'bg-blue-500/10 text-blue-500',
        Attended: 'bg-green-500/10 text-green-500',
        Cancelled: 'bg-red-500/10 text-red-500',
    };

    return (
        <AdminLayout title="Registrations">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
                        />
                    </div>
                </div>
                <div className="flex gap-4">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Attended">Attended</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors">
                        <HiDownload /> Export CSV
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {['Pending', 'Confirmed', 'Attended', 'Cancelled'].map(status => (
                    <div key={status} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
                        <p className="text-2xl font-bold text-[var(--color-text)]">
                            {registrations.filter(r => r.status === status).length}
                        </p>
                        <p className="text-sm text-[var(--color-text-muted)]">{status}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-[var(--color-bg)]">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-medium text-[var(--color-text-muted)]">Name</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-[var(--color-text-muted)]">Email</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-[var(--color-text-muted)]">Phone</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-[var(--color-text-muted)]">Event</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-[var(--color-text-muted)]">Status</th>
                            <th className="text-right px-6 py-4 text-sm font-medium text-[var(--color-text-muted)]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {filteredRegistrations.map((reg) => (
                            <tr key={reg._id} className="hover:bg-[var(--color-bg)]/50">
                                <td className="px-6 py-4 text-[var(--color-text)] font-medium">{reg.name}</td>
                                <td className="px-6 py-4 text-[var(--color-text-secondary)]">{reg.email}</td>
                                <td className="px-6 py-4 text-[var(--color-text-secondary)]">{reg.phone}</td>
                                <td className="px-6 py-4 text-[var(--color-text-secondary)]">{reg.eventTitle}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[reg.status]}`}>
                                        {reg.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => updateStatus(reg._id, 'Confirmed')}
                                            className="p-2 rounded-lg hover:bg-green-500/10 text-[var(--color-text-secondary)] hover:text-green-500 transition-colors"
                                            title="Confirm"
                                        >
                                            <HiCheck size={18} />
                                        </button>
                                        <button
                                            onClick={() => updateStatus(reg._id, 'Cancelled')}
                                            className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--color-text-secondary)] hover:text-red-500 transition-colors"
                                            title="Cancel"
                                        >
                                            <HiX size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
