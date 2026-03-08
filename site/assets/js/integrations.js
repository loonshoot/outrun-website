(function() {
  var dataEl = document.getElementById("integrations-data");
  if (!dataEl) return;

  var allIntegrations;
  try {
    allIntegrations = JSON.parse(dataEl.textContent);
  } catch (e) {
    return;
  }

  var integrations = allIntegrations.filter(function(app) { return app.published; });

  var grid = document.getElementById("integration-grid");
  var searchInput = document.getElementById("integration-search");
  var filtersContainer = document.getElementById("category-filters");
  var resultsCount = document.getElementById("results-count");
  var noResults = document.getElementById("no-results");
  var requestCta = document.getElementById("request-cta");

  var activeCategory = "all";

  function renderCards(filtered) {
    grid.innerHTML = "";
    filtered.forEach(function(app) {
      var tag = app.link ? "a" : "div";
      var card = document.createElement(tag);
      card.className = "integration-card";
      if (app.link) {
        card.href = app.link;
      }

      var iconHtml;
      if (app.icon) {
        iconHtml = '<img src="' + app.icon + '" alt="' + app.name + '" class="integration-card-logo">';
      } else {
        iconHtml = '<div class="integration-card-fallback"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div>';
      }

      card.innerHTML =
        iconHtml +
        '<div>' +
          '<div class="integration-card-name">' + app.name + '</div>' +
          '<div class="integration-card-desc">' + app.description + '</div>' +
          '<span class="integration-card-badge badge-' + app.type + '">' + app.typeLabel + '</span>' +
        '</div>';
      grid.appendChild(card);
    });

    var count = filtered.length;
    resultsCount.textContent = count + " integration" + (count !== 1 ? "s" : "");

    if (count === 0) {
      noResults.classList.remove("hidden");
      requestCta.classList.add("hidden");
    } else {
      noResults.classList.add("hidden");
      requestCta.classList.remove("hidden");
    }
  }

  function filterIntegrations() {
    var query = searchInput.value.toLowerCase().trim();
    var filtered = integrations.filter(function(app) {
      var matchesCategory = activeCategory === "all" || app.categories.indexOf(activeCategory) !== -1;
      var matchesSearch = !query || app.name.toLowerCase().indexOf(query) !== -1 || app.description.toLowerCase().indexOf(query) !== -1;
      return matchesCategory && matchesSearch;
    });
    renderCards(filtered);
  }

  searchInput.addEventListener("input", filterIntegrations);

  filtersContainer.addEventListener("click", function(e) {
    var btn = e.target.closest(".integration-filter-btn");
    if (!btn) return;
    activeCategory = btn.dataset.category;
    filtersContainer.querySelectorAll(".integration-filter-btn").forEach(function(b) {
      b.classList.remove("integration-filter-btn--active");
    });
    btn.classList.add("integration-filter-btn--active");
    filterIntegrations();
  });

  renderCards(integrations);
})();
