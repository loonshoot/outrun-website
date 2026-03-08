/* Learn Sidebar Navigation — Accordion + Mobile Toggle */
(function () {
  var sidebar = document.getElementById('learn-sidebar');
  var overlay = document.getElementById('learn-overlay');
  var toggle = document.getElementById('learn-mobile-toggle');

  if (!sidebar) return;

  /* ---- Mobile sidebar toggle (delegation on document) ---- */
  document.addEventListener('click', function (e) {
    if (e.target.closest('#learn-mobile-toggle')) {
      if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
      } else {
        sidebar.classList.add('open');
        if (overlay) overlay.classList.add('active');
      }
    }
    if (overlay && e.target.closest('#learn-overlay')) {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    }
  });

  /* ---- Accordion sections (delegation on sidebar) ---- */
  sidebar.addEventListener('click', function (e) {
    var btn = e.target.closest('.learn-section-toggle');
    if (!btn) return;

    var section = btn.closest('.learn-section');
    if (!section) return;

    var isExpanded = section.classList.contains('expanded');
    if (isExpanded) {
      section.classList.remove('expanded');
      btn.setAttribute('aria-expanded', 'false');
    } else {
      section.classList.add('expanded');
      btn.setAttribute('aria-expanded', 'true');
    }
  });

  /* ---- Keyboard: Enter/Space to toggle ---- */
  sidebar.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      var btn = e.target.closest('.learn-section-toggle');
      if (btn) {
        e.preventDefault();
        btn.click();
      }
    }
  });

  /* ---- Auto-expand section with active link ---- */
  var sections = sidebar.querySelectorAll('.learn-section');
  sections.forEach(function (section) {
    var subsection = section.querySelector('.learn-subsection');
    if (!subsection) return;

    var links = subsection.querySelectorAll('.learn-nav-link');
    var hasActive = false;
    links.forEach(function (link) {
      if (link.classList.contains('active')) hasActive = true;
    });

    if (hasActive) {
      section.classList.add('expanded');
      var btn = section.querySelector('.learn-section-toggle');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }
  });

  /* ---- Scroll active nav link into view ---- */
  var activeLink = sidebar.querySelector('.learn-nav-link.active');
  if (activeLink) {
    activeLink.scrollIntoView({ block: 'center', behavior: 'instant' });
  }
})();
