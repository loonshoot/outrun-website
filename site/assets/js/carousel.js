// Carousel functionality - Infinite on desktop, simple on mobile
document.addEventListener('DOMContentLoaded', function() {
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  
  if (!track || !prevBtn || !nextBtn) {
    console.log('Carousel elements not found');
    return;
  }
  
  const originalCards = Array.from(track.querySelectorAll('.article-card'));
  
  if (originalCards.length === 0) {
    console.log('No carousel cards found');
    return;
  }
  
  const cardWidth = 320; // w-80 + gap
  const cardsVisible = 3; // Cards visible at once on desktop
  let currentIndex = 0;
  let isTransitioning = false;
  let isMobileMode = false;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  // Setup carousel based on device type
  function setupCarousel() {
    isMobileMode = isMobile();
    
    if (isMobileMode) {
      setupMobileCarousel();
    } else {
      setupInfiniteCarousel();
    }
  }

  // Simple mobile carousel - just original cards
  function setupMobileCarousel() {
    track.innerHTML = '';
    
    // Add original cards only
    originalCards.forEach(card => {
      track.appendChild(card.cloneNode(true));
    });
    
    currentIndex = 0;
    updateCarousel(false);
  }

  // Clone cards for infinite effect on desktop
  function setupInfiniteCarousel() {
    track.innerHTML = '';
    
    // Create enough clones for seamless infinite scroll
    const clonesNeeded = cardsVisible + 2; // Extra cards on each side
    const totalCards = originalCards.length;
    
    // Add clones at the beginning (last cards)
    for (let i = 0; i < clonesNeeded; i++) {
      const cloneIndex = (totalCards - clonesNeeded + i) % totalCards;
      const clone = originalCards[cloneIndex].cloneNode(true);
      clone.classList.add('clone');
      track.appendChild(clone);
    }
    
    // Add original cards
    originalCards.forEach(card => {
      track.appendChild(card.cloneNode(true));
    });
    
    // Add clones at the end (first cards)
    for (let i = 0; i < clonesNeeded; i++) {
      const clone = originalCards[i % totalCards].cloneNode(true);
      clone.classList.add('clone');
      track.appendChild(clone);
    }
    
    // Set initial position (start after the first set of clones)
    currentIndex = clonesNeeded;
    updateCarousel(false);
  }

  function updateCarousel(animate = true) {
    if (animate) {
      track.style.transition = 'transform 0.3s ease';
    } else {
      track.style.transition = 'none';
    }
    
    if (isMobileMode) {
      // Mobile: show first card with slight overlap of second card
      const containerWidth = track.parentElement.offsetWidth;
      const mobileCardWidth = containerWidth - 40; // Account for padding and overlap
      const translateX = -currentIndex * mobileCardWidth;
      track.style.transform = `translateX(${translateX}px)`;
    } else {
      // Desktop: normal infinite scroll
      const translateX = -currentIndex * cardWidth;
      track.style.transform = `translateX(${translateX}px)`;
    }
  }

  function goToNext() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    if (isMobileMode) {
      // Mobile: simple next with bounds checking
      if (currentIndex < originalCards.length - 1) {
        currentIndex++;
      }
      updateCarousel();
      setTimeout(() => { isTransitioning = false; }, 300);
    } else {
      // Desktop: infinite scroll
      currentIndex++;
      updateCarousel();
      
      setTimeout(() => {
        const totalClonedCards = track.children.length;
        const clonesNeeded = Math.ceil(totalClonedCards / 3);
        
        if (currentIndex >= totalClonedCards - clonesNeeded) {
          currentIndex = clonesNeeded;
          updateCarousel(false);
        }
        isTransitioning = false;
      }, 300);
    }
  }

  function goToPrev() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    if (isMobileMode) {
      // Mobile: simple prev with bounds checking
      if (currentIndex > 0) {
        currentIndex--;
      }
      updateCarousel();
      setTimeout(() => { isTransitioning = false; }, 300);
    } else {
      // Desktop: infinite scroll
      currentIndex--;
      updateCarousel();
      
      setTimeout(() => {
        const clonesNeeded = Math.ceil(track.children.length / 3);
        
        if (currentIndex < clonesNeeded) {
          currentIndex = track.children.length - clonesNeeded - cardsVisible;
          updateCarousel(false);
        }
        isTransitioning = false;
      }, 300);
    }
  }

  // Event listeners for buttons
  nextBtn.addEventListener('click', goToNext);
  prevBtn.addEventListener('click', goToPrev);

  // Touch/swipe support for mobile
  let startX = 0;
  let isDragging = false;
  let currentTranslate = 0;
  let prevTranslate = 0;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  track.addEventListener('touchstart', function(e) {
    if (!isMobile()) return;
    startX = e.touches[0].clientX;
    isDragging = true;
    prevTranslate = currentTranslate;
    track.style.transition = 'none';
  });

  track.addEventListener('touchmove', function(e) {
    if (!isMobile() || !isDragging) return;
    e.preventDefault();
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    currentTranslate = prevTranslate + diff;
    
    // Apply transform with current position
    if (isMobileMode) {
      const containerWidth = track.parentElement.offsetWidth;
      const mobileCardWidth = containerWidth - 40;
      track.style.transform = `translateX(${-currentIndex * mobileCardWidth + diff}px)`;
    } else {
      track.style.transform = `translateX(${-currentIndex * cardWidth + diff}px)`;
    }
  });

  track.addEventListener('touchend', function(e) {
    if (!isMobile() || !isDragging) return;
    isDragging = false;
    
    const diff = currentTranslate - prevTranslate;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        // Swipe right - previous
        goToPrev();
      } else {
        // Swipe left - next
        goToNext();
      }
    } else {
      // Snap back to current position
      updateCarousel();
    }
  });

  // Initialize the carousel
  setupCarousel();
  
  // Handle resize - reinitialize if switching between mobile/desktop
  window.addEventListener('resize', function() {
    const wasMobile = isMobileMode;
    const nowMobile = isMobile();
    
    if (wasMobile !== nowMobile) {
      setupCarousel();
    } else {
      updateCarousel(false);
    }
  });

  console.log('Carousel initialized successfully');
}); 