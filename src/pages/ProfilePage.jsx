import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { User, Gift, Clock, LogOut, Check, X, Shield } from 'lucide-react';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [islands, setIslands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    // Promo Code State
    const [promoCode, setPromoCode] = useState('');
    const [promoMessage, setPromoMessage] = useState('');
    const [promoStatus, setPromoStatus] = useState(null); // 'success', 'error'

    // Dummy History Data
    const [history, setHistory] = useState([
        { id: 1, action: 'Регистрация', date: '2025-01-20', icon: 'User' },
        { id: 2, action: 'Активация кода WELCOME', date: '2025-01-21', icon: 'Gift' },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/auth');
                return;
            }
            setUser(session.user);

            // Fetch Profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
            
            if (profileData) {
                setProfile(profileData);
            } else {
                // If profile doesn't exist, create it (fallback if no trigger)
                const { data: newProfile } = await supabase
                    .from('profiles')
                    .insert([{ id: session.user.id, nickname: session.user.email.split('@')[0] }])
                    .select()
                    .single();
                setProfile(newProfile);
            }

            // Fetch Islands
            const { data: islandsData } = await supabase
                .from('islands')
                .select('*')
                .eq('user_id', session.user.id)
                .order('slot_index', { ascending: true });
            
            if (islandsData) {
                setIslands(islandsData);
            }

            setLoading(false);
        };
        fetchData();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const handleActivatePromo = async (e) => {
        e.preventDefault();
        setPromoStatus(null);
        setPromoMessage('');

        if (!promoCode.trim()) return;

        try {
            // Check Access Keys
            const { data, error } = await supabase
                .from('access_keys')
                .select('*')
                .eq('key_code', promoCode.trim())
                .single();

            if (error || !data) {
                setPromoStatus('error');
                setPromoMessage('Неверный или истекший промокод.');
                return;
            }

            if (data.is_used) {
                setPromoStatus('error');
                setPromoMessage('Этот код уже был использован.');
                return;
            }

            // Mark as used
            const { error: updateError } = await supabase
                .from('access_keys')
                .update({ is_used: true, used_by_user_id: user.id })
                .eq('key_code', promoCode.trim());

            if (updateError) throw updateError;

            setPromoStatus('success');
            setPromoMessage('Промокод успешно активирован! Награда добавлена.');
            setHistory(prev => [{ 
                id: Date.now(), 
                action: `Активация кода ${promoCode.toUpperCase()}`, 
                date: new Date().toISOString().split('T')[0], 
                icon: 'Gift' 
            }, ...prev]);
            setPromoCode('');

        } catch (err) {
            setPromoStatus('error');
            setPromoMessage(`Ошибка: ${err.message}`);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb] text-[#2d3436] font-bold">
            Загрузка профиля...
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f7f9fb] pt-20 pb-12 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 p-8 bg-white rounded-[2.5rem] shadow-sm border-2 border-gray-100">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-[#a29bfe] rounded-full flex items-center justify-center border-4 border-white shadow-md">
                            <span className="text-4xl font-black text-white">{profile?.nickname?.[0].toUpperCase() || user?.email?.[0].toUpperCase()}</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-[#2d3436] mb-1">{profile?.nickname || 'Герой'}</h1>
                            <p className="text-gray-500 font-medium">{user?.email}</p>
                            <div className="flex gap-2 mt-3">
                                <span className="text-xs font-bold px-3 py-1 bg-[#55efc4]/20 text-[#00b894] rounded-full uppercase tracking-wider">
                                    Игрок
                                </span>
                                {user?.email === import.meta.env.VITE_ADMIN_EMAIL && (
                                    <span className="text-xs font-bold px-3 py-1 bg-[#ff7675]/20 text-[#d63031] rounded-full uppercase tracking-wider flex items-center gap-1">
                                        <Shield className="w-3 h-3" /> Admin
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-50 hover:text-[#d63031] transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Выйти
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="md:col-span-3 space-y-4">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${activeTab === 'profile' ? 'bg-white shadow-sm text-[#6c5ce7]' : 'text-gray-400 hover:bg-gray-100'}`}
                        >
                            <User className="w-5 h-5" />
                            Основное
                        </button>
                        <button
                            onClick={() => setActiveTab('promo')}
                            className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${activeTab === 'promo' ? 'bg-white shadow-sm text-[#fdcb6e]' : 'text-gray-400 hover:bg-gray-100'}`}
                        >
                            <Gift className="w-5 h-5" />
                            Промокоды
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${activeTab === 'history' ? 'bg-white shadow-sm text-[#00cec9]' : 'text-gray-400 hover:bg-gray-100'}`}
                        >
                            <Clock className="w-5 h-5" />
                            История
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-9">
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border-2 border-gray-100 min-h-[400px]">
                                <h2 className="text-2xl font-black text-[#2d3436] mb-6">Ваши Острова</h2>
                                <p className="text-gray-500 mb-8">Управление игровыми слотами и прогрессом персонажа.</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {islands.length > 0 ? (
                                        islands.map((island) => (
                                            <div key={island.id} className="p-6 bg-[#f7f9fb] rounded-2xl border-2 border-gray-100 hover:border-[#6c5ce7] transition-all group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-black text-[#2d3436] text-lg">{island.name}</h3>
                                                        <p className="text-xs font-bold text-gray-400">Слот #{island.slot_index + 1}</p>
                                                    </div>
                                                    <span className="bg-[#6c5ce7] text-white text-[10px] font-black px-2 py-1 rounded-md">ДЕНЬ {island.current_day}</span>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs font-bold">
                                                        <span className="text-gray-400">СИД:</span>
                                                        <span className="text-[#2d3436]">{island.seed}</span>
                                                    </div>
                                                </div>
                                                <button className="w-full mt-4 py-2 bg-white border-2 border-[#6c5ce7] text-[#6c5ce7] rounded-xl font-bold text-sm hover:bg-[#6c5ce7] hover:text-white transition-all">
                                                    Управлять
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full p-12 bg-[#f7f9fb] rounded-2xl border-2 border-dashed border-gray-200 text-center">
                                            <p className="text-gray-400 font-bold mb-2">У вас пока нет созданных островов.</p>
                                            <p className="text-xs text-gray-300 uppercase tracking-widest font-black">Зайдите в игру, чтобы начать приключение!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'promo' && (
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border-2 border-gray-100 min-h-[400px]">
                                <h2 className="text-2xl font-black text-[#2d3436] mb-6">Активация кодов</h2>
                                <p className="text-gray-500 mb-8">Введите промокод, чтобы получить уникальные предметы и бонусы в игре.</p>

                                <form onSubmit={handleActivatePromo} className="max-w-md">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            placeholder="Введите код (например, POCKET2025)"
                                            className="w-full bg-[#f7f9fb] border-2 border-[#dfe6e9] focus:border-[#fdcb6e] rounded-xl px-5 py-4 font-bold text-[#2d3436] outline-none transition-all uppercase placeholder-gray-300"
                                        />
                                        <button
                                            type="submit"
                                            className="absolute right-2 top-2 bottom-2 bg-[#fdcb6e] text-white px-6 rounded-lg font-black hover:bg-[#e1b12c] transition-colors"
                                        >
                                            OK
                                        </button>
                                    </div>
                                </form>

                                {promoMessage && (
                                    <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 font-bold ${promoStatus === 'success' ? 'bg-[#55efc4]/20 text-[#00b894]' : 'bg-[#ff7675]/20 text-[#d63031]'}`}>
                                        {promoStatus === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                        {promoMessage}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border-2 border-gray-100 min-h-[400px]">
                                <h2 className="text-2xl font-black text-[#2d3436] mb-6">История активности</h2>

                                <div className="space-y-4">
                                    {history.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 bg-[#f7f9fb] rounded-2xl hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400">
                                                    {item.icon === 'User' ? <User className="w-5 h-5" /> : <Gift className="w-5 h-5" />}
                                                </div>
                                                <span className="font-bold text-[#2d3436]">{item.action}</span>
                                            </div>
                                            <span className="text-xs font-bold text-gray-400 bg-white px-3 py-1 rounded-full">{item.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
