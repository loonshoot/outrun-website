// Documentation Navigation & Search
(function() {
    'use strict';

    // DOM Elements
    const sidebar = document.getElementById('docs-sidebar');
    const overlay = document.getElementById('docs-overlay');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const searchInput = document.getElementById('docs-search');
    const navLinks = document.querySelectorAll('.docs-nav-link');

    // State Management
    let currentPath = window.location.pathname;

    // Initialize
    function init() {
        setupMobileNavigation();
        setupSearch();
        highlightCurrentPage();
        setupKeyboardNavigation();
    }

    // Mobile Navigation
    function setupMobileNavigation() {
        if (mobileToggle && sidebar && overlay) {
            mobileToggle.addEventListener('click', toggleMobileNav);
            overlay.addEventListener('click', closeMobileNav);
            
            // Close on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && sidebar.classList.contains('open')) {
                    closeMobileNav();
                }
            });

            // Handle window resize
            window.addEventListener('resize', function() {
                if (window.innerWidth >= 1024) {
                    closeMobileNav();
                }
            });
        }
    }

    function toggleMobileNav() {
        if (sidebar.classList.contains('open')) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    }

    function openMobileNav() {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        mobileToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMobileNav() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        mobileToggle.setAttribute('aria-expanded', 'false');
    }

    // Search Functionality
    function setupSearch() {
        if (!searchInput) return;

        let searchTimeout;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                filterNavigation(e.target.value.toLowerCase().trim());
            }, 150);
        });

        // Clear search on escape
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                filterNavigation('');
                this.blur();
            }
        });
    }

    function filterNavigation(query) {
        const navGroups = document.querySelectorAll('.docs-nav-group');
        
        if (!query) {
            // Show all groups and links
            navGroups.forEach(group => {
                group.style.display = 'block';
                const links = group.querySelectorAll('.docs-nav-link');
                links.forEach(link => link.style.display = 'block');
            });
            return;
        }

        navGroups.forEach(group => {
            const links = group.querySelectorAll('.docs-nav-link');
            let hasVisibleLinks = false;

            links.forEach(link => {
                const text = link.textContent.toLowerCase();
                const isMatch = text.includes(query);
                
                link.style.display = isMatch ? 'block' : 'none';
                if (isMatch) hasVisibleLinks = true;
            });

            // Hide group if no links match
            group.style.display = hasVisibleLinks ? 'block' : 'none';
        });
    }

    // Page Highlighting
    function highlightCurrentPage() {
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            // Check if this link matches current page
            const linkPath = new URL(link.href).pathname;
            if (linkPath === currentPath || 
                (currentPath !== '/docs/' && currentPath.startsWith(linkPath) && linkPath !== '/docs/')) {
                link.classList.add('active');
            }
        });
    }

    // Keyboard Navigation
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // Focus search on 'S' key (when not in input)
            if (e.key.toLowerCase() === 's' && 
                document.activeElement.tagName !== 'INPUT' && 
                document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                if (searchInput) {
                    searchInput.focus();
                }
            }

            // Toggle mobile nav on 'M' key
            if (e.key.toLowerCase() === 'm' && 
                document.activeElement.tagName !== 'INPUT' && 
                document.activeElement.tagName !== 'TEXTAREA' &&
                window.innerWidth < 1024) {
                e.preventDefault();
                toggleMobileNav();
            }
        });
    }

    // Smooth Scrolling for Anchor Links
    function setupSmoothScrolling() {
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a[href^="#"]');
            if (!target) return;

            const targetId = target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without triggering page reload
                history.pushState(null, null, `#${targetId}`);
            }
        });
    }

    // Copy Code Blocks
    function setupCodeCopyButtons() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(block => {
            const pre = block.parentElement;
            const button = document.createElement('button');
            
            button.innerHTML = `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                Copy
            `;
            
            button.className = 'absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity';
            
            pre.style.position = 'relative';
            pre.classList.add('group');
            pre.appendChild(button);
            
            button.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(block.textContent);
                    button.innerHTML = `
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Copied!
                    `;
                    
                    setTimeout(() => {
                        button.innerHTML = `
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            Copy
                        `;
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy code:', err);
                }
            });
        });
    }

    // Table of Contents
    function generateTableOfContents() {
        const headings = document.querySelectorAll('.docs-article h2, .docs-article h3, .docs-article h4');
        if (headings.length === 0) return;

        const toc = document.createElement('nav');
        toc.className = 'docs-toc';
        toc.innerHTML = '<h3>On this page</h3><ul></ul>';
        
        const tocList = toc.querySelector('ul');
        
        headings.forEach((heading, index) => {
            // Add ID if not present
            if (!heading.id) {
                heading.id = `heading-${index}`;
            }
            
            const li = document.createElement('li');
            const link = document.createElement('a');
            
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent;
            link.className = `toc-${heading.tagName.toLowerCase()}`;
            
            li.appendChild(link);
            tocList.appendChild(li);
        });
        
        // Insert TOC after the first paragraph or at the beginning
        const firstParagraph = document.querySelector('.docs-article p');
        if (firstParagraph) {
            firstParagraph.parentNode.insertBefore(toc, firstParagraph.nextSibling);
        } else {
            const article = document.querySelector('.docs-article');
            if (article) {
                article.insertBefore(toc, article.firstChild);
            }
        }
    }

    // Performance: Throttle scroll events
    function throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Initialize additional features
    setupSmoothScrolling();
    setupCodeCopyButtons();
    generateTableOfContents();

})();