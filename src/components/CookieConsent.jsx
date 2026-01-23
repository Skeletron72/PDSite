import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500); // Delay appearance
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookie-consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-[9999] animate-fade-in-up">
            <div className="bg-white/80 dark:bg-[#2d3436]/90 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-2xl p-6 relative">
                <button
                    onClick={acceptCookies}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-[#fdcb6e]/20 rounded-xl">
                        <Cookie className="w-6 h-6 text-[#fdcb6e]" />
                    </div>
                    <div>
                        <h4 className="font-black text-sm uppercase tracking-wider mb-1 text-[#2d3436] dark:text-white">Печеньки?</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed">
                            Мы используем куки, чтобы сделать ваше приключение на Архипелаге уютнее.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={acceptCookies}
                        className="flex-1 bg-[#55efc4] hover:bg-[#00b894] text-[#2d3436] font-bold text-xs uppercase py-3 rounded-xl transition-colors shadow-sm"
                    >
                        Вкусно! (Принять)
                    </button>
                    <button
                        onClick={acceptCookies}
                        className="px-4 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600 text-gray-400 dark:text-gray-500 font-bold text-xs uppercase rounded-xl transition-all"
                    >
                        Скрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
