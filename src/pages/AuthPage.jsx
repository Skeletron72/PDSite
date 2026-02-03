import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Key, CheckCircle, XCircle, Loader2, Sparkles } from 'lucide-react';

const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [accessKey, setAccessKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [step, setStep] = useState(1); // 1: Basics, 2: Password
    const [message, setMessage] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(null); // null, true, false
    const [isCheckingNickname, setIsCheckingNickname] = useState(false);
    const navigate = useNavigate();

    const getPasswordStrength = (pass) => {
        let score = 0;
        if (!pass) return 0;
        if (pass.length > 6) score += 20;
        if (pass.length > 10) score += 20;
        if (/[A-Z]/.test(pass)) score += 20;
        if (/[0-9]/.test(pass)) score += 20;
        if (/[^A-Za-z0-9]/.test(pass)) score += 20;
        return score;
    };

    const passwordStrength = getPasswordStrength(password);

    // Debounce nickname check
    useEffect(() => {
        if (!isRegister || !nickname.trim() || nickname.length < 3) {
            setIsNicknameAvailable(null);
            setNicknameError('');
            return;
        }

        const timer = setTimeout(async () => {
            setIsCheckingNickname(true);
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('nickname')
                    .eq('nickname', nickname.trim())
                    .maybeSingle();

                if (error) throw error;

                if (data) {
                    setIsNicknameAvailable(false);
                    setNicknameError('Имя уже занято');
                } else {
                    setIsNicknameAvailable(true);
                    setNicknameError('');
                }
            } catch (err) {
                console.error('Error checking nickname:', err);
            } finally {
                setIsCheckingNickname(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [nickname, isRegister]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setMessage('');

        if (isRegister && step === 1) {
            if (!isNicknameAvailable && nickname) {
                setMessage('Ошибка: Это имя игрока уже занято.');
                return;
            }
            if (!nickname || !accessKey || !email) {
                setMessage('Ошибка: Пожалуйста, заполните все поля.');
                return;
            }
            setStep(2);
            return;
        }

        if (isRegister && step === 2) {
            if (password !== confirmPassword) {
                setMessage('Ошибка: Пароли не совпадают.');
                return;
            }
            if (passwordStrength < 60) {
                setMessage('Ошибка: Пароль слишком слабый.');
                return;
            }
        }

        setLoading(true);

        try {
            if (isRegister) {
                const { data: authData, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            nickname: nickname.trim(),
                            access_key: accessKey.trim()
                        }
                    }
                });

                if (error) {
                    if (error.message.includes('access_key')) {
                        throw new Error('Неверный или уже использованный ключ доступа.');
                    }
                    if (error.message.includes('profiles_nickname_key') || error.message.includes('unique constraint')) {
                        throw new Error('Это имя игрока уже занято.');
                    }
                    throw error;
                }

                if (authData?.session) {
                    setMessage('Успешно! Вход в систему...');
                    setTimeout(() => navigate('/profile'), 1500);
                } else {
                    setMessage('Успешно! Теперь вы можете войти в систему и начать игру!');
                    setIsRegister(false);
                    setStep(1);
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                navigate('/profile');
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
                        {(!isRegister || step === 1) && (
                            <div className={`space-y-6 transition-all duration-300 ${isRegister && step !== 1 ? 'opacity-0 scale-95 pointer-events-none absolute' : 'opacity-100 scale-100'}`}>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="hero@pocketdale.com"
                                        className="w-full bg-[#f1f2f6] border-4 border-transparent focus:border-[#55efc4] rounded-xl px-4 py-4 font-bold text-gray-700 outline-none transition-all placeholder-gray-300 shadow-inner"
                                        required
                                    />
                                </div>

                                {isRegister && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Имя игрока (Nickname)</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={nickname}
                                                    onChange={(e) => {
                                                        setNickname(e.target.value);
                                                        setNicknameError('');
                                                        setIsNicknameAvailable(null);
                                                    }}
                                                    placeholder="SuperPlayer777"
                                                    className={`w-full bg-[#f1f2f6] border-4 ${isNicknameAvailable === true ? 'border-[#55efc4]' : isNicknameAvailable === false ? 'border-[#ff7675]' : 'border-transparent'} focus:border-[#55efc4] rounded-xl px-4 py-4 font-bold text-gray-700 outline-none transition-all placeholder-gray-300 pr-12 shadow-inner`}
                                                    required
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                    {isCheckingNickname ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : isNicknameAvailable === true ? (
                                                        <CheckCircle className="w-5 h-5 text-[#55efc4]" />
                                                    ) : isNicknameAvailable === false ? (
                                                        <XCircle className="w-5 h-5 text-[#ff7675]" />
                                                    ) : null}
                                                </div>
                                            </div>
                                            {nicknameError && <p className="text-[10px] text-[#ff7675] font-bold ml-2 uppercase">{nicknameError}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Ключ доступа (Access Key)</label>
                                            <input
                                                type="text"
                                                value={accessKey}
                                                onChange={(e) => setAccessKey(e.target.value)}
                                                placeholder="XXXX-XXXX-XXXX"
                                                className="w-full bg-[#f1f2f6] border-4 border-transparent focus:border-[#55efc4] rounded-xl px-4 py-4 font-bold text-gray-700 outline-none transition-all placeholder-gray-300 shadow-inner"
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {!isRegister && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Пароль</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-[#f1f2f6] border-4 border-transparent focus:border-[#55efc4] rounded-xl px-4 py-4 font-bold text-gray-700 outline-none transition-all placeholder-gray-300 shadow-inner"
                                            required
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {isRegister && step === 2 && (
                            <div className="space-y-6 animate-slide-in">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-[10px] font-black text-[#a29bfe] uppercase flex items-center gap-1 hover:translate-x-[-4px] transition-transform"
                                >
                                    ← Назад к данным
                                </button>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Новый Пароль</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-[#f1f2f6] border-4 border-transparent focus:border-[#55efc4] rounded-xl px-4 py-4 font-bold text-gray-700 outline-none transition-all placeholder-gray-300 shadow-inner"
                                            required
                                        />
                                        {/* Strength Bar */}
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex gap-1 px-1 py-0.5">
                                            {[20, 40, 60, 80, 100].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-full flex-1 rounded-full transition-all duration-500 ${passwordStrength >= level
                                                        ? passwordStrength <= 40 ? 'bg-[#ff7675]' : passwordStrength <= 60 ? 'bg-[#fdcb6e]' : 'bg-[#55efc4]'
                                                        : 'bg-transparent'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase ml-2">
                                            Сложность: {passwordStrength <= 40 ? 'Слабый' : passwordStrength <= 60 ? 'Средний' : 'Надежный'}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Повторите Пароль</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className={`w-full bg-[#f1f2f6] border-4 ${confirmPassword && password !== confirmPassword ? 'border-[#ff7675]' : 'border-transparent'} focus:border-[#55efc4] rounded-xl px-4 py-4 font-bold text-gray-700 outline-none transition-all placeholder-gray-300 shadow-inner`}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {message && (
                            <div className={`p-4 rounded-xl text-center text-xs font-bold ${message.startsWith('Ошибка') ? 'bg-[#ff7675]/20 text-[#d63031]' : 'bg-[#55efc4]/20 text-[#00b894]'}`}>
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || (isRegister && step === 1 && (isCheckingNickname || isNicknameAvailable === false))}
                            className="w-full btn-shiny bg-[#55efc4] py-4 rounded-xl font-black text-[#2d3436] uppercase tracking-wider shadow-[4px_4px_0px_#00b894] hover:shadow-[2px_2px_0px_#00b894] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 group"
                        >
                            <span className="flex items-center justify-center gap-2">
                                {loading ? "Загрузка..." : (isRegister ? (step === 1 ? "Продолжить" : "Создать аккаунт") : "Войти в систему")}
                                {!loading && <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                            </span>
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t-2 border-gray-100 text-center">
                        <button
                            type="button"
                            className="text-gray-400 font-bold text-xs uppercase hover:text-[#55efc4] transition-colors"
                            onClick={() => {
                                setIsRegister(!isRegister);
                                setStep(1);
                                setMessage('');
                            }}
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
