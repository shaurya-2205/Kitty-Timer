# 🎀 Hello Kitty Study Timer

A super cute, cozy, and stress-free Pomodoro study timer with a Hello Kitty aesthetic!

![Preview](docs/assets/images/kitty_study.png)

## ✨ Features

- 🕐 **25-minute Focus Sessions** with pastel-red theme
- 🍵 **5-minute Short Breaks** with calming green theme
- 💤 **15-minute Long Breaks** after 4 study sessions
- 🍓 **Strawberry Tracker** — watch your progress fill up!
- 🎉 **Confetti Celebration** when you finish a session
- 🔔 **Chime Notification** via Web Audio API
- ⭐ **Floating Star Animations** in the background
- 💾 **LocalStorage Persistence** — your streak survives page refresh

## 🚀 Live Demo

> After deploying to GitHub Pages, your app will be live at:
> `https://<your-username>.github.io/HelloKitty/`

## 🛠️ How to Deploy on GitHub Pages

1. **Push this repo** to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Hello Kitty Study Timer 🎀"
   git branch -M main
   git remote add origin https://github.com/<your-username>/HelloKitty.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repo on GitHub → **Settings** → **Pages**
   - Under **Source**, select **Deploy from a branch**
   - Set the branch to `main` and the folder to `/docs`
   - Click **Save**

3. Your site will be live in a few minutes at `https://<your-username>.github.io/HelloKitty/`

## 🧪 Testing Locally

You can test locally by running a simple HTTP server:

```bash
cd docs
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

### ⏩ Fast Forward (Debug)

Don't want to wait 25 minutes? After clicking **Start**, open the browser console (`F12` → Console) and type:

```js
fastForward()
```

The timer will jump to 2 seconds remaining!

## 📁 Project Structure

```
HelloKitty/
├── docs/                  ← GitHub Pages serves from here
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── script.js
│   └── assets/
│       └── images/
│           ├── kitty_study.png
│           ├── kitty_tea.png
│           └── kitty_head.png
├── src/                   ← Development source (mirrors docs/)
├── Design Specification.txt
├── Technical Prerequisites.txt
├── workflow.txt
├── README.md
└── .gitignore
```

## 💖 Credits

Built with love, pastel colors, and lots of 🍓