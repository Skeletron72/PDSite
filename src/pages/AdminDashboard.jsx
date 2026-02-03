import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { PixelButton, PixelContainer, PixelHeading } from '../components/ui/PixelUI';
import PixelChart from '../components/PixelChart';
import BlogEditor from '../components/BlogEditor';
import PollEditor from '../components/PollEditor';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        players: 0,
        pollData: {
            labels: ['Loading'],
            datasets: [{ label: 'Votes', data: [0], backgroundColor: '#209cee' }]
        }
    });
    const navigate = useNavigate();

    useEffect(() => {
        checkAdmin();
        fetchStats();
    }, []);

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        // Simplified Admin Check: In real app, check a 'role' column in 'profiles' table
        // or compare with a list of admin UIDs in env variables.
        if (user && user.email === import.meta.env.VITE_ADMIN_EMAIL) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
        setLoading(false);
    };

    const fetchStats = async () => {
        // Mocking statistical data for visualization
        setStats({
            players: 1337,
            pollData: {
                labels: ['8-bit', '16-bit', '32-bit', 'HD-Pixel'],
                datasets: [{
                    label: 'Style Preference',
                    data: [450, 600, 120, 167],
                    backgroundColor: [
                        '#e76e55',
                        '#209cee',
                        '#92cc41',
                        '#f7d51d'
                    ],
                    borderColor: '#000',
                    borderWidth: 2
                }]
            }
        });
    };

    const exportData = () => {
        const data = [
            { Category: '8-bit', Votes: 450 },
            { Category: '16-bit', Votes: 600 },
            { Category: '32-bit', Votes: 120 },
            { Category: 'HD-Pixel', Votes: 167 }
        ];
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'poll_results.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="p-8 nes-text">VERIFYING PERMISSIONS...</div>;

    if (!isAdmin && process.env.NODE_ENV === 'production') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black p-4">
                <PixelContainer dark title="ACCESS DENIED" className="is-error">
                    <p>You do not have the clearance to view this data terminal.</p>
                    <PixelButton onClick={() => navigate('/')}>RETURN TO SURFACE</PixelButton>
                </PixelContainer>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 bg-[#212529]">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <PixelHeading level={1} className="text-2xl text-warning">ADMIN COMMAND CENTER</PixelHeading>
                    <PixelButton onClick={() => navigate('/')}>LOGOUT</PixelButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <PixelContainer dark title="TOTAL PLAYERS" className="text-center">
                        <p className="text-4xl text-success">{stats.players}</p>
                    </PixelContainer>
                    <PixelContainer dark title="ACTIVE SESSIONS" className="text-center">
                        <p className="text-4xl text-primary">42</p>
                    </PixelContainer>
                    <PixelContainer dark title="EXPORT DATA" className="text-center">
                        <PixelButton color="primary" onClick={exportData} className="w-full">
                            DOWNLOAD CSV
                        </PixelButton>
                    </PixelContainer>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <BlogEditor />
                    <PollEditor />
                </div>

                <div className="mt-12">
                    <PixelChart title="POLL RESULTS VISUALIZATION" data={stats.pollData} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
