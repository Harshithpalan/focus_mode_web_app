import React from 'react';
import { motion } from 'framer-motion';

interface CircularTimerProps {
    timeLeft: number;
    duration: number;
    mode: 'focus' | 'shortBreak' | 'longBreak';
}

const CircularTimer: React.FC<CircularTimerProps> = ({ timeLeft, duration, mode }) => {
    const percentage = (timeLeft / duration) * 100;
    const radius = 140;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getModeColor = () => {
        switch (mode) {
            case 'focus': return 'var(--color-brand-focus)';
            case 'shortBreak': return 'var(--color-brand-break-short)';
            case 'longBreak': return 'var(--color-brand-break-long)';
            default: return 'var(--color-brand-focus)';
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 300 300">
                <circle
                    cx="150"
                    cy="150"
                    r={radius}
                    fill="none"
                    stroke="rgba(0,0,0,0.03)"
                    strokeWidth="8"
                />
                {/* Progress Circle */}
                <motion.circle
                    cx="150"
                    cy="150"
                    r={radius}
                    fill="none"
                    stroke={getModeColor()}
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.5, ease: "linear" }}
                    style={{
                        strokeDasharray: circumference,
                    }}
                />
            </svg>

            {/* Time Display */}
            <div className="z-10 text-center">
                <motion.div
                    key={timeLeft}
                    initial={{ opacity: 0.8, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-7xl font-light tracking-tighter text-brand-text tabular-nums"
                >
                    {formatTime(timeLeft)}
                </motion.div>
                <div className="text-xs text-brand-text-muted mt-2 tracking-widest uppercase font-medium opacity-60">
                    {mode === 'focus' ? 'Focus Session' : 'Break Time'}
                </div>
            </div>

            {/* Subtle Glow */}
            <div
                className="absolute inset-0 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000"
                style={{ backgroundColor: getModeColor() }}
            />
        </div>
    );
};

export default CircularTimer;
