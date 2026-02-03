import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { User, Gift, Clock, LogOut, Check, X, Shield, Sparkles, Wand2 } from 'lucide-react';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, profile, signOut } = useAuth();
    const [islands, setIslands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    // Nickname Edit State
    const [isEditingNickname, setIsEditingNickname] = useState(false);
    const [newNickname, setNewNickname] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);

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
        const fetchIslands = async () => {
            if (!user) return;

            const { data } = await supabase
                .from('islands')
                .select('*')
                .eq('user_id', user.id)
                .order('slot_index', { ascending: true });

            if (data) setIslands(data);
            setLoading(false);
        };

        if (user) {
            fetchIslands();
        } else {
            // Wait for auth loading or redirect
            const timeout = setTimeout(() => {
                if (!loading && !user) navigate('/auth');
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [user, navigate]);

    const handleLogout = async () => {
        await signOut();
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

    const handleUpdateNickname = async (e) => {
        e.preventDefault();
        if (!newNickname.trim() || newNickname === profile?.nickname) {
            setIsEditingNickname(false);
            return;
        }

        setUpdateLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ nickname: newNickname.trim() })
                .eq('id', user.id);

            if (error) throw error;

            // Refresh local state or use refreshProfile from context if available
            // For now, simple reload or state update is enough if we trust Supabase
            // But let's use the context refresh if we implemented it
            window.location.reload(); // Quickest way to ensure everything updates for now
        } catch (err) {
            alert(`Ошибка обновления: ${err.message}`);
        } finally {
            setUpdateLoading(false);
            setIsEditingNickname(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-body)] text-[var(--text-main)] font-bold">
            Загрузка профиля...
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--bg-body)] pt-20 pb-12 px-6 text-[var(--text-main)]">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 p-8 bg-[var(--bg-card)] rounded-[2.5rem] shadow-sm border-2 border-[var(--border-color)]">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-[#a29bfe] rounded-full flex items-center justify-center border-4 border-white shadow-md">
                            <span className="text-4xl font-black text-white">{profile?.nickname?.[0].toUpperCase() || user?.email?.[0].toUpperCase()}</span>
                        </div>
                        <div>
                            {isEditingNickname ? (
                                <form onSubmit={handleUpdateNickname} className="flex gap-2 mb-1">
                                    <input
                                        type="text"
                                        value={newNickname}
                                        onChange={(e) => setNewNickname(e.target.value)}
                                        className="bg-gray-50 border-2 border-[#6c5ce7] rounded-lg px-3 py-1 font-bold text-[#2d3436] outline-none"
                                        autoFocus
                                        placeholder="Новый ник"
                                    />
                                    <button type="submit" disabled={updateLoading} className="bg-[#6c5ce7] text-white px-3 py-1 rounded-lg font-bold text-xs uppercase hover:bg-[#5849c4]">
                                        {updateLoading ? '...' : 'Ок'}
                                    </button>
                                    <button type="button" onClick={() => setIsEditingNickname(false)} className="text-gray-400 font-bold text-xs uppercase hover:text-gray-600">
                                        Отмена
                                    </button>
                                </form>
                            ) : (
                                <div className="flex items-center gap-2 group mb-1">
                                    <h1 className="text-3xl font-black text-[var(--text-main)]">{profile?.nickname || 'Герой'}</h1>
                                    <button
                                        onClick={() => {
                                            setNewNickname(profile?.nickname || '');
                                            setIsEditingNickname(true);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-[#6c5ce7] hover:bg-[#6c5ce7]/10 rounded-md transition-all"
                                        title="Изменить имя"
                                    >
                                        <Shield className="w-4 h-4 rotate-45" /> {/* Using Shield as a placeholder for edit or a generic icon */}
                                    </button>
                                </div>
                            )}
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
                            className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${activeTab === 'profile' ? 'bg-[var(--bg-card)] shadow-sm text-[#6c5ce7]' : 'text-gray-400 hover:bg-[var(--bg-card)]/50'}`}
                        >
                            <User className="w-5 h-5" />
                            Основное
                        </button>
                        <button
                            onClick={() => setActiveTab('promo')}
                            className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${activeTab === 'promo' ? 'bg-[var(--bg-card)] shadow-sm text-[#fdcb6e]' : 'text-gray-400 hover:bg-[var(--bg-card)]/50'}`}
                        >
                            <Gift className="w-5 h-5" />
                            Промокоды
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${activeTab === 'history' ? 'bg-[var(--bg-card)] shadow-sm text-[#00cec9]' : 'text-gray-400 hover:bg-[var(--bg-card)]/50'}`}
                        >
                            <Clock className="w-5 h-5" />
                            История
                        </button>

                        {user?.email === 'andrewche2003@gmail.com' && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="w-full text-left px-6 py-4 rounded-2xl font-bold bg-[#fab1a0]/20 text-[#e17055] hover:bg-[#fab1a0]/30 transition-all flex items-center gap-3 mt-4"
                            >
                                <Shield className="w-5 h-5" />
                                Админ-панель
                            </button>
                        )}

                        <div className="mt-8 p-6 bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] rounded-[2rem] text-white shadow-lg overflow-hidden relative group">
                            <Sparkles className="absolute -top-2 -right-2 w-16 h-16 opacity-20 group-hover:rotate-12 transition-transform" />
                            <h4 className="font-black uppercase text-[10px] tracking-widest mb-4 opacity-80">Ваш Герой</h4>

                            {islands[0]?.appearance_data ? (
                                <div className="space-y-3 relative z-10">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="opacity-70">Волосы:</span>
                                        <span className="font-black">{islands[0].appearance_data.hair || 'Обычные'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="opacity-70">Глаза:</span>
                                        <span className="font-black">{islands[0].appearance_data.eyes || 'Ясные'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="opacity-70">Наряд:</span>
                                        <span className="font-black">{islands[0].appearance_data.outfit || 'Странник'}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <Wand2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-[10px] font-bold opacity-70">Нет данных о внешности</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-9">
                        {activeTab === 'profile' && (
                            <div className="bg-[var(--bg-card)] rounded-[2.5rem] p-8 shadow-sm border-2 border-[var(--border-color)] min-h-[400px]">
                                <h2 className="text-2xl font-black text-[var(--text-main)] mb-6">Ваши Острова</h2>
                                <p className="text-gray-500 mb-8">Управление игровыми слотами и прогрессом персонажа.</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {islands.length > 0 ? (
                                        islands.map((island) => (
                                            <div key={island.id} className="p-6 bg-[var(--bg-body)] rounded-2xl border-2 border-[var(--border-color)] hover:border-[#6c5ce7] transition-all group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-black text-[var(--text-main)] text-lg">{island.name}</h3>
                                                        <p className="text-xs font-bold text-gray-400">Слот #{island.slot_index + 1}</p>
                                                    </div>
                                                    <span className="bg-[#6c5ce7] text-white text-[10px] font-black px-2 py-1 rounded-md">ДЕНЬ {island.current_day}</span>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs font-bold">
                                                        <span className="text-gray-400">СИД:</span>
                                                        <span className="text-[var(--text-main)]">{island.seed}</span>
                                                    </div>
                                                </div>
                                                <button className="w-full mt-4 py-2 bg-[var(--bg-card)] border-2 border-[#6c5ce7] text-[#6c5ce7] rounded-xl font-bold text-sm hover:bg-[#6c5ce7] hover:text-white transition-all">
                                                    Управлять
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full p-12 bg-[var(--bg-body)] rounded-2xl border-2 border-dashed border-[var(--border-color)] text-center">
                                            <p className="text-gray-400 font-bold mb-2">У вас пока нет созданных островов.</p>
                                            <p className="text-xs text-gray-300 uppercase tracking-widest font-black">Зайдите в игру, чтобы начать приключение!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'promo' && (
                            <div className="bg-[var(--bg-card)] rounded-[2.5rem] p-8 shadow-sm border-2 border-[var(--border-color)] min-h-[400px]">
                                <h2 className="text-2xl font-black text-[var(--text-main)] mb-6">Активация кодов</h2>
                                <p className="text-gray-500 mb-8">Введите промокод, чтобы получить уникальные предметы и бонусы в игре.</p>

                                <form onSubmit={handleActivatePromo} className="max-w-md">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            placeholder="Введите код (например, POCKET2025)"
                                            className="w-full bg-[var(--bg-body)] border-2 border-[var(--border-color)] focus:border-[#fdcb6e] rounded-xl px-5 py-4 font-bold text-[var(--text-main)] outline-none transition-all uppercase placeholder-gray-300"
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
                            <div className="bg-[var(--bg-card)] rounded-[2.5rem] p-8 shadow-sm border-2 border-[var(--border-color)] min-h-[400px]">
                                <h2 className="text-2xl font-black text-[var(--text-main)] mb-6">История активности</h2>

                                <div className="space-y-4">
                                    {history.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 bg-[var(--bg-body)] rounded-2xl hover:bg-[var(--bg-card)]/30 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-[var(--bg-card)] rounded-full flex items-center justify-center shadow-sm text-gray-400">
                                                    {item.icon === 'User' ? <User className="w-5 h-5" /> : <Gift className="w-5 h-5" />}
                                                </div>
                                                <span className="font-bold text-[var(--text-main)]">{item.action}</span>
                                            </div>
                                            <span className="text-xs font-bold text-gray-400 bg-[var(--bg-card)] px-3 py-1 rounded-full">{item.date}</span>
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
