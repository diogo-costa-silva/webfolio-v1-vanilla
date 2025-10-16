// Footer Module

export function initFooter() {
    // Footer is mostly static, but we can add dynamic functionality here
    updateCopyrightYear();
    initFooterAnimations();
}

function updateCopyrightYear() {
    const yearElements = document.querySelectorAll('.footer__year');
    const currentYear = new Date().getFullYear();

    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

function initFooterAnimations() {
    // Add subtle animations to social links
    const socialLinks = document.querySelectorAll('.social-links a');

    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}