import { useState, useEffect, useCallback, useRef } from 'react';

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const DURATIONS = {
    focus: 60 * 60, // 1:00:00 as requested
    shortBreak: 10 * 60,
    longBreak: 20 * 60,
};

export const useTimer = () => {
    const [mode, setMode] = useState<TimerMode>('focus');
    const [timeLeft, setTimeLeft] = useState(DURATIONS.focus);
    const [isRunning, setIsRunning] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);

    const timerRef = useRef<any>(null);

    const switchMode = useCallback((newMode: TimerMode) => {
        setMode(newMode);
        setTimeLeft(DURATIONS[newMode]);
        setIsRunning(false);
    }, []);

    const resetTimer = useCallback(() => {
        setTimeLeft(DURATIONS[mode]);
        setIsRunning(false);
    }, [mode]);

    const toggleTimer = useCallback(() => {
        setIsRunning((prev) => !prev);
    }, []);

    const completeSession = useCallback(() => {
        setIsRunning(false);
        if (mode === 'focus') {
            setSessionsCompleted((prev) => prev + 1);
            // Automatically switch to short break or long break
            const newSessions = sessionsCompleted + 1;
            if (newSessions % 4 === 0) {
                switchMode('longBreak');
            } else {
                switchMode('shortBreak');
            }
        } else {
            switchMode('focus');
        }
    }, [mode, sessionsCompleted, switchMode]);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            completeSession();
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning, timeLeft, completeSession]);

    return {
        timeLeft,
        duration: DURATIONS[mode],
        isRunning,
        mode,
        sessionsCompleted,
        toggleTimer,
        resetTimer,
        switchMode,
        completeSession
    };
};
