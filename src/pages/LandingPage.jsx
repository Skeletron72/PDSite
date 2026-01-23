import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen">
            {/* 1. HERO SECTION */}
            <header className="lush-hero flex flex-col items-center justify-center pt-24 px-6 text-center text-white">
                {/* Floating Effects */}
                <div className="floating-leaf" style={{ top: '15%', left: '10%', animationDelay: '0s' }}></div>
                <div className="floating-leaf" style={{ top: '25%', right: '15%', animationDelay: '1s' }}></div>
                <div className="floating-leaf" style={{ bottom: '40%', left: '20%', animationDelay: '2s' }}></div>

                <div className="relative z-20 max-w-4xl">
                    <h1 className="text-4xl md:text-7xl font-black mb-6 text-outline tracking-tight uppercase">
                        Pocket Dale
                    </h1>
                    <p className="text-sm md:text-xl mb-12 font-bold bg-white/20 backdrop-blur-md inline-block px-8 py-3 rounded-full shadow-lg border-2 border-white/30">
                        🏝 Уютное приключение, где друзья всегда рядом
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                        <button className="btn-playful" onClick={() => navigate('/auth')}>
                            Начать игру
                        </button>
                        <button className="btn-ghost">
                            Смотреть трейлер
                        </button>
                    </div>
                </div>

                {/* Real Parallax Layers */}
                <div className="parallax-layer layer-rocks animate-float" style={{ animationDuration: '8s' }}></div>
                <div className="parallax-layer layer-jungle animate-float" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
            </header>

            {/* 2. PHILOSOPHY - Вместе лучше */}
            <section className="py-24 px-6 bg-white overflow-hidden" id="about">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <div className="relative">
                            {/* Asset Placeholder: Illustration */}
                            <div className="w-full aspect-square bg-[#fab1a0]/10 rounded-[3rem] flex items-center justify-center border-4 border-dashed border-[#fab1a0]/30 overflow-hidden">
                                <div className="text-center p-12">
                                    <p className="text-[#fab1a0] font-black text-2xl mb-4 uppercase">Картинка:</p>
                                    <p className="text-gray-400 text-sm font-bold">Симбиоз и совместное строительство</p>
                                </div>
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
                            <div className="news-item shadow-sm">
                                <p className="font-black text-xl mb-2">✨ Сила дружбы</p>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Помогайте друг другу в строительстве, готовьте ужин для всей команды и обустраивайте быт.
                                    В нашей игре важен вклад каждого.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. FEATURES */}
            <section className="py-24 px-6 bg-[#f7f9fb]">
                <div className="max-w-7xl mx-auto text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter">Жизнь на Архипелаге</h2>
                    <div className="w-32 h-2 bg-primary mx-auto rounded-full"></div>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="cozy-card">
                        <div className="w-20 h-20 bg-[#55efc4] rounded-3xl mb-8 flex items-center justify-center text-3xl shadow-lg shadow-[#55efc4]/40">🏠</div>
                        <h3 className="text-2xl font-black mb-4">Уют и Дом</h3>
                        <p className="text-sm text-gray-600 leading-loose">
                            Превратите дикий остров в райский уголок. Стройте, украшайте и следите за комфортом своего персонажа —
                            счастливый герой лучше справляется с трудностями.
                        </p>
                    </div>
                    <div className="cozy-card">
                        <div className="w-20 h-20 bg-[#a29bfe] rounded-3xl mb-8 flex items-center justify-center text-3xl shadow-lg shadow-[#a29bfe]/40">💖</div>
                        <h3 className="text-2xl font-black mb-4">Отношения</h3>
                        <p className="text-sm text-gray-600 leading-loose">
                            Заводите друзей среди жителей острова или найдите любовь среди других игроков.
                            Крепкие узы и «Кольцо Обещания» дадут вам особые силы в совместных приключениях.
                        </p>
                    </div>
                    <div className="cozy-card">
                        <div className="w-20 h-20 bg-[#fab1a0] rounded-3xl mb-8 flex items-center justify-center text-3xl shadow-lg shadow-[#fab1a0]/40">⛵</div>
                        <h3 className="text-2xl font-black mb-4">Бесконечный Мир</h3>
                        <p className="text-sm text-gray-600 leading-loose">
                            Ваш домашний остров — это тихая гавань. Но стоит сесть в лодку, и вас ждет постоянно меняющийся архипелаг
                            с древними руинами, сокровищами и тайнами.
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. NEWS / BLOG PREVIEW */}
            <section className="py-24 px-6 bg-white" id="blog">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter">Вести с Архипелага</h2>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Последние обновления и гайды</p>
                        </div>
                        <button className="btn-playful scale-90" onClick={() => navigate('/blog')}>Читать все ←</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="flex flex-col sm:flex-row gap-8 items-center p-8 bg-[#fdfdfd] border-2 border-gray-50 rounded-[2.5rem] hover:border-primary/20 transition-all cursor-pointer group">
                            <div className="w-32 h-32 bg-gray-100 rounded-3xl shrink-0 flex items-center justify-center text-[8px] font-black text-gray-300 uppercase p-4 text-center">
                                Картинка новости 1
                            </div>
                            <div>
                                <span className="text-[10px] bg-[#55efc4]/20 text-[#00b894] px-3 py-1 rounded-full font-black uppercase mb-4 inline-block">Обновление</span>
                                <h4 className="text-xl font-black mb-3 group-hover:text-primary transition-colors">Свадьбы на утесе и новые костюмы</h4>
                                <p className="text-sm text-gray-500 leading-relaxed">Добавлена возможность играть пышные свадьбы с NPC и друзьями, а также праздничный декор.</p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-8 items-center p-8 bg-[#fdfdfd] border-2 border-gray-50 rounded-[2.5rem] hover:border-secondary/20 transition-all cursor-pointer group">
                            <div className="w-32 h-32 bg-gray-100 rounded-3xl shrink-0 flex items-center justify-center text-[8px] font-black text-gray-300 uppercase p-4 text-center">
                                Картинка новости 2
                            </div>
                            <div>
                                <span className="text-[10px] bg-[#81ecec]/20 text-[#00cec9] px-3 py-1 rounded-full font-black uppercase mb-4 inline-block">Гайд</span>
                                <h4 className="text-xl font-black mb-3 group-hover:text-secondary transition-colors">Секреты походной кухни</h4>
                                <p className="text-sm text-gray-500 leading-relaxed">Какие блюда лучше всего взять в подземелье, чтобы восстановить силы всей группе...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. FOOTER */}
            <footer className="py-24 bg-[#2d3436] text-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h3 className="text-4xl font-black mb-12 uppercase">Присоединяйся к нам</h3>
                    <div className="flex flex-wrap justify-center gap-6 mb-16">
                        <button className="bg-[#0088cc] px-10 py-4 rounded-full font-black text-sm hover:scale-105 transition-transform shadow-lg shadow-[#0088cc]/30">
                            TELEGRAM
                        </button>
                        <button className="bg-[#5865F2] px-10 py-4 rounded-full font-black text-sm hover:scale-105 transition-transform shadow-lg shadow-[#5865F2]/30">
                            DISCORD
                        </button>
                    </div>
                    <div className="w-24 h-1 bg-white/10 mx-auto mb-10"></div>
                    <p className="text-xs opacity-50 max-w-lg mx-auto leading-loose">
                        © 2026 POCKET DALE. Уютный мир в вашем браузере. <br />
                        Сделано с любовью к приключениям.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
