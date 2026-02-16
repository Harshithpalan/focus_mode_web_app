import React, { useState } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    eachDayOfInterval
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { SessionData } from '../../hooks/usePersistence';

interface FocusHeatmapProps {
    sessions: Record<string, SessionData>;
    selectedDate: string;
    onSelectDate: (date: string) => void;
}

const FocusHeatmap: React.FC<FocusHeatmapProps> = ({ sessions, selectedDate, onSelectDate }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const onPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const onNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const getDayColor = (day: Date) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const session = sessions[dateStr];
        if (!session || session.sessionsCompleted === 0) return 'color-empty';
        if (session.sessionsCompleted >= 4) return 'color-scale-4';
        if (session.sessionsCompleted >= 2) return 'color-scale-2';
        return 'color-scale-1';
    };

    return (
        <div className="w-full max-w-[280px] rounded-[24px] bg-white/5 backdrop-blur-3xl border border-white/10 p-4 shadow-2xl transition-all duration-300">
            {/* Header with Month/Year Selection */}
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex flex-col">
                    <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em]">
                        {format(currentMonth, 'MMMM')}
                    </h3>
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-none">
                        {format(currentMonth, 'yyyy')}
                    </span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onPrevMonth}
                        className="p-2 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all hover-scale"
                        title="Previous Month"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={onNextMonth}
                        className="p-2 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all hover-scale"
                        title="Next Month"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Weekday labels */}
            <div className="grid grid-cols-7 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-center text-[9px] font-black text-white/30 uppercase tracking-tighter">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5">
                {days.map((day, i) => {
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isSelected = selectedDate === dateStr;
                    const isToday = isSameDay(day, new Date());
                    const colorClass = getDayColor(day);

                    return (
                        <button
                            key={i}
                            onClick={() => onSelectDate(dateStr)}
                            className={`
                aspect-square flex flex-col items-center justify-center rounded-lg text-[10px] font-black transition-all cursor-pointer relative group
                ${!isCurrentMonth ? 'opacity-10 pointer-events-none' : 'hover:scale-110'}
                ${colorClass}
                ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0f172a] shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10' : ''}
                ${isToday && !isSelected ? 'border border-white/20' : ''}
              `}
                        >
                            <span className={`
                ${isCurrentMonth ? 'text-white' : 'text-white/20'}
                ${isSelected ? 'text-blue-500 scale-125' : ''}
              `}>
                                {format(day, 'd')}
                            </span>

                            {/* Tooltip hint on hover */}
                            {isCurrentMonth && sessions[dateStr]?.sessionsCompleted > 0 && (
                                <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_5px_rgba(59,130,246,1)]" />
                            )}
                        </button>
                    );
                })}
            </div>

            <style>{`
        .color-empty { background: rgba(255,255,255,0.03); }
        .color-scale-1 { background: rgba(59, 130, 246, 0.2); }
        .color-scale-2 { background: rgba(59, 130, 246, 0.4); }
        .color-scale-4 { background: rgba(59, 130, 246, 0.7); box-shadow: 0 0 10px rgba(59, 130, 246, 0.3); }
        
        /* Light mode overrides handled by global CSS or specific selectors if needed */
        .light .color-empty { background: rgba(0,0,0,0.05); }
        .light .color-scale-1 { background: #dbeafe; }
        .light .color-scale-2 { background: #93c5fd; }
        .light .color-scale-4 { background: #3b82f6; }
      `}</style>
        </div>
    );
};

export default FocusHeatmap;
