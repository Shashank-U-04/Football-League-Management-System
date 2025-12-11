'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Trophy, Calendar, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface Tournament {
    tournament_id: number;
    name: string;
    type: string;
    host_country: string;
    no_of_teams: number;
    no_of_matches: number;
    start_date: string;
    end_date: string;
}

export default function TournamentsPage() {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const res = await api.get('/tournaments');
                setTournaments(res.data.data || []);
            } catch (error) {
                console.error('Failed to fetch tournaments', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTournaments();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-900 mb-4">Tournaments</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-600">Explore ongoing and upcoming football leagues and cups.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tournaments.map((tournament, index) => (
                        <motion.div
                            key={tournament.tournament_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-shadow"
                        >
                            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                                <div className="flex justify-between items-start">
                                    <Trophy className="h-8 w-8 text-yellow-400" />
                                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                                        {tournament.type}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold mt-4">{tournament.name}</h3>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex items-center text-slate-600 dark:text-slate-300">
                                    <MapPin className="h-5 w-5 mr-3 text-blue-500" />
                                    <span>{tournament.host_country}</span>
                                </div>
                                <div className="flex items-center text-slate-600 dark:text-slate-300">
                                    <Users className="h-5 w-5 mr-3 text-green-500" />
                                    <span>{tournament.no_of_teams} Teams</span>
                                </div>
                                <div className="flex items-center text-slate-600 dark:text-slate-300">
                                    <Calendar className="h-5 w-5 mr-3 text-orange-500" />
                                    <span>{new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {tournaments.length === 0 && (
                    <div className="text-center text-slate-500 dark:text-slate-400 mt-12">
                        <p>No tournaments found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
