# 🎀 Kitty-Timer

A polished, pixel-perfect Pomodoro timer with a cozy Hello Kitty aesthetic. Stay focused, track progress, and take breaks—with style.

## ✨ Features

- **Landing Page** — Welcoming intro with adorable mascot and smooth transitions
- **Classic Pomodoro Timer** — 25-min focus / 5-min break / 15-min long break cycles
- **Custom Timer** — Create your own work/break durations
- **Session Tracker** — Visual progress indicator showing your streak
- **Mascot Interactions** — Hover animations and floating cloud whispers
- **Smooth Transitions** — Refined page navigation with subtle motion
- **Persistent Sessions** — LocalStorage saves your progress across page refreshes
- **Audio Notifications** — Gentle chime when sessions complete
- **Reduced-Motion Support** — Respects OS accessibility preferences

## 🎮 App Flow

```
Landing Page
    ↓ (Start)
Timer Page (Active Session)
    ↓ (Customize)
Custom Setup (Define work/break durations)
    ↓
Back to Timer
    ↓ (Complete sessions)
Progress tracked & saved
```

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (no frameworks)
- **Build Tool**: Vite
- **Styling**: CSS with custom properties & keyframe animations
- **Storage**: LocalStorage for session persistence
- **Deployment**: GitHub Pages

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run dev server** (hot reload enabled)
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

### Building for Production

```bash
npm run build
```

This generates optimized bundles in the `dist/` folder, ready for deployment.

## 📁 Project Structure

```
Kitty-Timer/
├── src/
│   ├── index.html        ← App entry point
│   ├── main.js           ← Navigation & page transitions
│   ├── js/
│   │   └── script.js     ← Timer logic & state
│   ├── css/
│   │   ├── styles.css    ← Main stylesheet
│   │   └── landing.css   ← Landing page styles
│   └── assets/
│       ├── images/       ← Mascot & icons
│       └── sounds/       ← Audio files
├── dist/                 ← Build output (generated)
├── public/               ← Static assets
├── package.json
├── vite.config.js
└── README.md
```

## 🌐 Deployment

### Deploy to GitHub Pages

1. **Configure `vite.config.js`** (already set up for `/Kitty-Timer/` base path)

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy: Kitty-Timer v1"
   git push origin main
   ```

3. **Enable GitHub Pages** in repo settings:
   - Go to **Settings** → **Pages**
   - Under "Build and deployment", select **GitHub Actions**
   - Vite will auto-build and deploy on push

4. Your app is live at `https://<username>.github.io/Kitty-Timer/`

---

**Built with care, pastel colors, and the spirit of focus.** 🍓✨