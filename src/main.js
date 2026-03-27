import './css/styles.css';
import './css/landing.css';
import './js/script.js';
import buttonClickSound from './assets/sounds/buttonClickSound.mp3';

document.addEventListener('DOMContentLoaded', () => {
    const pageLanding = document.getElementById('page-landing');
    const pageTimer   = document.getElementById('page-timer');
    const pageCustom  = document.getElementById('page-custom-setup');
    const topBarContent = document.querySelector('.top-bar-content');

    let glareRAF = null;
    let currentGlareX = 50;
    let currentGlareY = 50;
    let targetGlareX = 50;
    let targetGlareY = 50;

    function animateHeaderGlare() {
        currentGlareX += (targetGlareX - currentGlareX) * 0.2;
        currentGlareY += (targetGlareY - currentGlareY) * 0.2;

        topBarContent?.style.setProperty('--glare-x', `${currentGlareX}%`);
        topBarContent?.style.setProperty('--glare-y', `${currentGlareY}%`);

        if (Math.abs(targetGlareX - currentGlareX) > 0.1 || Math.abs(targetGlareY - currentGlareY) > 0.1) {
            glareRAF = requestAnimationFrame(animateHeaderGlare);
        } else {
            glareRAF = null;
        }
    }

    function queueHeaderGlareAnimation() {
        if (glareRAF !== null) return;
        glareRAF = requestAnimationFrame(animateHeaderGlare);
    }

    topBarContent?.addEventListener('mouseenter', () => {
        if (!document.body.classList.contains('landing-view')) return;
        topBarContent.classList.add('is-glare-hover');
    });

    topBarContent?.addEventListener('mouseleave', () => {
        topBarContent.classList.remove('is-glare-hover');
        targetGlareX = 50;
        targetGlareY = 50;
        queueHeaderGlareAnimation();
    });

    topBarContent?.addEventListener('mousemove', (event) => {
        if (!document.body.classList.contains('landing-view')) return;

        const rect = topBarContent.getBoundingClientRect();
        targetGlareX = ((event.clientX - rect.left) / rect.width) * 100;
        targetGlareY = ((event.clientY - rect.top) / rect.height) * 100;
        queueHeaderGlareAnimation();
    });

    // ── Navigation ──────────────────────────────────
    window.navigateTo = function(pageId) {
        if (pageId === 'timer') {
            pageLanding.classList.remove('active');
            pageCustom.classList.remove('active');
            pageTimer.classList.add('active');
            document.body.classList.remove('landing-view');
            topBarContent?.classList.remove('is-glare-hover');
        } else if (pageId === 'custom-setup') {
            pageLanding.classList.remove('active');
            pageTimer.classList.remove('active');
            pageCustom.classList.add('active');
            document.body.classList.remove('landing-view');
            topBarContent?.classList.remove('is-glare-hover');
        } else {
            pageTimer.classList.remove('active');
            pageCustom.classList.remove('active');
            pageLanding.classList.add('active');
            document.body.classList.add('landing-view');
        }
    };

    // ── Landing buttons ──────────────────────────────
    document.getElementById('btn-pomodoro')?.addEventListener('click', () => {
        playButtonSoundGlobal();
        if (typeof window.selectPomodoroProfile === 'function') {
            window.selectPomodoroProfile();
        }
        window.navigateTo('timer');
    });

    document.getElementById('btn-custom')?.addEventListener('click', () => {
        playButtonSoundGlobal();
        window.navigateTo('custom-setup');
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
