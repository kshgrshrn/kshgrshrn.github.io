const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const dataSaver = navigator.connection?.saveData === true;

function closeMenu() {
  mobileNav?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open navigation');
  if (menuButton) menuButton.querySelector('b').textContent = '+';
}

menuButton?.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menuButton.querySelector('b').textContent = open ? '×' : '+';
});
mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => {
  if (!mobileNav?.contains(event.target) && !menuButton?.contains(event.target)) closeMenu();
});

document.querySelector('#year').textContent = new Date().getFullYear();

function setupScroll() {
  if (motionPreference.matches || dataSaver || !window.Lenis) return;
  const lenis = new Lenis({ anchors: true, lerp: 0.1, smoothWheel: true });
  if (window.gsap && window.ScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
}

function setupAnimations() {
  if (motionPreference.matches || dataSaver || !window.gsap) return;
  const { gsap, ScrollTrigger } = window;
  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero-top', { y: -15, autoAlpha: 0, duration: .7 })
    .from('.hero-lead', { y: 20, autoAlpha: 0, duration: .7 }, '-=.35')
    .from('.hero h1 span, .hero h1 strong', { yPercent: 38, autoAlpha: 0, stagger: .12, duration: 1.05 }, '-=.4')
    .from('.hero-description', { y: 25, autoAlpha: 0, duration: .8 }, '-=.55')
    .from('.hero-foot', { autoAlpha: 0, duration: .7 }, '-=.35');

  if (!ScrollTrigger) return;
  document.querySelectorAll('.section-caption, .work-item, .proof-heading, .proof-list article, .profile-heading, .profile-copy, .closing').forEach(element => {
    gsap.from(element, {
      y: 32, autoAlpha: 0, duration: .8, ease: 'power2.out',
      scrollTrigger: { trigger: element, start: 'top 88%', once: true }
    });
  });
  gsap.to('.hero-grid', {
    yPercent: 16, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
}

function setupBackground() {
  const field = document.querySelector('#hero-field');
  if (!field || motionPreference.matches || dataSaver || window.innerWidth < 760 || !window.VANTA?.NET || !window.THREE) return;
  let effect;
  let failed = false;
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !effect && !failed) {
      try {
        effect = VANTA.NET({
          el: field, THREE: window.THREE, mouseControls: true, touchControls: false,
          gyroControls: false, minHeight: 200, minWidth: 200,
          color: 0xeeeeee, backgroundColor: 0x050505,
          points: 9, maxDistance: 22, spacing: 21, showDots: true
        });
      } catch (error) {
        failed = true;
        console.warn('Animated field unavailable:', error);
      }
    } else if (!entries[0].isIntersecting && effect) {
      effect.destroy();
      effect = undefined;
    }
  });
  observer.observe(field);
}

function setupSpotlights() {
  if (motionPreference.matches || window.matchMedia('(pointer: coarse)').matches) return;
  // Adapted from React Bits' Spotlight Card pointer interaction for this static site.
  document.querySelectorAll('.work-item').forEach(card => {
    card.addEventListener('pointermove', event => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--mouse-y', `${event.clientY - bounds.top}px`);
    }, { passive: true });
  });
}

function setupProgress() {
  const bar = document.querySelector('.reading-progress span');
  if (!bar) return;
  let pending = false;
  const update = () => {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${distance > 0 ? Math.min(1, window.scrollY / distance) : 0})`;
    pending = false;
  };
  window.addEventListener('scroll', () => {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

setupScroll();
setupAnimations();
setupBackground();
setupSpotlights();
setupProgress();
