import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { PixelButton, PixelContainer, PixelInput, PixelHeading } from '../components/ui/PixelUI';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (isRegister) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setMessage('Success! Check your email for confirmation.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                navigate('/');
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#212529]">
            <PixelContainer dark title={isRegister ? "REGISTER" : "LOGIN"} className="w-full max-w-md">
                <form onSubmit={handleAuth} className="space-y-6">
                    <PixelInput
                        label="EMAIL"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="pixel@hero.com"
                    />
                    <PixelInput
                        label="PASSWORD"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                    />

                    {message && (
                        <div className={`nes-text ${message.startsWith('Error') ? 'is-error' : 'is-success'} text-xs`}>
                            {message}
                        </div>
                    )}

                    <div className="flex flex-col gap-4 pt-4">
                        <PixelButton type="submit" color="primary" className="w-full">
                            {loading ? "PROCESSING..." : (isRegister ? "SIGN UP" : "LOG IN")}
                        </PixelButton>

                        <button
                            type="button"
                            className="nes-btn is-link text-xs"
                            onClick={() => setIsRegister(!isRegister)}
                        >
                            {isRegister ? "Already have an account? Login" : "Need an account? Register"}
                        </button>

                        <PixelButton onClick={() => navigate('/')} className="w-full">
                            BACK TO HOME
                        </PixelButton>
                    </div>
                </form>
            </PixelContainer>
        </div>
    );
};

export default AuthPage;
