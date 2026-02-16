import { useState, useEffect, useRef, useCallback } from 'react';

export type SoundTheme = 'none' | 'rain' | 'forest' | 'white-noise' | 'cafe';

const SOUND_URLS: Record<Exclude<SoundTheme, 'none'>, string> = {
    rain: 'https://actions.google.com/sounds/v1/weather/rain_on_roof.ogg',
    forest: 'https://actions.google.com/sounds/v1/ambiences/forest_ambience.ogg',
    'white-noise': 'https://actions.google.com/sounds/v1/ambiences/white_noise.ogg',
    cafe: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
};

const NOTIFICATION_SOUND = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';

export const useAudio = (isRunning: boolean) => {
    const [theme, setTheme] = useState<SoundTheme>('none');
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const notificationRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        notificationRef.current = new Audio(NOTIFICATION_SOUND);
    }, []);

    const playNotification = useCallback(() => {
        if (notificationRef.current) {
            notificationRef.current.volume = 0.5;
            notificationRef.current.play().catch(e => console.log('Audio play failed:', e));
        }
    }, []);

    useEffect(() => {
        if (theme !== 'none' && isRunning) {
            if (!audioRef.current) {
                audioRef.current = new Audio(SOUND_URLS[theme]);
                audioRef.current.loop = true;
            } else {
                audioRef.current.src = SOUND_URLS[theme];
            }
            audioRef.current.volume = volume;
            audioRef.current.play().catch(e => console.log('Audio play failed:', e));
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        }
    }, [theme, isRunning]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    return {
        theme,
        setTheme,
        volume,
        setVolume,
        playNotification
    };
};
