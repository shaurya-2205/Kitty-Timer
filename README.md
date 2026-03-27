# 🎀 Kitty-Timer

A soft, Hello Kitty-inspired focus timer designed to make study sessions feel calmer, cuter, and more intentional.

Kitty-Timer combines a polished themed landing experience with a functional Pomodoro workflow, custom timer setup, session tracking, and playful UI details that make the app feel more like a tiny product than a basic stopwatch.

## ✨ Highlights

* **Polished Landing Experience** — Branded intro screen with themed visuals, floating background motifs, and subtle hover interactions
* **Pomodoro Timer** — Built-in focus / short break / long break cycle
* **Custom Timer Setup** — Define your own focus and break durations
* **Session Tracking** — Visual tracker for completed focus sessions
* **Mascot UI Polish** — Character state changes, hover details, and small interaction moments
* **Smooth Page Transitions** — Soft animated transitions between app views
* **Accessibility-Friendly Motion** — Reduced-motion support for users who prefer minimal animation
* **Vite-Based Setup** — Fast local development and clean production builds

## 🧭 App Flow

```text
Landing Page
   → Pomodoro Timer
   → Custom Timer Setup
   → Active Timer Session
   → Session Progress Tracking
```

## 🛠️ Tech Stack

* **Frontend:** HTML, CSS, Vanilla JavaScript
* **Build Tool:** Vite
* **State Persistence:** LocalStorage
* **Deployment:** GitHub Pages

## 🚀 Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:5173
```

## 📦 Production Build

### Build

```bash
npm run build
```

### Preview production build locally

```bash
npm run preview
```

The final production-ready files are generated in:

```text
dist/
```

## 📁 Project Structure

```text
Kitty-Timer/
├── src/
│   ├── index.html
│   ├── main.js
│   ├── js/
│   │   └── script.js
│   ├── css/
│   │   ├── styles.css
│   │   └── landing.css
│   └── assets/
├── dist/
├── public/
├── package.json
├── vite.config.js
└── README.md
```

## 🌐 Deployment

This project is configured for deployment using **GitHub Pages + GitHub Actions**.

### Deploy flow

```bash
git add .
git commit -m "Update project"
git push origin main
```

On push, the GitHub Pages workflow builds the project and deploys the production output automatically.

## 💗 Notes

This project was built as a themed frontend experience — not just to function well, but to feel charming, cohesive, and pleasant to use.
