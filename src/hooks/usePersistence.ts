import { useState, useEffect, useCallback } from 'react';
import {
    doc,
    setDoc,
    getDoc,
    onSnapshot,
    collection,
    query,
    orderBy,
    limit
} from 'firebase/firestore';
import { db } from '../firebase';

export interface SessionData {
    sessionsCompleted: number;
    totalFocusMinutes: number;
    breakSessionsCompleted: number;
    totalBreakMinutes: number;
    date: string;
    day: number;
    month: number;
    year: number;
}

export interface UserStats {
    currentStreak: number;
    longestStreak: number;
    dailyGoalMinutes: number;
}

// Fixed document path for single-user mode (No authentication)
const USER_DOC_PATH = 'focusData/mainUser';

export const usePersistence = () => {
    const [stats, setStats] = useState<UserStats>({
        currentStreak: 0,
        longestStreak: 0,
        dailyGoalMinutes: 90
    });
    const [sessions, setSessions] = useState<Record<string, SessionData>>({});

    // Sync user profile stats
    useEffect(() => {
        const userDocRef = doc(db, USER_DOC_PATH);
        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setStats(docSnap.data() as UserStats);
            } else {
                // Initial setup for the main user document
                setDoc(userDocRef, {
                    currentStreak: 0,
                    longestStreak: 0,
                    dailyGoalMinutes: 90,
                    lastActiveDate: ''
                });
            }
        });
        return unsubscribe;
    }, []);

    // Sync session data (recent 30 days)
    useEffect(() => {
        const sessionCollRef = collection(db, USER_DOC_PATH, 'sessions');
        const q = query(sessionCollRef, orderBy('date', 'desc'), limit(31));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data: Record<string, SessionData> = {};
            querySnapshot.forEach((doc) => {
                data[doc.id] = doc.data() as SessionData;
            });
            setSessions(data);
        });
        return unsubscribe;
    }, []);

    const saveActivity = useCallback(async (minutes: number, activityType: 'focus' | 'break') => {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const sessionDocRef = doc(db, USER_DOC_PATH, 'sessions', todayStr);
        const userDocRef = doc(db, USER_DOC_PATH);

        // Update session document
        const sessionSnap = await getDoc(sessionDocRef);
        const currentSession = sessionSnap.exists()
            ? sessionSnap.data() as SessionData
            : {
                sessionsCompleted: 0,
                totalFocusMinutes: 0,
                breakSessionsCompleted: 0,
                totalBreakMinutes: 0,
                date: todayStr,
                day: now.getDate(),
                month: now.getMonth() + 1,
                year: now.getFullYear()
            };

        if (activityType === 'focus') {
            await setDoc(sessionDocRef, {
                ...currentSession,
                sessionsCompleted: currentSession.sessionsCompleted + 1,
                totalFocusMinutes: currentSession.totalFocusMinutes + minutes,
            }, { merge: true });

            // Update streak logic (only for focus)
            const userSnap = await getDoc(userDocRef);
            const userData = userSnap.data() as any;
            const lastActiveDate = userData.lastActiveDate;
            let newStreak = userData.currentStreak || 0;

            if (lastActiveDate !== todayStr) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                if (lastActiveDate === yesterdayStr) {
                    newStreak += 1;
                } else {
                    newStreak = 1;
                }

                await setDoc(userDocRef, {
                    ...userData,
                    currentStreak: newStreak,
                    longestStreak: Math.max(newStreak, userData.longestStreak || 0),
                    lastActiveDate: todayStr
                }, { merge: true });
            }
        } else {
            // It's a break
            await setDoc(sessionDocRef, {
                ...currentSession,
                breakSessionsCompleted: (currentSession.breakSessionsCompleted || 0) + 1,
                totalBreakMinutes: (currentSession.totalBreakMinutes || 0) + minutes,
            }, { merge: true });
        }
    }, []);

    return {
        stats,
        sessions,
        saveActivity
    };
};
