import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { PixelContainer, PixelButton, PixelHeading } from '../components/ui/PixelUI';
import { Send, Home, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

const PollDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [poll, setPoll] = useState(null);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        fetchPoll();
    }, [id]);

    const fetchPoll = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('polls')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setPoll(data);
        } catch (err) {
            console.error('Error fetching poll:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateResponse = (fieldId, value) => {
        setResponses(prev => ({ ...prev, [fieldId]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('poll_responses')
                .insert([{
                    poll_id: id,
                    user_id: user?.id || null,
                    responses
                }]);

            if (error) throw error;
            setSubmitted(true);
        } catch (err) {
            alert('Ошибка при отправке: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-body)] text-[var(--text-main)] transition-colors duration-300">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="font-black uppercase tracking-widest">Загрузка опроса...</p>
        </div>
    );

    if (!poll) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-body)] p-6 transition-colors duration-300">
            <PixelContainer dark title="404" className="text-center">
                <p className="mb-6 text-[var(--text-main)]">Опрос не найден.</p>
                <PixelButton onClick={() => navigate('/polls')}>К СПИСКУ ОПРОСОВ</PixelButton>
            </PixelContainer>
        </div>
    );

    if (submitted) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-body)] p-6 animate-slide-in transition-colors duration-300">
            <PixelContainer dark title="УСПЕШНО" className="text-center max-w-md">
                <CheckCircle className="w-20 h-20 text-success mx-auto mb-6" />
                <h2 className="text-2xl font-black text-[var(--text-main)] mb-2 uppercase">СПАСИБО ЗА УЧАСТИЕ!</h2>
                <p className="text-[var(--text-muted)] mb-8">Ваш голос поможет сделать Pocket Dale лучше.</p>
                <div className="flex gap-4">
                    <PixelButton onClick={() => navigate('/polls')} className="flex-1">ОПРОСЫ</PixelButton>
                    <PixelButton color="primary" onClick={() => navigate('/')} className="flex-1">ДОМОЙ</PixelButton>
                </div>
            </PixelContainer>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--bg-body)] py-20 px-6 text-[var(--text-main)] transition-colors duration-300">
            <div className="max-w-3xl mx-auto space-y-12">
                <button
                    onClick={() => navigate('/polls')}
                    className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors uppercase font-black text-[10px]"
                >
                    <ArrowLeft className="w-3 h-3" /> Все опросы
                </button>

                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-[var(--text-main)] uppercase tracking-tighter leading-none">
                        {poll.title}
                    </h1>
                    <p className="text-[var(--text-muted)] text-lg">{poll.description}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    {poll.fields?.map((field) => (
                        <div key={field.id} className="space-y-4 animate-slide-in">
                            <label className="text-xl font-black text-[var(--text-main)] uppercase block leading-tight">
                                {field.question}
                            </label>

                            {field.type === 'choice' && (
                                <div className="grid grid-cols-1 gap-3">
                                    {field.options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => handleUpdateResponse(field.id, option)}
                                            className={`p-4 rounded-xl border-4 text-left font-bold transition-all ${responses[field.id] === option
                                                ? 'bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(85,239,196,0.2)]'
                                                : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-primary'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {field.type === 'scale' && (
                                <div className="flex justify-between gap-1 md:gap-2">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => handleUpdateResponse(field.id, val)}
                                            className={`flex-1 h-12 rounded-lg border-2 font-black transition-all ${responses[field.id] === val
                                                ? 'bg-warning border-warning text-[#2d3436] scale-110 shadow-lg'
                                                : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-body)]'
                                                }`}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {field.type === 'text' && (
                                <textarea
                                    className="w-full bg-[var(--bg-card)] border-4 border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-main)] font-bold outline-none focus:border-success transition-colors min-h-[120px]"
                                    placeholder="Ваш ответ здесь..."
                                    value={responses[field.id] || ''}
                                    onChange={(e) => handleUpdateResponse(field.id, e.target.value)}
                                />
                            )}
                        </div>
                    ))}

                    <div className="pt-10">
                        <PixelButton
                            type="submit"
                            color="primary"
                            disabled={submitting}
                            className="w-full py-6 text-xl"
                        >
                            <Send className="w-5 h-5 mr-3 inline" />
                            {submitting ? 'ОТПРАВКА...' : 'ЗАВЕРШИТЬ ОПРОС'}
                        </PixelButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PollDetailsPage;
