import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen">
            {/* 1. HERO SECTION - Tropical & Magical */}
            <header className="lush-hero flex flex-col items-center justify-center pt-24 px-6 text-center text-white">
                {/* Decorative Assets Placeholders */}
                <div className="floating-leaf" style={{ top: '15%', left: '10%', animationDelay: '0s' }}></div>
                <div className="floating-leaf" style={{ top: '25%', right: '15%', animationDelay: '1s' }}></div>
                <div className="floating-leaf" style={{ bottom: '40%', left: '20%', animationDelay: '2s' }}></div>

                <div className="relative z-10 max-w-4xl">
                    <h1 className="text-4xl md:text-7xl font-black mb-6 text-outline tracking-tight uppercase">
                        Pocket Dale
                    </h1>
                    <p className="text-lg md:text-2xl mb-12 font-bold bg-white/20 backdrop-blur-md inline-block px-6 py-2 rounded-full shadow-lg">
                        🏝 Когда выживание — это забота
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                        <button className="btn-playful" onClick={() => navigate('/auth')}>
                            Начать Приключение
                        </button>
                        <button className="btn-ghost">
                            Смотреть Трейлер
                        </button>
                    </div>
                </div>

                {/* Parallax Layers - User to replace with illustrations */}
                <div className="parallax-layer opacity-40" style={{ backgroundColor: '#27ae60', height: '10%' }}></div>
                <div className="parallax-layer opacity-60" style={{ backgroundColor: '#2ecc71', height: '5%', marginBottom: '5%' }}></div>
            </header>

            {/* 2. PHILOSOPHY - Symbiosis */}
            <section className="py-24 px-6 bg-white overflow-hidden" id="about">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <div className="relative">
                            {/* Asset Placeholder: Character Hug Illustration (500x500) */}
                            <div className="w-full aspect-square bg-[#fab1a0]/10 rounded-full flex items-center justify-center border-4 border-dashed border-[#fab1a0]">
                                <p className="text-[#fab1a0] font-bold text-center p-8 uppercase">
                                    Иллюстрация: <br /> Симбиоз и объятия
                                </p>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black mb-8 text-[#2d3436]">
                                🫂 Ты мне нужен...
                            </h2>
                            <p className="text-lg leading-relaxed text-[#636e72] mb-10">
                                В большинстве игр вы просто бегаете рядом. В Pocket Dale вы <b>зависите</b> друг от друга.
                                Одиночество пугает — экран темнеет, а руки персонажа начинают дрожать.
                                Лекарство? Просто обнимите друга.
                            </p>
                            <div className=" news-item">
                                <p className="font-bold">✨ Забота лечит</p>
                                <p className="text-sm">Полей друга из лейки, потри ему спину — и вы оба получите заряд бодрости на весь день!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. FEATURES - Pinterest Grid */}
            <section className="py-24 px-6 bg-[#f1f2f6]">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-4">Жизнь в кармане</h2>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Ваши возможности на архипелаге</p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="cozy-card">
                        <div className="w-16 h-16 bg-[#55efc4] rounded-2xl mb-8 flex items-center justify-center text-white text-2xl">🚽</div>
                        <h3 className="text-xl font-bold mb-4">Физиология</h3>
                        <p className="text-sm text-gray-600 leading-loose">
                            Чистота открывает двери. Грязнулю не пустят в магазин! Следите за собой, чтобы не попасть в "конфуз".
                        </p>
                    </div>
                    <div className="cozy-card">
                        <div className="w-16 h-16 bg-[#a29bfe] rounded-2xl mb-8 flex items-center justify-center text-white text-2xl">💍</div>
                        <h3 className="text-xl font-bold mb-4">Романтика</h3>
                        <p className="text-sm text-gray-600 leading-loose">
                            Влюбились? Подарите "Кольцо Обещания" и получите боевые баффы от силы вашей любви.
                        </p>
                    </div>
                    <div className="cozy-card">
                        <div className="w-16 h-16 bg-[#fab1a0] rounded-2xl mb-8 flex items-center justify-center text-white text-2xl">🚣</div>
                        <h3 className="text-xl font-bold mb-4">Экспедиции</h3>
                        <p className="text-sm text-gray-600 leading-loose">
                            Каждый раз карта меняется. Садитесь в лодку и плывите в неизведанное за редкими ресурсами.
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. NEWS & BLOG - The "Pinterest" Feed */}
            <section className="py-24 px-6 bg-white" id="blog">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black mb-4">Вести с Архипелага</h2>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Последние обновления и гайды</p>
                        </div>
                        <button className="text-primary font-bold hover:underline">Все новости →</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex gap-6 items-start p-6 hover:bg-gray-50 rounded-[2rem] transition-colors cursor-pointer">
                            <div className="w-32 h-32 bg-gray-200 rounded-3xl shrink-0"></div>
                            <div>
                                <span className="text-[10px] text-primary font-bold uppercase">Обновление</span>
                                <h4 className="font-bold my-2">Свадьбы на утесе и новые костюмы</h4>
                                <p className="text-xs text-gray-500">Добавлена возможность играть свадьбы с NPC и друзьями...</p>
                                <p className="text-[10px] mt-4 opacity-40">24 Января, 2026</p>
                            </div>
                        </div>
                        <div className="flex gap-6 items-start p-6 hover:bg-gray-50 rounded-[2rem] transition-colors cursor-pointer">
                            <div className="w-32 h-32 bg-gray-200 rounded-3xl shrink-0"></div>
                            <div>
                                <span className="text-[10px] text-secondary font-bold uppercase">Гайд</span>
                                <h4 className="font-bold my-2">Как правильно тереть спину другу</h4>
                                <p className="text-xs text-gray-500">Максимизируем заряд бодрости на весь день с помощью лейки...</p>
                                <p className="text-[10px] mt-4 opacity-40">22 Января, 2026</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. FOOTER */}
            <footer className="py-20 bg-[#2d3436] text-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h3 className="text-3xl font-black mb-8">Присоединяйся к нам</h3>
                    <div className="flex justify-center gap-6 mb-12">
                        <button className="bg-[#0088cc] px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform">
                            Telegram
                        </button>
                        <button className="bg-[#5865F2] px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform">
                            Discord
                        </button>
                    </div>
                    <p className="text-sm opacity-40 max-w-md mx-auto">
                        © 2026 POCKET DALE. Уютный мир в вашем браузере. Сделано с любовью к симбиозу.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
