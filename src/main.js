import './css/styles.css';
import './css/landing.css';
import './js/script.js';
import buttonClickSound from './assets/sounds/buttonClickSound.mp3';

document.addEventListener('DOMContentLoaded', () => {
    const pageLanding = document.getElementById('page-landing');
    const pageTimer   = document.getElementById('page-timer');

    // ── Navigation ──────────────────────────────────
    window.navigateTo = function(pageId) {
        if (pageId === 'timer') {
            pageLanding.classList.remove('active');
            pageTimer.classList.add('active');
        } else {
            pageTimer.classList.remove('active');
            pageLanding.classList.add('active');
        }
    };

    // ── Landing buttons ──────────────────────────────
    document.getElementById('btn-pomodoro')?.addEventListener('click', () => {
        playButtonSoundGlobal();
        window.navigateTo('timer');
    });

    document.getElementById('btn-custom')?.addEventListener('click', () => {
        playButtonSoundGlobal();
        alert('Custom Timer coming soon! 🎀');
    });

    // ── Back button ──────────────────────────────────
    document.getElementById('backBtn')?.addEventListener('click', () => {
        playButtonSoundGlobal();
        window.navigateTo('landing');
    });

    // Start on landing
    window.navigateTo('landing');
});

// Shared audio helper (used by landing & timer)
window.playButtonSoundGlobal = function() {
    try {
        const snd = new Audio(buttonClickSound);
        snd.volume = 0.5;
        snd.play().catch(() => {});
    } catch (_) {}
};
