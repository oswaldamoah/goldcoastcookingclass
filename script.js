// filepath: c:\Users\Oswald\Documents\CODE\goldcoastcookingclass\script.js
// ==========================================
// ==========================================
// Navbar Scroll Effect (hide/show + blur)
// ==========================================
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (!navbar) return;

    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > 10) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    if (currentScroll > lastScroll && currentScroll > 200) {
        navbar.classList.add('nav-hidden');
    } else {
        navbar.classList.remove('nav-hidden');
    }

    lastScroll = currentScroll <= 0 ? 0 : currentScroll;
});

// ==========================================
// Active Navigation Link Highlight
// ==========================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavigation() {
    const scrollPos = window.scrollY;
    const navEl = document.getElementById('navbar') || document.querySelector('.navbar');
    const navHeight = navEl ? navEl.offsetHeight + 10 : 60;

    sections.forEach(section => {
        const top = section.offsetTop - navHeight;
        const bottom = top + section.offsetHeight;

        if (scrollPos >= top && scrollPos < bottom) {
            const id = section.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}

window.addEventListener('scroll', highlightNavigation);
window.addEventListener('load', highlightNavigation);

// ==========================================
// Mobile Menu Toggle
// ==========================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ==========================================
// Scroll-Triggered Animations (Framer-like)
// ==========================================
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with animate-on-scroll class
const animatedElements = document.querySelectorAll('.animate-on-scroll');
animatedElements.forEach(element => observer.observe(element));

// ==========================================
// Parallax Effect for Hero Section
// ==========================================
const heroDecoration = document.querySelector('.hero-decoration');
let ticking = false;

window.addEventListener('scroll', () => {
    if (!heroDecoration) return;
    const scrollY = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(() => {
            const translateY = scrollY * 0.2;
            heroDecoration.style.transform = `translateY(${translateY}px)`;
            ticking = false;
        });
        ticking = true;
    }
});

// ==========================================
// Service Cards Stagger Animation
// ==========================================
const serviceCards = document.querySelectorAll('.service-card');
const serviceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            serviceObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

serviceCards.forEach(card => {
    serviceObserver.observe(card);
});

// ==========================================
// Testimonial Cards Hover Effect
// ==========================================
const testimonialCards = document.querySelectorAll('.testimonial-card');
testimonialCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ==========================================
// Dynamic Text Animation on Load
// ==========================================
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    heroTitle.classList.add('visible');
});

// ==========================================
// Smooth CTA Button Ripple Effect
// ==========================================
const ctaButtons = document.querySelectorAll('.cta-button, .whatsapp-button, .secondary-button');

ctaButtons.forEach(button => {
    button.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const circle = document.createElement('span');
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.classList.add('ripple');

        const existingRipple = this.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }

        this.appendChild(circle);
    });
});

// Add ripple animation styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .cta-button, .whatsapp-button, .secondary-button {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

// ==========================================
// Video thumbnail hover preview
// ==========================================
window.addEventListener('load', () => {
    const thumbVideos = document.querySelectorAll('.video-thumb-media');
    thumbVideos.forEach(video => {
        const card = video.closest('.video-card');
        if (!card) return;

        card.addEventListener('mouseenter', () => {
            video.play().catch(() => {});
        });

        card.addEventListener('mouseleave', () => {
            video.pause();
            try {
                video.currentTime = 0;
            } catch (e) {}
        });
    });
});
document.head.appendChild(rippleStyle);
// Reviews: simple, mobile-first layout (no carousel/auto-scroll)
// ==========================================
(function initReviews() {
    const track = document.getElementById('reviewTrack');
    if (!track) return;

    const cards = Array.from(track.querySelectorAll('.gc-review-card'));

    // Enhance each card with structured meta (body + author + date)
    cards.forEach(card => {
        const full = card.dataset.full || '';
        const previewEl = card.querySelector('.review-preview');
        if (!previewEl || !full) return;

        // Expect format: "Body text ... - Name, YYYY-MM-DD"
        const dashIndex = full.lastIndexOf(' - ');
        let body = full;
        let author = '';
        let dateStr = '';

        if (dashIndex !== -1) {
            body = full.slice(0, dashIndex).trim();
            const meta = full.slice(dashIndex + 3).trim();
            const commaIndex = meta.lastIndexOf(',');
            if (commaIndex !== -1) {
                author = meta.slice(0, commaIndex).trim();
                dateStr = meta.slice(commaIndex + 1).trim();
            } else {
                author = meta;
            }
        }

        // Update preview text to a shorter version of the body for the card
        const maxChars = 220;
        let previewText = body;
        if (body.length > maxChars) {
            previewText = body.slice(0, maxChars).trimEnd() + '...';
        }
        previewEl.textContent = previewText;

        // Create / update a meta block inside the card
        let metaEl = card.querySelector('.gc-review-meta');
        if (!metaEl) {
            metaEl = document.createElement('div');
            metaEl.className = 'gc-review-meta';
            card.appendChild(metaEl);
        }

        const nameEl = document.createElement('div');
        nameEl.className = 'gc-review-author';
        nameEl.textContent = author || '';

        const dateEl = document.createElement('div');
        dateEl.className = 'gc-review-date';
        if (dateStr) {
            const d = new Date(dateStr);
            if (!isNaN(d.valueOf())) {
                dateEl.textContent = d.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            } else {
                dateEl.textContent = dateStr;
            }
        }

        metaEl.appendChild(nameEl);
        if (dateEl.textContent) metaEl.appendChild(dateEl);
    });
})();

