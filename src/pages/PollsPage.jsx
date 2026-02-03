import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { PixelButton, PixelContainer, PixelHeading } from '../components/ui/PixelUI';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PollsPage = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        try {
            const { data, error } = await supabase
                .from('polls')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });
            if (error) throw error;
            setPolls(data || []);
        } catch (e) {
            console.warn("Table 'polls' not found or error fetching. Using mock data.");
            setPolls([
                { id: '1', title: "Какую механику добавить первой?", description: "Голосуйте за будущее игры!" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenPoll = (id) => {
        navigate(`/polls/${id}`);
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-6 bg-[var(--bg-body)] text-[var(--text-main)] transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2">Голос Общины</h1>
                        <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs">Ваши решения меняют Архипелаг</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-ghost"
                    >
                        На главную
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="font-black uppercase text-gray-400">Связь с сервером...</p>
                    </div>
                ) : (
                    <div className="grid gap-12">
                        {polls.length === 0 ? (
                            <div className="text-center p-12 border-4 border-dashed border-[var(--border-color)] rounded-[2.5rem] opacity-40">
                                <p className="font-black uppercase">Нет активных обсуждений</p>
                            </div>
                        ) : (
                            polls.map(poll => (
                                <div key={poll.id} className="cozy-card group overflow-hidden border-2">
                                    <div className="flex justify-between items-start mb-6">
                                        <h2 className="text-2xl md:text-3xl font-black uppercase leading-none">{poll.title}</h2>
                                        <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase">Активен</span>
                                    </div>
                                    <p className="mb-10 text-[var(--text-muted)] leading-relaxed text-lg">{poll.description}</p>
                                    <button
                                        className="btn-playful w-full shadow-lg"
                                        onClick={() => navigate(`/polls/${poll.id}`)}
                                    >
                                        ПРИНЯТЬ УЧАСТИЕ
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {!user && (
                    <div className="mt-20 p-8 md:p-12 bg-warning/10 rounded-[2.5rem] border-4 border-warning/20 text-center animate-on-scroll">
                        <h3 className="text-2xl font-black mb-4 uppercase">Требуется Авторизация</h3>
                        <p className="text-[var(--text-muted)] mb-8 font-medium">Чтобы ваши голоса учитывались, необходимо войти в свой профиль.</p>
                        <button
                            className="btn-playful bg-warning border-black/10 text-black shadow-none hover:shadow-lg"
                            onClick={() => navigate('/auth')}
                        >
                            ВОЙТИ ИЛИ СОЗДАТЬ АККАУНТ
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PollsPage;
