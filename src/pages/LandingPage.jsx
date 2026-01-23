import React from 'react';
import { PixelHeading } from '../components/ui/PixelUI';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        { title: "Минералы", icon: "nes-icon diamond is-medium" },
        { title: "Существа", icon: "nes-icon ghost is-medium" },
        { title: "Оружие", icon: "nes-icon sword is-medium" },
        { title: "Места", icon: "nes-icon map is-medium" },
        { title: "Насекомые", icon: "nes-icon bug is-medium" },
        { title: "Рыбы", icon: "nes-icon fish is-medium" },
        { title: "Растения", icon: "nes-icon leaf is-medium" },
        { title: "Достижения", icon: "nes-icon trophy is-medium" }
    ];

    return (
        <div className="min-h-screen py-10 px-4 flex flex-col items-center justify-center">
            {/* Background decoration - optional game character or floating elements */}
            <div className="absolute top-10 right-10 animate-bounce">
                <i className="nes-icon star is-large"></i>
            </div>

            <div className="book-container">
                {/* LEFT PAGE - HERO & LORE */}
                <div className="book-page pixel-paper flex flex-col items-center justify-center text-center p-8">
                    <div className="mb-10">
                        <PixelHeading className="text-4xl md:text-5xl mb-4 text-[#5e4125]">
                            PocketDale
                        </PixelHeading>
                        <div className="w-32 h-1 bg-[#5e4125] mx-auto mb-6 opacity-30"></div>

                        {/* Character Preview */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="bg-[#5e4125]/10 p-4 rounded-lg border-2 border-[#5e4125]/20">
                                <i className="nes-jp-logo scale-150"></i>
                            </div>
                        </div>

                        <PixelHeading level={2} className="text-xl md:text-2xl mb-4 text-[#5e4125]">
                            Выживай. Строй. Исследуй.
                        </PixelHeading>

                        <p className="text-sm md:text-base leading-relaxed text-[#3b2d1c] mb-8 font-serif">
                            "Ваша шхуна разбилась в щепки о скалы таинственного острова. Океан выбросил тебя на берег с пустыми руками.
                            Сможешь ли ты покорить эти земли?"
                        </p>

                        <div className="flex flex-col gap-4 mt-auto">
                            <button className="wood-button text-sm" onClick={() => navigate('/auth')}>
                                ИГРАТЬ СЕЙЧАС
                            </button>
                            <button className="nes-btn is-warning text-[10px]" onClick={() => navigate('/polls')}>
                                ГОЛОСОВАНИЕ
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT PAGE - FEATURES/COLLECTIONS */}
                <div className="book-page pixel-paper p-8">
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-8">
                            <PixelHeading level={3} className="text-lg text-[#5e4125]">Коллекции</PixelHeading>
                            <i className="nes-icon close is-small opacity-30"></i>
                        </div>

                        <p className="text-[10px] text-[#3b2d1c] mb-8 text-center uppercase tracking-widest font-bold">
                            выберите категорию для просмотра вашей коллекции
                        </p>

                        <div className="grid grid-cols-3 gap-6 flex-grow">
                            {features.map((f, i) => (
                                <div key={i} className="flex flex-col items-center justify-center gap-2 hover:bg-[#5e4125]/5 p-2 transition-colors cursor-pointer border border-transparent hover:border-[#5e4125]/20">
                                    <i className={f.icon}></i>
                                    <span className="text-[8px] font-bold text-[#5e4125] text-center">{f.title}</span>
                                </div>
                            ))}
                        </div>

                        {/* Footer with Telegram */}
                        <div className="mt-12 pt-6 border-t border-[#5e4125]/20 flex flex-col items-center text-center gap-4">
                            <div className="flex items-center gap-2">
                                <i className="nes-icon whatsapp is-small !text-[#0088cc]"></i> {/* Using WA icon for TG as NES lacks original TG */}
                                <a href="https://t.me/your_telegram" target="_blank" className="text-[10px] text-[#0088cc] font-bold hover:underline">
                                    @POCKETDALE_TG
                                </a>
                            </div>
                            <p className="text-[8px] opacity-60">© 2026. Сделано с любовью к пикселям.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
