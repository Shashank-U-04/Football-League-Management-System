'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import FormInput from '@/components/ui/FormInput';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trophy, Users, Calendar, Medal, Edit, Trash2, ArrowLeft, CheckCircle } from 'lucide-react';

// Schemas
const tournamentSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.enum(['League', 'Knockout']),
    host_country: z.string().min(1, 'Host Country is required'),
    no_of_teams: z.string().transform((val) => parseInt(val, 10)),
    no_of_matches: z.string().transform((val) => parseInt(val, 10)),
    start_date: z.string(),
    end_date: z.string(),
});

const teamSchema = z.object({
    team_name: z.string().min(1, 'Team name is required'),
    coach_name: z.string().min(1, 'Coach name is required'),
    foundation_year: z.string().transform((val) => parseInt(val, 10)),
    tournament_id: z.number().default(1),
});

const playerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    age: z.string().transform((val) => parseInt(val, 10)),
    gender: z.enum(['M', 'F']),
    position: z.string().min(1, 'Position is required'),
    height_cm: z.string().transform((val) => parseFloat(val)),
    weight_kg: z.string().transform((val) => parseFloat(val)),
    jersey_number: z.string().transform((val) => parseInt(val, 10)),
    team_id: z.string().transform((val) => parseInt(val, 10)),
});

// Two schemas for Match: Schedule and Result
const scheduleMatchSchema = z.object({
    team1_id: z.string().transform((val) => parseInt(val, 10)),
    team2_id: z.string().transform((val) => parseInt(val, 10)),
    match_date: z.string().min(1, 'Date is required'),
    venue: z.string().min(1, 'Venue is required'),
});

const matchResultSchema = z.object({
    match_id: z.coerce.number(),
    team1_id: z.coerce.number(),
    team1_goals: z.coerce.number(),
    team2_id: z.coerce.number(),
    team2_goals: z.coerce.number(),
});

