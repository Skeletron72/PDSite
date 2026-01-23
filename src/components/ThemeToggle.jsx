import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Check system preference or saved theme
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        setIsAnimating(true);
        const newTheme = !isDark;
        setIsDark(newTheme);

        if (newTheme) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }

        setTimeout(() => setIsAnimating(false), 500); // Reset animation state
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 transition-colors hover:ring-2 hover:ring-[#55efc4] focus:outline-none overflow-hidden"
            aria-label="Toggle Theme"
        >
            <div className={`absolute transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${isDark ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`}>
                <Sun className="w-5 h-5 text-[#ffa502]" fill="#ffa502" />
            </div>
            <div className={`absolute transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${isDark ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'}`}>
                <Moon className="w-5 h-5 text-[#f1f2f6]" fill="#f1f2f6" />
            </div>

            {/* Click Ripple Effect */}
            {isAnimating && (
                <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
            )}
        </button>
    );
};

export default ThemeToggle;