// ==========================================
// Review Full Text Modal + carousel controls
// ==========================================
(function initReviewModal() {
    const reviewModal = document.getElementById('reviewModal');
    const reviewFullText = document.getElementById('reviewFullText');
    const reviewPrev = document.getElementById('reviewModalPrev');
    const reviewNext = document.getElementById('reviewModalNext');
    const cards = Array.from(document.querySelectorAll('#reviewTrack .gc-review-card'));
    if (!reviewModal || !reviewFullText || !cards.length) return;

    let currentIndex = 0;

    function openReviewModal(index) {
        currentIndex = (index + cards.length) % cards.length;
        const full = cards[currentIndex].dataset.full || '';
        reviewFullText.textContent = full;
        reviewModal.classList.add('is-open');
        reviewModal.setAttribute('aria-hidden', 'false');
    }

    function closeReviewModal() {
        reviewModal.classList.remove('is-open');
        reviewModal.setAttribute('aria-hidden', 'true');
    }

    // Open modal when clicking "Read full review" or card
    cards.forEach((card, index) => {
        const btn = card.querySelector('.review-readmore');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openReviewModal(index);
            });
        }
        card.addEventListener('click', (e) => {
            // prevent double from the button
            if (e.target.closest('.review-readmore')) return;
            openReviewModal(index);
        });
    });

    // Modal close (backdrop or close button)
    reviewModal.addEventListener('click', (e) => {
        const target = e.target;
        if (target.dataset.close === 'review' || target.closest('[data-close="review"]')) {
            closeReviewModal();
        }
    });

    // Modal next/prev
    if (reviewPrev) {
        reviewPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            openReviewModal(currentIndex);
        });
    }
    if (reviewNext) {
        reviewNext.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % cards.length;
            openReviewModal(currentIndex);
        });
    }
})();
// Video gallery: simple mobile-first layout, no carousel/auto-scroll
// ==========================================
// Layout is handled with CSS grid / flex; JS only handles lightbox.

// ==========================================
// ==========================================
(function initVideoLightbox() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('videoPlayer');
    const videoTitle = document.getElementById('videoTitle');
    const triggers = document.querySelectorAll('.video-card');

    if (!modal || !video || !triggers.length) return;

    function openVideo(src, title) {
        video.src = src;
        video.setAttribute('controls', 'controls');
        video.setAttribute('playsinline', 'playsinline');
        videoTitle.textContent = title || '';
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        video.play().catch(() => {});
    }

    function closeVideo() {
        video.pause();
        video.removeAttribute('src');
        video.load();
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
    }

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const src = trigger.dataset.videoSrc;
            const title = trigger.querySelector('.video-title')?.textContent || '';
            if (src) openVideo(src, title);
        });
    });

    modal.addEventListener('click', (e) => {
        const target = e.target;
        if (target.dataset.close === 'video' || target.closest('[data-close="video"]')) {
            closeVideo();
        }
    });
})();
