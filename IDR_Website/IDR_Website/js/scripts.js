// Add loading class so GSAP can set initial state when ready
document.documentElement.classList.add('gsap-loading');

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // LOGO FILE PATHS (update if you rename)
    // ==========================================
    const LOGO_DARK = 'images/Gemini_Generated_Image_66k7i766k7i766k7 (2)_r1_c1_processed_by_imagy.png';
    const LOGO_LIGHT = 'images/Gemini_Generated_Image_66k7i766k7i766k7 (2)_r1_c2_processed_by_imagy.png';

    // ==========================================
    // 1. CUSTOM CURSOR (desktop only)
    // ==========================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            cursorOutline.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 500, fill: "forwards" });
        });

        document.querySelectorAll('a, button, .bento-item, .stat-box, .glass-card').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    // ==========================================
    // 2. THEME TOGGLE — defaults to DARK
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const navLogo = document.getElementById('nav-logo');
    const footerLogo = document.getElementById('footer-logo');

    function setTheme(isLight) {
        if (isLight) {
            document.documentElement.setAttribute('data-theme', 'light');
            themeIcon.setAttribute('name', 'sunny');
            localStorage.setItem('idr-theme', 'light');
            if (navLogo) navLogo.src = LOGO_LIGHT;
            if (footerLogo) footerLogo.src = LOGO_LIGHT;
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.setAttribute('name', 'moon');
            localStorage.setItem('idr-theme', 'dark');
            if (navLogo) navLogo.src = LOGO_DARK;
            if (footerLogo) footerLogo.src = LOGO_DARK;
        }
    }

    // Default: dark — only switch to light if user previously chose it
    const savedTheme = localStorage.getItem('idr-theme');
    setTheme(savedTheme === 'light');

    themeToggleBtn.addEventListener('click', () => {
        const currentlyLight = document.documentElement.getAttribute('data-theme') === 'light';
        setTheme(!currentlyLight);
    });

    // ==========================================
    // 3. NAVBAR SCROLL
    // ==========================================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ==========================================
    // 4. MOBILE MENU TOGGLE
    // ==========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = document.getElementById('menu-icon');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            menuIcon.setAttribute('name', isOpen ? 'close-outline' : 'menu-outline');
        });
    }

    // ==========================================
    // 5. GSAP ANIMATIONS (with fallback)
    // ==========================================
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Now GSAP is ready — it will control animations from invisible
        // (the CSS .gsap-loading class allows this)

        // Hero entrance timeline
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(".navbar",
            { y: -80, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8 })
          .fromTo(".hero-text-wrapper > *",
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, stagger: 0.15 }, "-=0.4")
          .fromTo(".hero-visual-wrapper",
            { x: 60, opacity: 0 },
            { x: 0, opacity: 1, duration: 1 }, "-=0.6");

        // Scroll-triggered animations
        gsap.utils.toArray('.section-title').forEach(el => {
            gsap.fromTo(el,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out",
                  scrollTrigger: { trigger: el, start: "top 85%" } });
        });

        gsap.fromTo(".bento-item",
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.1, stagger: 0.15, ease: "expo.out",
              scrollTrigger: { trigger: ".bento-grid", start: "top 80%" } });

        gsap.fromTo(".stat-box",
            { scale: 0.85, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.5)",
              scrollTrigger: { trigger: ".stats-grid", start: "top 85%" } });

        gsap.fromTo(".pill",
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.7, stagger: 0.1, ease: "back.out(1.5)",
              scrollTrigger: { trigger: ".tags-cloud", start: "top 80%" } });

        gsap.fromTo(".contact-wrapper > *",
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, stagger: 0.2, ease: "power3.out",
              scrollTrigger: { trigger: ".contact-wrapper", start: "top 80%" } });

    } else {
        // GSAP failed to load — remove the loading class so everything is visible
        document.documentElement.classList.remove('gsap-loading');
        console.warn("GSAP not loaded. Showing content without animations.");
    }

    // ==========================================
    // 6. SMOOTH ANCHOR SCROLLING
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - 100,
                    behavior: 'smooth'
                });
                // Close mobile menu
                navLinks?.classList.remove('active');
                menuIcon?.setAttribute('name', 'menu-outline');
            }
        });
    });

    // ==========================================
    // 7. FORM HANDLER
    // ==========================================
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = registerForm.querySelector('button[type="submit"]');
            const btnText = btn.querySelector('.btn-text');
            const icon = btn.querySelector('ion-icon');
            const originalText = btnText.textContent;

            btnText.textContent = 'Transmitting...';
            icon.setAttribute('name', 'sync');
            btn.disabled = true;

            setTimeout(() => {
                btnText.textContent = 'Inquiry Received!';
                icon.setAttribute('name', 'checkmark-circle');
                icon.style.color = '#10B981';
                registerForm.reset();

                setTimeout(() => {
                    btnText.textContent = originalText;
                    icon.setAttribute('name', 'paper-plane');
                    icon.style.color = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
});
