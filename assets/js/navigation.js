// Navigation Module - Header with smart scroll behavior

export function initHeader() {
    const header = document.getElementById('header');
    const progressBar = document.getElementById('progressBar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');

    // DEFENSIVE: Verificar elementos críticos existem
    if (!header) {
        console.error('[Navigation] Header element not found');
        return;
    }

    if (!mobileMenuToggle) {
        console.warn('[Navigation] Mobile menu toggle not found');
    }

    if (!mobileNav) {
        console.warn('[Navigation] Mobile nav not found');
    }

    // Scroll variables
    let lastScrollTop = 0;
    let isScrolling = false;
    let scrollTimeout;
    const scrollThreshold = 5; // Minimum scroll distance to trigger hide/show

    // Initialize header state
    updateHeaderState(0);

    // Debounced scroll handler
    function handleScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                // Update progress bar
                updateProgressBar(scrollTop);

                // Handle header visibility
                if (Math.abs(scrollTop - lastScrollTop) > scrollThreshold) {
                    if (scrollTop > lastScrollTop && scrollTop > 100) {
                        // Scrolling down & past 100px - hide header
                        header.classList.add('header--hidden');
                        // Move progress bar to top when header is hidden
                        if (progressBar) {
                            progressBar.classList.add('progress-bar--top');
                        }
                    } else {
                        // Scrolling up - show header
                        header.classList.remove('header--hidden');
                        // Move progress bar below header when header is visible
                        if (progressBar) {
                            progressBar.classList.remove('progress-bar--top');
                        }
                    }
                    lastScrollTop = scrollTop;
                }

                // Update header state based on scroll position
                updateHeaderState(scrollTop);

                isScrolling = false;
            });
            isScrolling = true;
        }

        // Clear timeout on scroll
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 100);
    }

    // Update header appearance based on scroll position
    function updateHeaderState(scrollTop) {
        if (scrollTop > 50) {
            header.classList.add('header--shadow');
        } else {
            header.classList.remove('header--shadow');
        }

        // Always visible at page top
        if (scrollTop === 0) {
            header.classList.remove('header--hidden');
            // Ensure progress bar is below header when at top
            if (progressBar) {
                progressBar.classList.remove('progress-bar--top');
            }
        }
    }

    // Update progress bar width based on scroll
    function updateProgressBar(scrollTop) {
        if (!progressBar) return;

        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollTop / documentHeight) * 100;
        progressBar.style.width = `${Math.min(scrollPercentage, 100)}%`;
    }

    // Mobile menu toggle
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mobileMenuToggle.classList.toggle('mobile-menu-toggle--active');
            mobileNav.classList.toggle('active', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close mobile menu on link click
        const mobileNavLinks = mobileNav.querySelectorAll('.nav__link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('mobile-menu-toggle--active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (!mobileMenuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileMenuToggle.classList.remove('mobile-menu-toggle--active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Attach scroll listener with passive flag for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle window resize - IMPROVED with better breakpoint
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const isDesktop = window.innerWidth > 1024;

            // Close mobile menu on desktop resize
            if (isDesktop && mobileNav && mobileNav.classList.contains('active')) {
                mobileMenuToggle?.classList.remove('mobile-menu-toggle--active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 250);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Export for use in other modules
export function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

export function scrollToElement(elementId) {
    const element = document.querySelector(elementId);
    if (element) {
        const header = document.getElementById('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = element.offsetTop - headerHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}