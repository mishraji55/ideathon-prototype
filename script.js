// ======== Basic UI behavior (vanilla JS) ========

document.addEventListener('DOMContentLoaded', () => {
  // lucide icons rendered from HTML; ensure icons render
  if (window.lucide) lucide.createIcons();

  // Header shadow on scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('shadow-md', window.scrollY > 40);
  });

  // Mobile panel toggle (slide-in)
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobilePanel = document.getElementById('mobile-panel');
  const mobileClose = document.getElementById('mobile-close');

  function openMobile() {
    mobilePanel.style.transform = 'translateX(0)';
    mobilePanel.setAttribute('aria-hidden', 'false');
    mobileToggle.setAttribute('aria-expanded', 'true');
  }
  function closeMobile() {
    mobilePanel.style.transform = 'translateX(100%)';
    mobilePanel.setAttribute('aria-hidden', 'true');
    mobileToggle.setAttribute('aria-expanded', 'false');
  }

  mobileToggle?.addEventListener('click', () => {
    const hidden = mobilePanel.getAttribute('aria-hidden') === 'true';
    hidden ? openMobile() : closeMobile();
  });
  mobileClose?.addEventListener('click', closeMobile);

  // Close mobile on anchor click
  document.querySelectorAll('#mobile-panel a[href^="#"]').forEach(a => {
    a.addEventListener('click', closeMobile);
  });

  // Smooth scroll with header offset
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = header.offsetHeight + 10;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ========== Intersection Observer for reveal animations ==========
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.feature-card, .expert-card, .bento-card').forEach(el => {
    revealObserver.observe(el);
  });

  // ========== 3 STAT COUNT-UP ==========
  function animateCountUp(el, target, duration = 1400) {
    const start = 0;
    const range = target - start;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easing (easeOutCubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(start + range * eased);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  // trigger when visible
  const countEls = document.querySelectorAll('.count-up');
  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target || '0', 10);
        animateCountUp(el, target, 1600);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  countEls.forEach(el => countObserver.observe(el));

  // ========== Small Typewriter-ish reveal for hero subtitle (word by word) ==========
  const heroSub = document.getElementById('hero-subtitle');
  if (heroSub) {
    const text = heroSub.textContent.trim().split(' ');
    heroSub.innerHTML = text.map(w => `<span class="opacity-0 inline-block mr-1">${w}</span>`).join(' ');
    const spans = heroSub.querySelectorAll('span');
    spans.forEach((s, i) => {
      setTimeout(() => s.classList.remove('opacity-0'), 350 + i * 55);
    });
  }

  // ========== Form submit (demo) ==========
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    // Simple UI feedback (replace with real fetch to server)
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending…';
    setTimeout(() => {
      submitBtn.textContent = 'Send Message';
      alert('Thanks! Your message has been received. We will contact you soon.');
      contactForm.reset();
    }, 900);
  });

  // Re-render lucide icons after dynamic insertions
  if (window.lucide) lucide.createIcons();
});
