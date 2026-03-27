/* 🎀 Hello Kitty Study Timer Logic 🎀 */

// --- Constants & Config ---
const DEFAULT_PROFILE = Object.freeze({
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    sessionsBeforeLongBreak: 4
});

const CUSTOM_LIMITS = Object.freeze({
    focusMinutes: { min: 5, max: 180 },
    shortBreakMinutes: { min: 1, max: 60 },
    longBreakMinutes: { min: 5, max: 90 },
    sessionsBeforeLongBreak: { min: 2, max: 6 }
});

const MAX_TRACKER_VISUAL = 6;

const MODES = {
    STUDY: 'study',
    SHORT_BREAK: 'short-break',
    LONG_BREAK: 'long-break'
};

// --- State ---
let activeProfile = { ...DEFAULT_PROFILE };

let state = {
    timer: null,
    timeLeft: DEFAULT_PROFILE.focusMinutes * 60,
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
    customFocusInput: document.getElementById('customFocusInput'),
    customShortBreakInput: document.getElementById('customShortBreakInput'),
    customLongBreakInput: document.getElementById('customLongBreakInput'),
    customSessionsInput: document.getElementById('customSessionsInput'),
    customApplyBtn: document.getElementById('customApplyBtn'),
    customBackBtn: document.getElementById('customBackBtn'),
    customSetupError: document.getElementById('customSetupError'),
    mascotImage: document.getElementById('mascotImage'),
    timerCard: document.getElementById('timerCard'),
    progressRect: document.getElementById('progressRect'),
    tracker: document.getElementById('tracker'),
    body: document.body,
    preloader: document.getElementById('preloader')
};

// --- Asset URLs (resolved by Vite from HTML — safe in production) ---
// Vite transforms src attributes in index.html to hashed URLs at build time.
// Capturing them here means JS never needs a hardcoded path.
const ASSETS = {
    kittyStudy: null, // set in init() after DOM is ready
    kittyTea: null,
};

// --- Progress Setup ---
let SVGRectLength = 0;

function getModeDuration(mode) {
    if (mode === MODES.STUDY) return activeProfile.focusMinutes * 60;
    if (mode === MODES.SHORT_BREAK) return activeProfile.shortBreakMinutes * 60;
    return activeProfile.longBreakMinutes * 60;
}

function getTrackerVisualCount() {
    return Math.min(activeProfile.sessionsBeforeLongBreak, MAX_TRACKER_VISUAL);
}

function normalizeProfile(profile) {
    return {
        focusMinutes: Number(profile.focusMinutes),
        shortBreakMinutes: Number(profile.shortBreakMinutes),
        longBreakMinutes: Number(profile.longBreakMinutes),
        sessionsBeforeLongBreak: Number(profile.sessionsBeforeLongBreak)
    };
}

function validateCustomProfile(profile) {
    const normalized = normalizeProfile(profile);
    const errors = [];

    const checks = [
        ['focusMinutes', 'Focus duration'],
        ['shortBreakMinutes', 'Short break duration'],
        ['longBreakMinutes', 'Long break duration'],
        ['sessionsBeforeLongBreak', 'Sessions before long break']
    ];

    for (const [key, label] of checks) {
        const value = normalized[key];
        const limits = CUSTOM_LIMITS[key];

        if (!Number.isInteger(value)) {
            errors.push(`${label} must be a whole number.`);
            continue;
        }

        if (value < limits.min || value > limits.max) {
            errors.push(`${label} must be between ${limits.min} and ${limits.max}.`);
        }
    }

    return {
        valid: errors.length === 0,
        profile: normalized,
        errors
    };
}

function persistCustomProfile(profile) {
    localStorage.setItem('kittyCustomProfile', JSON.stringify(profile));
}

function loadCustomProfile() {
    const saved = localStorage.getItem('kittyCustomProfile');
    if (!saved) return { ...DEFAULT_PROFILE };

    try {
        const parsed = JSON.parse(saved);
        const validated = validateCustomProfile(parsed);
        return validated.valid ? validated.profile : { ...DEFAULT_PROFILE };
    } catch (_) {
        return { ...DEFAULT_PROFILE };
    }
}

function fillCustomForm(profile) {
    if (!el.customFocusInput) return;

    el.customFocusInput.value = profile.focusMinutes;
    el.customShortBreakInput.value = profile.shortBreakMinutes;
    el.customLongBreakInput.value = profile.longBreakMinutes;
    el.customSessionsInput.value = profile.sessionsBeforeLongBreak;
}

function clearCustomError() {
    if (el.customSetupError) el.customSetupError.textContent = '';
}

function showCustomError(errors) {
    if (!el.customSetupError) return;
    el.customSetupError.textContent = errors.join(' ');
}

function readCustomFormProfile() {
    return {
        focusMinutes: Number(el.customFocusInput?.value),
        shortBreakMinutes: Number(el.customShortBreakInput?.value),
        longBreakMinutes: Number(el.customLongBreakInput?.value),
        sessionsBeforeLongBreak: Number(el.customSessionsInput?.value)
    };
}

