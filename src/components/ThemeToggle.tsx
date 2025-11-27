"use client";
import React, { useEffect, useState } from 'react';
import { GlassButton } from './GlassButton';

export const ThemeToggle = () => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <GlassButton
            variant="secondary"
            onClick={toggleTheme}
            style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}
        >
            {theme === 'dark' ? '☀️' : '🌙'}
        </GlassButton>
    );
};
