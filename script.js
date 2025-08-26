// Helper: select
const $ = (q, c=document) => c.querySelector(q);
const $$ = (q, c=document) => [...c.querySelectorAll(q)];

// Mobile nav toggle (accessible)
const navToggle = $('.nav-toggle');
const navMenu = $('#nav-menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('open');
  });
}

// Close nav when clicking a link (mobile)
$$('a[data-nav]').forEach(a => {
  a.addEventListener('click', () => {
    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle?.setAttribute('aria-expanded','false');
    }
  });
});

// Back to top
const toTop = $('.to-top');
const onScroll = () => {
  if (!toTop) return;
  toTop.style.display = (window.scrollY > 400) ? 'inline-flex' : 'none';
};
window.addEventListener('scroll', onScroll);
toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Lightbox (for gallery buttons with data-lightbox)
const dialog = $('.lightbox');
const dialogImg = dialog?.querySelector('img');
const dialogClose = dialog?.querySelector('.lightbox-close');

$$('[data-lightbox]').forEach(btn => {
  btn.addEventListener('click', () => {
    const src = btn.getAttribute('data-lightbox');
    if (dialog && dialogImg && typeof dialog.showModal === 'function') {
      dialogImg.src = src;
      dialogImg.alt = btn.querySelector('img')?.alt || 'Selected image';
      dialog.showModal();
    }
  });
});
dialogClose?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', (e) => {
  const bounds = dialogImg?.getBoundingClientRect();
  const inside = bounds && e.clientX >= bounds.left && e.clientX <= bounds.right &&
                 e.clientY >= bounds.top && e.clientY <= bounds.bottom;
  if (!inside) dialog?.close();
});

// Contact form validation (basic)
const form = $('#contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;

    const name = $('#name');
    const email = $('#email');
    const msg = $('#msg');

    const setError = (el, message) => {
      ok = false;
      const small = el.parentElement.querySelector('.error');
      if (small) small.textContent = message;
      el.setAttribute('aria-invalid', 'true');
    };
    const clearError = (el) => {
      const small = el.parentElement.querySelector('.error');
      if (small) small.textContent = '';
      el.removeAttribute('aria-invalid');
    };

    // Validate
    if (!name.value.trim()) setError(name, 'Please enter your name.');
    else clearError(name);

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
    if (!emailOk) setError(email, 'Please enter a valid email.');
    else clearError(email);

    if (!msg.value.trim()) setError(msg, 'Please enter your message.');
    else clearError(msg);

    const status = $('.form-status');
    if (ok) {
      status && (status.textContent = 'Message sent! We will get back to you soon.');
      form.reset();
    } else {
      status && (status.textContent = 'Please fix the errors above.');
    }
  });
}

// Highlight current nav link based on URL (fallback)
const path = location.pathname.split('/').pop();
$$('a[data-nav], .footer-nav a').forEach(a => {
  const href = a.getAttribute('href');
  if (href && href === path) a.classList.add('active');
});

// Respect reduced motion: if user prefers reduced motion, disable smooth scroll on browsers that support it.
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.scrollBehavior = 'auto';
} else {
  document.documentElement.style.scrollBehavior = 'smooth';
}

// Hero Slideshow Initialization
document.addEventListener('DOMContentLoaded', function () {
  initializeHeroSlideshow();
});

let currentHeroSlide = 0;

function initializeHeroSlideshow() {
  const heroSlides = document.querySelectorAll('.hero-slide');

  if (heroSlides.length === 0) return;

  // Create a shuffled array of slide indices
  const shuffledIndices = Array.from({ length: heroSlides.length }, (_, i) => i);
  shuffleArray(shuffledIndices);

  // Mark the first slide as active
  heroSlides[shuffledIndices[0]].classList.add('active');

  setInterval(() => {
    // Remove active class from current slide
    heroSlides[shuffledIndices[currentHeroSlide]].classList.remove('active');

    // Move to the next slide index
    currentHeroSlide = (currentHeroSlide + 1) % shuffledIndices.length;

    // Add active class to new current slide
    heroSlides[shuffledIndices[currentHeroSlide]].classList.add('active');
  }, 2000); // Change slide every 2 seconds
}

// Fisher-Yates shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

