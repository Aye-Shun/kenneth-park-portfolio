(() => {
  'use strict';

  const EMAIL = 'kennethpark14@gmail.com';
  const SECTION_IDS = ['projects', 'experience', 'stack', 'contact'];

  function revealTerminal() {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = [];

    const stopAnimations = () => {
      if (preference.matches) {
        animations.forEach(animation => animation.cancel());
      }
    };

    // Clipping reveals the visual text without replacing it character by
    // character. The complete static content stays in the accessibility tree.
    if (!preference.matches) {
      document.querySelectorAll('[data-animate-line]').forEach((line, index) => {
        if (typeof line.animate !== 'function') return;
        const length = Array.from(line.dataset.line || line.textContent || '').length;
        if (!length) return;

        animations.push(line.animate([
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)' },
        ], {
          duration: Math.min(480, Math.max(180, length * 10)),
          delay: Math.min(index * 160, 800),
          easing: `steps(${Math.min(length, 45)}, end)`,
          fill: 'backwards',
          iterations: 1,
        }));
      });
    }

    // Turning reduced motion on during the reveal immediately shows every
    // full line. Turning it off later does not replay the introduction.
    if (typeof preference.addEventListener === 'function') {
      preference.addEventListener('change', stopAnimations);
    }
  }

  function highlightNavigation() {
    const links = [...document.querySelectorAll('.nav-links a[href^="#"]')]
      .filter(link => SECTION_IDS.includes(link.getAttribute('href').slice(1)));
    const sections = SECTION_IDS.map(id => document.getElementById(id)).filter(Boolean);
    if (!links.length || !sections.length) return;

    function setCurrent(id) {
      links.forEach(link => {
        const current = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('is-active', current);
        if (current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }

    function currentPosition() {
      const marker = window.innerHeight * 0.35;
      const passed = sections.filter(section => section.getBoundingClientRect().top <= marker);
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      setCurrent(atBottom ? sections.at(-1).id : passed.at(-1)?.id);
    }

    currentPosition();

    if ('IntersectionObserver' in window) {
      const visible = new Map();
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) visible.set(entry.target.id, entry);
          else visible.delete(entry.target.id);
        });

        const candidates = [...visible.values()].sort((left, right) =>
          right.intersectionRatio - left.intersectionRatio ||
          Math.abs(left.boundingClientRect.top) - Math.abs(right.boundingClientRect.top));
        if (candidates.length) setCurrent(candidates[0].target.id);
        else currentPosition();
      }, {
        rootMargin: '-20% 0px -45% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      });
      sections.forEach(section => observer.observe(section));
    } else {
      let scheduled = false;
      window.addEventListener('scroll', () => {
        if (scheduled) return;
        scheduled = true;
        window.requestAnimationFrame(() => {
          currentPosition();
          scheduled = false;
        });
      }, { passive: true });
    }

    window.addEventListener('resize', currentPosition, { passive: true });
  }

  function copyEmail() {
    const button = document.getElementById('copy-email');
    const status = document.getElementById('copy-status');
    if (!button || !status) return;

    button.addEventListener('click', async () => {
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      status.textContent = '';
      try {
        if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
          throw new Error('Clipboard is unavailable');
        }
        await navigator.clipboard.writeText(EMAIL);
        status.textContent = 'Email copied.';
      } catch {
        status.textContent = `Copy manually: ${EMAIL}`;
      } finally {
        button.disabled = false;
        button.removeAttribute('aria-busy');
      }
    });
  }

  function initialize() {
    revealTerminal();
    highlightNavigation();
    copyEmail();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
