'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import FormInput from '@/components/ui/FormInput';
import { Lock } from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', data);
            login(res.data.data);
            router.push('/admin/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-100">
                <div className="flex flex-col items-center mb-6">
                    <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
                    <p className="text-slate-500 text-sm">Sign in to manage the league</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FormInput
                        label="Username"
                        type="text"
                        placeholder="Enter username"
                        error={errors.username?.message}
                        {...register('username')}
                    />
                    <FormInput
                        label="Password"
                        type="password"
                        placeholder="Enter password"
                        error={errors.password?.message}
                        {...register('password')}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-2 rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}
