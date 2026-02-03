import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTelegramPlane, FaDiscord } from 'react-icons/fa';
import { Sparkles, Palmtree, Home, Heart, Compass as Ship, Leaf } from 'lucide-react'; // Added Lucide icons
import { supabase } from '../lib/supabaseClient';
import ThemeToggle from '../components/ThemeToggle';
import CookieConsent from '../components/CookieConsent';

const LandingPage = () => {
    const navigate = useNavigate();
    const [offset, setOffset] = React.useState({ x: 0, y: 0 });
    const [scrolled, setScrolled] = React.useState(false);
    const [isAdmin, setIsAdmin] = React.useState(false);

    const handleMouseMove = (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20; // -10 to 10
        const y = (e.clientY / window.innerHeight - 0.5) * 10; // -5 to 5
        setOffset({ x, y });
    };




    React.useEffect(() => {
        checkUser();

        const handleScroll = () => {
            setScrolled(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email === import.meta.env.VITE_ADMIN_EMAIL) {
            setIsAdmin(true);
        }
    };

    return (
        <div className="min-h-screen" onMouseMove={handleMouseMove}>
            <CookieConsent />

            {/* DYNAMIC ISLAND NAV */}
            <div className="dynamic-island-container">
                <nav className="dynamic-island">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <img src="/assets/logo_pixel.png" alt="PD" className="h-8 w-auto image-pixelated hover:rotate-12 transition-transform" />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="nav-link" onClick={() => navigate('/blog')}>Блог</button>
                        <button className="nav-link" onClick={() => navigate('/auth')}>Кабинет</button>
                        {isAdmin && <button className="nav-link text-[#fab1a0]" onClick={() => navigate('/admin')}>Админка</button>}
                        <ThemeToggle />
                    </div>
                </nav>
            </div>

            {/* 1. HERO SECTION */}
            <header className="lush-hero flex flex-col items-center justify-center pt-24 px-6 text-center text-white relative">
                {/* Floating Effects - Magic Fireflies (Increased Count & Visibility & Colors) */}
                <div className="magic-firefly" style={{ top: '20%', left: '15%', animationDelay: '0s', animationDuration: '4s' }}></div>
                <div className="magic-firefly" style={{ top: '30%', right: '20%', animationDelay: '1.5s', animationDuration: '5s' }}></div>
                <div className="magic-firefly" style={{ top: '60%', left: '10%', animationDelay: '0.5s', animationDuration: '6s' }}></div>
                <div className="magic-firefly" style={{ top: '70%', right: '25%', animationDelay: '2.5s', animationDuration: '4.5s' }}></div>
                <div className="magic-firefly" style={{ bottom: '20%', left: '40%', animationDelay: '1s', animationDuration: '5.5s' }}></div>
                <div className="magic-firefly" style={{ top: '40%', right: '10%', animationDelay: '3s', animationDuration: '4s' }}></div>
                <div className="magic-firefly" style={{ bottom: '10%', right: '40%', animationDelay: '2s', animationDuration: '5s' }}></div>
                <div className="magic-firefly" style={{ top: '15%', left: '40%', animationDelay: '4s', animationDuration: '6s' }}></div>

                {/* Background Gradient Overlay for Text Contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10 pointer-events-none"></div>

                <div className="relative z-20 max-w-4xl transition-opacity duration-500 flex flex-col items-center" style={{
                    transform: `translate(${offset.x * -0.5}px, ${offset.y * -0.5}px)`,
                    opacity: scrolled ? 0 : 1
                }}>
                    {/* Logo with Magic Glow */}
                    <img src="/assets/logo_pixel.png" alt="Pocket Dale" className="w-full max-w-2xl mx-auto mb-8 image-pixelated magic-glow animate-float" style={{ animationDuration: '6s' }} />

                    {/* Liquid Glass Pill for Tagline */}
                    <div className="glass-panel-dark px-8 py-4 mb-12 flex items-center gap-3 transform hover:scale-105 transition-transform cursor-default">
                        <Palmtree className="w-5 h-5 text-[#55efc4]" />
                        <span className="font-bold text-lg md:text-xl tracking-wide text-shadow-sm">
                            Уютное приключение, где друзья всегда рядом
                        </span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                        <button className="btn-playful shadow-[0_0_20px_rgba(85,239,196,0.6)]" onClick={() => navigate('/auth')}>
                            Начать игру
                        </button>
                        <button className="btn-ghost backdrop-blur-xl border-white/50 text-white hover:bg-white/20">
                            Смотреть трейлер
                        </button>
                    </div>
                </div>

                {/* Real Parallax Layers */}
                {/* Rocks - Front Layer (Faster parallax, no sway) */}
                <div
                    className="parallax-container layer-rocks"
                    style={{ transform: `translateX(${offset.x * 1.5}px) translateY(${offset.y * 0.5}px)` }}
                >
                    <div className="parallax-inner"></div>
                </div>

                {/* Jungle - Middle Layer (Medium parallax, Wind Sway) */}
                <div
                    className="parallax-container layer-jungle"
                    style={{ transform: `translateX(${offset.x * 0.8}px) translateY(${offset.y * 0.2}px)` }}
                >
                    <div className="parallax-inner"></div>
                </div>
            </header>

            {/* 2. PHILOSOPHY - Вместе лучше */}
            <section className="py-24 px-6 bg-white overflow-hidden animate-on-scroll" id="about">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <div className="relative">
                            {/* Asset Placeholder: Illustration */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-[#fab1a0] rounded-[3rem] rotate-3 opacity-20 group-hover:rotate-6 transition-transform duration-500"></div>
                                <img src="/assets/illustration_garden.png" alt="Cozy Gardening" className="relative z-10 w-full rounded-[3rem] border-4 border-white shadow-xl image-pixelated transform group-hover:scale-[1.02] transition-transform duration-500" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-6xl font-black mb-8 text-[#2d3436] tracking-tighter uppercase">
                                Вместе — лучше
                            </h2>
                            <p className="text-lg leading-relaxed text-[#636e72] mb-12">
                                В мире Pocket Dale вы не просто выживаете — вы живете. Это игра о том, как превратить заброшенный берег в общий дом.
                                Исследуйте архипелаг, делитесь ресурсами и поддерживайте друг друга в путешествиях.
                                Здесь одиночество отступает, уступая место командному духу.
                            </p>
                            <div className="news-item shadow-sm flex items-center gap-4">
                                <div className="bg-[#fdcb6e]/20 p-3 rounded-xl">
                                    <Sparkles className="w-6 h-6 text-[#fdcb6e]" />
                                </div>
                                <div>
                                    <p className="font-black text-xl mb-1">Сила дружбы</p>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        Помогайте друг другу в строительстве, готовьте ужин для всей команды и обустраивайте быт.
                                        В нашей игре важен вклад каждого.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. FEATURES */}
            <section className="py-24 px-6 bg-[#f7f9fb] animate-on-scroll">
                <div className="max-w-7xl mx-auto text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter">Жизнь на Архипелаге</h2>
                    <div className="w-32 h-2 bg-primary mx-auto rounded-full"></div>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="cozy-card group hover:-translate-y-2 transition-transform duration-300">
                        <div className="h-24 mb-6 flex items-center justify-center">
                            <div className="w-20 h-20 bg-[#55efc4]/20 rounded-2xl flex items-center justify-center group-hover:bg-[#55efc4]/30 transition-colors">
                                <Home className="w-10 h-10 text-[#00b894]" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-black mb-4">Уют и Дом</h3>
                        <p className="text-sm text-gray-600 leading-loose">
                            Превратите дикий остров в райский уголок. Стройте, украшайте и следите за комфортом своего персонажа —
                            счастливый герой лучше справляется с трудностями.
                        </p>
                    </div>
                    <div className="cozy-card group hover:-translate-y-2 transition-transform duration-300">
                        <div className="h-24 mb-6 flex items-center justify-center">
                            <div className="w-20 h-20 bg-[#ff7675]/20 rounded-2xl flex items-center justify-center group-hover:bg-[#ff7675]/30 transition-colors">
                                <Heart className="w-10 h-10 text-[#d63031]" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-black mb-4">Отношения</h3>
                        <p className="text-sm text-gray-600 leading-loose">
                            Заводите друзей среди жителей острова или найдите любовь среди других игроков.
                            Крепкие узы и «Кольцо Обещания» дадут вам особые силы в совместных приключениях.
                        </p>
                    </div>
                    <div className="cozy-card group hover:-translate-y-2 transition-transform duration-300">
                        <div className="h-24 mb-6 flex items-center justify-center">
                            <div className="w-20 h-20 bg-[#74b9ff]/20 rounded-2xl flex items-center justify-center group-hover:bg-[#74b9ff]/30 transition-colors">
                                <Ship className="w-10 h-10 text-[#0984e3]" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-black mb-4">Бесконечный Мир</h3>
                        <p className="text-sm text-gray-600 leading-loose">
                            Ваш домашний остров — это тихая гавань. Но стоит сесть в лодку, и вас ждет постоянно меняющийся архипелаг
                            с древними руинами, сокровищами и тайнами.
                        </p>
                    </div>
                </div>
            </section>
            {/* 4. ROADMAP */}
            <section className="py-24 px-6 bg-white roadmap-section overflow-hidden">
                <div className="roadmap-timeline"></div>

                <div className="max-w-6xl mx-auto mb-20 text-center relative z-10 animate-on-scroll">
                    <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter">Путь Развития</h2>
                    <p className="text-gray-500 font-bold max-w-2xl mx-auto">Мы постоянно работаем над улучшением Pocket Dale. Вот наши планы на ближайшее будущее.</p>
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    {[
                        {
                            title: "Альфа-тест",
                            date: "Q1 2025",
                            status: "done",
                            statusText: "Завершено",
                            desc: "Запуск основного игрового движка, базовые механики строительства и садоводства. Первые игроки на архипелаге."
                        },
                        {
                            title: "Социальное обновление",
                            date: "Q2 2025",
                            status: "progress",
                            statusText: "В разработке",
                            desc: "Система друзей, совместное строительство, обмен ресурсами и внутриигровой чат."
                        },
                        {
                            title: "Новые биомы и квесты",
                            date: "Q3 2025",
                            status: "planned",
                            statusText: "Запланировано",
                            desc: "Расширение архипелага: пустынные острова, заснеженные вершины и цепочки уникальных заданий."
                        },
                        {
                            title: "Мобильная версия",
                            date: "Q4 2025",
                            status: "planned",
                            statusText: "Запланировано",
                            desc: "Выход Pocket Dale на iOS и Android. Кроссплатформенный прогресс между всеми устройствами."
                        },
                        {
                            title: "Глобальный релиз",
                            date: "2026",
                            status: "planned",
                            statusText: "Запланировано",
                            desc: "Полномасштабный запуск игры, открытие глобальных серверов и первый сезонный ивент."
                        }
                    ].map((step, idx) => (
                        <div key={idx} className="roadmap-item animate-on-scroll">
                            <div className="roadmap-dot"></div>
                            <div className="roadmap-card group">
                                <div className={`roadmap-status status-${step.status}`}>
                                    {step.statusText}
                                </div>
                                <h3 className="text-2xl font-black mb-1">{step.title}</h3>
                                <p className="text-sm font-bold text-primary mb-4">{step.date}</p>
                                <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>



            {/* 5. FOOTER */}
            {/* 5. FOOTER */}
            <footer className="py-12 bg-[#2d3436] text-white relative overflow-hidden">
                {/* Subtle Glass Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>

                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">

                        <div className="text-left">
                            <h3 className="text-xl font-black uppercase mb-2 tracking-wider">Pocket Dale</h3>
                            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                                Уют и приключения ждут тебя. <br /> Создавай, дружи, исследуй.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-[#0088cc]/20 flex items-center justify-center text-[#0088cc] hover:bg-[#0088cc] hover:text-white transition-all hover:scale-110">
                                <FaTelegramPlane className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-[#5865F2]/20 flex items-center justify-center text-[#5865F2] hover:bg-[#5865F2] hover:text-white transition-all hover:scale-110">
                                <FaDiscord className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-2 opacity-30 text-[10px] uppercase font-bold tracking-widest">
                        <span>© 2026 Pocket Dale</span>
                        <span>•</span>
                        <span>Made with love</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
