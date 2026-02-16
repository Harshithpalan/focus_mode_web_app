# 🧘 Focus Mode Web App

> "A premium productivity tool designed to help users maintain deep focus and track their work habits."

## 🌟 Features
- **⏱️ Smart Timer:** Adjustable modes for Focus, Short Break, and Long Break sessions.
- **🧘 Zen Mode:** A fully immersive, distraction-free full-screen experience.
- **🎵 Ambient Soundscapes:** Integrated audio mixer to drown out background noise (Rain, Forest, White Noise).
- **📊 Progress Tracking:** Visual statistics including daily focus minutes, session counts, and current streaks.
- **📅 Focus Heatmap:** GitHub-style contribution graph to visualize your productivity over time.
- **✨ Modern UI:** Smooth animations powered by Framer Motion and a responsive design using Tailwind CSS.

## 🚀 Tech Stack
- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS 4**
- **Framer Motion**
- **Canvas Confetti**
- **Lucide React**
- **Firebase** (Integration ready)

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Harshithpalan/focus_mode_web_app.git
   cd focus_mode_web_app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📂 Project Structure
```
src/
├── components/      # Reusable UI components
│   ├── Audio/       # Sound controls
│   ├── Calendar/    # Heatmap widget
│   ├── Stats/       # Daily statistics cards
│   ├── Theme/       # Dark/Light mode toggle
│   └── Timer/       # Core timer logic & display
├── hooks/           # Custom React hooks (useTimer, useAudio, usePersistence)
└── App.tsx          # Main application entry
```