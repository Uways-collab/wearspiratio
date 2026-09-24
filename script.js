/**
 * WEARSPIRATION — Contemporary Luxury Fashion & Footwear
 * Global Interactions & Component Controllers
 */

(function () {
  'use strict';

  // Wait for DOM content to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDOMLoaded);
  } else {
    onDOMLoaded();
  }

  function onDOMLoaded() {
    document.body.classList.add('dom-loaded');
    initApp();
  }

  function initApp() {
    initHeaderScroll();
    initMobileNav();
    initHeroVideo();
    initScrollToTop();
    initScrollReveal();
    initEditorialCardReveal();
    initProductGallery();
    initSizeSelector();
    initAccordions();
    initNewsletterForms();
    initContactForm();
    initShopFilters();
    initReleaseListCTA();
    initStickyScroll();
    initCart();
  }

  /**
   * Hero Video Controller: Ensures video background plays clearly and seamlessly
   */
  function initHeroVideo() {
    const heroVideos = document.querySelectorAll('.hero-video');
    heroVideos.forEach((video) => {
      video.muted = true;
      video.playsInline = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const resume = () => {
            video.play();
          };
          document.addEventListener('click', resume, { once: true });
          document.addEventListener('touchstart', resume, { once: true });
        });
      }
    });
  }

  /**
   * 1. Header Scroll State Controller
   * Adds solid/scrim styling when scrolled past initial hero threshold.
   * Uses requestAnimationFrame to prevent layout thrashing and maintain 60fps.
   */
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let isTicking = false;

    const updateHeader = () => {
      if (window.scrollY > 30) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
      isTicking = false;
    };

    const handleScroll = () => {
      if (!isTicking) {
        window.requestAnimationFrame(updateHeader);
        isTicking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateHeader(); // Initial check
  }

  /**
   * 2. Mobile Navigation Drawer & Accessibility
   * Handles open/close, focus trapping, Escape key, and body scroll lock.
   */
  function initMobileNav() {
    const toggleBtn = document.querySelector('.menu-toggle');
    const drawer = document.querySelector('.mobile-nav-drawer');
    if (!toggleBtn || !drawer) return;

    const navLinks = drawer.querySelectorAll('a, button');

    function openMenu() {
      toggleBtn.setAttribute('aria-expanded', 'true');
      drawer.classList.add('is-active');
      document.body.classList.add('menu-open');
    }

    function closeMenu() {
      toggleBtn.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('is-active');
      document.body.classList.remove('menu-open');
    }

    toggleBtn.addEventListener('click', function () {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close on navigation click
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-active')) {
        closeMenu();
        toggleBtn.focus();
      }
    });
  }

  /**
   * 3. Smooth Scroll-To-Top Button Controller
   * Activates when user scrolls past the hero section (> 350px).
   * Ensures smooth scrolling with respect to reduced-motion preferences.
   */
  function initScrollToTop() {
    let scrollBtn = document.querySelector('.scroll-to-top');

    // Create dynamically if not present in the DOM
    if (!scrollBtn) {
      scrollBtn = document.createElement('button');
      scrollBtn.className = 'scroll-to-top';
      scrollBtn.setAttribute('type', 'button');
      scrollBtn.setAttribute('aria-label', 'Return to top of page');
      scrollBtn.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      `;
      document.body.appendChild(scrollBtn);
    }

    let isTicking = false;

    const updateVisibility = () => {
      // Threshold: 360px down or past hero
      if (window.scrollY > 360) {
        scrollBtn.classList.add('is-visible');
      } else {
        scrollBtn.classList.remove('is-visible');
      }
      isTicking = false;
    };

    const onScroll = () => {
      if (!isTicking) {
        window.requestAnimationFrame(updateVisibility);
        isTicking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateVisibility();

    scrollBtn.addEventListener('click', function () {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
      // Return focus to top skip-link or brand mark
      const brandMark = document.querySelector('.brand-wordmark');
      if (brandMark) {
        brandMark.focus({ preventScroll: true });
      }
    });
  }

  /**
   * 4. IntersectionObserver Reveal Animation
   * Smooth, subtle editorial entrance for content blocks.
   */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  /**
   * 4b. IntersectionObserver Reveal Animation for Editorial Cards
   * Fades in editorial-card elements when they enter the viewport by toggling CSS classes.
   */
  function initEditorialCardReveal() {
    const editorialCards = document.querySelectorAll('.editorial-card');
    if (!editorialCards.length) return;

    if (!('IntersectionObserver' in window)) {
      editorialCards.forEach((card) => {
        card.classList.add('is-revealed', 'is-visible', 'revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed', 'is-visible', 'revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    editorialCards.forEach((card) => observer.observe(card));
  }

  /**
   * 5. Product Image Gallery Controller (PDP)
   * Switches high-resolution view on thumbnail click.
   */
  function initProductGallery() {
    const gallery = document.querySelector('.pdp-gallery');
    if (!gallery) return;

    const mainImg = gallery.querySelector('.pdp-main-image-wrap img');
    const thumbButtons = gallery.querySelectorAll('.pdp-thumb-btn');
    if (!mainImg || !thumbButtons.length) return;

    thumbButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        const targetSrc = btn.getAttribute('data-full-src');
        const targetAlt = btn.getAttribute('data-alt') || mainImg.alt;

        if (!targetSrc) return;

        // Smooth transition
        mainImg.style.opacity = '0.35';
        setTimeout(() => {
          mainImg.src = targetSrc;
          mainImg.alt = targetAlt;
          mainImg.style.opacity = '1';
        }, 120);

        thumbButtons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    });
  }

  /**
   * 6. Size Selector (PDP)
   */
  function initSizeSelector() {
    const sizeButtons = document.querySelectorAll('.size-btn');
    const sizeDisplay = document.querySelector('.selected-size-val');
    if (!sizeButtons.length) return;

    sizeButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        sizeButtons.forEach((b) => {
          b.classList.remove('selected');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('selected');
        btn.setAttribute('aria-checked', 'true');
        const selectedSize = btn.getAttribute('data-size') || btn.textContent.trim();
        if (sizeDisplay) {
          sizeDisplay.textContent = selectedSize;
        }
        const quickAddBtns = document.querySelectorAll('.pdp-actions .btn-quick-add');
        quickAddBtns.forEach((qb) => {
          qb.setAttribute('data-size', selectedSize);
        });
      });
    });
  }

  /**
   * 7. Accordions (PDP / FAQ)
   */
  function initAccordions() {
    const items = document.querySelectorAll('.accordion-item');
    if (!items.length) return;

    items.forEach((item) => {
      const trigger = item.querySelector('.accordion-trigger');
      const content = item.querySelector('.accordion-content');
      if (!trigger || !content) return;

      trigger.addEventListener('click', function () {
        const isOpen = item.classList.contains('is-open');

        const group = item.closest('.accordion-group');
        if (group) {
          group.querySelectorAll('.accordion-item').forEach((sibling) => {
            if (sibling !== item) {
              sibling.classList.remove('is-open');
              const siblingContent = sibling.querySelector('.accordion-content');
              if (siblingContent) siblingContent.style.maxHeight = null;
              const siblingTrigger = sibling.querySelector('.accordion-trigger');
              if (siblingTrigger) siblingTrigger.setAttribute('aria-expanded', 'false');
            }
          });
        }

        if (isOpen) {
          item.classList.remove('is-open');
          content.style.maxHeight = null;
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('is-open');
          content.style.maxHeight = content.scrollHeight + 'px';
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /**
   * 8. Newsletter Form Controller
   * Client-side validation and confirmation feedback without pretending server request.
   */
  function initNewsletterForms() {
    const forms = document.querySelectorAll('.newsletter-form');
    if (!forms.length) return;

    forms.forEach((form) => {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const input = form.querySelector('.newsletter-input');
        if (!input) return;

        const email = input.value.trim();
        if (!email || !email.includes('@')) {
          input.focus();
          return;
        }

        let feedback = form.parentElement.querySelector('.form-feedback');
        if (!feedback) {
          feedback = document.createElement('div');
          feedback.className = 'form-feedback is-visible';
          feedback.setAttribute('role', 'status');
          feedback.setAttribute('aria-live', 'polite');
          form.parentElement.appendChild(feedback);
        }

        feedback.textContent = 'Thank you for your interest. You have been added to the Wearspiration preview list.';
        feedback.classList.add('is-visible');
        form.reset();

        setTimeout(() => {
          feedback.classList.remove('is-visible');
        }, 6000);
      });
    });
  }

  /**
   * 9. Contact Form Controller
   */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = form.querySelector('#contact-name');
      const emailInput = form.querySelector('#contact-email');
      const messageInput = form.querySelector('#contact-message');

      if (!nameInput?.value.trim() || !emailInput?.value.trim() || !messageInput?.value.trim()) {
        return;
      }

      const feedback = document.getElementById('contact-feedback');
      if (feedback) {
        feedback.textContent = 'Your message has been received. Our editorial team will review your inquiry.';
        feedback.classList.add('is-visible');
      }

      form.reset();

      setTimeout(() => {
        if (feedback) feedback.classList.remove('is-visible');
      }, 7000);
    });
  }

  /**
   * 10. Shop Page Filter & Sort Simulator
   */
  function initShopFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.products-grid .product-card');
    if (!filterButtons.length || !productCards.length) return;

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        const filterCategory = btn.getAttribute('data-filter');

        filterButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        productCards.forEach((card) => {
          const cardCategory = card.getAttribute('data-category');
          if (filterCategory === 'all' || cardCategory === filterCategory) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /**
   * 11. "Join the release list" Notification (PDP)
   */
  function initReleaseListCTA() {
    const ctaBtn = document.getElementById('btn-release-list');
    const feedback = document.getElementById('release-feedback');
    if (!ctaBtn || !feedback) return;

    ctaBtn.addEventListener('click', function () {
      feedback.textContent = 'You have joined the release notification list for The Forma Sneaker.';
      feedback.classList.add('is-visible');
      ctaBtn.textContent = 'Added to Priority List';
      ctaBtn.disabled = true;
      ctaBtn.style.opacity = '0.7';

      setTimeout(() => {
        feedback.classList.remove('is-visible');
      }, 5000);
    });
  }

  /**
   * 12. Sticky Scroll Driven Dual Animation Controller
   * Uses IntersectionObserver to detect which .sticky-scroll-panel is active in the viewport.
   * Updates active classes on .sticky-text-card, .sticky-scroll-panel, and .sticky-progress-bar,
   * synchronizing the pinned left-side narrative with the right-side visual canvas.
   */
  function initStickyScroll() {
    const sections = document.querySelectorAll('.sticky-scroll-section');
    if (!sections.length) return;

    sections.forEach((section) => {
      const panels = Array.from(section.querySelectorAll('.sticky-scroll-panel'));
      const textCards = Array.from(section.querySelectorAll('.sticky-text-card'));
      const stepCounter = section.querySelector('.sticky-step-counter');
      const progressBar = section.querySelector('.sticky-progress-bar');

      if (!panels.length || !textCards.length) return;

      let currentIndex = -1;
      let progressRafId = null;
      let pendingProgressIndex = null;

      function renderProgressBar(index) {
        if (progressBar) {
          const percentage = ((index + 1) / panels.length) * 100;
          progressBar.style.width = `${percentage}%`;
          progressBar.classList.add('is-active');
          progressBar.setAttribute('aria-valuenow', String(index + 1));
          progressBar.setAttribute('aria-valuemax', String(panels.length));
        }

        if (stepCounter) {
          const currentStr = String(index + 1).padStart(2, '0');
          const totalStr = String(panels.length).padStart(2, '0');
          stepCounter.textContent = `${currentStr} / ${totalStr}`;
        }
      }

      function scheduleProgressUpdate(index) {
        pendingProgressIndex = index;
        if (progressRafId === null) {
          progressRafId = window.requestAnimationFrame(() => {
            if (pendingProgressIndex !== null) {
              renderProgressBar(pendingProgressIndex);
            }
            progressRafId = null;
          });
        }
      }

      function updateActiveState(index) {
        if (index === currentIndex || index < 0 || index >= panels.length) return;
        currentIndex = index;

        // 1. Synchronize Left Pinned Text Cards (Fade & Slide transitions)
        textCards.forEach((card, idx) => {
          const isActive = idx === index;
          card.classList.toggle('is-active', isActive);
          card.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        });

        // 2. Synchronize Right Visual Panels (Triggers internal staggered animations)
        panels.forEach((panel, idx) => {
          const isActive = idx === index;
          panel.classList.toggle('is-active', isActive);
        });

        // 3. Batch Update Step Counter & Progress Indicator via requestAnimationFrame (prevents layout thrashing, 60fps)
        scheduleProgressUpdate(index);
      }

      // Initialize with the first panel active
      updateActiveState(0);

      // Fallback for browsers without IntersectionObserver support
      if (!('IntersectionObserver' in window)) {
        panels.forEach((p) => p.classList.add('is-active'));
        textCards.forEach((c) => c.classList.add('is-active'));
        return;
      }

      // Map to track intersection ratios for multi-panel crossing
      const visibleRatios = new Map();

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const panelIndex = panels.indexOf(entry.target);
            if (panelIndex !== -1) {
              if (entry.isIntersecting) {
                visibleRatios.set(panelIndex, entry.intersectionRatio);
              } else {
                visibleRatios.delete(panelIndex);
              }
            }
          });

          // Find the panel that holds the highest visible ratio inside the focal viewport zone
          if (visibleRatios.size > 0) {
            let highestIndex = currentIndex;
            let maxRatio = -1;

            visibleRatios.forEach((ratio, idx) => {
              if (ratio > maxRatio) {
                maxRatio = ratio;
                highestIndex = idx;
              }
            });

            if (highestIndex !== -1) {
              updateActiveState(highestIndex);
            }
          }
        },
        {
          root: null,
          // Target the central 50% vertical viewport band for natural storytelling focus
          rootMargin: '-25% 0px -25% 0px',
          threshold: [0.1, 0.25, 0.5, 0.75, 0.9],
        }
      );

      panels.forEach((panel) => observer.observe(panel));
    });
  }

  /**
   * 14. Shopping Bag / Cart & Quick Add Controller
   * Enables adding products directly to the bag from shop grid cards without leaving the page.
   */
  function initCart() {
    const STORAGE_KEY = 'wearspiration_cart';

    // Safe LocalStorage helpers with in-memory fallback
    let memoryCart = [];
    function loadCart() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (err) {
        return memoryCart;
      }
    }

    function saveCart(items) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (err) {
        memoryCart = items;
      }
    }

    // Ensure cart drawer DOM elements exist (create dynamically if not already in markup)
    let backdrop = document.getElementById('cart-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'cart-backdrop';
      backdrop.className = 'cart-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.appendChild(backdrop);
    }

    let drawer = document.getElementById('cart-drawer');
    if (!drawer) {
      drawer = document.createElement('aside');
      drawer.id = 'cart-drawer';
      drawer.className = 'cart-drawer';
      drawer.setAttribute('role', 'dialog');
      drawer.setAttribute('aria-modal', 'true');
      drawer.setAttribute('aria-label', 'Shopping Bag');
      drawer.setAttribute('aria-hidden', 'true');
      drawer.innerHTML = `
        <div class="cart-drawer-header">
          <div class="cart-drawer-title-wrap">
            <span class="eyebrow" style="margin-bottom: 0.2rem;">SHOPPING BAG</span>
            <h2 class="cart-drawer-title">Your Selection (<span class="cart-drawer-count">0</span>)</h2>
          </div>
          <button type="button" class="cart-drawer-close" aria-label="Close shopping bag">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="cart-drawer-body" id="cart-items-container"></div>
        <div class="cart-drawer-footer" id="cart-drawer-footer">
          <div class="cart-shipping-notice">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 14 14"></polyline>
            </svg>
            <span>Complimentary carbon-neutral express courier included</span>
          </div>
          <div class="cart-subtotal-row">
            <span class="cart-subtotal-label">Subtotal</span>
            <span class="cart-subtotal-price" id="cart-subtotal-val">$0</span>
          </div>
          <button type="button" class="btn btn-primary cart-checkout-btn" id="btn-cart-checkout">Proceed to Checkout</button>
          <button type="button" class="cart-continue-btn" id="btn-cart-continue">Continue Browsing</button>
        </div>
      `;
      document.body.appendChild(drawer);
    }

    let toast = document.getElementById('cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cart-toast';
      toast.className = 'cart-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.innerHTML = `
        <div class="cart-toast-info">
          <span class="cart-toast-title">Added to Bag</span>
          <span class="cart-toast-text" id="cart-toast-msg">Item added to your selection</span>
        </div>
        <button type="button" class="cart-toast-btn" id="cart-toast-action">View Bag</button>
      `;
      document.body.appendChild(toast);
    }

    const itemsContainer = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal-val');
    const closeBtn = drawer.querySelector('.cart-drawer-close');
    const checkoutBtn = document.getElementById('btn-cart-checkout');
    const continueBtn = document.getElementById('btn-cart-continue');
    const toastMsg = document.getElementById('cart-toast-msg');
    const toastBtn = document.getElementById('cart-toast-action');

    let toastTimeout = null;

    function getTotalCount(items) {
      return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    }

    function getTotalPrice(items) {
      return items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    }

    function updateBadges(totalCount) {
      const badges = document.querySelectorAll('.cart-count-badge');
      badges.forEach((badge) => {
        badge.textContent = totalCount;
        badge.setAttribute('data-count', totalCount);
        badge.setAttribute('aria-label', `${totalCount} items in cart`);
        // Trigger bump keyframe animation
        badge.classList.remove('badge-bump');
        void badge.offsetWidth; // reflow
        badge.classList.add('badge-bump');
      });

      const drawerCounts = document.querySelectorAll('.cart-drawer-count');
      drawerCounts.forEach((el) => {
        el.textContent = totalCount;
      });
    }

    function renderDrawer() {
      const items = loadCart();
      const totalCount = getTotalCount(items);
      const subtotal = getTotalPrice(items);

      updateBadges(totalCount);

      if (!itemsContainer) return;

      if (items.length === 0) {
        itemsContainer.innerHTML = `
          <div class="cart-empty-state">
            <div class="cart-empty-icon" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <h3 class="cart-empty-title">Your Bag is Empty</h3>
            <p class="cart-empty-desc">Explore the latest architectural releases in footwear and clothing.</p>
            <button type="button" class="btn btn-outline" id="btn-empty-shop" style="margin-top: 0.5rem; min-height: 42px; padding: 0.5rem 1.25rem;">Explore Pieces</button>
          </div>
        `;
        const emptyShopBtn = document.getElementById('btn-empty-shop');
        if (emptyShopBtn) {
          emptyShopBtn.addEventListener('click', closeCart);
        }
        if (subtotalEl) subtotalEl.textContent = '$0';
        if (checkoutBtn) {
          checkoutBtn.disabled = true;
          checkoutBtn.style.opacity = '0.4';
          checkoutBtn.textContent = 'Proceed to Checkout';
        }
        return;
      }

      if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = '1';
        checkoutBtn.textContent = `Proceed to Checkout \u2022 $${subtotal.toLocaleString()}`;
      }

      if (subtotalEl) {
        subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
      }

      let html = '<div class="cart-items-list">';
      items.forEach((item, index) => {
        const itemTotal = (item.price * (item.quantity || 1)).toLocaleString();
        html += `
          <div class="cart-item" data-index="${index}">
            <div class="cart-item-img-wrap">
              <img src="${item.img}" alt="${item.title}" loading="lazy" decoding="async">
            </div>
            <div class="cart-item-details">
              <span class="cart-item-cat">${item.category || 'Atelier'}</span>
              <h4 class="cart-item-title">${item.title}</h4>
              <span class="cart-item-meta">${item.size ? `Size: ${item.size}` : ''}</span>
              <div class="cart-item-row">
                <div class="cart-qty-ctrl" role="group" aria-label="Quantity for ${item.title}">
                  <button type="button" class="cart-qty-btn btn-qty-dec" data-index="${index}" aria-label="Decrease quantity for ${item.title}">&minus;</button>
                  <span class="cart-qty-val" aria-live="polite">${item.quantity || 1}</span>
                  <button type="button" class="cart-qty-btn btn-qty-inc" data-index="${index}" aria-label="Increase quantity for ${item.title}">&plus;</button>
                </div>
                <span class="cart-item-price">$${itemTotal}</span>
              </div>
              <button type="button" class="cart-item-remove" data-index="${index}" aria-label="Remove ${item.title} from bag">Remove</button>
            </div>
          </div>
        `;
      });
      html += '</div>';

      itemsContainer.innerHTML = html;

      // Bind quantity decrease
      itemsContainer.querySelectorAll('.btn-qty-dec').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.dataset.index, 10);
          const current = loadCart();
          if (current[idx]) {
            if (current[idx].quantity > 1) {
              current[idx].quantity -= 1;
            } else {
              current.splice(idx, 1);
            }
            saveCart(current);
            renderDrawer();
          }
        });
      });

      // Bind quantity increase
      itemsContainer.querySelectorAll('.btn-qty-inc').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.dataset.index, 10);
          const current = loadCart();
          if (current[idx]) {
            current[idx].quantity = (current[idx].quantity || 1) + 1;
            saveCart(current);
            renderDrawer();
          }
        });
      });

      // Bind remove
      itemsContainer.querySelectorAll('.cart-item-remove').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.dataset.index, 10);
          const current = loadCart();
          if (current[idx]) {
            current.splice(idx, 1);
            saveCart(current);
            renderDrawer();
          }
        });
      });
    }

    function openCart() {
      renderDrawer();
      if (drawer) {
        drawer.classList.add('is-active');
        drawer.setAttribute('aria-hidden', 'false');
      }
      if (backdrop) {
        backdrop.classList.add('is-active');
        backdrop.setAttribute('aria-hidden', 'false');
      }
      document.body.style.overflow = 'hidden';

      // Focus close button for accessibility
      if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 100);
      }
    }

    function closeCart() {
      if (drawer) {
        drawer.classList.remove('is-active');
        drawer.setAttribute('aria-hidden', 'true');
      }
      if (backdrop) {
        backdrop.classList.remove('is-active');
        backdrop.setAttribute('aria-hidden', 'true');
      }
      document.body.style.overflow = '';
    }

    function showToast(title) {
      if (!toast || !toastMsg) return;
      toastMsg.textContent = `${title} has been added to your bag.`;
      toast.classList.add('is-visible');

      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toast.classList.remove('is-visible');
      }, 4000);
    }

    // Attach listener to Quick Add triggers
    function handleQuickAdd(e) {
      e.preventDefault();
      e.stopPropagation();

      const btn = e.currentTarget;
      const card = btn.closest('.product-card');

      const id = btn.dataset.productId || (card && card.dataset.productId) || 'product-item';
      const title = btn.dataset.title || (card && card.querySelector('.product-card-title')?.textContent?.trim()) || 'Artisanal Piece';
      const price = parseFloat(btn.dataset.price) || 380;
      const currency = btn.dataset.currency || '$';
      const category = btn.dataset.category || (card && card.dataset.category) || 'Footwear';
      const size = btn.dataset.size || 'EU 42';
      const img = btn.dataset.img || (card && card.querySelector('img')?.getAttribute('src')) || '';

      // Add to cart state
      const current = loadCart();
      const existingIndex = current.findIndex((item) => item.id === id && item.size === size);

      if (existingIndex > -1) {
        current[existingIndex].quantity = (current[existingIndex].quantity || 1) + 1;
      } else {
        current.push({
          id,
          title,
          price,
          currency,
          category,
          size,
          img,
          quantity: 1,
        });
      }

      saveCart(current);

      // Button feedback: toggle .is-added on all quick-add buttons for this product card
      const relatedButtons = card
        ? card.querySelectorAll('.btn-quick-add, .product-card-quick-add')
        : [btn];

      relatedButtons.forEach((b) => {
        b.classList.add('is-added');
        const textSpan = b.querySelector('.btn-quick-add-text, .quick-add-text');
        if (textSpan) {
          textSpan.dataset.originalText = textSpan.textContent;
          textSpan.textContent = 'Added \u2713';
        }
      });

      setTimeout(() => {
        relatedButtons.forEach((b) => {
          b.classList.remove('is-added');
          const textSpan = b.querySelector('.btn-quick-add-text, .quick-add-text');
          if (textSpan && textSpan.dataset.originalText) {
            textSpan.textContent = textSpan.dataset.originalText;
          }
        });
      }, 2000);

      // Update badges & re-render drawer
      renderDrawer();

      // Show toast notification
      showToast(title);

      // Smoothly open cart drawer without leaving the page
      openCart();
    }

    // Bind all Quick Add buttons on product cards
    const quickAddButtons = document.querySelectorAll('.btn-quick-add, .product-card-quick-add');
    quickAddButtons.forEach((btn) => {
      btn.addEventListener('click', handleQuickAdd);
    });

    // Bind Header Cart Button triggers
    const headerCartButtons = document.querySelectorAll('.header-cart-btn');
    headerCartButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
      });
    });

    // Bind close actions
    if (closeBtn) {
      closeBtn.addEventListener('click', closeCart);
    }
    if (backdrop) {
      backdrop.addEventListener('click', closeCart);
    }
    if (continueBtn) {
      continueBtn.addEventListener('click', closeCart);
    }
    if (toastBtn) {
      toastBtn.addEventListener('click', () => {
        if (toast) toast.classList.remove('is-visible');
        openCart();
      });
    }

    // Checkout button interaction
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        const items = loadCart();
        if (items.length === 0) return;
        checkoutBtn.disabled = true;
        const originalText = checkoutBtn.textContent;
        checkoutBtn.textContent = 'Connecting to Secure Checkout...';
        setTimeout(() => {
          alert('Thank you for reserving your pieces. An allocation consultant will confirm your order details shortly.');
          checkoutBtn.disabled = false;
          checkoutBtn.textContent = originalText;
          closeCart();
        }, 800);
      });
    }

    // Escape key closes cart
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer && drawer.classList.contains('is-active')) {
        closeCart();
      }
    });

    // Initial render of badges
    const initialItems = loadCart();
    updateBadges(getTotalCount(initialItems));
  }
})();
