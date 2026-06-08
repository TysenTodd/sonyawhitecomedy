(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const supportsIO = "IntersectionObserver" in window;

  const runReady = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  };

  const setBodyScrollLocked = (locked) => {
    document.body.style.overflow = locked ? "hidden" : "auto";
  };

  const addAutoplayParams = (url) => {
    if (!url) return "";
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}autoplay=1&playsinline=1&rel=0`;
  };

  const hydrateIframe = (iframe) => {
    if (!iframe || !iframe.dataset.src) return;
    if (!iframe.src || iframe.src === "about:blank" || iframe.getAttribute("src") === "about:blank") {
      iframe.src = iframe.dataset.src;
    }
  };

  const hydrateMediaInside = (root) => {
    if (!root) return;
    $$('iframe[data-src]', root).forEach(hydrateIframe);
  };

  const unloadMediaInside = (root) => {
    if (!root) return;
    $$('iframe[data-src]', root).forEach((iframe) => {
      iframe.src = "about:blank";
    });
  };

  function openCustomModal(modal) {
    if (!modal) return;
    modal.classList.add("active");
    modal.style.display = "";
    setBodyScrollLocked(true);
    hydrateMediaInside(modal);
  }

  function closeCustomModal(modal) {
    if (!modal) return;
    modal.classList.remove("active");
    modal.style.display = "";
    unloadMediaInside(modal);
    if (!$$(".custom-modal.active").length && !$("#videoModal.active")) {
      setBodyScrollLocked(false);
    }
  }

  function openVideoModal(videoSrc) {
    const videoModal = $("#videoModal");
    const modalVideo = $("#modalVideo");
    if (!videoModal || !modalVideo || !videoSrc) return;

    modalVideo.src = addAutoplayParams(videoSrc);
    videoModal.style.display = "flex";
    videoModal.classList.add("active");
    setBodyScrollLocked(true);
  }

  function closeVideoModal() {
    const videoModal = $("#videoModal");
    const modalVideo = $("#modalVideo");
    if (!videoModal || !modalVideo) return;

    videoModal.classList.remove("active");
    videoModal.style.display = "none";
    modalVideo.src = "about:blank";
    if (!$$('.custom-modal.active').length) {
      setBodyScrollLocked(false);
    }
  }

  window.openVideoModal = openVideoModal;
  window.closeVideoModal = closeVideoModal;

  function setupNavbar() {
    const hamburger = $(".hamburger");
    const navLinks = $(".nav-links");
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");
      hamburger.classList.toggle("active", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.addEventListener("click", (event) => {
      if (!event.target.closest("a")) return;
      navLinks.classList.remove("active");
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    });

    let resizeFrame = null;
    window.addEventListener("resize", () => {
      if (resizeFrame) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = null;
        if (window.innerWidth > 850) {
          navLinks.classList.remove("active");
          hamburger.classList.remove("active");
          hamburger.setAttribute("aria-expanded", "false");
        }
      });
    }, { passive: true });
  }

  function filterVideoCards(scope, filter) {
    const cards = $$(".video-card", scope);
    cards.forEach((card) => {
      const visible = filter === "all" || card.dataset.category === filter;
      card.style.display = visible ? "block" : "none";
      card.style.opacity = visible ? "1" : "";
      card.style.transform = visible ? "" : "";
    });
  }

  function setupShowcaseRotation() {
    const showcaseSection = $(".videos-showcase-pro");
    const showcaseFilters = $$(".videos-pro-filters .bubble");
    if (!showcaseSection || !showcaseFilters.length) return;

    let currentIndex = 0;
    let intervalId = null;

    const activate = (index) => {
      const bubble = showcaseFilters[index];
      if (!bubble) return;
      showcaseFilters.forEach((item) => item.classList.remove("active"));
      bubble.classList.add("active");
      filterVideoCards(showcaseSection, bubble.dataset.filter);
    };

    const stop = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const start = () => {
      if (intervalId || document.hidden) return;
      activate(currentIndex);
      intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % showcaseFilters.length;
        activate(currentIndex);
      }, 10000);
    };

    showcaseSection.addEventListener("click", (event) => {
      const bubble = event.target.closest(".videos-pro-filters .bubble");
      if (!bubble) return;
      currentIndex = showcaseFilters.indexOf(bubble);
      stop();
      activate(currentIndex);
    });

    if (supportsIO) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) start();
          else stop();
        });
      }, { threshold: 0.35 });
      observer.observe(showcaseSection);
    } else {
      start();
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });
  }

  function setupRevealAnimations() {
    const tourCards = $$(".home-tour .tour-card");
    if (tourCards.length) {
      tourCards.forEach((card) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(40px)";
        card.style.transition = "0.6s ease";
      });

      if (supportsIO) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          });
        }, { threshold: 0.2 });

        tourCards.forEach((card) => observer.observe(card));
      } else {
        tourCards.forEach((card) => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        });
      }
    }

    const testimonials = $$(".testimonial-card");
    if (!testimonials.length) return;

    testimonials.forEach((card) => card.classList.add("reveal-ready"));

    if (!supportsIO) {
      testimonials.forEach((card) => card.classList.add("reveal-active"));
      return;
    }

    const testimonialObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("reveal-active");
        testimonialObserver.unobserve(entry.target);
      });
    }, { threshold: 0.2 });

    testimonials.forEach((card) => testimonialObserver.observe(card));
  }

  function setupSectionFilters() {
    document.addEventListener("click", (event) => {
      const swBubble = event.target.closest(".sw-showcase-section .sw-bubble");
      if (swBubble) {
        const showcaseSection = swBubble.closest(".sw-showcase-section");
        const filter = swBubble.dataset.filter;
        $$(".sw-bubble", showcaseSection).forEach((btn) => btn.classList.remove("active"));
        swBubble.classList.add("active");
        $$(".sw-video-card", showcaseSection).forEach((card) => {
          card.classList.toggle("hide", !(filter === "all" || card.dataset.category === filter));
        });
        return;
      }

      const tourFilter = event.target.closest(".tour-modal-filter");
      if (tourFilter) {
        const tourModal = tourFilter.closest(".tour-modal-mini");
        const filter = tourFilter.dataset.filter;
        $$(".tour-modal-filter", tourModal).forEach((btn) => btn.classList.remove("active"));
        tourFilter.classList.add("active");
        $$(".tour-modal-event-card", tourModal).forEach((card) => {
          card.classList.toggle("hide", !(filter === "all" || card.dataset.type === filter));
        });
        return;
      }

      const galleryFilter = event.target.closest(".gallery-modal-upgraded .gallery-filter-card");
      if (galleryFilter) {
        const galleryModal = galleryFilter.closest(".gallery-modal-upgraded");
        const selected = galleryFilter.dataset.filter;
        $$(".gallery-filter-card", galleryModal).forEach((btn) => btn.classList.remove("active"));
        galleryFilter.classList.add("active");
        $$(".gallery-rail", galleryModal).forEach((rail) => {
          const visible = rail.dataset.category === selected;
          rail.style.display = visible ? "block" : "none";
          rail.classList.toggle("active", visible);
        });
      }
    });
  }

  const loadedScripts = new Set();
  function loadScriptOnce(url, callback) {
    if (!url) return;
    if (loadedScripts.has(url)) {
      if (typeof callback === "function") callback();
      return;
    }
    loadedScripts.add(url);
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    if (typeof callback === "function") script.addEventListener("load", callback, { once: true });
    document.body.appendChild(script);
  }

  function loadFacebookEmbed() {
    const holder = $('script[data-defer-social="facebook"]');
    const url = holder?.dataset.src || "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v17.0";
    loadScriptOnce(url, () => {
      if (window.FB?.XFBML?.parse) window.FB.XFBML.parse();
    });
  }

  function loadTikTokEmbed() {
    const holder = $('script[data-defer-social="tiktok"]');
    const url = holder?.dataset.src || "https://www.tiktok.com/embed.js";
    loadScriptOnce(url);
  }

  function setupSocialTabs() {
    const socialText = $("#socialFeedText");
    const textMap = {
      facebook: "See Sonya’s latest updates directly from Facebook.",
      instagram: "View Sonya’s Instagram highlights and follow her latest comedy moments.",
      tiktok: "Watch short-form clips, comedy moments, and featured TikTok content."
    };

    document.addEventListener("click", (event) => {
      const tab = event.target.closest(".social-tab");
      if (!tab) return;

      const selected = tab.dataset.social;
      $$(".social-tab").forEach((btn) => btn.classList.remove("active"));
      tab.classList.add("active");
      $$(".social-feed-panel").forEach((panel) => panel.classList.remove("active"));
      $(`#${selected}Panel`)?.classList.add("active");
      if (socialText && textMap[selected]) socialText.textContent = textMap[selected];

      if (selected === "facebook") loadFacebookEmbed();
      if (selected === "tiktok") loadTikTokEmbed();
    });

    const contactSection = $(".socials-feed-section");
    if (contactSection && supportsIO) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          loadFacebookEmbed();
          observer.unobserve(entry.target);
        });
      }, { rootMargin: "400px 0px", threshold: 0.01 });
      observer.observe(contactSection);
    } else if (contactSection) {
      loadFacebookEmbed();
    }
  }

  function setupModalAndClickDelegation() {
    document.addEventListener("click", (event) => {
      const modalTrigger = event.target.closest(".modal-trigger");
      if (modalTrigger) {
        const modal = document.getElementById(modalTrigger.getAttribute("data-modal"));
        openCustomModal(modal);
        return;
      }

      const customClose = event.target.closest(".hero-modal-close");
      if (customClose) {
        closeCustomModal(customClose.closest(".custom-modal"));
        return;
      }

      const videoCard = event.target.closest(".video-trigger, .sw-video-card");
      if (videoCard && videoCard.dataset.video) {
        event.preventDefault();
        openVideoModal(videoCard.dataset.video);
        return;
      }

      const videoClose = event.target.closest("#videoModal .close-modal");
      if (videoClose) {
        closeVideoModal();
        return;
      }

      const openModal = $("#videoModal.active");
      if (openModal && event.target === openModal) {
        closeVideoModal();
        return;
      }

      const clickedBackdrop = event.target.classList?.contains("custom-modal") ? event.target : null;
      if (clickedBackdrop) {
        closeCustomModal(clickedBackdrop);
        return;
      }

      const jerryBox = event.target.closest(".jerry-click-video");
      if (jerryBox) {
        const videoId = jerryBox.dataset.videoId;
        if (!videoId) return;
        jerryBox.innerHTML = `
          <iframe
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1"
            title="Sonya White Jerry Springer Appearance"
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
          </iframe>
        `;
      }
    });
  }

  function setupCloseAndScrollButtons() {
    const closeAndScroll = (event, modalSelector, targetSelector, delay = 0) => {
      event.preventDefault();
      const modal = modalSelector ? $(modalSelector) : event.currentTarget.closest(".custom-modal");
      if (modal) closeCustomModal(modal);
      const target = $(targetSelector);
      if (!target) return;
      window.setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), delay);
    };

    $$(".close-and-scroll").forEach((btn) => {
      btn.addEventListener("click", (event) => closeAndScroll(event, null, "#tour"));
    });

    $$(".close-gallery-scroll").forEach((btn) => {
      btn.addEventListener("click", (event) => closeAndScroll(event, "#galleryModal", "#gallery"));
    });

    $$(".close-showcase-scroll").forEach((btn) => {
      btn.addEventListener("click", (event) => closeAndScroll(event, "#showcaseModal", "#showcase"));
    });

    $$(".close-tour-scroll").forEach((btn) => {
      btn.addEventListener("click", (event) => closeAndScroll(event, "#tourModal", "#contactForm", 250));
    });
  }

  function setupSiteLock() {
    const overlay = $("#siteLockOverlay");
    const form = $("#siteLockForm");
    const input = $("#siteLockCode");
    const error = $("#siteLockError");
    if (!overlay || !form || !input) return;

    const correctCode = "sonya2026";

    if (localStorage.getItem("siteUnlocked") === "true") {
      overlay.style.display = "none";
      return;
    }

    setBodyScrollLocked(true);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (input.value.trim() === correctCode) {
        localStorage.setItem("siteUnlocked", "true");
        overlay.style.display = "none";
        setBodyScrollLocked(false);
      } else {
        if (error) error.textContent = "Incorrect code. Please try again.";
        input.value = "";
        input.focus();
      }
    });
  }

  function setupFooterBioLink() {
    const footerBioLink = $(".footer-bio-modal-link");
    const bioModal = $("#bioModal");
    if (!footerBioLink || !bioModal) return;

    footerBioLink.addEventListener("click", (event) => {
      event.preventDefault();
      openCustomModal(bioModal);
    });
  }

  function setupTheaterFlipGallery() {
    const cards = $$(".three-set-flip-card");
    if (!cards.length) return;

    const intervals = new WeakMap();

    const prepareCard = (card) => {
      if (card.dataset.flipPrepared === "true") return;
      const images = (card.dataset.images || "").split("|").filter(Boolean);
      if (!images.length) return;

      const frontImg = $(".front img", card);
      const backImg = $(".back img", card);
      if (frontImg) frontImg.src = images[0];
      if (backImg) backImg.src = images[1] || images[0];
      card.dataset.currentIndex = "0";
      card.dataset.showingBack = "false";
      card.dataset.flipPrepared = "true";
    };

    const startCard = (card) => {
      prepareCard(card);
      if (intervals.has(card) || document.hidden) return;
      const images = (card.dataset.images || "").split("|").filter(Boolean);
      if (images.length < 2) return;
      const frontImg = $(".front img", card);
      const backImg = $(".back img", card);

      const id = setInterval(() => {
        let currentIndex = Number(card.dataset.currentIndex || 0);
        let showingBack = card.dataset.showingBack === "true";
        const nextIndex = (currentIndex + 1) % images.length;

        if (showingBack) {
          if (frontImg) frontImg.src = images[nextIndex];
          card.classList.remove("is-flipped");
        } else {
          if (backImg) backImg.src = images[nextIndex];
          card.classList.add("is-flipped");
        }

        card.dataset.showingBack = String(!showingBack);
        card.dataset.currentIndex = String(nextIndex);
      }, 4500);

      intervals.set(card, id);
    };

    const stopCard = (card) => {
      const id = intervals.get(card);
      if (!id) return;
      clearInterval(id);
      intervals.delete(card);
    };

    cards.forEach(prepareCard);

    if (supportsIO) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) startCard(entry.target);
          else stopCard(entry.target);
        });
      }, { rootMargin: "150px 0px", threshold: 0.05 });
      cards.forEach((card) => observer.observe(card));
    } else {
      cards.forEach(startCard);
    }

    document.addEventListener("visibilitychange", () => {
      cards.forEach((card) => {
        if (document.hidden) stopCard(card);
      });
    });
  }

  function setupKeyboardSupport() {
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      $$(".custom-modal.active").forEach(closeCustomModal);
      closeVideoModal();
      setBodyScrollLocked(false);
    });
  }

  function setupFooterModalGlobals() {
    window.openFooterModal = (type) => {
      const modal = $("#footer-modal");
      const text = $("#footer-modal-text");
      if (!modal || !text) return;
      modal.style.display = "flex";
      if (type === "terms") {
        text.innerHTML = `
          <h2>Terms of Service</h2>
          <p>All content and performances are property of Sonya White Comedy. No redistribution without permission.</p>
        `;
      }
      if (type === "privacy") {
        text.innerHTML = `
          <h2>Privacy Policy</h2>
          <p>We only collect basic contact information submitted through forms. No data is sold or shared.</p>
        `;
      }
    };

    window.closeFooterModal = () => {
      const modal = $("#footer-modal");
      if (modal) modal.style.display = "none";
    };
  }

  function setupIdleIframeHydration() {
    const standaloneIframes = $$('iframe[data-src]').filter((iframe) => !iframe.closest('.custom-modal'));
    if (!standaloneIframes.length) return;

    if (supportsIO) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          hydrateIframe(entry.target);
          observer.unobserve(entry.target);
        });
      }, { rootMargin: "250px 0px", threshold: 0.01 });
      standaloneIframes.forEach((iframe) => observer.observe(iframe));
    } else {
      standaloneIframes.forEach(hydrateIframe);
    }
  }

  runReady(() => {
    setupFooterModalGlobals();
    setupNavbar();
    setupModalAndClickDelegation();
    setupSectionFilters();
    setupShowcaseRotation();
    setupRevealAnimations();
    setupSocialTabs();
    setupCloseAndScrollButtons();
    setupSiteLock();
    setupFooterBioLink();
    setupTheaterFlipGallery();
    setupKeyboardSupport();
    setupIdleIframeHydration();
  });
})();
