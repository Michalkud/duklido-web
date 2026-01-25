/**
 * DUKLIDO Website - Main JavaScript
 * Handles navigation, animations, and form validation
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-links a');
    const contactForm = document.getElementById('contactForm');
    const fadeElements = document.querySelectorAll('.fade-in');

    // ===== Dynamic Year in Footer =====
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ===== Mobile Navigation Toggle =====
    const navBackdrop = document.querySelector('.nav-backdrop');

    const closeMobileMenu = () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        if (navBackdrop) navBackdrop.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Otevřít menu');
        document.body.style.overflow = '';
    };

    const openMobileMenu = () => {
        navToggle.classList.add('active');
        navMenu.classList.add('active');
        if (navBackdrop) navBackdrop.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Zavřít menu');
        document.body.style.overflow = 'hidden';
    };

    navToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.contains('active');
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu when clicking backdrop
    if (navBackdrop) {
        navBackdrop.addEventListener('click', closeMobileMenu);
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // ===== Escape Key Handler for Mobile Menu =====
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
            navToggle.focus(); // Return focus to toggle button
        }
    });

    // ===== Navbar Background on Scroll =====
    const handleNavbarScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Check initial state

    // ===== Scroll Spy - Active Section Indicator =====
    const sections = document.querySelectorAll('section[id]');

    const updateActiveNavLink = () => {
        const scrollPosition = window.scrollY + navbar.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });

        // Remove active class when at the very top (hero section)
        if (window.scrollY < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
        }
    };

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Check initial state

    // ===== Smooth Scroll for Anchor Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Scroll-triggered Animations =====
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        fadeInObserver.observe(element);
    });

    // ===== Form Validation =====
    if (contactForm) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const formStatus = document.getElementById('form-status');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form fields
            const name = document.getElementById('name');
            const address = document.getElementById('address');
            const type = document.getElementById('type');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const gdpr = document.getElementById('gdpr');
            const honeypot = document.getElementById('website');

            let isValid = true;
            const errors = [];

            // Honeypot check - if filled, it's likely a bot
            if (honeypot && honeypot.value) {
                console.log('Bot detected');
                return;
            }

            // Helper to show/hide field error
            const showFieldError = (field, message) => {
                const formGroup = field.closest('.form-group') || field.closest('.form-group-checkbox');
                let errorEl = formGroup.querySelector('.field-error');
                if (!errorEl) {
                    errorEl = document.createElement('span');
                    errorEl.className = 'field-error';
                    errorEl.setAttribute('role', 'alert');
                    formGroup.appendChild(errorEl);
                }
                errorEl.textContent = message;
                field.classList.add('error');
                field.setAttribute('aria-invalid', 'true');
                field.setAttribute('aria-describedby', `${field.id}-error`);
                errorEl.id = `${field.id}-error`;
            };

            const clearFieldError = (field) => {
                const formGroup = field.closest('.form-group') || field.closest('.form-group-checkbox');
                const errorEl = formGroup.querySelector('.field-error');
                if (errorEl) errorEl.remove();
                field.classList.remove('error');
                field.removeAttribute('aria-invalid');
                field.removeAttribute('aria-describedby');
            };

            // Clear all previous field errors
            contactForm.querySelectorAll('.field-error').forEach(el => el.remove());

            // Validate name
            if (!name.value.trim()) {
                isValid = false;
                errors.push('Prosím vyplňte jméno nebo název.');
                showFieldError(name, 'Prosím vyplňte jméno nebo název.');
            } else {
                clearFieldError(name);
            }

            // Validate address
            if (!address.value.trim()) {
                isValid = false;
                errors.push('Prosím vyplňte město nebo adresu.');
                showFieldError(address, 'Prosím vyplňte město nebo adresu.');
            } else {
                clearFieldError(address);
            }

            // Validate type
            if (!type.value) {
                isValid = false;
                errors.push('Prosím vyberte typ úklidu.');
                showFieldError(type, 'Prosím vyberte typ úklidu.');
            } else {
                clearFieldError(type);
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim() || !emailRegex.test(email.value)) {
                isValid = false;
                errors.push('Prosím zadejte platnou e-mailovou adresu.');
                showFieldError(email, 'Prosím zadejte platnou e-mailovou adresu.');
            } else {
                clearFieldError(email);
            }

            // Validate phone
            const phoneRegex = /^[\d\s\+\-\(\)]{9,}$/;
            if (!phone.value.trim() || !phoneRegex.test(phone.value)) {
                isValid = false;
                errors.push('Prosím zadejte platné telefonní číslo.');
                showFieldError(phone, 'Prosím zadejte platné telefonní číslo.');
            } else {
                clearFieldError(phone);
            }

            // Validate GDPR consent
            if (gdpr && !gdpr.checked) {
                isValid = false;
                errors.push('Prosím potvrďte souhlas se zpracováním osobních údajů.');
                gdpr.closest('.form-group-checkbox').classList.add('error');
                gdpr.setAttribute('aria-invalid', 'true');
            } else if (gdpr) {
                gdpr.closest('.form-group-checkbox').classList.remove('error');
                gdpr.removeAttribute('aria-invalid');
            }

            if (isValid) {
                // Show loading state
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;

                // Update screen reader status
                if (formStatus) {
                    formStatus.textContent = 'Odesílám formulář...';
                }

                // Simulate form submission (replace with actual submission in production)
                setTimeout(() => {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;

                    // Form is valid - show success message
                    showFormMessage('success', 'Děkujeme za vaši poptávku! Ozveme se vám co nejdříve.');
                    if (formStatus) {
                        formStatus.textContent = 'Formulář byl úspěšně odeslán. Děkujeme za vaši poptávku.';
                    }
                    contactForm.reset();
                }, 1500);
            } else {
                // Show first error
                showFormMessage('error', errors[0]);
                if (formStatus) {
                    formStatus.textContent = errors[0];
                }
                // Focus the first invalid field
                const firstError = contactForm.querySelector('.error, [aria-invalid="true"]');
                if (firstError) {
                    firstError.focus();
                }
            }
        });

        // Remove error class and field error message on input
        contactForm.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', () => {
                field.classList.remove('error');
                field.removeAttribute('aria-invalid');
                field.removeAttribute('aria-describedby');
                // Remove field-level error message
                const formGroup = field.closest('.form-group') || field.closest('.form-group-checkbox');
                if (formGroup) {
                    const errorEl = formGroup.querySelector('.field-error');
                    if (errorEl) errorEl.remove();
                }
                // Handle checkbox container
                if (field.type === 'checkbox') {
                    const container = field.closest('.form-group-checkbox');
                    if (container) container.classList.remove('error');
                }
            });
        });
    }

    // ===== Form Message Helper =====
    function showFormMessage(type, message) {
        // Remove existing message if any
        const existingMessage = contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message-${type}`;
        messageElement.setAttribute('role', 'alert');
        messageElement.textContent = message;

        // Insert at the beginning of the form
        contactForm.insertBefore(messageElement, contactForm.firstChild);

        // Scroll to message
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Remove after 5 seconds
        setTimeout(() => {
            messageElement.style.opacity = '0';
            messageElement.style.transition = 'opacity 0.3s ease';
            setTimeout(() => messageElement.remove(), 300);
        }, 5000);
    }

});
