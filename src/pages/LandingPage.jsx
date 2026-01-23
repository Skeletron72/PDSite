import React from 'react';
import { PixelHeading } from '../components/ui/PixelUI';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            title: "Создавай",
            desc: "Интуитивный крафт из сотен ресурсов.",
            icon: "nes-icon diamond is-medium"
        },
        {
            title: "Выживай",
            desc: "Опасные ночи и динамическая погода.",
            icon: "nes-icon ghost is-medium"
        },
        {
            title: "Дружи",
            desc: "Торгуй и строй вместе с другими.",
            icon: "nes-icon star is-medium"
        },
        {
            title: "Исследуй",
            desc: "Бесконечные острова и древние тайны.",
            icon: "nes-icon map is-medium"
        }
    ];

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-white">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 glass-dark py-4 px-6 border-b-4 border-[#3b2d1c]">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src="/favicon.png" alt="logo" className="w-8 h-8" />
                        <span className="text-xl font-bold tracking-tighter text-warning">POCKETDALE</span>
                    </div>
                    <div className="hidden md:flex gap-8 text-[10px] uppercase font-bold">
                        <a href="#lore" className="hover:text-primary transition-colors">История</a>
                        <a href="#features" className="hover:text-primary transition-colors">Особенности</a>
                        <a href="https://t.me/your_telegram" target="_blank" className="hover:text-[#0088cc] transition-colors">Telegram</a>
                    </div>
                    <button
                        className="pixel-btn-wood text-[10px] scale-90"
                        onClick={() => navigate('/auth')}
                    >
                        ВОЙТИ
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-bg relative min-h-screen flex items-center justify-center pt-20 px-4">
                <div className="absolute inset-0 bg-black/40 z-0" />

                <div className="relative z-10 max-w-4xl w-full text-center">
                    <div className="animate-float mb-8">
                        <PixelHeading className="text-5xl md:text-8xl text-warning drop-shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                            PocketDale
                        </PixelHeading>
                    </div>

                    <div className="pixel-panel mx-auto max-w-2xl bg-white/5 backdrop-blur-sm">
                        <p className="text-lg md:text-2xl mb-8 leading-relaxed text-[#5e4125] font-bold">
                            Выживай. Строй. Исследуй.
                        </p>
                        <p className="text-sm md:text-base mb-10 text-[#3b2d1c] leading-loose">
                            Уютная многопользовательская песочница прямо в твоем браузере.
                            Очнись на берегу, собери первую кирку и построй свой новый дом.
                            Никаких скачиваний — только приключения.
                        </p>
                        <button
                            className="pixel-btn-wood text-lg px-12 py-4 w-full md:w-auto"
                            onClick={() => navigate('/auth')}
                        >
                            ИГРАТЬ СЕЙЧАС
                        </button>
                    </div>
                </div>
            </section>

            {/* Lore Section */}
            <section id="lore" className="py-24 px-4 bg-[#2c211a] border-y-8 border-[#1a150f]">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <PixelHeading level={2} className="text-3xl mb-8 text-primary">
                            ШТОРМ ЗАБРАЛ ВСЁ...
                        </PixelHeading>
                        <p className="text-lg italic leading-loose opacity-90 border-l-4 border-primary pl-6">
                            "Ваша шхуна разбилась в щепки о скалы таинственного острова. Океан выбросил тебя на берег с пустыми руками.
                            Вокруг — дикая природа, древние руины и другие выжившие. Сможешь ли ты покорить эти земли?"
                        </p>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="pixel-card p-1 scale-110">
                            <img src="/hero_bg.png" alt="world" className="w-full h-auto opacity-80" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 px-4 bg-[#1a150f]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <PixelHeading level={2} className="text-4xl mb-4 text-warning">ОСОБЕННОСТИ МИРА</PixelHeading>
                        <div className="w-24 h-2 bg-warning mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((f, i) => (
                            <div key={i} className="pixel-card flex flex-col items-center text-center gap-6">
                                <div className="bg-black/40 p-6 border-2 border-primary/30">
                                    <i className={f.icon}></i>
                                </div>
                                <h3 className="text-xl text-primary font-bold">{f.title}</h3>
                                <p className="text-xs leading-relaxed opacity-70 italic">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-6 bg-black border-t-8 border-[#3b2d1c]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="text-center md:text-left">
                        <PixelHeading className="text-2xl mb-4 text-warning">PocketDale</PixelHeading>
                        <p className="text-xs opacity-50 mb-6 max-w-xs">
                            Присоединяйся к нашему сообществу в Telegram, чтобы найти друзей для выживания и следить за обновлениями.
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <i className="nes-icon whatsapp scale-75 !text-[#0088cc]"></i>
                            <a href="https://t.me/your_telegram" target="_blank" className="text-sm font-bold text-[#0088cc] hover:underline">
                                @POCKETDALE_TG
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-6">
                        <button className="pixel-btn-wood px-8 py-3" onClick={() => navigate('/auth')}>
                            НАЧАТЬ ПУТЬ
                        </button>
                        <p className="text-[10px] opacity-30">
                            © 2026 PocketDale Project. Все права защищены.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
