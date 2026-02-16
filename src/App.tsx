import { useState, useEffect } from 'react'
import { Maximize2, Play, Pause, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { format, isSameDay } from 'date-fns'

// Components
import CircularTimer from './components/Timer/CircularTimer'
import AmbientSoundSelector from './components/Audio/AmbientSoundSelector'
import DailyStats from './components/Stats/DailyStats'
import FocusHeatmap from './components/Calendar/FocusHeatmap'
import ThemeToggle from './components/Theme/ThemeToggle'
import ModeButton from './components/Timer/ModeButton'
import GradientButton from './components/Timer/GradientButton'

// Hooks
import { useTimer, type TimerMode } from './hooks/useTimer'
import { useAudio } from './hooks/useAudio'
import { usePersistence } from './hooks/usePersistence'

const MeditationLogo = () => (
  <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
    <circle cx="100" cy="55" r="25" fill="currentColor" opacity="0.9" />
    <path d="M100 85C85 85 55 100 55 125C55 140 70 145 100 145C130 145 145 140 145 125C145 100 115 85 100 85Z" fill="currentColor" opacity="0.8" />
    <path d="M45 145C30 145 20 160 20 170C20 180 50 185 100 185C150 185 180 180 180 170C180 160 170 145 155 145" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    <circle cx="45" cy="145" r="8" fill="currentColor" />
    <circle cx="155" cy="145" r="8" fill="currentColor" />
  </svg>
);

function App() {
  const [isZenMode, setIsZenMode] = useState(false)
  const [selectedDay, setSelectedDay] = useState(format(new Date(), 'yyyy-MM-dd'))

  // Core Logic Hooks
  const {
    timeLeft,
    duration,
    isRunning,
    mode,
    toggleTimer,
    resetTimer,
    switchMode
  } = useTimer()

  const {
    theme,
    setTheme,
    volume,
    setVolume,
    playNotification
  } = useAudio(isRunning)

  const { stats, sessions, saveActivity } = usePersistence()

  // Handle Session Completion
  useEffect(() => {
    if (timeLeft === 0) {
      playNotification()
      if (mode === 'focus') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#A8C5DA', '#FFFFFF', '#D8E2DC']
        })
        saveActivity(duration / 60, 'focus')
      } else {
        saveActivity(duration / 60, 'break')
      }
    }
  }, [timeLeft, mode, duration, playNotification, saveActivity])

  const getModeLabel = (m: TimerMode) => {
    switch (m) {
      case 'focus': return 'Focus'
      case 'shortBreak': return 'Short Break'
      case 'longBreak': return 'Long Break'
    }
  }

  // Immersive Focus Mode Effect
  const isDeepFocus = isZenMode && isRunning

  // Calculate selected day stats
  const selectedDayData = sessions[selectedDay] || { totalFocusMinutes: 0, sessionsCompleted: 0 }

  return (
    <div className={`flex items-center justify-center min-h-screen w-full transition-all duration-1000 ${isZenMode ? 'cursor-none bg-black/40' : ''}`}>
      {/* Deep Focus Blur Overlay */}
      <AnimatePresence>
        {isDeepFocus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-3xl z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className={`app-frame ${isZenMode ? 'border-none shadow-none bg-transparent' : ''}`}>
        {/* Header - Inside the Frame */}
        {!isZenMode && (
          <header className="flex items-center justify-between px-10 py-8 w-full z-20">
            <div className="flex items-center gap-4">
              <div className="text-brand-text dark:text-blue-400 hover:scale-110 transition-transform duration-500">
                <MeditationLogo />
              </div>
              <h1 className="text-xl font-black tracking-tight text-brand-text dark:text-white uppercase tracking-[0.2em]">Focus Mode</h1>
            </div>

            <nav className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={() => setIsZenMode(true)}
                className="p-3 bg-white/5 dark:bg-white/5 rounded-xl border border-white/10 shadow-sm text-brand-text-muted hover:text-white hover-scale"
              >
                <Maximize2 size={20} />
              </button>
            </nav>
          </header>
        )}

        {/* Main Content Grid */}
        <main className={`flex-1 p-10 pt-0 w-full z-20 transition-all duration-1000 ${isZenMode ? 'flex flex-col items-center justify-center' : ''}`}>
          <div className={isZenMode ? 'flex flex-col items-center gap-16' : 'grid grid-cols-1 lg:grid-cols-[1.85fr_1fr] gap-10 items-start'}>

            {/* Left Column: Timer & Controls (65% approx) */}
            <div className="flex flex-col items-center gap-12 w-full">
              <section className="flex flex-col items-center gap-12 w-full">
                {!isZenMode && (
                  <div className="flex flex-wrap justify-center gap-6 p-2 rounded-[32px] bg-white/5 border border-white/5 backdrop-blur-md shadow-2xl">
                    {(['focus', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
                      <ModeButton
                        key={m}
                        label={getModeLabel(m)}
                        isActive={mode === m}
                        onClick={() => switchMode(m)}
                        mode={m}
                      />
                    ))}
                  </div>
                )}

                <div className="relative flex flex-col items-center">
                  <CircularTimer timeLeft={timeLeft} duration={duration} mode={mode} />

                  <div className="mt-12 flex items-center gap-6">
                    <GradientButton
                      label={isRunning ? 'PAUSE' : 'START SESSION'}
                      onClick={toggleTimer}
                      icon={isRunning ? <Pause size={20} /> : <Play size={20} />}
                    />

                    {!isZenMode && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={resetTimer}
                        className="p-6 bg-white/5 text-white rounded-full border border-white/10 hover:bg-white/10 transition-all shadow-xl hover-scale"
                      >
                        <RotateCcw size={24} />
                      </motion.button>
                    )}
                  </div>
                </div>
              </section>

              {/* Stats & Audio */}
              {!isZenMode && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div className="flex flex-col gap-4">
                    <div className="px-6 py-2 bg-blue-500/10 rounded-xl border border-blue-500/20 w-fit">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                        Stats for {isSameDay(new Date(selectedDay + 'T00:00:00'), new Date()) ? 'Today' : format(new Date(selectedDay + 'T00:00:00'), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <DailyStats
                      totalMinutes={selectedDayData.totalFocusMinutes}
                      sessionsCompleted={selectedDayData.sessionsCompleted}
                      streak={stats.currentStreak}
                    />
                  </div>
                  <AmbientSoundSelector
                    currentTheme={theme}
                    onThemeChange={setTheme}
                    volume={volume}
                    onVolumeChange={setVolume}
                  />
                </motion.div>
              )}
            </div>

            {/* Right Column: Calendar Widget (35% approx) */}
            {!isZenMode && (
              <aside className="w-full flex justify-center lg:justify-end">
                <FocusHeatmap
                  sessions={sessions}
                  selectedDate={selectedDay}
                  onSelectDate={setSelectedDay}
                />
              </aside>
            )}
          </div>
        </main>

        {/* Zen Mode Exit & Indicator */}
        <AnimatePresence>
          {isZenMode && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed top-20 left-1/2 -translate-x-1/2 text-white/30 uppercase tracking-[0.8em] text-[10px] font-black z-[60]"
              >
                Deep Work in Progress
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60]"
              >
                <button
                  onClick={() => setIsZenMode(false)}
                  className="px-12 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-white/40 hover:text-white transition-all text-[10px] tracking-[0.4em] uppercase font-black hover-scale shadow-2xl"
                >
                  Exit Session
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {!isZenMode && (
          <footer className="py-10 px-8 flex flex-col items-center gap-4">
            <p className="text-center text-white/10 text-[8px] font-black tracking-[0.4em] uppercase">
              Designed for Focus & Intentionality
            </p>
            <div className="text-[9px] text-white/20 hover:text-white/40 transition-colors">
              <a href="https://iconscout.com/3d-icons/man-doing-meditation" className="underline" target="_blank" rel="noopener noreferrer">Man Doing Meditation</a> by <a href="https://iconscout.com/contributors/orenjistudio" className="underline" target="_blank" rel="noopener noreferrer">Orenji Studio</a> on <a href="https://iconscout.com" className="underline" target="_blank" rel="noopener noreferrer">IconScout</a>
            </div>
          </footer>
        )}
      </div>
    </div>
  )
}

export default App
