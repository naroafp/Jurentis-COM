// script.js - JURENTIS | WHATSAPP + CONTACTO + PARTÍCULAS + COOKIES + ANIMACIONES + ÓVALOS PREMIUM
document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // 1. PARTÍCULAS EN HERO (OPTIMIZADO)
    // ========================================
    const canvas = document.getElementById("particles-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        const particleCount = 80;
        let animationId = null;

        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener("resize", () => {
            resizeCanvas();
            initParticles();
        });

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1.5 - 0.75;
                this.speedY = Math.random() * 1.5 - 0.75;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            animationId = requestAnimationFrame(animate);
        }
        animate();

        window.addEventListener('beforeunload', () => {
            if (animationId) cancelAnimationFrame(animationId);
        });
    }

    // ========================================
    // 2. VIABILIDAD: WHATSAPP + DESELECCIÓN
    // ========================================
    const btnEnviar = document.getElementById('btnEnviar');
    const formViabilidad = document.getElementById('formViabilidad');
    const productoCards = document.querySelectorAll('#viabilidad .producto-card');
    const productoInputs = document.querySelectorAll('input[name="producto"]');

    function updateSelection() {
        productoCards.forEach((card, i) => {
            if (productoInputs[i].checked) {
                card.classList.add('producto-seleccionado');
            } else {
                card.classList.remove('producto-seleccionado');
            }
        });
    }

    productoCards.forEach((card, i) => {
        card.addEventListener('click', () => {
            productoInputs[i].checked = true;
            updateSelection();
        });
    });

    if (btnEnviar && formViabilidad) {
        btnEnviar.addEventListener('click', function () {
            const producto = document.querySelector('input[name="producto"]:checked');
            if (!producto) {
                showToast('Selecciona un producto', 'error');
                return;
            }

            if (!formViabilidad.checkValidity()) {
                showToast('Completa nombre y teléfono', 'error');
                return;
            }

            const nombre = formViabilidad.nombre.value.trim() || 'Cliente';
            const tel = formViabilidad.telefono.value.trim();
            const email = formViabilidad.email.value.trim() || 'No proporcionado';

            const mensaje = `¡VIABILIDAD INMEDIATA!\n\n` +
                           `Producto: *${producto.value}*\n` +
                           `Nombre: *${nombre}*\n` +
                           `Teléfono: *${tel}*\n` +
                           `Email: ${email}\n\n` +
                           `Envía aquí tu contrato o factura (PDF o foto) y te respondemos GRATIS en menos de 24h.\n\n` +
                           `¡Gracias!`;

            const whatsappURL = `https://wa.me/34672857131?text=${encodeURIComponent(mensaje)}`;
            window.open(whatsappURL, '_blank');

            // DESELECCIONAR + LIMPIAR FORM
            productoInputs.forEach(input => input.checked = false);
            updateSelection();
            formViabilidad.reset();

            showToast('¡Abriendo WhatsApp! Envía tu documento.', 'success');

            // Restaurar botón
            const original = btnEnviar.innerHTML;
            btnEnviar.innerHTML = 'Abriendo WhatsApp...';
            btnEnviar.disabled = true;
            setTimeout(() => {
                btnEnviar.innerHTML = original;
                btnEnviar.disabled = false;
            }, 2000);
        });
    }

    // ========================================
    // 3. FORMULARIO CONTACTO → gracias.html
    // ========================================
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Enviando...`;
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    window.location.href = 'gracias.html';
                } else {
                    throw new Error(result.message || 'Error al enviar');
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('Error al enviar. Inténtalo de nuevo.', 'error');
                submitBtn.innerHTML = 'Enviar Consulta';
                submitBtn.disabled = false;
            }
        });
    }

    // ========================================
    // 4. TOAST PERSONALIZADO
    // ========================================
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type} show`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
            <button class="toast-close">×</button>
        `;

        document.body.appendChild(toast);

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 5000);
    }

    // ========================================
    // 5. ANIMACIONES AL ENTRAR EN PANTALLA
    // ========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('#viabilidad .producto-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${i * 0.1}s`;
        observer.observe(card);
    });

    const formCard = document.querySelector('#viabilidad .card');
    if (formCard) {
        formCard.style.opacity = '0';
        formCard.style.transform = 'translateY(40px)';
        formCard.style.transition = 'all 0.7s ease 0.4s';
        observer.observe(formCard);
    }

    // ========================================
    // 6. SCROLL SUAVE + CIERRE NAVBAR MÓVIL
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (href.startsWith("#") && href !== "#") {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    window.scrollTo({
                        top: target.offsetTop - 90,
                        behavior: "smooth"
                    });
                    const navbar = document.querySelector('.navbar-collapse');
                    if (navbar?.classList.contains('show')) {
                        new bootstrap.Collapse(navbar).hide();
                    }
                }
            }
        });
    });

    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const navbar = document.querySelector('.navbar-collapse');
            if (navbar?.classList.contains('show')) {
                new bootstrap.Collapse(navbar).hide();
            }
        });
    });

    // ========================================
    // 7. INICIALIZAR SELECCIÓN
    // ========================================
    updateSelection();

     // ========================================
    // 8. BANNER DE COOKIES - 100% FUNCIONAL (SOLUCIÓN DEFINITIVA)
    // ========================================
    const cookieBanner = document.getElementById('cookie-banner');

    if (cookieBanner) {
        // Forzar que esté visible en el DOM aunque esté oculto por CSS
        cookieBanner.style.display = 'block';

        // Mostrar si no se han aceptado cookies
        if (!localStorage.getItem('cookies-aceptadas')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }

        window.aceptarCookies = function () {
            localStorage.setItem('cookies-aceptadas', 'true');
            cookieBanner.classList.remove('show');
            setTimeout(() => {
                cookieBanner.style.display = 'none';
            }, 700);
        };

        window.configurarCookies = function () {
            aceptarCookies(); // por ahora mismo comportamiento
        };

        // Aceptar con scroll
        let scrollDone = false;
        window.addEventListener('scroll', function handler() {
            if (!scrollDone && !localStorage.getItem('cookies-aceptadas')) {
                scrollDone = true;
                aceptarCookies();
                window.removeEventListener('scroll', handler);
            }
        });
    }
    
    // ========================================
    // 9. ÓVALOS ANIMADOS CON GSAP (ya cargado en <head>)
    // ========================================
    const titleOvals = document.querySelectorAll('.title-oval');
    if (titleOvals.length > 0 && typeof gsap !== 'undefined') {
        const ovalObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const oval = entry.target;
                    const path = oval.querySelector('.oval-path');
                    const length = path.getTotalLength();

                    gsap.set(oval, { opacity: 0, scale: 0.9 });
                    gsap.set(path, {
                        strokeDasharray: length,
                        strokeDashoffset: length,
                        opacity: 0
                    });

                    gsap.to(oval, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" });
                    gsap.to(path, { strokeDashoffset: 0, opacity: 1, duration: 1.4, ease: "power3.out", delay: 0.2 });
                    gsap.to(oval.querySelector('svg'), { filter: "drop-shadow(0 0 12px rgba(100, 204, 197, 0.35))", duration: 0.8, delay: 1.4 });

                    ovalObserver.unobserve(oval);
                }
            });
        }, { threshold: 0.6 });

        titleOvals.forEach(oval => ovalObserver.observe(oval));

        // Hover sutil
        titleOvals.forEach(oval => {
            oval.addEventListener('mouseenter', () => gsap.to(oval, { scale: 1.03, duration: 0.4 }));
            oval.addEventListener('mouseleave', () => gsap.to(oval, { scale: 1, duration: 0.4 }));
        });
    }

});
