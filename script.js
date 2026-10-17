/* ============================================
   Code Vedic IT Solutions - Interactive Scripts
   Particles • Animations • Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===== Particle Background =====
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.color = this.randomColor();
        }
        randomColor() {
            const colors = [
                'rgba(99, 102, 241, 0.6)',
                'rgba(34, 211, 238, 0.5)',
                'rgba(168, 85, 247, 0.5)',
                'rgba(236, 72, 153, 0.4)'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 1.5;
                    this.y -= (dy / dist) * force * 1.5;
                }
            }

            // Bounce
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.6;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Mouse tracking for particles + cursor glow
    const cursorGlow = document.getElementById('cursorGlow');
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        if (cursorGlow) {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        }
    });
    document.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // ===== Navbar Scroll =====
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link
        updateActiveNav();
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== Mobile Menu =====
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ===== Active Nav on Scroll =====
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }

    // ===== Counter Animation =====
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const duration = 2000;
            const start = performance.now();

            function update(now) {
                const progress = Math.min((now - start) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(ease * target);
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            }
            requestAnimationFrame(update);
        });
    }

    // Trigger counters when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounters();
            heroObserver.disconnect();
        }
    }, { threshold: 0.3 });
    heroObserver.observe(document.querySelector('.hero-stats'));

    // ===== AOS-like Scroll Animations =====
    const aosElements = document.querySelectorAll('[data-aos]');

    const aosObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    aosElements.forEach(el => aosObserver.observe(el));

    // ===== FAQ Accordion =====
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isActive = item.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(faq => {
                faq.classList.remove('active');
            });

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ===== Contact Form =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value.trim();

            // Open WhatsApp with pre-filled message
            let text = `Hi Code Vedic!%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}`;
            if (service) text += `%0AService: ${encodeURIComponent(service)}`;
            if (message) text += `%0A%0AMessage: ${encodeURIComponent(message)}`;

            window.open(`https://wa.me/918893891603?text=${text}`, '_blank');
            
            // Visual feedback
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span>Opening WhatsApp...</span> <i class="fas fa-check"></i>';
            btn.style.background = '#25D366';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                contactForm.reset();
            }, 2000);
        });
    }

    // ===== Smooth reveal for sections =====
    // Already handled by AOS observer

});

// ===== First Visit Enquiry Popup =====
(function () {
    const overlay = document.getElementById('enquiryOverlay');
    if (!overlay) return;
    const closeBtn = document.getElementById('enquiryClose');

    if (!localStorage.getItem('enquiryShown')) {
        setTimeout(() => {
            overlay.classList.add('active');
        }, 1400);
    }

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        localStorage.setItem('enquiryShown', 'true');
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            localStorage.setItem('enquiryShown', 'true');
        }
    });

    const form = document.getElementById('enquiryForm');
    if (form) {
        form.addEventListener('submit', () => {
            localStorage.setItem('enquiryShown', 'true');
        });
    }
})();

// ===== Chat Agent =====
(function () {
    const toggle = document.getElementById('chatToggle');
    const windowEl = document.getElementById('chatWindow');
    const closeBtn = document.getElementById('chatClose');
    const badge = document.getElementById('chatBadge');
    if (!toggle || !windowEl) return;

    toggle.addEventListener('click', () => {
        windowEl.classList.toggle('open');
        if (badge) badge.style.display = 'none';
    });

    closeBtn.addEventListener('click', () => {
        windowEl.classList.remove('open');
    });

    document.querySelectorAll('.chat-next').forEach(btn => {
        btn.addEventListener('click', () => {
            const currentStep = btn.closest('.chat-form-step');
            const nextId = btn.getAttribute('data-next');
            const nextStep = document.getElementById(nextId);
            if (!nextStep) return;

            const input = currentStep.querySelector('input, select, textarea');
            if (input && !input.value.trim()) {
                input.focus();
                input.style.borderColor = '#EF4444';
                setTimeout(() => { input.style.borderColor = ''; }, 1500);
                return;
            }

            currentStep.style.display = 'none';
            nextStep.style.display = 'block';
        });
    });
})();
