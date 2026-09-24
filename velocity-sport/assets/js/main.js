/* =========================================================
   VOLT SPORT — main.js
   Nav scroll state, 3D tilt, hero parallax, counters,
   shop filters/sort/view, size-guide tabs+units,
   kit customizer, forms, back-to-top.
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initThemeToggle();
    initDirectionToggle();
    initAOS();
    initNavScroll();
    initVisuals();
    initFlipTouch();
    initTilt();
    initHeroParallax();
    initCounters();
    initBackToTop();
    initShopFilters();
    initSizeGuide();
    initKitCustomizer();
    initQtyStepper();
    initCommerce();
    initSearchOverlay();
    initCartPage();
    initWishlistPage();
    initForms();
    initAuthTabSwitch();
    initPlainTabs();
    initYear();
    initEqualTestimonialCards();
    if (window.VoltStore) VoltStore.updateBadges();
  });

  /* ---------- Dark / light mode toggle ---------- */
  function initThemeToggle() {
    var STORAGE_KEY = "volt_theme";
    var root = document.documentElement;

    function currentTheme() {
      return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    }

    function applyIcon(theme) {
      document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
        var icon = btn.querySelector("[data-theme-icon]");
        if (!icon) return;
        icon.className = theme === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
        btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
        btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      });
    }

    function setTheme(theme, persist) {
      if (theme === "dark") {
        root.setAttribute("data-theme", "dark");
      } else {
        root.setAttribute("data-theme", "light");
      }
      if (persist) {
        try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* ignore */ }
      }
      applyIcon(theme);
    }

    // Sync icon state with whatever the anti-flash inline script already set.
    applyIcon(currentTheme());

    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setTheme(currentTheme() === "dark" ? "light" : "dark", true);
      });
    });

    // Keep tabs in sync if the user changes theme in another tab.
    window.addEventListener("storage", function (e) {
      if (e.key === STORAGE_KEY && (e.newValue === "dark" || e.newValue === "light")) {
        setTheme(e.newValue, false);
      }
    });
  }

  /* ---------- Reading direction toggle ---------- */
  function initDirectionToggle() {
    var STORAGE_KEY = "volt_direction";
    var root = document.documentElement;
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }

    function applyDirection(direction, persist) {
      var isRtl = direction === "rtl";
      root.setAttribute("dir", isRtl ? "rtl" : "ltr");
      document.querySelectorAll("[data-direction-toggle]").forEach(function (btn) {
        var icon = btn.querySelector("[data-direction-icon]");
        var label = btn.querySelector(".direction-label");
        if (icon) icon.className = isRtl ? "bi bi-text-right" : "bi bi-text-left";
        if (label) label.textContent = isRtl ? "RTL" : "LTR";
        btn.setAttribute("aria-label", isRtl ? "Switch to left-to-right layout" : "Switch to right-to-left layout");
        btn.setAttribute("aria-pressed", isRtl ? "true" : "false");
      });
      if (persist) {
        try { localStorage.setItem(STORAGE_KEY, isRtl ? "rtl" : "ltr"); } catch (e) { /* ignore */ }
      }
    }

    applyDirection(saved === "rtl" ? "rtl" : "ltr", false);
    document.querySelectorAll("[data-direction-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyDirection(root.getAttribute("dir") === "rtl" ? "ltr" : "rtl", true);
      });
    });
  }

  /* ---------- Illustrated garment visuals ---------- */
  function initVisuals() {
    if (!window.VoltStore) return;
    document.querySelectorAll("[data-visual]").forEach(function (el) {
      var type = el.getAttribute("data-visual");
      var color = el.getAttribute("data-visual-color") || "#06222E";
      var accent = el.getAttribute("data-visual-accent") || "#2EE6C7";
      // Prefer a dedicated per-product photo (keyed by the product card's own
      // data-product-id) so every product tile shows a unique image instead
      // of sharing one picture per category. Falls back to the category
      // photo only when there's no product context (e.g. flip-cards).
      var productCard = el.closest("[data-product-id]");
      var productId = productCard ? productCard.getAttribute("data-product-id") : null;
      if (productId && VoltStore.PRODUCTS[productId]) {
        el.innerHTML = VoltStore.renderProductPhoto(productId, accent);
      } else {
        el.innerHTML = VoltStore.renderVisual(type, color, accent);
      }
    });
    document.querySelectorAll("[data-pictogram]").forEach(function (el) {
      var type = el.getAttribute("data-pictogram");
      var accent = el.getAttribute("data-pictogram-accent") || "#2EE6C7";
      el.innerHTML = VoltStore.renderPictogram(type, accent);
    });
    document.querySelectorAll("[data-gender-pictogram]").forEach(function (el) {
      var type = el.getAttribute("data-gender-pictogram");
      var accent = el.getAttribute("data-pictogram-accent") || "#2EE6C7";
      el.innerHTML = VoltStore.renderGenderPictogram(type, accent);
    });
    document.querySelectorAll("[data-avatar]").forEach(function (el) {
      el.innerHTML = VoltStore.renderAvatar(el.getAttribute("data-avatar"));
    });
  }

  /* ---------- Flip card tap support for touch devices ---------- */
  function initFlipTouch() {
    var isTouch = window.matchMedia && window.matchMedia("(hover: none)").matches;
    if (!isTouch) return;
    document.querySelectorAll(".flip-card").forEach(function (card) {
      card.addEventListener("click", function (e) {
        if (!card.classList.contains("touched")) {
          e.preventDefault();
          document.querySelectorAll(".flip-card.touched").forEach(function (c) {
            if (c !== card) c.classList.remove("touched");
          });
          card.classList.add("touched");
        }
      });
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".flip-card")) {
        document.querySelectorAll(".flip-card.touched").forEach(function (c) { c.classList.remove("touched"); });
      }
    });
  }

  /* ---------- AOS ---------- */
  function initAOS() {
    if (window.AOS) {
      AOS.init({ duration: 700, once: true, offset: 60, easing: "ease-out-cubic" });
    }
  }

  /* ---------- Sticky navbar ---------- */
  function initNavScroll() {
    var nav = document.getElementById("mainNav");
    if (!nav) return;
    // Two different thresholds (hysteresis) instead of one, so hovering
    // right around the trigger point — a slow manual scroll, a trackpad's
    // elastic bounce, momentum scrolling — can't rapidly add/remove the
    // class and make the navbar's background flicker between transparent
    // and solid. Also throttled to one check per animation frame instead
    // of running on every native scroll event.
    var ticking = false;
    var isScrolled = false;
    var evaluate = function () {
      var y = window.scrollY;
      if (!isScrolled && y > 80) {
        isScrolled = true;
        nav.classList.add("is-scrolled");
      } else if (isScrolled && y < 32) {
        isScrolled = false;
        nav.classList.remove("is-scrolled");
      }
      ticking = false;
    };
    var onScroll = function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(evaluate);
      }
    };
    evaluate();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 3D tilt cards ---------- */
  function initTilt() {
    var cards = document.querySelectorAll(".tilt-card");
    cards.forEach(function (card) {
      var inner = card.querySelector(".tilt-inner");
      if (!inner) return;
      var maxTilt = 10;
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        var rotateY = (x - 0.5) * maxTilt * 2;
        var rotateX = (0.5 - y) * maxTilt * 2;
        inner.style.transform = "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";
      });
      card.addEventListener("mouseleave", function () {
        inner.style.transform = "rotateX(0deg) rotateY(0deg)";
      });
    });
  }

  /* ---------- Hero layered parallax ---------- */
  function initHeroParallax() {
    var stage = document.querySelector(".hero-stage");
    if (!stage) return;
    var layers = stage.querySelectorAll(".float-card");
    var hero = document.querySelector(".hero");
    if (!hero) return;
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach(function (layer) {
        var depth = parseFloat(layer.getAttribute("data-depth") || 1);
        var moveX = x * 22 * depth;
        var moveY = y * 22 * depth;
        var base = layer.getAttribute("data-base-transform") || "";
        layer.style.transform = base + " translate(" + moveX + "px," + moveY + "px)";
      });
    });
    hero.addEventListener("mouseleave", function () {
      layers.forEach(function (layer) {
        layer.style.transform = layer.getAttribute("data-base-transform") || "";
      });
    });
  }

  /* ---------- Count-up stats ---------- */
  function initCounters() {
    var nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          animateCount(el);
          obs.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    nums.forEach(function (el) { obs.observe(el); });
  }
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = Math.floor(eased * target);
      el.textContent = val.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(step);
  }

  /* ---------- Back to top ---------- */
  function initBackToTop() {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 500) btn.classList.add("show");
        else btn.classList.remove("show");
      },
      { passive: true }
    );
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Shop: filters, sort, view toggle ---------- */
  function initShopFilters() {
    var grid = document.querySelector("[data-product-grid]");
    if (!grid) return;
    var items = Array.prototype.slice.call(grid.querySelectorAll(".product-item"));
    var sportBoxes = document.querySelectorAll("[data-filter-sport]");
    var genderBoxes = document.querySelectorAll("[data-filter-gender]");
    var priceRange = document.querySelector("[data-filter-price]");
    var priceOutput = document.querySelector("[data-price-output]");
    var resultCount = document.querySelector("[data-result-count]");
    var sortSelect = document.querySelector("[data-sort-select]");
    var viewButtons = document.querySelectorAll("[data-view]");
    var clearBtn = document.querySelector("[data-clear-filters]");
    var searchInput = document.querySelector("[data-shop-search-input]");
    var searchBanner = document.querySelector("[data-search-banner]");
    var searchQueryEl = document.querySelector("[data-search-query]");
    var searchClear = document.querySelector("[data-search-clear]");

    var urlQuery = new URLSearchParams(window.location.search).get("search") || "";
    if (searchInput && urlQuery) searchInput.value = urlQuery;
    updateSearchBanner(urlQuery);

    function updateSearchBanner(query) {
      if (!searchBanner) return;
      if (query) {
        searchBanner.classList.remove("d-none");
        if (searchQueryEl) searchQueryEl.textContent = query;
      } else {
        searchBanner.classList.add("d-none");
      }
    }

    function activeValues(nodeList) {
      return Array.prototype.filter
        .call(nodeList, function (n) { return n.checked; })
        .map(function (n) { return n.value; });
    }

    function applyFilters() {
      var sports = activeValues(sportBoxes);
      var genders = activeValues(genderBoxes);
      var maxPrice = priceRange ? parseFloat(priceRange.value) : Infinity;
      var query = (searchInput ? searchInput.value : urlQuery || "").trim().toLowerCase();
      var visible = 0;
      items.forEach(function (item) {
        var sport = item.getAttribute("data-sport");
        var gender = item.getAttribute("data-gender");
        var price = parseFloat(item.getAttribute("data-price"));
        var name = (item.getAttribute("data-name") || "").toLowerCase();
        var matchSport = sports.length === 0 || sports.indexOf(sport) !== -1;
        var matchGender = genders.length === 0 || genders.indexOf(gender) !== -1;
        var matchPrice = isNaN(price) || price <= maxPrice;
        var matchSearch = !query || name.indexOf(query) !== -1 || sport.indexOf(query) !== -1;
        var show = matchSport && matchGender && matchPrice && matchSearch;
        item.style.display = show ? "" : "none";
        if (show) visible++;
      });
      if (resultCount) resultCount.textContent = visible;
      updateSearchBanner(query);
    }

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }
    if (searchClear) {
      searchClear.addEventListener("click", function () {
        if (searchInput) searchInput.value = "";
        urlQuery = "";
        if (window.history.replaceState) window.history.replaceState({}, "", "shop.html");
        applyFilters();
      });
    }

    sportBoxes.forEach(function (b) { b.addEventListener("change", applyFilters); });
    genderBoxes.forEach(function (b) { b.addEventListener("change", applyFilters); });
    if (priceRange) {
      priceRange.addEventListener("input", function () {
        if (priceOutput) priceOutput.textContent = "$" + priceRange.value;
        applyFilters();
      });
    }
    document.querySelectorAll("[data-filter-color]").forEach(function (sw) {
      sw.addEventListener("click", function () {
        sw.classList.toggle("active");
      });
    });

    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        var val = sortSelect.value;
        var sorted = items.slice().sort(function (a, b) {
          if (val === "price-asc") return parseFloat(a.getAttribute("data-price")) - parseFloat(b.getAttribute("data-price"));
          if (val === "price-desc") return parseFloat(b.getAttribute("data-price")) - parseFloat(a.getAttribute("data-price"));
          if (val === "name") return a.getAttribute("data-name").localeCompare(b.getAttribute("data-name"));
          return 0;
        });
        sorted.forEach(function (item) { grid.appendChild(item); });
      });
    }

    viewButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        viewButtons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var view = btn.getAttribute("data-view");
        if (view === "list") grid.classList.add("view-list");
        else grid.classList.remove("view-list");
      });
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        sportBoxes.forEach(function (b) { b.checked = false; });
        genderBoxes.forEach(function (b) { b.checked = false; });
        if (priceRange) {
          priceRange.value = priceRange.max;
          if (priceOutput) priceOutput.textContent = "$" + priceRange.value;
        }
        if (searchInput) searchInput.value = "";
        urlQuery = "";
        if (window.history.replaceState) window.history.replaceState({}, "", "shop.html");
        applyFilters();
      });
    }

    applyFilters();
  }

  /* ---------- Size guide: unit toggle ---------- */
  function initSizeGuide() {
    var toggle = document.querySelector("[data-unit-toggle]");
    if (!toggle) return;
    var buttons = toggle.querySelectorAll("button");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var unit = btn.getAttribute("data-unit");
        document.querySelectorAll("[data-cm][data-in]").forEach(function (cell) {
          cell.textContent = unit === "in" ? cell.getAttribute("data-in") : cell.getAttribute("data-cm");
        });
      });
    });
  }

  /* ---------- Team kit customizer ---------- */
  function initKitCustomizer() {
    var stage = document.querySelector("[data-kit-stage]");
    if (!stage) return;
    var svg = stage.querySelector("svg");
    var colorSwatches = document.querySelectorAll("[data-kit-color]");
    var accentSwatches = document.querySelectorAll("[data-kit-accent]");
    var typeCards = document.querySelectorAll("[data-kit-type]");
    var fabricCards = document.querySelectorAll("[data-kit-fabric]");
    var nameInput = document.querySelector("[data-kit-name]");
    var numberInput = document.querySelector("[data-kit-number]");
    var qtyInput = document.querySelector("[data-kit-qty]");
    var tierRows = document.querySelectorAll("[data-tier-min]");

    colorSwatches.forEach(function (sw) {
      sw.addEventListener("click", function () {
        colorSwatches.forEach(function (s) { s.classList.remove("active"); });
        sw.classList.add("active");
        var color = sw.getAttribute("data-kit-color");
        svg.querySelectorAll("[data-part='base']").forEach(function (p) { p.setAttribute("fill", color); });
      });
    });
    accentSwatches.forEach(function (sw) {
      sw.addEventListener("click", function () {
        accentSwatches.forEach(function (s) { s.classList.remove("active"); });
        sw.classList.add("active");
        var color = sw.getAttribute("data-kit-accent");
        svg.querySelectorAll("[data-part='accent']").forEach(function (p) { p.setAttribute("fill", color); });
      });
    });
    typeCards.forEach(function (card) {
      card.addEventListener("click", function () {
        typeCards.forEach(function (c) { c.classList.remove("active"); });
        card.classList.add("active");
      });
    });
    fabricCards.forEach(function (card) {
      card.addEventListener("click", function () {
        fabricCards.forEach(function (c) { c.classList.remove("active"); });
        card.classList.add("active");
      });
    });
    if (nameInput) {
      nameInput.addEventListener("input", function () {
        var el = svg.querySelector("[data-part='teamname']");
        if (el) el.textContent = (nameInput.value || "YOUR TEAM").toUpperCase();
      });
    }
    if (numberInput) {
      numberInput.addEventListener("input", function () {
        var el = svg.querySelector("[data-part='number']");
        if (el) el.textContent = numberInput.value || "07";
      });
    }
    if (qtyInput && tierRows.length) {
      var updateTier = function () {
        var qty = parseInt(qtyInput.value, 10) || 0;
        tierRows.forEach(function (row) {
          var min = parseInt(row.getAttribute("data-tier-min"), 10);
          var max = parseInt(row.getAttribute("data-tier-max"), 10);
          if (qty >= min && qty <= max) row.classList.add("active-tier");
          else row.classList.remove("active-tier");
        });
      };
      qtyInput.addEventListener("input", updateTier);
      updateTier();
    }
  }

  /* ---------- Forms: front-end only validation ---------- */
  function initForms() {
    var forms = document.querySelectorAll(".needs-validation");
    forms.forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        e.stopPropagation();
        form.classList.add("was-validated");
        if (form.checkValidity()) {
          var successEl = form.querySelector("[data-form-success]");
          if (successEl) successEl.classList.remove("d-none");
          form.reset();
          form.classList.remove("was-validated");
        }
      });
    });
  }

  /* ---------- Auth page: "Create an account" / "Sign in" links switch pills ---------- */
  function initAuthTabSwitch() {
    document.querySelectorAll("[data-auth-switch]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var targetId = link.getAttribute("data-auth-switch");
        var toggleBtn = document.getElementById("pill-" + targetId);
        if (toggleBtn && window.bootstrap) {
          bootstrap.Tab.getOrCreateInstance(toggleBtn).show();
        }
      });
    });
  }

  /* ---------- Plain (non Bootstrap) button tab groups, e.g. kit builder sport picker ---------- */
  function initPlainTabs() {
    document.querySelectorAll(".size-tabs").forEach(function (group) {
      var buttons = group.querySelectorAll(".nav-link:not([data-bs-toggle])");
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          buttons.forEach(function (b) { b.classList.remove("active"); });
          btn.classList.add("active");
        });
      });
    });
  }

  function initYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Equal-height testimonial cards ----------
     .testi-card already relies on the fact that a Bootstrap `.row` is a flex
     container (so its columns stretch to match the tallest neighbour) plus
     `margin-top:auto` on `.testi-meta` to pin every name/role to the same
     bottom edge. That covers the normal case, but the moment anything shifts
     card content after layout — a webfont swapping in, an avatar photo
     finishing its lazy load, a resize — the browser doesn't automatically
     re-run that stretch calculation for content that already reflowed on
     its own. Belt-and-suspenders: explicitly measure every card in each
     testimonial row after everything has settled and pin them all to the
     tallest one's height, so the three name rows are guaranteed to land on
     the same line no matter what shifted the text above them. */
  function initEqualTestimonialCards() {
    var cards = Array.from(document.querySelectorAll(".testi-card"));
    if (!cards.length) return;

    function equalize() {
      cards.forEach(function (c) { c.style.minHeight = ""; });
      // Group by vertical row (cards sharing the same offsetTop) so this
      // still works correctly if the grid ever wraps at a narrower width.
      var rows = {};
      cards.forEach(function (c) {
        var top = Math.round(c.getBoundingClientRect().top);
        rows[top] = rows[top] || [];
        rows[top].push(c);
      });
      Object.keys(rows).forEach(function (top) {
        var group = rows[top];
        var tallest = group.reduce(function (max, c) {
          return Math.max(max, c.getBoundingClientRect().height);
        }, 0);
        group.forEach(function (c) { c.style.minHeight = tallest + "px"; });
      });
    }

    equalize();
    // Re-run once more shortly after load in case avatar photos or webfonts
    // finish arriving and nudge text height after the first pass.
    window.addEventListener("load", equalize);
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(equalize, 150);
    });
    document.querySelectorAll(".testi-face").forEach(function (img) {
      if (img.complete) return;
      img.addEventListener("load", equalize, { once: true });
      img.addEventListener("error", equalize, { once: true });
    });
  }

  /* ---------- Quantity steppers (product detail, kit builder qty box, cart rows) ---------- */
  function initQtyStepper() {
    document.querySelectorAll(".qty-stepper").forEach(function (stepper) {
      if (stepper.hasAttribute("data-wired")) return;
      stepper.setAttribute("data-wired", "1");
      var input = stepper.querySelector("input");
      var buttons = stepper.querySelectorAll("button");
      if (!input || buttons.length < 2) return;
      var minus = buttons[0], plus = buttons[1];
      minus.addEventListener("click", function () {
        var v = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
        input.value = v;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
      plus.addEventListener("click", function () {
        var v = (parseInt(input.value, 10) || 1) + 1;
        input.value = v;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
      input.addEventListener("change", function () {
        var v = Math.max(1, parseInt(input.value, 10) || 1);
        input.value = v;
      });
    });
  }

  /* ---------- Toast feedback ---------- */
  function toast(message, icon) {
    var el = document.querySelector(".toast-volt");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast-volt";
      document.body.appendChild(el);
    }
    el.innerHTML = '<i class="bi ' + (icon || "bi-check-circle-fill") + '"></i><span>' + message + "</span>";
    el.classList.add("show");
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }

  /* ---------- Add to cart / wishlist wiring (event delegation, works for dynamic content too) ---------- */
  function initCommerce() {
    if (!window.VoltStore) return;

    syncWishlistIcons();

    document.addEventListener("click", function (e) {
      var addBtn = e.target.closest("[data-add-to-cart]");
      if (addBtn) {
        e.preventDefault();
        var card = addBtn.closest("[data-product-id]");
        if (!card) return;
        var id = card.getAttribute("data-product-id");
        var qtyEl = card.querySelector("[data-kit-qty], .qty-stepper input");
        var qty = qtyEl ? parseInt(qtyEl.value, 10) || 1 : 1;
        VoltStore.addToCart(id, qty);
        VoltStore.updateBadges();
        var p = VoltStore.PRODUCTS[id];
        toast((p ? p.name : "Item") + " added to cart", "bi-bag-check-fill");
        return;
      }
      var wishBtn = e.target.closest("[data-wishlist-toggle]");
      if (wishBtn) {
        e.preventDefault();
        var wcard = wishBtn.closest("[data-product-id]");
        if (!wcard) return;
        var wid = wcard.getAttribute("data-product-id");
        var nowWished = VoltStore.toggleWishlist(wid);
        setWishIconState(wishBtn, nowWished);
        VoltStore.updateBadges();
        var wp = VoltStore.PRODUCTS[wid];
        toast((wp ? wp.name : "Item") + (nowWished ? " added to wishlist" : " removed from wishlist"), nowWished ? "bi-heart-fill" : "bi-heart");
        return;
      }
    });
  }

  function setWishIconState(btn, active) {
    var icon = btn.querySelector("i");
    btn.classList.toggle("active", active);
    if (icon) {
      icon.classList.toggle("bi-heart", !active);
      icon.classList.toggle("bi-heart-fill", active);
    }
  }

  function syncWishlistIcons() {
    if (!window.VoltStore) return;
    document.querySelectorAll("[data-wishlist-toggle]").forEach(function (btn) {
      var card = btn.closest("[data-product-id]");
      if (!card) return;
      var id = card.getAttribute("data-product-id");
      setWishIconState(btn, VoltStore.isWished(id));
    });
  }

  /* ---------- Search overlay ---------- */
  function initSearchOverlay() {
    var overlay = document.getElementById("searchOverlay");
    if (!overlay) return;
    var input = overlay.querySelector("input[type='search'], input[type='text']");
    var form = overlay.querySelector("form");
    var closeBtn = overlay.querySelector("[data-search-close]");

    function open() {
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
      setTimeout(function () { if (input) input.focus(); }, 150);
    }
    function close() {
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    }

    document.querySelectorAll("[data-search-toggle]").forEach(function (btn) {
      btn.addEventListener("click", open);
    });
    if (closeBtn) closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("open")) close();
    });
    overlay.querySelectorAll("[data-search-tag]").forEach(function (tag) {
      tag.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "shop.html?search=" + encodeURIComponent(tag.getAttribute("data-search-tag"));
      });
    });
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var q = (input && input.value || "").trim();
        window.location.href = "shop.html" + (q ? "?search=" + encodeURIComponent(q) : "");
      });
    }
  }

  /* ---------- Cart page ---------- */
  function initCartPage() {
    var root = document.querySelector("[data-cart-page]");
    if (!root || !window.VoltStore) return;

    function render() {
      var items = VoltStore.getCartDetailed();
      var list = root.querySelector("[data-cart-list]");
      var emptyState = root.querySelector("[data-cart-empty]");
      var summary = root.querySelector("[data-cart-summary]");
      if (!items.length) {
        list.innerHTML = "";
        if (emptyState) emptyState.classList.remove("d-none");
        if (summary) summary.classList.add("d-none");
        VoltStore.updateBadges();
        return;
      }
      if (emptyState) emptyState.classList.add("d-none");
      if (summary) summary.classList.remove("d-none");

      list.innerHTML = items.map(function (item) {
        return (
          '<div class="cart-row" data-product-id="' + item.id + '">' +
          '<div class="cart-thumb ' + item.grad + '" data-visual="' + item.visual + '" data-visual-color="' + item.color + '" data-visual-accent="' + item.accent + '"></div>' +
          '<div class="flex-grow-1">' +
          '<div class="d-flex justify-content-between align-items-start gap-2">' +
          '<div><span class="product-cat">' + item.category + " · " + item.gender + "</span>" +
          '<h3 class="product-name mb-1" style="font-size:1.05rem;">' + item.name + "</h3></div>" +
          '<button class="btn-icon-circle flex-shrink-0" style="width:36px;height:36px;" aria-label="Remove" data-cart-remove><i class="bi bi-x-lg" style="font-size:.85rem;"></i></button>' +
          "</div>" +
          '<div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-2">' +
          '<div class="qty-stepper"><button type="button" aria-label="Decrease quantity">−</button><input type="text" value="' + item.qty + '" aria-label="Quantity"><button type="button" aria-label="Increase quantity">+</button></div>' +
          '<span class="product-price">$' + item.lineTotal.toFixed(2) + "</span>" +
          "</div></div></div>"
        );
      }).join("");

      initQtyStepper();

      list.querySelectorAll(".qty-stepper input").forEach(function (input) {
        input.addEventListener("change", function () {
          var row = input.closest("[data-product-id]");
          VoltStore.setCartQty(row.getAttribute("data-product-id"), input.value);
          render();
        });
      });
      list.querySelectorAll("[data-cart-remove]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var row = btn.closest("[data-product-id]");
          VoltStore.removeFromCart(row.getAttribute("data-product-id"));
          render();
        });
      });

      initVisuals();

      var subtotal = VoltStore.cartSubtotal();
      var shipping = subtotal >= 75 || subtotal === 0 ? 0 : 8;
      var total = subtotal + shipping;
      var subtotalEl = root.querySelector("[data-cart-subtotal]");
      var shippingEl = root.querySelector("[data-cart-shipping]");
      var totalEl = root.querySelector("[data-cart-total]");
      if (subtotalEl) subtotalEl.textContent = "$" + subtotal.toFixed(2);
      if (shippingEl) shippingEl.textContent = shipping === 0 ? "Free" : "$" + shipping.toFixed(2);
      if (totalEl) totalEl.textContent = "$" + total.toFixed(2);

      VoltStore.updateBadges();
    }

    render();

    var checkoutBtn = root.querySelector("[data-checkout]");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (!VoltStore.getCart().length) return;

        // This is a front-end template with no real payment gateway wired
        // up, so "checkout" simulates a successful order: clear the cart
        // and swap the summary/list view for a clear confirmation panel
        // (plus a toast) instead of leaving the user without any feedback.
        var orderNumber = "VS-" + Math.floor(100000 + Math.random() * 900000);
        VoltStore.clearCart();

        var list = root.querySelector("[data-cart-list]");
        var summaryCol = checkoutBtn.closest(".col-lg-4");
        var listCol = list ? list.closest(".col-lg-8") : null;
        if (listCol) listCol.classList.add("d-none");
        if (summaryCol) summaryCol.classList.add("d-none");

        var successState = root.querySelector("[data-cart-success]");
        if (successState) {
          var orderNumEl = successState.querySelector("[data-order-number]");
          if (orderNumEl) orderNumEl.textContent = "Order #" + orderNumber;
          successState.classList.remove("d-none");
          successState.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        VoltStore.updateBadges();
        toast("Order placed successfully! Confirmation #" + orderNumber, "bi-check-circle-fill");
      });
    }
  }

  /* ---------- Wishlist page ---------- */
  function initWishlistPage() {
    var root = document.querySelector("[data-wishlist-page]");
    if (!root || !window.VoltStore) return;

    function render() {
      var items = VoltStore.getWishlistDetailed();
      var list = root.querySelector("[data-wishlist-list]");
      var emptyState = root.querySelector("[data-wishlist-empty]");
      if (!items.length) {
        list.innerHTML = "";
        if (emptyState) emptyState.classList.remove("d-none");
        VoltStore.updateBadges();
        return;
      }
      if (emptyState) emptyState.classList.add("d-none");

      list.innerHTML = items.map(function (item) {
        var priceHtml = "$" + item.price + (item.was ? '<span class="was">$' + item.was + "</span>" : "");
        return (
          '<div class="col-6 col-md-4 col-lg-3" data-product-id="' + item.id + '">' +
          '<div class="tilt-card h-100"><div class="tilt-inner h-100"><div class="product-card">' +
          '<div class="product-media ' + item.grad + (item.dark ? " on-dark" : "") + '">' +
          '<div class="dot-texture"></div>' +
          '<button class="btn-icon-circle position-absolute top-0 end-0 m-2" style="width:36px;height:36px;background:#fff;" aria-label="Remove from wishlist" data-wishlist-remove><i class="bi bi-x-lg" style="font-size:.8rem;"></i></button>' +
          '<div data-visual="' + item.visual + '" data-visual-color="' + item.color + '" data-visual-accent="' + item.accent + '" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;"></div>' +
          "</div>" +
          '<div class="product-body">' +
          '<span class="product-cat">' + item.category + " · " + item.gender + "</span>" +
          '<h3 class="product-name">' + item.name + "</h3>" +
          '<div class="d-flex align-items-center justify-content-between mt-2">' +
          '<span class="product-price">' + priceHtml + "</span>" +
          '<button class="btn btn-volt btn-sm-pill" data-add-to-cart><i class="bi bi-bag-plus"></i></button>' +
          "</div></div></div></div></div></div>"
        );
      }).join("");

      list.querySelectorAll("[data-wishlist-remove]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var card = btn.closest("[data-product-id]");
          VoltStore.removeFromWishlist(card.getAttribute("data-product-id"));
          render();
        });
      });

      initVisuals();
      VoltStore.updateBadges();
    }

    render();
  }
})();