function AdminDashboardContent() {
    const { user } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [view, setView] = useState<'menu' | 'manage'>('menu');
    const [activeTab, setActiveTab] = useState<'tournament' | 'team' | 'player' | 'match'>('team');
    // 'schedule' | 'result' for Match tab
    const [matchMode, setMatchMode] = useState<'schedule' | 'result'>('schedule');

    const [message, setMessage] = useState('');
    const [dataList, setDataList] = useState<any[]>([]);
    const [teamList, setTeamList] = useState<any[]>([]); // For dropdowns
    const [editingItem, setEditingItem] = useState<any>(null);

    useEffect(() => {
        const viewParam = searchParams.get('view');
        if (viewParam === 'menu') {
            setView('menu');
        }

        if (!user) {
            router.push('/login');
        }
    }, [user, router, searchParams]);

    // Fetch teams for dropdown (run once or when needed)
    const fetchTeams = useCallback(async () => {
        try {
            const res = await api.get('/teams');
            setTeamList(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch teams', error);
        }
    }, []);

    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);

    const fetchData = useCallback(async () => {
        try {
            let endpoint = '';
            if (activeTab === 'team') endpoint = '/teams';
            else if (activeTab === 'player') endpoint = '/players';
            else if (activeTab === 'match') endpoint = '/matches';
            else if (activeTab === 'tournament') endpoint = '/tournaments';

            if (endpoint) {
                const res = await api.get(endpoint);
                setDataList(res.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching data', error);
        }
    }, [activeTab]);

    useEffect(() => {
        if (view === 'manage') {
            fetchData();
        }
    }, [view, fetchData]);

    const { register: registerTournament, handleSubmit: handleSubmitTournament, reset: resetTournament, setValue: setValTournament } = useForm({ resolver: zodResolver(tournamentSchema) });
    const { register: registerTeam, handleSubmit: handleSubmitTeam, reset: resetTeam, setValue: setValTeam } = useForm({ resolver: zodResolver(teamSchema) });
    const { register: registerPlayer, handleSubmit: handleSubmitPlayer, reset: resetPlayer, setValue: setValPlayer } = useForm({ resolver: zodResolver(playerSchema) });

    // Match Forms
    const { register: registerSchedule, handleSubmit: handleSubmitSchedule, reset: resetSchedule, setValue: setValSchedule } = useForm({ resolver: zodResolver(scheduleMatchSchema) });
    const { register: registerResult, handleSubmit: handleSubmitResult, reset: resetResult, setValue: setValResult } = useForm({ resolver: zodResolver(matchResultSchema) });

    const onSubmit = async (endpoint: string, data: any, resetFunc: any, successMsg: string) => {
        try {
            // Special handling for Match Result (always POST to procedure)
            if (activeTab === 'match' && matchMode === 'result') {
                // Use data from form, but fallback to editingItem if available (for safety)
                const processedData = {
                    ...data,
                    match_id: data.match_id || editingItem?.match_id,
                };
                await api.post('/matches/result', processedData);
                setMessage('Match Result Recorded!');
            }
            else if (editingItem) {
                // Determine the correct ID field based on the active tab/item
                const id = editingItem.player_id || editingItem.team_id || editingItem.tournament_id || editingItem.match_id || editingItem.id;

                await api.put(`${endpoint}/${id}`, data);
                setMessage('Item updated successfully!');
            } else {
                await api.post(endpoint, data);
                setMessage(successMsg);
            }

            resetFunc();
            setEditingItem(null);
            fetchData();
            // Refresh teams if we just added/edited a team
            if (activeTab === 'team') {
                fetchTeams();
            }

            setTimeout(() => setMessage(''), 3000);
        } catch (error: any) {
            console.error(error);
            setMessage(error.response?.data?.message || 'Operation failed. Please check inputs.');
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this item?')) {
            try {
                let endpoint = '';
                if (activeTab === 'team') endpoint = '/teams';
                else if (activeTab === 'player') endpoint = '/players';
                else if (activeTab === 'match') endpoint = '/matches';
                else if (activeTab === 'tournament') endpoint = '/tournaments';

                await api.delete(`${endpoint}/${id}`);
                setMessage('Item deleted successfully');
                fetchData();
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                console.error(error);
                setMessage('Failed to delete');
            }
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (activeTab === 'tournament') {
            setValTournament('name', item.name || '');
            setValTournament('type', item.type || 'League');
            setValTournament('host_country', item.host_country || '');
            setValTournament('no_of_teams', item.no_of_teams?.toString() || '');
            setValTournament('no_of_matches', item.no_of_matches?.toString() || '');
            setValTournament('start_date', item.start_date ? item.start_date.split('T')[0] : '');
            setValTournament('end_date', item.end_date ? item.end_date.split('T')[0] : '');
        } else if (activeTab === 'team') {
            setValTeam('team_name', item.team_name || '');
            setValTeam('coach_name', item.coach_name || '');
            setValTeam('foundation_year', item.foundation_year?.toString() || '');
            setValTeam('tournament_id', item.tournament_id || 1);
        } else if (activeTab === 'player') {
            setValPlayer('name', item.name || '');
            setValPlayer('age', item.age?.toString() || '');
            setValPlayer('gender', item.gender || 'M');
            setValPlayer('position', item.position || '');
            setValPlayer('height_cm', item.height_cm?.toString() || '');
            setValPlayer('weight_kg', item.weight_kg?.toString() || '');
            setValPlayer('jersey_number', item.jersey_number?.toString() || '');
            setValPlayer('team_id', item.team_id?.toString() || '');
        }
        else if (activeTab === 'match') {
            // Pre-fill Schedule Form Data (so user can edit details if they choose Schedule mode)
            setValSchedule('team1_id', item.team1_id?.toString() || '');
            setValSchedule('team2_id', item.team2_id?.toString() || '');
            setValSchedule('match_date', item.match_date ? item.match_date.split('T')[0] : '');
            setValSchedule('venue', item.venue || '');

            // Prepare Result Form Pre-fill as well (in case they switch to Result)
            // We reuse the logic from openMatchResultForm indirectly or just set it here if we switch manually

            if (item.status === 'Completed') {
                openMatchResultForm(item);
            } else {
                setMatchMode('schedule');
            }
        }
    };

    const openMatchResultForm = (match: any) => {
        setMatchMode('result');
        setEditingItem(match);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Pre-fill with strict defaults to avoid "uncontrolled" error
        setValResult('match_id', match.match_id);
        setValResult('team1_id', match.team1_id);
        setValResult('team2_id', match.team2_id);
        setValResult('team1_goals', match.team1_goals !== undefined && match.team1_goals !== null ? match.team1_goals.toString() : '0');
        setValResult('team2_goals', match.team2_goals !== undefined && match.team2_goals !== null ? match.team2_goals.toString() : '0');
    };

    // Handler for Match Dropdown Selection
    const handleMatchSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const matchId = parseInt(e.target.value);
        if (!matchId) {
            setEditingItem(null);
            resetResult();
            return;
        }

        const match = dataList.find(m => m.match_id === matchId);
        if (match) {
            openMatchResultForm(match);
        }
    };

    const handleManage = (tab: 'tournament' | 'team' | 'player' | 'match') => {
        setActiveTab(tab);
        setView('manage');
        setEditingItem(null);
        if (tab === 'match') setMatchMode('schedule'); // Default to schedule
    };

    if (!user) return null;

    if (view === 'menu') {
        return (
            <div className="max-w-5xl mx-auto space-y-8 py-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-blue-900 text-xl font-bold">Select a category to manage</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button onClick={() => handleManage('tournament')} className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-blue-500 transition-all group text-left">
                        <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                            <Medal className="w-8 h-8 text-blue-600 dark:text-blue-300 group-hover:text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Manage Tournaments</h2>
                        <p className="text-slate-500 dark:text-slate-400">Create and edit leagues, knockout cups, and schedules.</p>
                    </button>

                    <button onClick={() => handleManage('team')} className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-green-500 transition-all group text-left">
                        <div className="h-14 w-14 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                            <Trophy className="w-8 h-8 text-green-600 dark:text-green-300 group-hover:text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Manage Teams</h2>
                        <p className="text-slate-500 dark:text-slate-400">Add teams, assign coaches, and manage club details.</p>
                    </button>

                    <button onClick={() => handleManage('player')} className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-purple-500 transition-all group text-left">
                        <div className="h-14 w-14 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                            <Users className="w-8 h-8 text-purple-600 dark:text-purple-300 group-hover:text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Manage Players</h2>
                        <p className="text-slate-500 dark:text-slate-400">Register players, update stats, and transfer between teams.</p>
                    </button>

                    <button onClick={() => handleManage('match')} className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-orange-500 transition-all group text-left">
                        <div className="h-14 w-14 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
                            <Calendar className="w-8 h-8 text-orange-600 dark:text-orange-300 group-hover:text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Manage Matches</h2>
                        <p className="text-slate-500 dark:text-slate-400">Schedule games and record final scores.</p>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={() => setView('menu')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-blue-900" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white capitalize">Manage {activeTab}s</h1>
                        <p className="text-blue-800 font-semibold">Add, edit, or remove {activeTab}s</p>
                    </div>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-md text-center font-medium border ${message.includes('failed') ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 sticky top-8">
                        <h2 className="text-xl font-bold mb-6 flex items-center text-slate-800 dark:text-white">
                            {editingItem ? <Edit className="w-5 h-5 mr-2 text-blue-600" /> : <Plus className="w-5 h-5 mr-2 text-blue-600" />}
                            {activeTab === 'match'
                                ? (matchMode === 'schedule' ? 'Schedule Match' : 'Enter Match Result')
                                : (editingItem ? 'Edit' : 'Add New') + ' ' + activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h2>

                        {/* Toggle for Match Mode (Always visible for Matches) */}
                        {activeTab === 'match' && (
                            <div className="flex mb-4 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                                <button
                                    onClick={() => setMatchMode('schedule')}
                                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${matchMode === 'schedule' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                                >
                                    Schedule
                                </button>
                                <button
                                    onClick={() => setMatchMode('result')}
                                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${matchMode === 'result' ? 'bg-green-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                                >
                                    Result
                                </button>
                            </div>
                        )}

                        {activeTab === 'tournament' && (
                            <form onSubmit={handleSubmitTournament((data) => onSubmit('/tournaments', data, resetTournament, 'Tournament saved!'))} className="space-y-4">
                                <FormInput label="Name" {...registerTournament('name')} />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                                        <select {...registerTournament('type')} className="w-full px-3 py-2 border rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                                            <option value="League">League</option>
                                            <option value="Knockout">Knockout</option>
                                        </select>
                                    </div>
                                    <FormInput label="Host Country" {...registerTournament('host_country')} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput label="Teams" type="number" {...registerTournament('no_of_teams')} />
                                    <FormInput label="Matches" type="number" {...registerTournament('no_of_matches')} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput label="Start Date" type="date" {...registerTournament('start_date')} />
                                    <FormInput label="End Date" type="date" {...registerTournament('end_date')} />
                                </div>
                                <button type="submit" className="w-full bg-slate-900 dark:bg-blue-600 text-white py-2.5 rounded-lg hover:bg-slate-800 dark:hover:bg-blue-700 font-medium">
                                    {editingItem ? 'Update Tournament' : 'Create Tournament'}
                                </button>
                            </form>
                        )}

                        {activeTab === 'team' && (
                            <form onSubmit={handleSubmitTeam((data) => onSubmit('/teams', data, resetTeam, 'Team saved!'))} className="space-y-4">
                                <FormInput label="Team Name" {...registerTeam('team_name')} />
                                <FormInput label="Coach Name" {...registerTeam('coach_name')} />
                                <FormInput label="Foundation Year" type="number" {...registerTeam('foundation_year')} />
                                <button type="submit" className="w-full bg-slate-900 dark:bg-blue-600 text-white py-2.5 rounded-lg hover:bg-slate-800 dark:hover:bg-blue-700 font-medium">
                                    {editingItem ? 'Update Team' : 'Add Team'}
                                </button>
                            </form>
                        )}

                        {activeTab === 'player' && (
                            <form onSubmit={handleSubmitPlayer((data) => onSubmit('/players', data, resetPlayer, 'Player saved!'))} className="space-y-4">
                                <FormInput label="Name" {...registerPlayer('name')} />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput label="Age" type="number" {...registerPlayer('age')} />
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                                        <select {...registerPlayer('gender')} className="w-full px-3 py-2 border rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                                            <option value="M">Male</option>
                                            <option value="F">Female</option>
                                        </select>
                                    </div>
                                </div>
                                <FormInput label="Position" {...registerPlayer('position')} />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput label="Height (cm)" type="number" step="0.1" {...registerPlayer('height_cm')} />
                                    <FormInput label="Weight (kg)" type="number" step="0.1" {...registerPlayer('weight_kg')} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput label="Jersey #" type="number" {...registerPlayer('jersey_number')} />
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Team</label>
                                        <select {...registerPlayer('team_id')} className="w-full px-3 py-2 border rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                                            <option value="">Select Team</option>
                                            {teamList.map((t) => (
                                                <option key={t.team_id} value={t.team_id}>{t.team_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-slate-900 dark:bg-blue-600 text-white py-2.5 rounded-lg hover:bg-slate-800 dark:hover:bg-blue-700 font-medium">
                                    {editingItem ? 'Update Player' : 'Add Player'}
                                </button>
                            </form>
                        )}

                        {activeTab === 'match' && matchMode === 'schedule' && (
                            <form onSubmit={handleSubmitSchedule((data) => onSubmit('/matches', data, resetSchedule, 'Match Scheduled!'))} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Team 1</label>
                                        <select {...registerSchedule('team1_id')} className="w-full px-3 py-2 border rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                                            <option value="">Select Home Team</option>
                                            {teamList.map((t) => (
                                                <option key={t.team_id} value={t.team_id}>{t.team_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Team 2</label>
                                        <select {...registerSchedule('team2_id')} className="w-full px-3 py-2 border rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                                            <option value="">Select Away Team</option>
                                            {teamList.map((t) => (
                                                <option key={t.team_id} value={t.team_id}>{t.team_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <FormInput label="Date" type="date" {...registerSchedule('match_date')} />
                                <FormInput label="Venue" {...registerSchedule('venue')} />
                                <button type="submit" className="w-full bg-slate-900 dark:bg-green-600 text-white py-2.5 rounded-lg hover:bg-slate-800 dark:hover:bg-green-700 font-medium">
                                    {editingItem ? 'Update Match Details' : 'Schedule Match'}
                                </button>
                            </form>
                        )}

                        {activeTab === 'match' && matchMode === 'result' && (
                            <form onSubmit={handleSubmitResult((data) => onSubmit('/matches/result', data, resetResult, 'Result Updated!'))} className="space-y-4">
                                <div className="p-3 bg-blue-50 dark:bg-slate-700 rounded-lg mb-4 text-center">
                                    <span className="text-xl font-bold text-slate-700 dark:text-white block">Enter Match Result</span>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Select Match to Update</label>
                                    <select
                                        {...registerResult('match_id')}
                                        onChange={handleMatchSelection}
                                        className="w-full px-3 py-2 border rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    >
                                        <option value="">-- Select a Match --</option>
                                        {dataList.filter(m => m.status !== 'Completed').map((m) => (
                                            <option key={m.match_id} value={m.match_id}>
                                                ID {m.match_id}: {m.team1_name} vs {m.team2_name} ({new Date(m.match_date).toLocaleDateString()})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <input type="hidden" {...registerResult('team1_id')} value={editingItem?.team1_id || 0} />
                                <input type="hidden" {...registerResult('team2_id')} value={editingItem?.team2_id || 0} />

                                {editingItem && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormInput label={`${editingItem.team1_name} Goals`} type="number" {...registerResult('team1_goals')} />
                                        <FormInput label={`${editingItem.team2_name} Goals`} type="number" {...registerResult('team2_goals')} />
                                    </div>
                                )}

                                {!editingItem && (
                                    <div className="p-4 text-center text-slate-500 text-sm">
                                        Please select a match above to enter scores.
                                    </div>
                                )}

                                <button type="submit" disabled={!editingItem} className="w-full disabled:opacity-50 bg-slate-900 dark:bg-blue-600 text-white py-2.5 rounded-lg hover:bg-slate-800 dark:hover:bg-blue-700 font-medium">
                                    Save Result & Update Table
                                </button>
                            </form>
                        )}

                        {editingItem && (
                            <button onClick={() => { setEditingItem(null); resetTeam(); resetPlayer(); resetResult(); resetTournament(); resetSchedule(); setMatchMode('schedule'); }} className="w-full mt-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 font-medium">
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Existing {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}s</h2>
                            <span className="text-sm text-slate-500 dark:text-slate-400">{dataList.length} items</span>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-[800px] overflow-y-auto">
                            {dataList.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 dark:text-slate-400">No data found. Add some!</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                                        <thead className="bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold">
                                            <tr>
                                                <th className="px-4 py-3">{activeTab === 'player' ? 'Jersey #' : 'ID'}</th>
                                                <th className="px-4 py-3">Name/Details</th>
                                                <th className="px-4 py-3">Extra Info</th>
                                                <th className="px-4 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                            {dataList.map((item, idx) => (
                                                <tr key={idx} className={`hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${editingItem === item ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                                                    <td className="px-4 py-3 font-mono text-xs">
                                                        {activeTab === 'player'
                                                            ? item.jersey_number
                                                            : (item.id || item.team_id || item.player_id || item.match_id || item.tournament_id)}
                                                    </td>
                                                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                                                        {item.name || item.team_name || (
                                                            <div className="flex flex-col">
                                                                <span>{item.team1_name} vs {item.team2_name}</span>
                                                                <span className="text-xs text-slate-500">{new Date(item.match_date).toLocaleDateString()}</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {activeTab === 'team' && `Coach: ${item.coach_name}`}
                                                        {activeTab === 'player' && `${item.position} - ${item.team_name || item.team_id}`}
                                                        {activeTab === 'tournament' && `${item.host_country} (${item.type})`}
                                                        {activeTab === 'match' && (item.status === 'Completed' ? <span className="text-green-600 font-bold">{item.team1_goals} - {item.team2_goals}</span> : <span className="text-orange-500 bg-orange-50 px-2 py-1 rounded text-xs">Scheduled</span>)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right space-x-2">
                                                        <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-md" title="Edit">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDelete(item.player_id || item.team_id || item.tournament_id || item.match_id || item.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-md" title="Delete">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading dashboard...</div>}>
            <AdminDashboardContent />
        </Suspense>
    );
}
