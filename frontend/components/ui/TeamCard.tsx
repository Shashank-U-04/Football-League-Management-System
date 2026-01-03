import { useState } from 'react';
import { Users, Calendar, ChevronDown, ChevronUp, Shirt } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Team {
    team_id: number;
    team_name: string;
    coach_name: string;
    foundation_year: number;
}

interface Player {
    player_id: number;
    name: string;
    position: string;
    jersey_number: number;
}

interface TeamCardProps {
    team: Team;
    players?: Player[];
}

export default function TeamCard({ team, players = [] }: TeamCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 hover:shadow-lg transition-all"
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                        {team.team_name.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                        ID: {team.team_id}
                    </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{team.team_name}</h3>
                <div className="space-y-2 text-sm text-slate-600 mb-4">
                    <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>Coach: {team.coach_name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Est: {team.foundation_year}</span>
                    </div>
                </div>

                {players.length > 0 && (
                    <div className="border-t border-slate-100 pt-4">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full flex items-center justify-between text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <span>{isOpen ? 'Hide Squad' : 'Show Squad'} ({players.length})</span>
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-1">
                                        {players.map((player) => (
                                            <div key={player.player_id} className="flex items-center text-sm p-2 bg-slate-50 rounded-md">
                                                <div className="mr-3 text-slate-400">
                                                    <Shirt className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-slate-900">{player.name}</p>
                                                    <p className="text-xs text-slate-500">{player.position}</p>
                                                </div>
                                                <span className="font-mono font-bold text-blue-600 text-lg">
                                                    #{player.jersey_number}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
