document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Mobile features toggle
    const mobileFeaturesBtn = document.querySelector('.mobile-features-btn');
    const mobileFeaturesMenu = document.getElementById('mobile-features-menu');
    const mobileFeaturesArrow = document.querySelector('.mobile-features-arrow');
    
    if (mobileFeaturesBtn && mobileFeaturesMenu && mobileFeaturesArrow) {
        mobileFeaturesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            mobileFeaturesMenu.classList.toggle('hidden');
            mobileFeaturesArrow.classList.toggle('rotate-180');
        });
    }
}); 