import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Key } from 'lucide-react';

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
                const { data: authData, error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;

                // Manually create profile if signup was successful
                if (authData?.user) {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .insert([
                            {
                                id: authData.user.id,
                                nickname: email.split('@')[0],
                                avatar_id: 0
                            }
                        ]);
                    if (profileError) console.error('Error creating profile:', profileError);
                }

                setMessage('Успешно! Проверьте почту для подтверждения или войдите.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                navigate('/profile'); // Redirect to Profile on success
            }
        } catch (error) {
            setMessage(`Ошибка: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#2d3436] relative overflow-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}>
            </div>

            <div className="w-full max-w-md relative z-10 animate-fade-in-up">
                {/* Header Card */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter text-shadow-pixel">
                        {isRegister ? "Регистрация" : "Вход"}
                    </h1>
                    <p className="text-[#a29bfe] font-bold text-sm uppercase tracking-widest">
                        {isRegister ? "Присоединиться к миру" : "Панель Управления"}
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[8px_8px_0px_rgba(0,0,0,0.2)] border-4 border-white relative">
                    {/* Decorative Elements */}
                    <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#fab1a0] rounded-full flex items-center justify-center text-3xl shadow-lg border-4 border-white animate-bounce-slow text-white">
                        <Key className="w-8 h-8" />
                    </div>

                    <form onSubmit={handleAuth} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="hero@pocketdale.com"
                                className="w-full bg-[#f1f2f6] border-4 border-transparent focus:border-[#55efc4] rounded-xl px-4 py-4 font-bold text-gray-700 outline-none transition-all placeholder-gray-300"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Пароль</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#f1f2f6] border-4 border-transparent focus:border-[#55efc4] rounded-xl px-4 py-4 font-bold text-gray-700 outline-none transition-all placeholder-gray-300"
                                required
                            />
                        </div>

                        {message && (
                            <div className={`p-4 rounded-xl text-center text-xs font-bold ${message.startsWith('Ошибка') ? 'bg-[#ff7675]/20 text-[#d63031]' : 'bg-[#55efc4]/20 text-[#00b894]'}`}>
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-shiny bg-[#55efc4] py-4 rounded-xl font-black text-[#2d3436] uppercase tracking-wider shadow-[4px_4px_0px_#00b894] hover:shadow-[2px_2px_0px_#00b894] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50"
                        >
                            {loading ? "Загрузка..." : (isRegister ? "Создать аккаунт" : "Войти в систему")}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t-2 border-gray-100 text-center">
                        <button
                            type="button"
                            className="text-gray-400 font-bold text-xs uppercase hover:text-[#55efc4] transition-colors"
                            onClick={() => setIsRegister(!isRegister)}
                        >
                            {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Регистрация"}
                        </button>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <button onClick={() => navigate('/')} className="text-white/50 font-bold text-xs uppercase hover:text-white transition-colors">
                        ← Вернуться на главную
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
