// Hero section animations and parallax
document.addEventListener('DOMContentLoaded', function() {
  // Add any JavaScript for animations or interactions
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(20px)';

    setTimeout(() => {
      heroTitle.style.transition = 'opacity 1s ease, transform 1s ease';
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'translateY(0)';
    }, 300);
  }

  // Rotating text animation
  const rotatingItems = document.querySelectorAll('.rotating-text-item');
  if (rotatingItems.length > 0) {
    let currentIndex = 0;

    function rotateText() {
      // Add exit class to current item
      rotatingItems[currentIndex].classList.add('exit');
      rotatingItems[currentIndex].classList.remove('active');

      // Move to next item
      currentIndex = (currentIndex + 1) % rotatingItems.length;

      // After a short delay, activate the next item
      setTimeout(() => {
        // Remove exit class from all items
        rotatingItems.forEach(item => item.classList.remove('exit'));

        // Activate the next item
        rotatingItems[currentIndex].classList.add('active');
      }, 400);
    }

    // Start rotation after initial delay (slower timing)
    setInterval(rotateText, 4500);
  }

  // Parallax effect for outrun hero
  const outrunHero = document.getElementById('outrun-hero');
  if (outrunHero) {
    let ticking = false;
    let isMobile = window.innerWidth <= 768;

    function updateParallax() {
      if (isMobile) return; // Skip parallax on mobile

      const scrolled = window.pageYOffset;
      const heroRect = outrunHero.getBoundingClientRect();
      const heroTop = heroRect.top + scrolled;
      const heroHeight = heroRect.height;

      // Only apply parallax when hero is in viewport
      if (scrolled + window.innerHeight > heroTop && scrolled < heroTop + heroHeight) {
        const parallaxOffset = (scrolled - heroTop) * 0.3; // Adjust multiplier for effect intensity
        outrunHero.style.setProperty('--scroll-offset', `${parallaxOffset}px`);
        outrunHero.classList.add('parallax-active');
      } else {
        outrunHero.classList.remove('parallax-active');
      }

      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    // Handle scroll events
    window.addEventListener('scroll', requestTick, { passive: true });

    // Handle resize events
    window.addEventListener('resize', function() {
      isMobile = window.innerWidth <= 768;
      if (isMobile) {
        outrunHero.classList.remove('parallax-active');
      }
    }, { passive: true });

    // Initial call
    updateParallax();
  }
});
