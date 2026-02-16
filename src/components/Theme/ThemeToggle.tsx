import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2.5 bg-white dark:bg-gray-800 rounded-xl transition-all border border-gray-200 dark:border-gray-700 shadow-sm text-brand-text dark:text-gray-300 hover:text-brand-text dark:hover:text-white"
        >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </motion.button>
    );
};

export default ThemeToggle;
