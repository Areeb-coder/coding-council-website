import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuthStore } from '@/stores/authStore';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login, isLoading } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setError('');
        try {
            await login(data.email, data.password);
            window.location.href = '/admin/dashboard';
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            setError(error.response?.data?.error || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-primary)] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-2xl">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-info)] flex items-center justify-center mb-4">
                            <span className="text-white font-bold text-2xl">&lt;/&gt;</span>
                        </div>
                        <h1 className="text-2xl font-bold text-[var(--color-text)]">Admin Panel</h1>
                        <p className="text-[var(--color-text-secondary)] mt-2">
                            Sign in to manage Coding Council
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] w-5 h-5" />
                                <input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--color-bg)] border ${errors.email ? 'border-red-500' : 'border-[var(--color-border)]'
                                        } text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none transition-colors`}
                                    placeholder="admin@codingcouncil.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] w-5 h-5" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password')}
                                    className={`w-full pl-12 pr-12 py-3 rounded-xl bg-[var(--color-bg)] border ${errors.password ? 'border-red-500' : 'border-[var(--color-border)]'
                                        } text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none transition-colors`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                                >
                                    {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-xl bg-[var(--color-accent)] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[var(--color-accent-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        >
                            {isLoading ? (
                                <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                'Sign In'
                            )}
                        </motion.button>
                    </form>

                    {/* Back to site */}
                    <div className="mt-6 text-center">
                        <a
                            href="/"
                            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                        >
                            ← Back to website
                        </a>
                    </div>
                </div>

                {/* Default credentials hint */}
                <div className="mt-4 text-center text-sm text-gray-400">
                    <p>Default: admin@codingcouncil.com / admin123</p>
                </div>
            </motion.div>
        </div>
    );
}
