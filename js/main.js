/* ===========================
   DOM Ready
   =========================== */
document.addEventListener('DOMContentLoaded', () => {
  initTypingAnimation();
  initScrollAnimations();
  initNavbar();
  initMobileMenu();
  initModals();
});

/* ===========================
   Typing Animation
   =========================== */
function initTypingAnimation() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const phrases = [
    '예외 없는 설계를 추구하는 백엔드 개발자',
    '데이터 정합성을 최우선으로 생각합니다',
    '인터록 설계 철학을 코드에 녹여냅니다',
    '안전한 시스템을 만드는 개발자'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    const current = phrases[phraseIndex];

    if (isPaused) {
      isPaused = false;
      isDeleting = true;
      setTimeout(type, 800);
      return;
    }

    if (!isDeleting) {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        isPaused = true;
        setTimeout(type, 2000);
        return;
      }
      setTimeout(type, 60);
    } else {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 30);
    }
  }

  setTimeout(type, 1000);
}

/* ===========================
   Scroll Animations (Intersection Observer)
   =========================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger the animation for sibling elements
          const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
          let delay = 0;
          siblings.forEach((sib, i) => {
            if (sib === entry.target) {
              delay = i * 100;
            }
          });

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ===========================
   Navbar Scroll Effect & Active Link
   =========================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section, .hero');

  // Scroll background
  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Active link on scroll
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-70px 0px -30% 0px'
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // Smooth scroll on nav link click
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      // Close mobile menu if open
      const menu = document.getElementById('nav-menu');
      const toggle = document.getElementById('nav-toggle');
      menu.classList.remove('active');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ===========================
   Mobile Menu
   =========================== */
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('active');
    toggle.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('active');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ===========================
   Project Modals
   =========================== */
function initModals() {
  const detailBtns = document.querySelectorAll('.project-detail-btn');
  const overlays = document.querySelectorAll('.modal-overlay');
  const closeBtns = document.querySelectorAll('.modal-close');

  detailBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal(overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      closeModal(btn.closest('.modal-overlay'));
    });
  });

  overlays.forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      overlays.forEach((overlay) => {
        if (overlay.classList.contains('active')) {
          closeModal(overlay);
        }
      });
    }
  });
}
