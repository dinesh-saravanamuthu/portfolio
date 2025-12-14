document.addEventListener('DOMContentLoaded', () => {
    const starsContainer = document.querySelector('.stars');
    if (!starsContainer) return;

    // Create star layers
    const layers = ['small', 'medium', 'big'];
    // Reduced counts for performance on lower-end devices
    const counts = [200, 60, 30];

    // Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');

    // Add 'pending' class initially to elements that should animate
    // This prevents them from being hidden if JS fails, but allows animation if JS runs.
    reveals.forEach(reveal => reveal.classList.add('pending'));

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 50; // Triggers sooner

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
                reveal.classList.remove('pending');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // Scrollspy / update active nav link based on current section in view
    const navLinksAll = Array.from(document.querySelectorAll('#primary-navigation a'));
    const sections = navLinksAll.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

    const updateNavActive = () => {
        let activeIndex = -1;
        sections.forEach((sec, i) => {
            const rect = sec.getBoundingClientRect();
            // section is considered active if its top is near the top third of viewport
            if (rect.top <= window.innerHeight * 0.35 && rect.bottom > window.innerHeight * 0.15) {
                activeIndex = i;
            }
        });

        // fallback: if none matched, pick the section nearest to top
        if (activeIndex === -1) {
            let closest = {i: -1, distance: Infinity};
            sections.forEach((sec, i) => {
                const d = Math.abs(sec.getBoundingClientRect().top);
                if (d < closest.distance) {
                    closest = {i, distance: d};
                }
            });
            activeIndex = closest.i;
        }

        navLinksAll.forEach((a, i) => {
            if (i === activeIndex) {
                a.classList.add('active');
                a.setAttribute('aria-current', 'true');
            } else {
                a.classList.remove('active');
                a.removeAttribute('aria-current');
            }
        });
    };

    window.addEventListener('scroll', updateNavActive, { passive: true });
    updateNavActive();

    // Disable dynamic star generation to avoid random positions/numbers
    // Hiding the container produces a cleaner, less "AI-generated" look
    starsContainer.style.display = 'none';
    
    // Mobile nav toggle handler
    const navToggle = document.querySelector('.nav-toggle');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.getElementById('primary-navigation');
    if (navToggle && navbar && navLinks) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!expanded));
            navbar.classList.toggle('open');
            // If opening, move focus into the nav for keyboard users
            if (!expanded) navLinks.querySelector('a')?.focus();
        });
        // Close mobile nav when a link is clicked
        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navbar.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1 && href.startsWith('#')) {
                const el = document.querySelector(href);
                if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Update focus for accessibility
                    el.setAttribute('tabindex', '-1');
                    el.focus({ preventScroll: true });
                }
            }
        });
    });

    // Image Modal Functionality
    const profileWrapper = document.querySelector('.profile-wrapper');
    const imageModal = document.getElementById('image-modal');
    const imageModalClose = document.querySelector('.image-modal-close');

    if (profileWrapper && imageModal) {
        profileWrapper.addEventListener('click', () => {
            imageModal.classList.add('show');
            imageModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });

        imageModalClose.addEventListener('click', () => {
            imageModal.classList.remove('show');
            imageModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        });

        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                imageModal.classList.remove('show');
                imageModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = 'auto';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && imageModal.classList.contains('show')) {
                imageModal.classList.remove('show');
                imageModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = 'auto';
            }
        });
    }
});