function applyTimerProfile(profile) {
    activeProfile = { ...profile };
    resetTimer();
}

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
    // Cache the Vite-resolved URLs from the img element Vite already transformed
    // in index.html. These are the real hashed paths that work in production.
    ASSETS.kittyStudy = el.mascotImage.src; // initial src set in HTML = kitty_study

    // Derive the kitty_tea URL from the kitty_study URL (same folder, same hash pattern)
    // We do this by loading a temporary Image so Vite's import meta can be used,
    // OR we simply use a data attribute on a hidden img in the HTML.
    // Simplest: read from a hidden <img> tag we'll add to index.html.
    const teaRef = document.getElementById('mascotTeaRef');
    ASSETS.kittyTea = teaRef ? teaRef.src : ASSETS.kittyStudy;

    setupSVGProgress();
    loadState();
    fillCustomForm(loadCustomProfile());
    el.body.className = `mode-${state.currentMode}`;
    updateDisplay();
    updateStrawberryTracker();
    updateButtonsState();
    updateMascotState();
    el.mascotImage.classList.add('mascot-enter');
    setTimeout(() => {
        el.mascotImage.classList.remove('mascot-enter');
    }, 1100);
    createStars();
    finalizePreloader();
    
    // Event Listeners
    el.startBtn.addEventListener('click', () => { playButtonSound(); startTimer(); });
    el.pauseBtn.addEventListener('click', () => { playButtonSound(); pauseTimer(); });
    el.resetBtn.addEventListener('click', () => { playButtonSound(); resetTimer(); });

    el.customApplyBtn?.addEventListener('click', () => {
        playButtonSound();
        const result = validateCustomProfile(readCustomFormProfile());

        if (!result.valid) {
            showCustomError(result.errors);
            return;
        }

        clearCustomError();
        persistCustomProfile(result.profile);
        applyTimerProfile(result.profile);
        if (typeof window.navigateTo === 'function') {
            window.navigateTo('timer');
        }
    });

    el.customBackBtn?.addEventListener('click', () => {
        playButtonSound();
        clearCustomError();
        fillCustomForm(loadCustomProfile());
        if (typeof window.navigateTo === 'function') {
            window.navigateTo('landing');
        }
    });

    window.selectPomodoroProfile = function() {
        clearCustomError();
        applyTimerProfile(DEFAULT_PROFILE);
    };
    
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
    // Fresh-start behavior: do not restore previous session count on reload.
    state.sessionCount = 0;
    saveState();
}

// --- Timer Logic ---
function startTimer() {
    if (state.isActive) return;
    state.isActive = true;
    
    updateButtonsState();
    updateMascotState();
    
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
    updateMascotState();
}

function resetTimer() {
    pauseTimer();
    state.sessionCount = 0;
    saveState();
    updateStrawberryTracker();
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
        
        if (state.sessionCount >= activeProfile.sessionsBeforeLongBreak) {
            setMode(MODES.LONG_BREAK);
        } else {
            setMode(MODES.SHORT_BREAK);
        }
        celebrateMascotBriefly();
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
            state.timeLeft = getModeDuration(MODES.STUDY);
            el.sessionText.textContent = `Focus Session: ${(state.sessionCount % activeProfile.sessionsBeforeLongBreak) + 1} / ${activeProfile.sessionsBeforeLongBreak}`;
            el.mascotImage.src = ASSETS.kittyStudy; // Use Vite-resolved URL
            break;
        case MODES.SHORT_BREAK:
            state.timeLeft = getModeDuration(MODES.SHORT_BREAK);
            el.sessionText.textContent = "Enjoy your break! 🍵";
            el.mascotImage.src = ASSETS.kittyTea; // Use Vite-resolved URL
            break;
        case MODES.LONG_BREAK:
            state.timeLeft = getModeDuration(MODES.LONG_BREAK);
            el.sessionText.textContent = "Mega Rest Session! 💤";
            el.mascotImage.src = ASSETS.kittyTea; // Use Vite-resolved URL
            break;
    }

    updateMascotState();
    
    updateDisplay();
}

// --- UI Updates ---
function renderTimeDisplay(timeString) {
    const chars = [...timeString];
    const nodes = Array.from(el.timeText.children);

    // Keep the existing span structure and only update text content per tick.
    // This prevents re-creating nodes and replaying entrance animations.
    if (nodes.length === chars.length) {
        for (let i = 0; i < chars.length; i++) {
            nodes[i].textContent = chars[i];
        }
        return;
    }

    const fragment = document.createDocumentFragment();
    for (const ch of chars) {
        const span = document.createElement('span');
        span.className = ch === ':' ? 'time-colon' : 'time-digit';
        span.textContent = ch;
        fragment.appendChild(span);
    }

    el.timeText.textContent = '';
    el.timeText.appendChild(fragment);
}

