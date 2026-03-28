/* ============================================
   KINETIQ CARE - Main JavaScript
   ============================================ */

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// Mobile menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    const spans = hamburger.querySelectorAll('span');
    const isOpen = navLinks.classList.contains('mobile-open');
    spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity = isOpen ? '0' : '1';
    spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('mobile-open'));
  });
}

// Active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// Intersection Observer for scroll animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -60px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

function observeCards() {
  document.querySelectorAll('.service-card, .testimonial-card, .team-card, .facility-card, .report-card, .value-card, .gallery-item, .feature-item, .process-step, .equipment-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}
observeCards();
// Re-run after dynamic content renders
document.addEventListener('kcContentLoaded', observeCards);

// Counter animation
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const step = target / (2000 / 16);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString() + suffix;
    if (current >= target) clearInterval(timer);
  }, 16);
}
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animateCounter(el, parseInt(el.dataset.target), el.dataset.suffix || '');
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => statsObserver.observe(el));

// ── Gallery filter (callable after dynamic render) ────────────────────────
window.initGalleryFilter = function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!filterBtns.length || !galleryItems.length) return;
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.opacity = show ? '1' : '0';
        item.style.transform = show ? 'scale(1)' : 'scale(0.95)';
        setTimeout(() => { item.style.display = show ? '' : 'none'; }, show ? 0 : 300);
      });
    });
  });
};

// ── Report tabs (callable after dynamic render) ────────────────────────────
window.initReportTabs = function () {
  const tabBtns = document.querySelectorAll('.tab-btn');
  if (!tabBtns.length) return;
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.tab;
      document.querySelectorAll('.report-card').forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.type === filter) ? '' : 'none';
      });
    });
  });
};

// ── Report search (event delegation — works on dynamic DOM) ───────────────
document.addEventListener('input', e => {
  if (e.target.id !== 'reportSearch') return;
  const query = e.target.value.toLowerCase();
  document.querySelectorAll('.report-card').forEach(card => {
    const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
    const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
    card.style.display = (title.includes(query) || desc.includes(query)) ? '' : 'none';
  });
});

// ── Download button (event delegation) ────────────────────────────────────
document.addEventListener('click', e => {
  const btn = e.target.closest('.download-btn');
  if (!btn) return;
  e.stopPropagation();
  const icon = btn.querySelector('i');
  if (icon) icon.className = 'fas fa-check';
  btn.style.background = '#1FA899';
  setTimeout(() => {
    if (icon) icon.className = 'fas fa-download';
    btn.style.background = '';
  }, 2000);
});

// Contact form
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Message Sent!';
      btn.style.background = '#1FA899';
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3000);
    }, 1500);
  });
}
