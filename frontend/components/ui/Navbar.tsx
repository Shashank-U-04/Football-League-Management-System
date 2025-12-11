'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Trophy, User, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            // eslint-disable-next-line
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <nav className="bg-slate-900 dark:bg-slate-950 text-white shadow-lg transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <Trophy className="h-8 w-8 text-yellow-500" />
                            <span className="font-bold text-xl tracking-tight">League Manager</span>
                        </Link>
                        <div className="hidden md:flex ml-10 space-x-8">
                            <Link href="/tournaments" className="hover:text-yellow-400 transition-colors">Tournaments</Link>
                            <Link href="/teams" className="hover:text-yellow-400 transition-colors">Teams</Link>
                            <Link href="/matches" className="hover:text-yellow-400 transition-colors">Matches</Link>
                            <Link href="/players" className="hover:text-yellow-400 transition-colors">Players</Link>
                            <Link href="/leaderboard" className="hover:text-yellow-400 transition-colors">Leaderboard</Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-slate-800 transition-colors"
                            title="Toggle Theme"
                        >
                            {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-300" />}
                        </button>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/admin/dashboard?view=menu"
                                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-md"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span>Dashboard</span>
                                </Link>
                                <span className="text-sm text-gray-300 hidden md:inline">Hi, {user.username}</span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md transition-colors text-sm"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center space-x-1 bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-4 py-2 rounded-md font-medium transition-colors"
                            >
                                <User className="h-4 w-4" />
                                <span>Admin Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
