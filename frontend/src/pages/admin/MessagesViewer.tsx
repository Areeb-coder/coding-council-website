import { useState } from 'react';
import { HiSearch, HiMail, HiReply, HiArchive, HiTrash } from 'react-icons/hi';
import AdminLayout from './AdminLayout';

interface Message {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
}

const mockMessages: Message[] = [
    { _id: '1', name: 'Alice Johnson', email: 'alice@example.com', subject: 'Partnership Inquiry', message: 'Hi, I would like to discuss a potential partnership...', status: 'New', createdAt: '2026-01-20' },
    { _id: '2', name: 'Mike Brown', email: 'mike@example.com', subject: 'Event Sponsorship', message: 'Our company is interested in sponsoring your next hackathon...', status: 'Read', createdAt: '2026-01-19' },
    { _id: '3', name: 'Sarah Lee', email: 'sarah@example.com', subject: 'Joining as Volunteer', message: 'I am a student and would love to volunteer for...', status: 'Replied', createdAt: '2026-01-18' },
];

export default function MessagesViewer() {
    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const updateStatus = (id: string, status: string) => {
        setMessages(messages.map(m => m._id === id ? { ...m, status } : m));
    };

    const deleteMessage = (id: string) => {
        if (confirm('Delete this message?')) {
            setMessages(messages.filter(m => m._id !== id));
            if (selectedMessage?._id === id) setSelectedMessage(null);
        }
    };

    const statusColors: Record<string, string> = {
        New: 'bg-blue-500/10 text-blue-500',
        Read: 'bg-gray-500/10 text-gray-500',
        Replied: 'bg-green-500/10 text-green-500',
        Archived: 'bg-yellow-500/10 text-yellow-500',
    };

    return (
        <AdminLayout title="Messages">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
                {/* Message List */}
                <div className="lg:col-span-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-[var(--color-border)]">
                        <div className="relative">
                            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredMessages.map((msg) => (
                            <button
                                key={msg._id}
                                onClick={() => { setSelectedMessage(msg); updateStatus(msg._id, 'Read'); }}
                                className={`w-full text-left p-4 border-b border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors ${selectedMessage?._id === msg._id ? 'bg-[var(--color-bg)]' : ''
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-[var(--color-text)]">{msg.name}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[msg.status]}`}>
                                        {msg.status}
                                    </span>
                                </div>
                                <p className="text-sm text-[var(--color-text-secondary)] truncate">{msg.subject}</p>
                                <p className="text-xs text-[var(--color-text-muted)] mt-1">{msg.createdAt}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Message Detail */}
                <div className="lg:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
                    {selectedMessage ? (
                        <div className="h-full flex flex-col">
                            <div className="p-6 border-b border-[var(--color-border)]">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold text-[var(--color-text)]">{selectedMessage.subject}</h3>
                                        <p className="text-[var(--color-text-secondary)] mt-1">
                                            From: <span className="text-[var(--color-text)]">{selectedMessage.name}</span> ({selectedMessage.email})
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <a
                                            href={`mailto:${selectedMessage.email}`}
                                            className="p-2 rounded-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] transition-colors"
                                            title="Reply"
                                        >
                                            <HiReply size={18} />
                                        </a>
                                        <button
                                            onClick={() => updateStatus(selectedMessage._id, 'Archived')}
                                            className="p-2 rounded-lg bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:text-yellow-500 transition-colors"
                                            title="Archive"
                                        >
                                            <HiArchive size={18} />
                                        </button>
                                        <button
                                            onClick={() => deleteMessage(selectedMessage._id)}
                                            className="p-2 rounded-lg bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:text-red-500 transition-colors"
                                            title="Delete"
                                        >
                                            <HiTrash size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto">
                                <p className="text-[var(--color-text)] whitespace-pre-wrap">{selectedMessage.message}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-[var(--color-text-muted)]">
                            <div className="text-center">
                                <HiMail size={48} className="mx-auto mb-4 opacity-50" />
                                <p>Select a message to view</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
