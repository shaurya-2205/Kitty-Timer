/* 🎀 Hello Kitty Study Timer Logic 🎀 */

// --- Constants & Config ---
const CONFIG = {
    STUDY_TIME: 25 * 60, // 25 minutes
    SHORT_BREAK: 5 * 60,  // 5 minutes
    LONG_BREAK: 15 * 60, // 15 minutes
    SESSIONS_BEFORE_LONG_BREAK: 4
};

const MODES = {
    STUDY: 'study',
    SHORT_BREAK: 'short-break',
    LONG_BREAK: 'long-break'
};

// --- State ---
let state = {
    timer: null,
    timeLeft: CONFIG.STUDY_TIME,
    isActive: false,
    currentMode: MODES.STUDY,
    sessionCount: 0 // Completed study sessions
};

// --- DOM Elements ---
const el = {
    timeText: document.getElementById('timeText'),
    sessionText: document.getElementById('sessionText'),
    startBtn: document.getElementById('startBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    resetBtn: document.getElementById('resetBtn'),
    mascotImage: document.getElementById('mascotImage'),
    timerCard: document.getElementById('timerCard'),
    progressRect: document.getElementById('progressRect'),
    strawberries: document.querySelectorAll('.strawberry'),
    body: document.body
};

// --- Progress Setup ---
let SVGRectLength = 0;

function setupSVGProgress() {
    SVGRectLength = el.progressRect.getTotalLength();
    el.progressRect.style.strokeDasharray = `${SVGRectLength} ${SVGRectLength}`;
    el.progressRect.style.strokeDashoffset = SVGRectLength; // Start empty (or trace back)
}

function setProgress(percent) {
    if(!SVGRectLength) setupSVGProgress();
    const offset = SVGRectLength - (percent / 100) * SVGRectLength;
    el.progressRect.style.strokeDashoffset = offset;
}

// --- Initialization ---
function init() {
    setupSVGProgress();
    loadState();
    updateDisplay();
    updateStrawberryTracker();
    updateButtonsState();
    createStars();
    
    // Event Listeners
    el.startBtn.addEventListener('click', startTimer);
    el.pauseBtn.addEventListener('click', pauseTimer);
    el.resetBtn.addEventListener('click', resetTimer);
    
    // Developer tool to fast forward time
    window.fastForward = () => { if(state.isActive) { state.timeLeft = 2; } };
}

// --- Persistence ---
function saveState() {
    localStorage.setItem('kittyTimerState', JSON.stringify({
        sessionCount: state.sessionCount
    }));
}

function loadState() {
    const saved = localStorage.getItem('kittyTimerState');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            state.sessionCount = parsed.sessionCount || 0;
            if (state.sessionCount >= CONFIG.SESSIONS_BEFORE_LONG_BREAK) {
                state.sessionCount = 0;
            }
        } catch (e) { console.error('Error loading state'); }
    }
}

// --- Timer Logic ---
function startTimer() {
    if (state.isActive) return;
    state.isActive = true;
    
    updateButtonsState();
    
    state.timer = setInterval(() => {
        state.timeLeft--;
        updateDisplay();
        
        if (state.timeLeft <= 0) {
            handleSessionEnd();
        }
    }, 1000);
}

function pauseTimer() {
    if (!state.isActive) return;
    
    state.isActive = false;
    clearInterval(state.timer);
    updateButtonsState();
}

function resetTimer() {
    pauseTimer();
    setMode(MODES.STUDY);
}

// --- Dynamic Buttons Mapping ---
function updateButtonsState() {
    if (state.isActive) {
        // Running: Pause (Pink) | Reset (Blue) | Start (Gray/Disabled)
        el.startBtn.className = 'btn btn-gray disabled-btn';
        el.startBtn.disabled = true;
        
        el.pauseBtn.className = 'btn btn-pink';
        el.pauseBtn.disabled = false;
        
        el.resetBtn.className = 'btn btn-blue';
        el.resetBtn.disabled = false;
    } else {
        // Paused/Idle: Pause (Gray/Disabled) | Reset (Blue) | Start (Pink)
        el.startBtn.className = 'btn btn-pink';
        el.startBtn.disabled = false;
        
        el.pauseBtn.className = 'btn btn-gray disabled-btn';
        el.pauseBtn.disabled = true;
        
        el.resetBtn.className = 'btn btn-blue';
        el.resetBtn.disabled = false;
    }
}


