document.addEventListener('DOMContentLoaded', function() {
    const notification = document.getElementById('zendesk-notification');
    const nav = document.querySelector('nav') || document.querySelector('header') || document.querySelector('[role="navigation"]');
    const main = document.querySelector('main');
    let lastScrollY = window.scrollY;
    let navHeight = 0;
    let notificationHeight = 0;
    let isMobile = window.innerWidth <= 768;

    if (!notification) return;

    // Get heights and update positioning
    function updateLayout() {
        isMobile = window.innerWidth <= 768;

        if (isMobile) {
            // On mobile, pin to top
            notification.style.top = '0';
            notificationHeight = notification.offsetHeight;

            // Add margin to main content for notification only (nav is at bottom)
            if (main) {
                main.style.marginTop = notificationHeight + 'px';
            }
        } else {
            // On desktop, position below nav
            if (nav) {
                navHeight = nav.offsetHeight || 64;
            } else {
                navHeight = 64;
            }
            notification.style.top = navHeight + 'px';

            notificationHeight = notification.offsetHeight;

            // Add margin to main content to account for both nav and notification
            if (main) {
                main.style.marginTop = (navHeight + notificationHeight) + 'px';
            }
        }
    }

    // Initial setup
    setTimeout(updateLayout, 100);
    window.addEventListener('resize', updateLayout);

    // Handle scroll behavior
    function handleScroll() {
        const currentScrollY = window.scrollY;

        if (isMobile) {
            // On mobile, hide on any scroll down
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                // Scrolling down - hide notification
                notification.style.transform = 'translateY(-100%)';
                // Remove main margin when notification is hidden
                if (main) {
                    main.style.marginTop = '0';
                }
            } else if (currentScrollY <= 0) {
                // At the very top - show notification
                notification.style.transform = 'translateY(0)';
                // Restore margin when notification is visible
                if (main) {
                    main.style.marginTop = notificationHeight + 'px';
                }
            }
        } else {
            // Desktop behavior - slide behind nav
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down - hide notification
                notification.style.transform = 'translateY(-100%)';
                // Reduce main margin when notification is hidden
                if (main) {
                    main.style.marginTop = navHeight + 'px';
                }
            } else {
                // Scrolling up or at top - show notification
                notification.style.transform = 'translateY(0)';
                // Restore full margin when notification is visible
                if (main) {
                    main.style.marginTop = (navHeight + notificationHeight) + 'px';
                }
            }
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
});
