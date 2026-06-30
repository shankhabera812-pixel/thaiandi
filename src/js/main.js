/**
 * Main — Thai & I
 * Sticky nav, scroll reveal, mobile menu, back-to-top, active nav link
 */
(function () {
  'use strict';

  /* ── Sticky header ─────────────────────────────────────── */
  function initStickyNav() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Active nav link ────────────────────────────────────── */
  function initActiveNav() {
    const sections = Array.from(document.querySelectorAll('section[id], .hero[id]'));
    const navLinks  = Array.from(document.querySelectorAll('.header-nav a[href^="#"]'));

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => observer.observe(s));
  }

  /* ── Mobile nav ─────────────────────────────────────────── */
  function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    if (!hamburger || !mobileNav) return;

    const HEADER_HEIGHT = 80;
    let isOpen = false;

    function openNav() {
      isOpen = true;
      mobileNav.classList.add('is-open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      isOpen = false;
      mobileNav.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => isOpen ? closeNav() : openNav());

    // Close on link click — handle in-page anchor scrolling here directly.
    // initHashScroll skips mobile-nav links to avoid double-handling and
    // incorrect getBoundingClientRect() calls while the overlay is mid-transition.
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        const isHash = href && href.startsWith('#') && href.length > 1;

        if (isHash) {
          e.preventDefault();
          closeNav();
          // Delay scroll until overlay begins fading (CSS transition: 500ms).
          // 320ms gives the overlay enough time to start closing so
          // getBoundingClientRect() returns the correct position.
          setTimeout(() => {
            const target = document.querySelector(href);
            if (!target) return;
            const top = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
            window.scrollTo({ top, behavior: 'smooth' });
          }, 320);
        } else {
          closeNav();
        }
      });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) closeNav();
    });
  }

  /* ── Scroll reveal ──────────────────────────────────────── */
  function initReveal() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => observer.observe(el));
  }

  /* ── Back to top ────────────────────────────────────────── */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Testimonials mobile slider ─────────────────────────── */
  function initTestimonialsSlider() {
    const cards   = Array.from(document.querySelectorAll('.testimonial-card'));
    const prevBtn = document.querySelector('.testimonials-mobile-btn--prev');
    const nextBtn = document.querySelector('.testimonials-mobile-btn--next');
    if (!cards.length || !prevBtn) return;

    let current = 0;

    function show(i) {
      cards.forEach(c => c.classList.remove('is-active'));
      current = (i + cards.length) % cards.length;
      cards[current].classList.add('is-active');
    }

    prevBtn?.addEventListener('click', () => show(current - 1));
    nextBtn?.addEventListener('click', () => show(current + 1));

    // Show first card
    cards[0].classList.add('is-active');
  }

  /* ── Smooth hash scroll ─────────────────────────────────── */
  function initHashScroll() {
    const HEADER_HEIGHT = 80;
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      // Mobile nav links manage their own close + scroll sequence — skip them here.
      if (a.closest('.mobile-nav')) return;
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    initStickyNav();
    initActiveNav();
    initMobileNav();
    initReveal();
    initBackToTop();
    initTestimonialsSlider();
    initHashScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
