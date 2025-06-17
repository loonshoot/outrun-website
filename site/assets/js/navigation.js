document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileDocsNav = document.getElementById('mobile-docs-nav');
    const mobileMainNav = document.getElementById('mobile-main-nav');
    const backToMainMenuBtn = document.getElementById('back-to-main-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if we're on a docs page
            if (window.location.pathname.startsWith('/docs/')) {
                // Show docs navigation
                mobileMenu.classList.toggle('hidden');
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileDocsNav.classList.remove('hidden');
                    mobileMainNav.classList.add('hidden');
                }
            } else {
                // Normal mobile menu behavior
                mobileMenu.classList.toggle('hidden');
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMainNav.classList.remove('hidden');
                    mobileDocsNav.classList.add('hidden');
                }
            }
        });
    }
    
    // Back to main menu button
    if (backToMainMenuBtn) {
        backToMainMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            mobileDocsNav.classList.add('hidden');
            mobileMainNav.classList.remove('hidden');
        });
    }
    
    // Mobile docs section toggles
    const mobileDocsSectionBtns = document.querySelectorAll('.mobile-docs-section-btn');
    mobileDocsSectionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            const subsection = document.querySelector(`.mobile-docs-subsection[data-section="${section}"]`);
            const arrow = this.querySelector('.mobile-docs-arrow');
            
            if (subsection && arrow) {
                subsection.classList.toggle('hidden');
                arrow.classList.toggle('rotate-180');
            }
        });
    });
    
    // Expose function for docs pages
    window.openDocsNav = function() {
        if (mobileMenu && mobileDocsNav && mobileMainNav) {
            mobileMenu.classList.remove('hidden');
            mobileDocsNav.classList.remove('hidden');
            mobileMainNav.classList.add('hidden');
        }
    };
    
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
    
    // Mobile integrations toggle
    const mobileIntegrationsBtn = document.querySelector('.mobile-integrations-btn');
    const mobileIntegrationsMenu = document.getElementById('mobile-integrations-menu');
    const mobileIntegrationsArrow = document.querySelector('.mobile-integrations-arrow');
    
    if (mobileIntegrationsBtn && mobileIntegrationsMenu && mobileIntegrationsArrow) {
        mobileIntegrationsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            mobileIntegrationsMenu.classList.toggle('hidden');
            mobileIntegrationsArrow.classList.toggle('rotate-180');
        });
    }
    
    // Desktop mega nav hover functionality
    const featuresTrigger = document.querySelector('.nav-features-trigger');
    const featuresMegaNav = document.getElementById('features-mega-nav');
    const integrationsTrigger = document.querySelector('.nav-integrations-trigger');
    const integrationsMegaNav = document.getElementById('integrations-mega-nav');
    
    let featuresTimeout;
    let integrationsTimeout;
    
    // Features mega nav
    if (featuresTrigger && featuresMegaNav) {
        featuresTrigger.addEventListener('mouseenter', function() {
            clearTimeout(featuresTimeout);
            clearTimeout(integrationsTimeout);
            
            // Hide integrations menu
            integrationsMegaNav?.classList.add('hidden');
            
            // Show features menu
            featuresMegaNav.classList.remove('hidden');
            
            // Rotate arrow
            const arrow = featuresTrigger.querySelector('svg');
            arrow?.classList.add('rotate-180');
        });
        
        featuresTrigger.addEventListener('mouseleave', function() {
            featuresTimeout = setTimeout(() => {
                featuresMegaNav.classList.add('hidden');
                const arrow = featuresTrigger.querySelector('svg');
                arrow?.classList.remove('rotate-180');
            }, 100);
        });
        
        featuresMegaNav.addEventListener('mouseenter', function() {
            clearTimeout(featuresTimeout);
        });
        
        featuresMegaNav.addEventListener('mouseleave', function() {
            featuresMegaNav.classList.add('hidden');
            const arrow = featuresTrigger.querySelector('svg');
            arrow?.classList.remove('rotate-180');
        });
    }
    
    // Integrations mega nav
    if (integrationsTrigger && integrationsMegaNav) {
        integrationsTrigger.addEventListener('mouseenter', function() {
            clearTimeout(integrationsTimeout);
            clearTimeout(featuresTimeout);
            
            // Hide features menu
            featuresMegaNav?.classList.add('hidden');
            
            // Show integrations menu
            integrationsMegaNav.classList.remove('hidden');
            
            // Rotate arrow
            const arrow = integrationsTrigger.querySelector('svg');
            arrow?.classList.add('rotate-180');
        });
        
        integrationsTrigger.addEventListener('mouseleave', function() {
            integrationsTimeout = setTimeout(() => {
                integrationsMegaNav.classList.add('hidden');
                const arrow = integrationsTrigger.querySelector('svg');
                arrow?.classList.remove('rotate-180');
            }, 100);
        });
        
        integrationsMegaNav.addEventListener('mouseenter', function() {
            clearTimeout(integrationsTimeout);
        });
        
        integrationsMegaNav.addEventListener('mouseleave', function() {
            integrationsMegaNav.classList.add('hidden');
            const arrow = integrationsTrigger.querySelector('svg');
            arrow?.classList.remove('rotate-180');
        });
    }
}); 