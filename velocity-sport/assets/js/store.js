/* =========================================================
   VOLT SPORT — store.js
   Product registry + localStorage-backed cart & wishlist.
   Exposed as window.VoltStore.
   ========================================================= */
(function (global) {
  "use strict";

  var CART_KEY = "volt_cart_v1";
  var WISH_KEY = "volt_wishlist_v1";

  /* ---------- Product registry (single source of truth) ---------- */
  var PRODUCTS = {
    "velocity-pro-racerback": { name: "Velocity Pro Racerback Swimsuit", price: 68, was: 84, category: "Swimwear", gender: "Women", grad: "grad-cyan", visual: "swimsuit", color: "#0B0F1A", accent: "#FF4B3E", photo: "photo-1600965962361-9035dbfd1c50" },
    "ripcurrent-jammer": { name: "RipCurrent Jammer Shorts", price: 42, was: null, category: "Swimwear", gender: "Men", grad: "grad-cyan", visual: "jammer", color: "#0B0F1A", accent: "#23E6C4", photo: "photo-1582012631802-f7b48ad7517c" },
    "hydraline-kids-swim": { name: "HydraLine Kids Swim Set", price: 35, was: null, category: "Swimwear", gender: "Kids", grad: "grad-cyan", visual: "swimsuit", color: "#FFD23F", accent: "#23E6C4", photo: "photo-1651614158095-b98b6c1da74b" },
    "gridiron-match-jersey": { name: "GridIron Match Jersey", price: 54, was: null, category: "Football", gender: "Men", grad: "grad-coral", visual: "jersey", color: "#FF4B3E", accent: "#0B0F1A", photo: "photo-1602674809970-89073c530b0a" },
    "striker-womens-football": { name: "Striker Women's Football Kit", price: 58, was: null, category: "Football", gender: "Women", grad: "grad-coral", visual: "jersey", color: "#23E6C4", accent: "#ffffff", photo: "photo-1629977007398-a17feb6ddf14" },
    "ironcourt-cricket-whites": { name: "IronCourt Cricket Whites Set", price: 72, was: null, category: "Cricket", gender: "Men", grad: "grad-sand", visual: "cricket", color: "#F5F3EA", accent: "#101B3D", photo: "photo-1643294358128-0d2da3b4ea7a" },
    "boundary-kids-cricket": { name: "Boundary Kids Cricket Kit", price: 46, was: 58, category: "Cricket", gender: "Kids", grad: "grad-sand", visual: "cricket", color: "#F5F3EA", accent: "#1E7A3C", photo: "photo-1753443278499-ebe4b8e3a6d7" },
    "smash-pro-badminton-tee": { name: "Smash Pro Badminton Tee", price: 32, was: null, category: "Badminton", gender: "Men", grad: "grad-violet", visual: "badminton", color: "#F5F3EA", accent: "#8C6BFF", photo: "photo-1567220734778-52aeef6a84e8" },
    "rally-womens-badminton": { name: "Rally Women's Badminton Skort Set", price: 49, was: null, category: "Badminton", gender: "Women", grad: "grad-violet", visual: "badminton", color: "#FF8FAE", accent: "#8C6BFF", photo: "photo-1732955365687-152d8ce1f9ab" },
    "aerodash-running-tights": { name: "AeroDash Running Tights", price: 56, was: null, category: "Running", gender: "Men", grad: "grad-volt", visual: "running", color: "#0B0F1A", accent: "#D4FF3F", photo: "photo-1683110848616-d63a5894221d" },
    "pulsefit-running-tank": { name: "PulseFit Running Tank", price: 38, was: null, category: "Running", gender: "Women", grad: "grad-volt", visual: "running", color: "#FF4B3E", accent: "#0B0F1A", photo: "photo-1590646299178-1b26ab821e34" },
    "overload-gym-tee": { name: "Overload Men's Gym Tee", price: 28, was: null, category: "Gym", gender: "Men", grad: "grad-ink", visual: "gymtee", dark: true, color: "#2B3350", accent: "#D4FF3F", photo: "photo-1589472500102-79d9284b8a72" },
    "flexcore-gym-leggings": { name: "FlexCore Women's Gym Leggings", price: 52, was: 64, category: "Gym", gender: "Women", grad: "grad-ink", visual: "leggings", dark: true, color: "#2B3350", accent: "#8C6BFF", photo: "photo-1584464432902-7a05792ff66d" },
    "crease-womens-cricket": { name: "Crease Women's Cricket Whites", price: 69, was: null, category: "Cricket", gender: "Women", grad: "grad-sand", visual: "cricket", color: "#F5F3EA", accent: "#1B4757" },
    "academy-kids-football": { name: "Academy Kids Football Kit", price: 36, was: null, category: "Football", gender: "Kids", grad: "grad-coral", visual: "jersey", color: "#FF6B4D", accent: "#F3FAF9" }
  };

  /* ---------- Safe storage helpers ---------- */
  function safeGet(key) {
    try {
      var raw = global.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
  function safeSet(key, val) {
    try {
      global.localStorage.setItem(key, JSON.stringify(val));
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ---------- Cart ---------- */
  function getCart() { return safeGet(CART_KEY); }
  function setCart(cart) { safeSet(CART_KEY, cart); }

  function addToCart(id, qty) {
    qty = Math.max(1, parseInt(qty, 10) || 1);
    if (!PRODUCTS[id]) return;
    var cart = getCart();
    var existing = cart.find(function (i) { return i.id === id; });
    if (existing) existing.qty += qty;
    else cart.push({ id: id, qty: qty });
    setCart(cart);
  }
  function removeFromCart(id) {
    setCart(getCart().filter(function (i) { return i.id !== id; }));
  }
  function setCartQty(id, qty) {
    qty = Math.max(1, parseInt(qty, 10) || 1);
    var cart = getCart();
    var item = cart.find(function (i) { return i.id === id; });
    if (item) { item.qty = qty; setCart(cart); }
  }
  function clearCart() { setCart([]); }
  function getCartDetailed() {
    return getCart()
      .filter(function (i) { return !!PRODUCTS[i.id]; })
      .map(function (i) {
        var p = PRODUCTS[i.id];
        return Object.assign({ id: i.id, qty: i.qty, lineTotal: +(p.price * i.qty).toFixed(2) }, p);
      });
  }
  function cartCount() {
    return getCart().reduce(function (sum, i) { return sum + i.qty; }, 0);
  }
  function cartSubtotal() {
    return getCartDetailed().reduce(function (sum, i) { return sum + i.lineTotal; }, 0);
  }

  /* ---------- Wishlist ---------- */
  function getWishlist() { return safeGet(WISH_KEY); }
  function setWishlist(list) { safeSet(WISH_KEY, list); }
  function isWished(id) { return getWishlist().indexOf(id) !== -1; }
  function toggleWishlist(id) {
    if (!PRODUCTS[id]) return false;
    var list = getWishlist();
    var idx = list.indexOf(id);
    if (idx === -1) { list.push(id); setWishlist(list); return true; }
    list.splice(idx, 1); setWishlist(list); return false;
  }
  function removeFromWishlist(id) {
    setWishlist(getWishlist().filter(function (w) { return w !== id; }));
  }
  function wishlistCount() { return getWishlist().length; }
  function getWishlistDetailed() {
    return getWishlist()
      .filter(function (id) { return !!PRODUCTS[id]; })
      .map(function (id) { return Object.assign({ id: id }, PRODUCTS[id]); });
  }

  /* ---------- Badges ---------- */
  function updateBadges() {
    var cartEls = document.querySelectorAll("[data-cart-count]");
    var count = cartCount();
    cartEls.forEach(function (el) { el.textContent = count; });
    var wishEls = document.querySelectorAll("[data-wishlist-count]");
    var wcount = wishlistCount();
    wishEls.forEach(function (el) { el.textContent = wcount; });
  }

  /* ---------- Real product & lifestyle photography ----------
     Sourced from Unsplash (free license for commercial + personal use,
     no permission required). Hotlinked via their CDN, so no binary
     download/storage is needed here; the images load in the visitor's
     own browser exactly like the Google Fonts / Bootstrap Icons CDN
     assets already used across the site. */
  function photoUrl(id, w, h) {
    w = w || 600; h = h || 600;
    return "https://images.unsplash.com/" + id + "?auto=format&fit=crop&w=" + w + "&h=" + h + "&q=85";
  }

  /* Category-level "action shot" fallback photography — only used when a
     tile has no specific data-product-id (e.g. flip-cards), so these are
     kept deliberately distinct from every per-product photo below. */
  var VISUAL_PHOTOS = {
    swimsuit:  { id: "photo-1762392050936-cf787f78e812", alt: "Swimmer racing in a competitive pool" },
    jammer:    { id: "photo-1677170273555-84ec47408fb9", alt: "Swim shorts and pool gear" },
    jersey:    { id: "photo-1780548545759-434981c7c46e", alt: "Two players competing for the ball" },
    cricket:   { id: "photo-1729027696167-0f3aa8e92e64", alt: "Cricket batsman playing a shot" },
    badminton: { id: "flagged/photo-1572987337807-6174e06ba9d0", alt: "Badminton player mid-smash" },
    running:   { id: "photo-1668188697843-ab5b42e9fbd8", alt: "Runner sprinting on a track" },
    gymtee:    { id: "photo-1674834727149-00812f907676", alt: "Men's gym t-shirt with dumbbells" },
    leggings:  { id: "photo-1616279969096-54b228f5f103", alt: "Women's athletic leggings" }
  };

  function renderVisual(type, color, accent) {
    var photo = VISUAL_PHOTOS[type] || VISUAL_PHOTOS.jersey;
    var border = accent ? ' style="border:3px solid ' + accent + ';"' : "";
    return '<img class="garment-svg" src="' + photoUrl(photo.id, 640, 640) + '" alt="' + photo.alt + '" loading="lazy"' + border + ">";
  }

  /* Kept for backward compatibility with any leftover data-pictogram
     markup — defers to the same real-photo rendering as data-visual. */
  function renderPictogram(type, accent) {
    return renderVisual(type, null, accent);
  }

  /* Per-product photography — every product gets its own dedicated photo
     (keyed off the existing data-product-id hook already present on every
     product card across the site) instead of sharing one image per
     category, so no two products ever show the same picture. Falls back
     to the category photo above only if a product is somehow missing one. */
  function renderProductPhoto(productId, accent) {
    var p = PRODUCTS[productId];
    if (!p) return renderVisual("jersey", null, accent);
    if (!p.photo) return renderVisual(p.visual, p.color, accent);
    var border = accent ? ' style="border:3px solid ' + accent + ';"' : "";
    return '<img class="garment-svg" src="' + photoUrl(p.photo, 640, 640) + '" alt="' + p.name + '" loading="lazy"' + border + ">";
  }

  var GENDER_PHOTOS = {
    men:   { id: "photo-1780336673680-cc6561d9e971", alt: "Man in athletic wear" },
    women: { id: "photo-1596641211273-938aeaf926a9", alt: "Woman in athletic wear" },
    kids:  { id: "photo-1605550437077-40fd0ae0cc2d", alt: "Child playing sport in a jersey" }
  };

  function renderGenderPictogram(type, accent) {
    var photo = GENDER_PHOTOS[type] || GENDER_PHOTOS.men;
    return '<img src="' + photoUrl(photo.id, 520, 620) + '" alt="' + photo.alt + '" loading="lazy">';
  }

  var AVATAR_PHOTOS = {
    riya:   { id: "photo-1683848644087-c3cb69b77d4f", alt: "Portrait of Riya Menon" },
    daniel: { id: "photo-1761258772329-751d7fb43cff", alt: "Portrait of Daniel Kessler" },
    amara:  { id: "photo-1758518729459-235dcaadc611", alt: "Portrait of Amara Singh" }
  };

  function renderAvatar(key) {
    var photo = AVATAR_PHOTOS[key] || AVATAR_PHOTOS.riya;
    return '<img class="testi-face" src="' + photoUrl(photo.id, 200, 200) + '" alt="' + photo.alt + '" loading="lazy">';
  }


  global.VoltStore = {
    PRODUCTS: PRODUCTS,
    getCart: getCart, addToCart: addToCart, removeFromCart: removeFromCart,
    setCartQty: setCartQty, clearCart: clearCart, getCartDetailed: getCartDetailed,
    cartCount: cartCount, cartSubtotal: cartSubtotal,
    getWishlist: getWishlist, isWished: isWished, toggleWishlist: toggleWishlist,
    removeFromWishlist: removeFromWishlist, wishlistCount: wishlistCount,
    getWishlistDetailed: getWishlistDetailed,
    updateBadges: updateBadges,
    renderVisual: renderVisual,
    renderPictogram: renderPictogram,
    renderProductPhoto: renderProductPhoto,
    renderGenderPictogram: renderGenderPictogram,
    renderAvatar: renderAvatar
  };
})(window);
