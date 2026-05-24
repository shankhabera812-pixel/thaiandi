/**
 * Hero Carousel
 * 5-slide crossfade, 5s autoplay, 0.8s fade, reduced-motion fallback
 */
(function () {
  'use strict';

  const AUTOPLAY_INTERVAL = 5000;
  const PAUSE_AFTER_MANUAL = 12000;

  function initCarousel() {
    const carousel = document.querySelector('.hero-slides');
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
    const dots   = Array.from(document.querySelectorAll('.hero-dot'));
    const prev   = document.querySelector('.hero-arrow--prev');
    const next   = document.querySelector('.hero-arrow--next');

    if (!slides.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let current  = 0;
    let timer    = null;
    let paused   = false;
    let pauseTimeout = null;

    function goTo(index, focus) {
      slides[current].classList.remove('is-active');
      dots[current]?.classList.remove('is-active');

      current = (index + slides.length) % slides.length;

      slides[current].classList.add('is-active');
      dots[current]?.classList.add('is-active');

      if (focus) slides[current].setAttribute('tabindex', '0');
    }

    function startAutoplay() {
      if (prefersReducedMotion) return;
      stopAutoplay();
      timer = setInterval(() => {
        if (!paused) goTo(current + 1);
      }, AUTOPLAY_INTERVAL);
    }

    function stopAutoplay() {
      clearInterval(timer);
      timer = null;
    }

    function pauseTemporarily() {
      clearTimeout(pauseTimeout);
      paused = true;
      pauseTimeout = setTimeout(() => {
        paused = false;
      }, PAUSE_AFTER_MANUAL);
    }

    // Arrow buttons
    prev?.addEventListener('click', () => {
      goTo(current - 1);
      pauseTemporarily();
    });
    next?.addEventListener('click', () => {
      goTo(current + 1);
      pauseTemporarily();
    });

    // Dot buttons
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goTo(i);
        pauseTemporarily();
      });
    });

    // Keyboard support
    document.querySelector('.hero')?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { goTo(current - 1); pauseTemporarily(); }
      if (e.key === 'ArrowRight') { goTo(current + 1); pauseTemporarily(); }
    });

    // Pause on hover/focus (hero area)
    const heroEl = document.querySelector('.hero');
    heroEl?.addEventListener('mouseenter', () => { paused = true; });
    heroEl?.addEventListener('mouseleave', () => { paused = false; });
    heroEl?.addEventListener('focusin',    () => { paused = true; });
    heroEl?.addEventListener('focusout',   () => { paused = false; });

    // Touch swipe
    let touchStartX = 0;
    heroEl?.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    heroEl?.addEventListener('touchend',   (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        goTo(dx < 0 ? current + 1 : current - 1);
        pauseTemporarily();
      }
    });

    // Init
    goTo(0);
    startAutoplay();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
  } else {
    initCarousel();
  }
})();
