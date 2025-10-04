// Back to Top Button Module

export function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');

    if (!backToTopButton) {
        return;
    }

    // Threshold for showing the button (in pixels)
    const SCROLL_THRESHOLD = 300;

    // Throttle function to optimize scroll performance
    function throttle(func, delay) {
        let timeoutId;
        let lastRan;

        return function() {
            const context = this;
            const args = arguments;

            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(function() {
                    if ((Date.now() - lastRan) >= delay) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, delay - (Date.now() - lastRan));
            }
        };
    }

    // Show or hide button based on scroll position
    function toggleButtonVisibility() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollPosition > SCROLL_THRESHOLD) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }

    // Scroll to top smoothly
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Event listeners
    window.addEventListener('scroll', throttle(toggleButtonVisibility, 100));
    backToTopButton.addEventListener('click', scrollToTop);

    // Initial check on page load
    toggleButtonVisibility();
}