// --- Session End Logic ---
function handleSessionEnd() {
    pauseTimer();
    playNotificationSound();
    
    if (state.currentMode === MODES.STUDY) {
        state.sessionCount++;
        saveState();
        updateStrawberryTracker();
        triggerConfetti();
        
        if (state.sessionCount >= CONFIG.SESSIONS_BEFORE_LONG_BREAK) {
            setMode(MODES.LONG_BREAK);
        } else {
            setMode(MODES.SHORT_BREAK);
        }
    } else {
        if (state.currentMode === MODES.LONG_BREAK) {
            state.sessionCount = 0;
            saveState();
            updateStrawberryTracker();
        }
        setMode(MODES.STUDY);
    }
}

// --- Mode Switching ---
function setMode(newMode) {
    state.currentMode = newMode;
    el.body.className = `mode-${newMode}`;
    
    switch (newMode) {
        case MODES.STUDY:
            state.timeLeft = CONFIG.STUDY_TIME;
            el.sessionText.textContent = `Focus Session: ${(state.sessionCount % 4) + 1} / 4`;
            el.mascotImage.src = "assets/images/kitty_study.png";
            el.mascotImage.className = "mascot-image mascot-idle";
            break;
        case MODES.SHORT_BREAK:
            state.timeLeft = CONFIG.SHORT_BREAK;
            el.sessionText.textContent = "Enjoy your break! 🍵";
            el.mascotImage.src = "assets/images/kitty_tea.png";
            el.mascotImage.className = "mascot-image mascot-tea";
            break;
        case MODES.LONG_BREAK:
            state.timeLeft = CONFIG.LONG_BREAK;
            el.sessionText.textContent = "Mega Rest Session! 💤";
            el.mascotImage.src = "assets/images/kitty_tea.png";
            el.mascotImage.className = "mascot-image mascot-tea";
            break;
    }
    
    updateDisplay();
}

// --- UI Updates ---
function updateDisplay() {
    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    el.timeText.textContent = timeString;
    document.title = `(${timeString}) Hello Kitty Timer`;
    
    // Ensure header title is accurate as we initialize
    if (state.currentMode === MODES.STUDY && el.sessionText.textContent.includes("Session")) {
        el.sessionText.textContent = `Focus Session: ${(state.sessionCount % 4) + 1} / 4`;
    }
    
    let totalTime;
    if (state.currentMode === MODES.STUDY) totalTime = CONFIG.STUDY_TIME;
    else if (state.currentMode === MODES.SHORT_BREAK) totalTime = CONFIG.SHORT_BREAK;
    else totalTime = CONFIG.LONG_BREAK;
    
    const percentage = ((totalTime - state.timeLeft) / totalTime) * 100;
    setProgress(Math.max(0, Math.min(100, percentage)));
}

function updateStrawberryTracker() {
    el.strawberries.forEach((strawberry, index) => {
        if (index < state.sessionCount) {
            strawberry.classList.remove('empty');
            strawberry.style.transform = 'scale(1.1)';
            setTimeout(() => strawberry.style.transform = '', 300);
        } else {
            strawberry.classList.add('empty');
        }
    });
}

function triggerConfetti() {
    if (typeof confetti === 'function') {
        const duration = 2500;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 4,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#FFB6C1', '#FFFFFF', '#FFEA98']
            });
            confetti({
                particleCount: 4,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#FFB6C1', '#FFFFFF', '#FFEA98']
            });

            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    }
}

function playNotificationSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1.5);
    } catch (e) { }
}

function createStars() {
    const container = document.getElementById('starsContainer');
    const colors = ['yellow', 'purple', 'yellow', 'green', 'yellow'];
    
    for (let i = 0; i < 12; i++) {
        const star = document.createElement('div');
        star.className = `star ${colors[i % colors.length]}`;
        
        star.style.left = `${10 + Math.random() * 80}%`;
        star.style.top = `${10 + Math.random() * 80}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(star);
    }
}

document.addEventListener('DOMContentLoaded', init);
