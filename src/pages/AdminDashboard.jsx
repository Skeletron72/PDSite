import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { PixelButton, PixelContainer, PixelHeading } from '../components/ui/PixelUI';
import PixelChart from '../components/PixelChart';
import BlogEditor from '../components/BlogEditor';
import PollEditor from '../components/PollEditor';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import { Users, Activity, Download, ListChecks, ArrowLeftRight } from 'lucide-react';

const AdminDashboard = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalPlayers: 0,
        activePolls: 0,
        totalResponses: 0
    });

    const [polls, setPolls] = useState([]);
    const [selectedPoll, setSelectedPoll] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        checkAdmin();
        fetchGlobalStats();
        fetchPollsList();
    }, [refreshTrigger]);

    useEffect(() => {
        if (selectedPoll) {
            fetchPollAnalytics(selectedPoll.id);
        } else {
            setChartData(null);
        }
    }, [selectedPoll]);

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email === import.meta.env.VITE_ADMIN_EMAIL) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
        setLoading(false);
    };

    const fetchGlobalStats = async () => {
        try {
            // Get total players
            const { count: playerCount } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            // Get active polls count
            const { count: pollCount } = await supabase
                .from('polls')
                .select('*', { count: 'exact', head: true })
                .eq('is_active', true);

            // Get total responses
            const { count: responseCount } = await supabase
                .from('poll_responses')
                .select('*', { count: 'exact', head: true });

            setStats({
                totalPlayers: playerCount || 0,
                activePolls: pollCount || 0,
                totalResponses: responseCount || 0
            });
        } catch (err) {
            console.error('Error fetching global stats:', err);
        }
    };

    const fetchPollsList = async () => {
        const { data } = await supabase
            .from('polls')
            .select('*')
            .order('created_at', { ascending: false });
        setPolls(data || []);
        if (data && data.length > 0 && !selectedPoll) {
            setSelectedPoll(data[0]);
        }
    };

    const fetchPollAnalytics = async (pollId) => {
        try {
            const { data: responses, error } = await supabase
                .from('poll_responses')
                .select('*')
                .eq('poll_id', pollId);

            if (error) throw error;

            if (!responses || responses.length === 0) {
                setChartData({
                    labels: ['Нет данных'],
                    datasets: [{ label: 'Ответы', data: [0], backgroundColor: '#dfe6e9' }]
                });
                return;
            }

            const poll = polls.find(p => p.id === pollId);
            if (!poll) return;

            // Simple aggregation: Count occurrences for the FIRST field
            // In a better UI, we'd allow switching fields
            const firstField = poll.fields[0];
            const counts = {};

            responses.forEach(r => {
                const val = r.responses[firstField.id];
                if (val !== undefined) {
                    counts[val] = (counts[val] || 0) + 1;
                }
            });

            const labels = Object.keys(counts);
            const dataValues = Object.values(counts);

            setChartData({
                labels,
                datasets: [{
                    label: firstField.question,
                    data: dataValues,
                    backgroundColor: [
                        '#55efc4', '#81ecec', '#74b9ff', '#a29bfe',
                        '#ffeaa7', '#fab1a0', '#ff7675', '#fd79a8'
                    ],
                    borderColor: '#000',
                    borderWidth: 2
                }]
            });

        } catch (err) {
            console.error('Error calculating analytics:', err);
        }
    };

    const exportCSV = async () => {
        if (!selectedPoll) return;

        const { data: responses } = await supabase
            .from('poll_responses')
            .select('*')
            .eq('poll_id', selectedPoll.id);

        if (!responses) return;

        // Transform for CSV
        const csvData = responses.map(r => ({
            id: r.id,
            user_id: r.user_id,
            created_at: r.created_at,
            ...r.responses
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `results_${selectedPoll.title.replace(/\s+/g, '_')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-body)]">
            <div className="text-center animate-pulse">
                <Shield className="w-16 h-16 text-warning mx-auto mb-4" />
                <p className="font-black uppercase tracking-widest text-warning">Проверка доступа...</p>
            </div>
        </div>
    );

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black p-4 text-white">
                <div className="max-w-md w-full p-12 bg-[#2d3436] rounded-[2.5rem] border-8 border-error shadow-2xl text-center">
                    <Shield className="w-20 h-20 text-error mx-auto mb-6" />
                    <h2 className="text-3xl font-black mb-4 uppercase italic">ДОСТУП ЗАПРЕЩЕН</h2>
                    <p className="text-gray-400 mb-10 font-bold">Этот терминал доступен только для авторизованных смотрителей Архипелага.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-playful bg-error border-white/10 text-white"
                    >
                        ВЕРНУТЬСЯ
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-20 px-6 bg-[var(--bg-body)] text-[var(--text-main)] transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Modern Header */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-[var(--bg-card)] p-8 rounded-[2.5rem] border-2 border-[var(--border-color)] shadow-sm gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-warning/20 rounded-2xl flex items-center justify-center border-2 border-warning animate-float">
                            <Shield className="w-10 h-10 text-warning" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black m-0 uppercase tracking-tighter leading-none italic">Центр Управления</h1>
                            <p className="text-[var(--text-muted)] font-bold text-xs uppercase tracking-widest mt-2">Терминал Администратора v2.5</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/')} className="btn-ghost border-[var(--border-color)]">Выйти</button>
                </div>

                {/* Global Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="cozy-card text-center group border-2">
                        <Users className="w-10 h-10 mx-auto mb-4 text-success opacity-40 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-[10px] font-black uppercase text-gray-400 mb-2">Игроков в системе</h3>
                        <p className="text-5xl font-black text-success tracking-tighter">{stats.totalPlayers}</p>
                    </div>
                    <div className="cozy-card text-center group border-2">
                        <Activity className="w-10 h-10 mx-auto mb-4 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-[10px] font-black uppercase text-gray-400 mb-2">Активных опросов</h3>
                        <p className="text-5xl font-black text-primary tracking-tighter">{stats.activePolls}</p>
                    </div>
                    <div className="cozy-card text-center group border-2">
                        <ListChecks className="w-10 h-10 mx-auto mb-4 text-warning opacity-40 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-[10px] font-black uppercase text-gray-400 mb-2">Всего участий</h3>
                        <p className="text-5xl font-black text-warning tracking-tighter">{stats.totalResponses}</p>
                    </div>
                </div>

                {/* Analytics & Selection Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Poll Selector List */}
                    <div className="lg:col-span-1 space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                            <ArrowLeftRight className="w-6 h-6 text-primary" /> История опросов
                        </h2>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {polls.map(poll => (
                                <button
                                    key={poll.id}
                                    onClick={() => setSelectedPoll(poll)}
                                    className={`w-full text-left p-6 rounded-[1.5rem] border-2 transition-all ${selectedPoll?.id === poll.id
                                        ? 'bg-primary/10 border-primary shadow-lg scale-[1.02]'
                                        : 'bg-[var(--bg-card)] border-[var(--border-color)] opacity-60 hover:opacity-100 hover:border-white/50'}`}
                                >
                                    <h3 className="font-black text-xs uppercase truncate mb-2">{poll.title}</h3>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[8px] font-bold text-gray-500">{new Date(poll.created_at).toLocaleDateString()}</span>
                                        {poll.is_active && <span className="bg-success/20 text-success text-[8px] px-2 py-0.5 rounded-full font-black uppercase">Live</span>}
                                    </div>
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={!selectedPoll}
                            onClick={exportCSV}
                            className="btn-playful w-full shadow-lg flex items-center justify-center gap-3 py-4"
                        >
                            <Download className="w-5 h-5" /> EXPORT ANALYTICS
                        </button>
                    </div>

                    {/* Dynamic Chart Display */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight">Подробный отчет</h2>
                        <div className="cozy-card min-h-[500px] flex flex-col justify-center border-2">
                            {chartData ? (
                                <div className="space-y-8 animate-slide-in">
                                    <h4 className="text-center font-black uppercase text-xs text-[var(--text-muted)] tracking-widest">{selectedPoll?.title}</h4>
                                    <div className="h-[350px]">
                                        <PixelChart title="" data={chartData} />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-20 space-y-6">
                                    <div className="w-20 h-20 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-gray-500/30">
                                        <Activity className="w-10 h-10 text-gray-500/30" />
                                    </div>
                                    <p className="text-gray-500 font-bold uppercase italic tracking-wider">Выберите опрос для анализа</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sub-Editors Partition */}
                <div className="pt-20 border-t-2 border-[var(--border-color)]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <BlogEditor onSave={() => setRefreshTrigger(t => t + 1)} />
                        <PollEditor onSave={() => setRefreshTrigger(t => t + 1)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
