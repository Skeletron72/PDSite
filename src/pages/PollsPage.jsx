import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { PixelButton, PixelContainer, PixelHeading } from '../components/ui/PixelUI';
import { useNavigate } from 'react-router-dom';

const PollsPage = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        setLoading(true);
        // In a real app, you'd fetch from Supabase. 
        // Here we use mock data for demonstration if the table doesn't exist yet.
        try {
            const { data, error } = await supabase.from('polls').select('*');
            if (error) throw error;
            setPolls(data || []);
        } catch (e) {
            console.warn("Table 'polls' not found or error fetching. Using mock data.");
            setPolls([
                { id: 1, question: "Which class should we add next?", options: ["Wizard", "Rogue", "Paladin"] },
                { id: 2, question: "Best pixel art style?", options: ["8-bit", "16-bit", "Gameboy"] }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (pollId, optionIndex) => {
        if (!user) {
            alert("Please login to vote!");
            navigate('/auth');
            return;
        }

        // Logic for voting restricted by UID would go here:
        // 1. Check if user already voted in 'votes' table
        // 2. If not, insert vote and update 'polls' counts
        console.log(`Voting for poll ${pollId}, option ${optionIndex}`);
        alert("Vote recorded! (Mock)");
    };

    return (
        <div className="min-h-screen p-8 bg-[#212529]">
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
                            <PixelContainer key={poll.id} dark title={`POLL #${poll.id}`} className="hover:border-primary transition-colors">
                                <p className="mb-6 font-bold">{poll.question}</p>
                                <div className="flex flex-col gap-4">
                                    {poll.options.map((option, idx) => (
                                        <PixelButton
                                            key={idx}
                                            className="w-full text-left"
                                            onClick={() => handleVote(poll.id, idx)}
                                        >
                                            {option}
                                        </PixelButton>
                                    ))}
                                </div>
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
