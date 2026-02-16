import React from 'react';
import { CloudRain, Trees, Wind, Coffee, VolumeX, Volume2 } from 'lucide-react';
import type { SoundTheme } from '../../hooks/useAudio';
import AmbientButton from './AmbientButton';

interface AmbientSoundSelectorProps {
    currentTheme: SoundTheme;
    onThemeChange: (theme: SoundTheme) => void;
    volume: number;
    onVolumeChange: (volume: number) => void;
}

const AmbientSoundSelector: React.FC<AmbientSoundSelectorProps> = ({
    currentTheme,
    onThemeChange,
    volume,
    onVolumeChange
}) => {
    // Mapping themes to variants and icons
    const themes: { id: SoundTheme; icon: React.ReactNode; label: string, variant: 'white' | 'green' | 'indigo' | 'red' }[] = [
        { id: 'none', icon: <VolumeX />, label: 'None', variant: 'white' },
        { id: 'rain', icon: <CloudRain />, label: 'Rain', variant: 'indigo' },
        { id: 'forest', icon: <Trees />, label: 'Forest', variant: 'green' },
        { id: 'white-noise', icon: <Wind />, label: 'Zen', variant: 'green' }, // Mapping 'white-noise' (Zen) to green as per "forest zen"
        { id: 'cafe', icon: <Coffee />, label: 'Café', variant: 'red' },
    ];

    return (
        <div className="flex flex-col items-center gap-8 w-full">
            <div className="flex flex-wrap items-center justify-center gap-6">
                {themes.map((theme) => (
                    <AmbientButton
                        key={theme.id}
                        variant={theme.variant}
                        isActive={currentTheme === theme.id}
                        onClick={() => onThemeChange(theme.id)}
                        title={theme.label}
                    >
                        {theme.icon}
                    </AmbientButton>
                ))}
            </div>

            <div className="flex items-center gap-4 w-full max-w-xs px-4 mt-2">
                <Volume2 size={16} className="text-brand-text-muted" />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                />
            </div>
        </div>
    );
};

export default AmbientSoundSelector;
