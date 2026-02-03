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
        <div className="min-h-screen p-8 bg-[var(--bg-body)] text-[var(--text-main)] transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <PixelHeading level={1} className="text-2xl text-primary">COMMUNITY POLLS</PixelHeading>
                    <PixelButton onClick={() => navigate('/')}>BACK</PixelButton>
                </div>

                {loading ? (
                    <p className="nes-text">LOADING QUESTS...</p>
                ) : (
                    <div className="grid gap-8">
                        {polls.map(poll => (
                            <PixelContainer key={poll.id} dark title={poll.title} className="hover:border-primary transition-colors cursor-pointer" onClick={() => handleOpenPoll(poll.id)}>
                                <p className="mb-6 text-gray-400">{poll.description}</p>
                                <PixelButton color="primary" className="w-full">
                                    УЧАСТВОВАТЬ
                                </PixelButton>
                            </PixelContainer>
                        ))}
                    </div>
                )}

                {!user && (
                    <PixelContainer className="mt-12 text-center" title="AUTHENTICATION REQUIRED">
                        <p className="mb-4">Log in to participate in development decisions!</p>
                        <PixelButton color="primary" onClick={() => navigate('/auth')}>LOG IN / REGISTER</PixelButton>
                    </PixelContainer>
                )}
            </div>
        </div>
    );
};

export default PollsPage;
