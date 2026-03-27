import './css/styles.css';
import './css/landing.css';
import './js/script.js';
import buttonClickSound from './assets/sounds/buttonClickSound.mp3';

document.addEventListener('DOMContentLoaded', () => {
    const pageLanding = document.getElementById('page-landing');
    const pageTimer   = document.getElementById('page-timer');
    const pageCustom  = document.getElementById('page-custom-setup');
    const topBarContent = document.querySelector('.top-bar-content');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const PAGE_TRANSITION_MS = 220;

    let isPageTransitioning = false;
    let queuedPageId = null;

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

    function resolvePage(pageId) {
        if (pageId === 'timer') return pageTimer;
        if (pageId === 'custom-setup') return pageCustom;
        return pageLanding;
    }

    function applyPageViewState(pageId) {
        if (pageId === 'landing') {
            document.body.classList.add('landing-view');
            return;
        }

        document.body.classList.remove('landing-view');
        topBarContent?.classList.remove('is-glare-hover');
    }

    function completeQueuedNavigation() {
        if (!queuedPageId) return;

        const nextQueued = queuedPageId;
        queuedPageId = null;
        window.navigateTo(nextQueued);
    }

    function cleanupPageTransitionClasses() {
        pageLanding.classList.remove('page-enter', 'page-exit');
        pageTimer.classList.remove('page-enter', 'page-exit');
        pageCustom.classList.remove('page-enter', 'page-exit');
    }

    // ── Navigation ──────────────────────────────────
    window.navigateTo = function(pageId, options = {}) {
        const destination = resolvePage(pageId);
        const current = document.querySelector('.page.active');
        const skipAnimation = options.skipAnimation === true || prefersReducedMotion.matches;

        applyPageViewState(pageId);

        if (current === destination) {
            return;
        }

        if (isPageTransitioning) {
            queuedPageId = pageId;
            return;
        }

        cleanupPageTransitionClasses();

        if (skipAnimation) {
            current?.classList.remove('active');
            destination.classList.add('active');
            return;
        }

        isPageTransitioning = true;

        if (current) {
            current.classList.add('page-exit');
        }

        setTimeout(() => {
            current?.classList.remove('active', 'page-exit');
            destination.classList.add('active', 'page-enter');

            setTimeout(() => {
                destination.classList.remove('page-enter');
                isPageTransitioning = false;
                completeQueuedNavigation();
            }, PAGE_TRANSITION_MS);
        }, PAGE_TRANSITION_MS);
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
    window.navigateTo('landing', { skipAnimation: true });
});

// Shared audio helper (used by landing & timer)
window.playButtonSoundGlobal = function() {
    try {
        const snd = new Audio(buttonClickSound);
        snd.volume = 0.5;
        snd.play().catch(() => {});
    } catch (_) {}
};
