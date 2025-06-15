// Documentation Navigation with Accordion Functionality
(function() {
    'use strict';

    // DOM Elements
    const navLinks = document.querySelectorAll('.docs-nav-link');
    const sectionToggles = document.querySelectorAll('.docs-section-toggle');
    const sections = document.querySelectorAll('.docs-section');

    // State Management
    let currentPath = window.location.pathname;

    // Initialize
    function init() {
        setupAccordionNavigation();
        highlightCurrentPage();
        expandCurrentSection();
        setupKeyboardNavigation();
        setupSmoothScrolling();
        setupCodeCopyButtons();
        generateTableOfContents();
    }



    // Accordion Navigation
    function setupAccordionNavigation() {
        sectionToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const section = this.closest('.docs-section');
                toggleSection(section);
            });
        });
    }

    function toggleSection(section) {
        const isExpanded = section.classList.contains('expanded');
        const toggle = section.querySelector('.docs-section-toggle');
        
        if (isExpanded) {
            collapseSection(section);
        } else {
            expandSection(section);
        }
        
        // Update aria-expanded attribute
        toggle.setAttribute('aria-expanded', !isExpanded);
    }

    function expandSection(section) {
        section.classList.add('expanded');
        const subsection = section.querySelector('.docs-subsection');
        
        // Calculate the actual height needed
        subsection.style.maxHeight = subsection.scrollHeight + 'px';
        
        // Reset to CSS value after animation
        setTimeout(() => {
            if (section.classList.contains('expanded')) {
                subsection.style.maxHeight = '1000px';
            }
        }, 300);
    }

    function collapseSection(section) {
        const subsection = section.querySelector('.docs-subsection');
        
        // Set explicit height before collapsing
        subsection.style.maxHeight = subsection.scrollHeight + 'px';
        
        // Force reflow
        subsection.offsetHeight;

        // Collapse
        subsection.style.maxHeight = '0';
        section.classList.remove('expanded');
    }

    // Page Highlighting and Section Expansion
    function highlightCurrentPage() {
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            // Check if this link exactly matches current page
            const linkPath = new URL(link.href).pathname;
            if (linkPath === currentPath) {
                link.classList.add('active');
            }
        });
    }

    function expandCurrentSection() {
        // Find which section contains the current page
        let currentSection = null;
        
        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            // Exact match gets priority
            if (linkPath === currentPath) {
                currentSection = link.closest('.docs-section');
            }
        });

        // If no exact match, find section that contains the current path
        if (!currentSection) {
            navLinks.forEach(link => {
                const linkPath = new URL(link.href).pathname;
                if (currentPath.startsWith(linkPath) && linkPath !== '/docs/') {
                    currentSection = link.closest('.docs-section');
                }
            });
        }

        // If we found a current section, expand it
        if (currentSection) {
            expandSection(currentSection);
            const toggle = currentSection.querySelector('.docs-section-toggle');
            toggle.setAttribute('aria-expanded', 'true');
        }
    }

    // Keyboard Navigation
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // Navigate sections with arrow keys when focused
            if (document.activeElement.classList.contains('docs-section-toggle')) {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
                    const toggles = Array.from(sectionToggles);
                    const currentIndex = toggles.indexOf(document.activeElement);
                    
                    if (e.key === 'ArrowUp' && currentIndex > 0) {
                        toggles[currentIndex - 1].focus();
                    } else if (e.key === 'ArrowDown' && currentIndex < toggles.length - 1) {
                        toggles[currentIndex + 1].focus();
                    }
                }
                
                if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                    document.activeElement.click();
                }
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
                    console.error('Failed to copy text: ', err);
                }
            });
        });
    }

    // Table of Contents Generation
    function generateTableOfContents() {
        const article = document.querySelector('.docs-article');
        const tocDesktop = document.querySelector('.docs-toc-desktop .docs-toc-container');
        
        if (!article) return;

        const headings = article.querySelectorAll('h2, h3, h4, h5, h6');
        if (headings.length === 0) {
            // Hide TOC containers if no headings
            if (tocDesktop) tocDesktop.parentElement.style.display = 'none';
            return;
        }

        // Create TOC content
        function createTOCContent() {
            const tocList = document.createElement('ul');
        
        headings.forEach((heading, index) => {
                // Generate ID if it doesn't exist
            if (!heading.id) {
                    heading.id = heading.textContent
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-');
            }
            
                const listItem = document.createElement('li');
                listItem.className = `toc-${heading.tagName.toLowerCase()}`;
                
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent;
                
                listItem.appendChild(link);
                tocList.appendChild(listItem);
        });
        
            return tocList;
        }

        // Create mobile TOC and insert after H1
        function createMobileTOC() {
            const firstH1 = article.querySelector('h1');
            if (firstH1) {
                // Create mobile TOC container
                const mobileTocContainer = document.createElement('div');
                mobileTocContainer.className = 'docs-toc-mobile';
                
                // Create accordion toggle
                const toggleButton = document.createElement('button');
                toggleButton.className = 'docs-toc-toggle';
                toggleButton.innerHTML = `
                    <span>On this page</span>
                    <svg class="docs-toc-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6,9 12,15 18,9"></polyline>
                    </svg>
                `;
                toggleButton.setAttribute('aria-expanded', 'false');
                
                // Create collapsible content
                const tocContainer = document.createElement('div');
                tocContainer.className = 'docs-toc-container';
                tocContainer.appendChild(createTOCContent());
                
                // Add click handler for accordion
                toggleButton.addEventListener('click', () => {
                    const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
                    toggleButton.setAttribute('aria-expanded', !isExpanded);
                    mobileTocContainer.classList.toggle('expanded', !isExpanded);
                });
                
                mobileTocContainer.appendChild(toggleButton);
                mobileTocContainer.appendChild(tocContainer);
                
                // Insert after H1
                firstH1.parentNode.insertBefore(mobileTocContainer, firstH1.nextSibling);
            }
        }

        // Populate desktop TOC
        if (tocDesktop) {
            tocDesktop.innerHTML = '<h3>On this page</h3>';
            tocDesktop.appendChild(createTOCContent());
        }
        
        // Create mobile TOC
        createMobileTOC();
        
        // Setup scroll spy for active section highlighting
        setupScrollSpy(headings);
    }



    // Scroll Spy for TOC
    function setupScrollSpy(headings) {
        function updateActiveLink() {
            let activeHeading = null;
            const scrollPosition = window.scrollY + 100; // Offset for better UX
            
            // Find the current heading
            for (let i = headings.length - 1; i >= 0; i--) {
                const heading = headings[i];
                if (heading.offsetTop <= scrollPosition) {
                    activeHeading = heading;
                    break;
                }
            }
            
            // Update active states for both mobile and desktop TOC
            const allTocLinks = document.querySelectorAll('.docs-toc-mobile .docs-toc-container a, .docs-toc-desktop .docs-toc-container a');
            allTocLinks.forEach(link => link.classList.remove('active'));
            
            if (activeHeading) {
                // Update both mobile and desktop TOC links
                const mobileActiveLink = document.querySelector(`.docs-toc-mobile .docs-toc-container a[href="#${activeHeading.id}"]`);
                const desktopActiveLink = document.querySelector(`.docs-toc-desktop .docs-toc-container a[href="#${activeHeading.id}"]`);
                
                if (mobileActiveLink) {
                    mobileActiveLink.classList.add('active');
                }
                if (desktopActiveLink) {
                    desktopActiveLink.classList.add('active');
            }
        }
    }

        // Throttled scroll listener
        const throttledUpdate = throttle(updateActiveLink, 100);
        window.addEventListener('scroll', throttledUpdate);
        
        // Initial update
        updateActiveLink();
    }

    // Utility function for throttling
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

})();