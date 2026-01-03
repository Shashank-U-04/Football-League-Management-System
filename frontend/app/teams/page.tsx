'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import TeamCard from '@/components/ui/TeamCard';
import { motion } from 'framer-motion';

interface Team {
    team_id: number;
    team_name: string;
    coach_name: string;
    foundation_year: number;
    tournament_id: number;
}

export default function TeamsPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [players, setPlayers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teamsRes, playersRes] = await Promise.all([
                    api.get('/teams'),
                    api.get('/players')
                ]);
                setTeams(teamsRes.data.data);
                setPlayers(playersRes.data.data);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="text-center py-20">Loading teams and players...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-slate-900">Teams & Players</h1>
                <p className="text-slate-600 max-w-2xl mx-auto">
                    Meet the contenders and their squads fighting for glory in the league.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                    <TeamCard
                        key={team.team_id}
                        team={team}
                        players={players.filter(p => p.team_id === team.team_id)}
                    />
                ))}
            </div>
        </div>
    );
}
