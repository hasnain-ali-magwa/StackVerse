document.addEventListener("DOMContentLoaded", () => {
    initializeScrollAnimations();
    initializeBackgroundParallax();
});

function initializeScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }
            });
        },
        {
            threshold: 0.15
        }
    );

    const elements = document.querySelectorAll(
        `
        .hero-content,
        .selector-box,
        .subfield-card,
        .tool-card,
        .contact-form-box,
        .social-box
        `
    );

    elements.forEach((element) => {
        element.classList.add("hidden-animation");
        observer.observe(element);
    });
}

function initializeBackgroundParallax() {
    const orbs = document.querySelectorAll(".gradient-orb");

    if (!orbs.length) return;

    if (window.innerWidth <= 768) return;

    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;

    document.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    function animateParallax() {
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;

        orbs.forEach((orb, index) => {
            const intensity = 20 + (index * 12);

            const moveX = currentX * intensity;
            const moveY = currentY * intensity;

            orb.style.transform = `
                translate(${moveX}px, ${moveY}px)
            `;
        });

        requestAnimationFrame(animateParallax);
    }

    animateParallax();
}