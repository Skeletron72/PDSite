import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import logoPixel from '../assets/logo_pixel.png';
import { User, LogOut, Shield, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, profile, isAdmin, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Don't show custom navbar on auth page if needed, but here we want it everywhere
    const isLanding = location.pathname === '/';

    return (
        <div className="fixed top-0 left-0 right-0 z-[1000] flex justify-center p-4 pointer-events-none">
            <nav className={`dynamic-island pointer-events-auto transition-all duration-300 flex items-center justify-between gap-6 px-6 py-3 rounded-full bg-[#2d3436]/90 backdrop-blur-xl border border-white/10 shadow-2xl ${scrolled ? 'scale-90 opacity-90' : 'scale-100'}`}>
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => isLanding ? window.scrollTo({ top: 0, behavior: 'smooth' }) : navigate('/')}>
                    <img src={logoPixel} alt="PD" className="h-8 w-auto image-pixelated hover:rotate-12 transition-transform" />
                </div>

                <div className="flex items-center gap-6">
                    <button className="nav-link" onClick={() => navigate('/blog')}>Блог</button>
                    <button className="nav-link" onClick={() => navigate('/polls')}>Опросы</button>

                    {user ? (
                        <div className="flex items-center gap-4">
                            {isAdmin && (
                                <button className="nav-link text-[#fab1a0] flex items-center gap-1" onClick={() => navigate('/admin')}>
                                    <Shield className="w-4 h-4" /> <span className="hidden md:inline">Панель</span>
                                </button>
                            )}
                            <button
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 p-1.5 pr-4 rounded-full transition-colors"
                                onClick={() => navigate('/profile')}
                            >
                                <div className="w-8 h-8 rounded-full bg-[#55efc4] flex items-center justify-center text-black font-black text-xs uppercase">
                                    {profile?.nickname?.[0] || user.email[0]}
                                </div>
                                <span className="text-[10px] font-black uppercase text-white hidden sm:inline">{profile?.nickname || 'Герой'}</span>
                            </button>
                        </div>
                    ) : (
                        <button className="nav-link bg-[#55efc4]/20 text-[#55efc4] px-4 py-1.5 rounded-full hover:bg-[#55efc4]/30 transition-colors" onClick={() => navigate('/auth')}>Вход</button>
                    )}

                    <ThemeToggle />
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
