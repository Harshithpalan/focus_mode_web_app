import React from 'react';
import StatsButton from './StatsButton';

interface DailyStatsProps {
    totalMinutes: number;
    sessionsCompleted: number;
    streak: number;
}

const DailyStats: React.FC<DailyStatsProps> = ({ totalMinutes, sessionsCompleted, streak }) => {
    const stats = [
        { label: 'Focus Time', value: `${Math.round(totalMinutes)}m`, icon: '⏱️' },
        { label: 'Sessions', value: sessionsCompleted.toString(), icon: '✅' },
        { label: 'Streak', value: `${streak}d`, icon: '🔥' }
    ];

    return (
        <section className="grid grid-cols-3 gap-4 w-full">
            {stats.map((stat, index) => (
                <StatsButton
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    icon={stat.icon}
                />
            ))}
        </section>
    );
};

export default DailyStats;