function updateDisplay() {
    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    renderTimeDisplay(timeString);
    document.title = `(${timeString}) Hello Kitty Timer`;
    
    // Ensure header title is accurate as we initialize
    if (state.currentMode === MODES.STUDY && el.sessionText.textContent.includes("Session")) {
        el.sessionText.textContent = `Focus Session: ${(state.sessionCount % activeProfile.sessionsBeforeLongBreak) + 1} / ${activeProfile.sessionsBeforeLongBreak}`;
    }

    const totalTime = getModeDuration(state.currentMode);
    
    const percentage = ((totalTime - state.timeLeft) / totalTime) * 100;
    setProgress(Math.max(0, Math.min(100, percentage)));
}

function updateMascotState() {
    const visualState = state.currentMode === MODES.STUDY
        ? (state.isActive ? 'bounce' : 'idle')
        : 'tea';

    const nextClassName = `mascot-image mascot-${visualState}`;
    const currentState = el.mascotImage.getAttribute('data-state');

    // Avoid re-applying the same class/state; that would restart CSS animation timelines.
    if (currentState === visualState && el.mascotImage.className === nextClassName) {
        return;
    }

    el.mascotImage.className = nextClassName;
    el.mascotImage.setAttribute('data-state', visualState);
}

function celebrateMascotBriefly() {
    el.mascotImage.className = 'mascot-image mascot-celebrate';
    el.mascotImage.setAttribute('data-state', 'celebrate');

    setTimeout(() => {
        updateMascotState();
    }, 700);
}

function finalizePreloader() {
    if (!el.preloader) return;

    setTimeout(() => {
        if (el.preloader && el.preloader.parentNode) {
            el.preloader.parentNode.removeChild(el.preloader);
        }
    }, 2200);
}

function updateStrawberryTracker() {
    if (!el.tracker) return;

    const visualCount = getTrackerVisualCount();
    el.tracker.style.width = `${Math.max(200, visualCount * 34)}px`;
    const currentWraps = el.tracker.querySelectorAll('.strawberry-wrap');

    if (currentWraps.length !== visualCount) {
        el.tracker.textContent = '';
        for (let i = 0; i < visualCount; i++) {
            const wrap = document.createElement('div');
            wrap.className = 'strawberry-wrap';

            const img = document.createElement('img');
            img.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍓</text></svg>";
            img.className = 'strawberry empty';
            img.alt = '🍓';

            wrap.appendChild(img);
            el.tracker.appendChild(wrap);
        }
    }

    const strawberries = el.tracker.querySelectorAll('.strawberry');
    strawberries.forEach((strawberry, index) => {
        if (index < state.sessionCount) {
            strawberry.classList.remove('empty');
            strawberry.style.transform = 'scale(1.1)';
            setTimeout(() => { strawberry.style.transform = ''; }, 300);
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

// --- Audio ---
// buttonClickSound is imported and played by main.js (which has access to
// Vite's asset pipeline). script.js delegates to the global helper.
function playButtonSound() {
    if (typeof window.playButtonSoundGlobal === 'function') {
        window.playButtonSoundGlobal();
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
    const colors = ['yellow', 'purple', 'yellow', 'green', 'yellow', 'purple'];
    const motifCount = 18;

    // Keep motifs away from the central hero zone (cards, mascot, buttons).
    // These edge slots create a fuller but still background-safe distribution.
    const safeEdgeSlots = [
        { left: [4, 14], top: [6, 16] },
        { left: [18, 28], top: [5, 13] },
        { left: [32, 42], top: [4, 12] },
        { left: [58, 68], top: [4, 12] },
        { left: [72, 82], top: [5, 13] },
        { left: [86, 96], top: [6, 16] },
        { left: [3, 10], top: [24, 36] },
        { left: [90, 97], top: [24, 36] },
        { left: [2, 9], top: [42, 56] },
        { left: [91, 98], top: [42, 56] },
        { left: [3, 10], top: [60, 74] },
        { left: [90, 97], top: [60, 74] },
        { left: [5, 15], top: [84, 94] },
        { left: [19, 30], top: [86, 95] },
        { left: [33, 44], top: [88, 96] },
        { left: [56, 67], top: [88, 96] },
        { left: [70, 81], top: [86, 95] },
        { left: [85, 95], top: [84, 94] }
    ];

    for (let i = 0; i < motifCount; i++) {
        const star = document.createElement('div');
        star.className = `star ${colors[i % colors.length]}`;
        const slot = safeEdgeSlots[i % safeEdgeSlots.length];
        star.style.left = `${slot.left[0] + Math.random() * (slot.left[1] - slot.left[0])}%`;
        star.style.top = `${slot.top[0] + Math.random() * (slot.top[1] - slot.top[0])}%`;
        star.style.animationDelay = `${Math.random() * 8}s`;
        star.style.setProperty('--motif-size', `${14 + Math.random() * 9}px`);
        star.style.setProperty('--motif-opacity-min', `${0.20 + Math.random() * 0.12}`);
        star.style.setProperty('--motif-opacity-max', `${0.33 + Math.random() * 0.15}`);
        star.style.setProperty('--motif-duration', `${9 + Math.random() * 6}s`);
        star.style.setProperty('--motif-drift', `${3 + Math.random() * 4}px`);
        star.style.setProperty('--motif-rotate', `${2 + Math.random() * 3}deg`);
        
        container.appendChild(star);
    }
}

document.addEventListener('DOMContentLoaded', init);
