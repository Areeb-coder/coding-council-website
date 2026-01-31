import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    HiUser,
    HiKey,
    HiGlobeAlt,
    HiSave,
    HiEye,
    HiEyeOff
} from 'react-icons/hi';
import { FaLinkedin, FaGithub, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { useAuthStore } from '@/stores/authStore';
import { authApi, settingsApi } from '@/api';

interface SocialLinks {
    linkedin: string;
    github: string;
    instagram: string;
    whatsapp: string;
    email: string;
    [key: string]: string;
}

export default function Settings() {
    const { user, updateUser, logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState('profile');

    // Profile state
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
    });

    // Password state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    // Social links state
    const [socialLinks, setSocialLinks] = useState<SocialLinks>({
        linkedin: 'https://www.linkedin.com/company/codingcouncil-jmi',
        github: 'https://github.com/CodingCouncil-JMI',
        instagram: 'https://www.instagram.com/codingcouncil.jmi',
        whatsapp: 'https://chat.whatsapp.com/invite',
        email: 'codingcouncil@jmi.ac.in',
    });

    const [saving, setSaving] = useState(false);

    // Initialize profile form and social links
    useEffect(() => {
        if (user) {
            setProfileForm({
                name: user.name || '',
                email: user.email || '',
            });
        }

        const fetchSettings = async () => {
            try {
                const { data } = await settingsApi.get();
                if (data.success && data.data.socialLinks) {
                    setSocialLinks(data.data.socialLinks);
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            }
        };

        fetchSettings();
    }, [user]);

    const tabs = [
        { id: 'profile', label: 'Profile', icon: HiUser },
        { id: 'security', label: 'Security', icon: HiKey },
        { id: 'social', label: 'Social Links', icon: HiGlobeAlt },
    ];

    // Handle profile form changes
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // Handle password form changes
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // Handle social links changes
    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSocialLinks(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // Save profile
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data } = await authApi.updateProfile(profileForm);
            updateUser(data.user);
            toast.success('Profile updated successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    // Change password
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        setSaving(true);
        try {
            await authApi.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            toast.success('Password changed successfully. Please login again.');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });

            // Password change invalidates refreshToken in backend, so we should logout
            setTimeout(() => {
                logout();
            }, 2000);
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    // Save social links
    const handleSaveSocialLinks = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await settingsApi.updateSocialLinks(socialLinks);
            toast.success('Social links updated successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to update social links');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout title="Settings">
            <div className="max-w-4xl mx-auto">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 border-b border-[var(--color-border)] pb-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id
                                ? 'bg-[var(--color-accent)] text-white'
                                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]'
                                }`}
                        >
                            <tab.icon size={18} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6"
                    >
                        <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">Profile Settings</h2>
                        <form onSubmit={handleSaveProfile} className="space-y-6">
                            <div className="admin-form-grid">
                                <div>
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profileForm.name}
                                        onChange={handleProfileChange}
                                        className="form-input"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileForm.email}
                                        onChange={handleProfileChange}
                                        className="form-input"
                                        placeholder="admin@example.com"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-[var(--color-border)]">
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    <HiSave size={18} />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6"
                    >
                        <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">Change Password</h2>
                        <form onSubmit={handleChangePassword} className="space-y-6">
                            <div>
                                <label className="form-label">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.current ? 'text' : 'password'}
                                        name="currentPassword"
                                        value={passwordForm.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="form-input pr-12"
                                        placeholder="Enter current password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                                    >
                                        {showPasswords.current ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="admin-form-grid">
                                <div>
                                    <label className="form-label">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.new ? 'text' : 'password'}
                                            name="newPassword"
                                            value={passwordForm.newPassword}
                                            onChange={handlePasswordChange}
                                            className="form-input pr-12"
                                            placeholder="Enter new password"
                                            required
                                            minLength={8}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                                        >
                                            {showPasswords.new ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="form-label">Confirm New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.confirm ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={passwordForm.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="form-input pr-12"
                                            placeholder="Confirm new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                                        >
                                            {showPasswords.confirm ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-[var(--color-text-muted)]">
                                Password must be at least 8 characters long.
                            </p>

                            <div className="pt-4 border-t border-[var(--color-border)]">
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    <HiKey size={18} />
                                    {saving ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Social Links Tab */}
                {activeTab === 'social' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6"
                    >
                        <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">Social Media Links</h2>
                        <p className="text-[var(--color-text-muted)] mb-6">
                            Update the social media links displayed on the website.
                        </p>
                        <form onSubmit={handleSaveSocialLinks} className="space-y-6">
                            <div>
                                <label className="form-label flex items-center gap-2">
                                    <FaLinkedin className="text-[#0A66C2]" /> LinkedIn
                                </label>
                                <input
                                    type="url"
                                    name="linkedin"
                                    value={socialLinks.linkedin}
                                    onChange={handleSocialChange}
                                    className="form-input"
                                    placeholder="https://linkedin.com/company/..."
                                />
                            </div>

                            <div>
                                <label className="form-label flex items-center gap-2">
                                    <FaGithub /> GitHub
                                </label>
                                <input
                                    type="url"
                                    name="github"
                                    value={socialLinks.github}
                                    onChange={handleSocialChange}
                                    className="form-input"
                                    placeholder="https://github.com/..."
                                />
                            </div>

                            <div>
                                <label className="form-label flex items-center gap-2">
                                    <FaInstagram className="text-[#E4405F]" /> Instagram
                                </label>
                                <input
                                    type="url"
                                    name="instagram"
                                    value={socialLinks.instagram}
                                    onChange={handleSocialChange}
                                    className="form-input"
                                    placeholder="https://instagram.com/..."
                                />
                            </div>

                            <div>
                                <label className="form-label flex items-center gap-2">
                                    <FaWhatsapp className="text-[#25D366]" /> WhatsApp Community
                                </label>
                                <input
                                    type="url"
                                    name="whatsapp"
                                    value={socialLinks.whatsapp}
                                    onChange={handleSocialChange}
                                    className="form-input"
                                    placeholder="https://chat.whatsapp.com/..."
                                />
                            </div>

                            <div>
                                <label className="form-label">Contact Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={socialLinks.email}
                                    onChange={handleSocialChange}
                                    className="form-input"
                                    placeholder="contact@example.com"
                                />
                            </div>

                            <div className="pt-4 border-t border-[var(--color-border)]">
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    <HiSave size={18} />
                                    {saving ? 'Saving...' : 'Save Social Links'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </div>
        </AdminLayout>
    );
}
