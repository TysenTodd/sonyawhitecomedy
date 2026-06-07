// HAMBURGER MENU
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
  if (!navLinks) return;

  const isOpen = navLinks.classList.toggle('active');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger?.classList.remove('active');
    hamburger?.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 850) {
    navLinks?.classList.remove('active');
    hamburger?.classList.remove('active');
    hamburger?.setAttribute('aria-expanded', 'false');
  }
});




// =========================
// ELEMENTS
// =========================
const bubbles = document.querySelectorAll(".bubble");
const cards = document.querySelectorAll(".video-card");

const modal = document.getElementById("videoModal");
const modalVideo = document.getElementById("modalVideo");
const triggers = document.querySelectorAll(".video-trigger");
const closeBtn = document.querySelector(".close-modal");


// =========================
// BUBBLE FILTER SYSTEM (NEW)
// =========================
bubbles.forEach(bubble => {
  bubble.addEventListener("click", () => {

    // active state
    bubbles.forEach(b => b.classList.remove("active"));
    bubble.classList.add("active");

    const filter = bubble.dataset.filter;

    cards.forEach(card => {

      const category = card.dataset.category;

      if (filter === "all" || category === filter) {

        card.style.display = "block";

        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "scale(1)";
        }, 50);

      } else {

        card.style.opacity = "0";
        card.style.transform = "scale(0.95)";

        setTimeout(() => {
          card.style.display = "none";
        }, 200);
      }
    });

  });
});




// =========================
// MODAL SYSTEM (FIXED)
// =========================
if (modal && modalVideo) {
  triggers.forEach(el => {
    el.addEventListener("click", () => {
      const videoSrc = el.dataset.video;

      modal.style.display = "flex";
      modal.classList.add("active");
      modalVideo.src = videoSrc.includes("?") ? `${videoSrc}&autoplay=1` : `${videoSrc}?autoplay=1`;
    });
  });
}

function closeVideoModal() {
  if (!modal || !modalVideo) return;
  modal.classList.remove("active");
  modal.style.display = "none";
  modalVideo.src = "";
}

// close button
closeBtn?.addEventListener("click", closeVideoModal);

// click outside modal
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeVideoModal();
  }
});


// HOME TOUR SCROLL ANIMATION
const tourCards = document.querySelectorAll(".home-tour .tour-card");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, { threshold: 0.2 });

tourCards.forEach(card => {
  card.style.opacity = "0";
  card.style.transform = "translateY(40px)";
  card.style.transition = "0.6s ease";
  observer.observe(card);
});



function openFooterModal(type) {
  const modal = document.getElementById("footer-modal");
  const text = document.getElementById("footer-modal-text");

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
}

function closeFooterModal() {
  document.getElementById("footer-modal").style.display = "none";
}

/* =========================
   ABOUT PAGE MODALS
========================= */

const modalTriggers = document.querySelectorAll(".modal-trigger");
const modals = document.querySelectorAll(".custom-modal");
const closeButtons = document.querySelectorAll(".close-modal");

modalTriggers.forEach(trigger => {
  trigger.addEventListener("click", () => {

    const modalId = trigger.getAttribute("data-modal");
    const modal = document.getElementById(modalId);

    if(modal){
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }

  });
});

closeButtons.forEach(button => {
  button.addEventListener("click", () => {
    const parentModal = button.closest(".custom-modal");

    if (parentModal) {
      parentModal.classList.remove("active");
      parentModal.style.display = "";
      document.body.style.overflow = "auto";
      return;
    }

    if (button.closest("#videoModal")) {
      closeVideoModal();
    }
  });
});

window.addEventListener("click", (e) => {

  modals.forEach(modal => {

    if(e.target === modal){
      modal.classList.remove("active");
      modal.style.display = "";
      document.body.style.overflow = "auto";
    }

  });

});


const modalIds = [
  "bioModal",
  "tourModal",
  "galleryModal",
  "showcaseModal",
  "cinemaModal"
];

modalIds.forEach(id => {
  const modal = document.getElementById(id);

  if (!modal) return;

  const closeBtn = modal.querySelector(".hero-modal-close");

  closeBtn?.addEventListener("click", () => {
    modal.classList.remove("active");
    modal.style.display = "";
    document.body.style.overflow = "auto";
  });
});

function setupBubbleFilters(container) {
  const bubbles = container.querySelectorAll(".bubble");
  const cards = container.querySelectorAll(".video-card");

  bubbles.forEach(bubble => {
    bubble.addEventListener("click", () => {

      bubbles.forEach(b => b.classList.remove("active"));
      bubble.classList.add("active");

      const filter = bubble.dataset.filter;

      cards.forEach(card => {

        const category = card.dataset.category;

        if (filter === "all" || category === filter) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }

      });

    });
  });
}

const showcaseModal = document.getElementById("showcaseModal");

if (showcaseModal) {
  setupBubbleFilters(showcaseModal);
}

/* =========================
   SONYA SHOWCASE MINI FILTER + VIDEO
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const showcaseSection = document.querySelector(".sw-showcase-section");
  if (!showcaseSection) return;

  const showcaseBubbles = showcaseSection.querySelectorAll(".sw-bubble");
  const showcaseCards = showcaseSection.querySelectorAll(".sw-video-card");

  showcaseBubbles.forEach((bubble) => {
    bubble.addEventListener("click", () => {
      const filter = bubble.dataset.filter;

      showcaseBubbles.forEach((btn) => btn.classList.remove("active"));
      bubble.classList.add("active");

      showcaseCards.forEach((card) => {
        const category = card.dataset.category;

        if (filter === "all" || category === filter) {
          card.classList.remove("hide");
        } else {
          card.classList.add("hide");
        }
      });
    });
  });

  const videoModal = document.getElementById("videoModal");
  const modalVideo = document.getElementById("modalVideo");

  showcaseCards.forEach((card) => {
    card.addEventListener("click", () => {
      if (!videoModal || !modalVideo) return;

      const videoURL = card.dataset.video;
      modalVideo.src = videoURL;
      videoModal.style.display = "flex";
    });
  });
});

/* =========================
   TOUR MODAL FILTERS
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const tourModal = document.querySelector(".tour-modal-mini");
  if (!tourModal) return;

  const filterButtons = tourModal.querySelectorAll(".tour-modal-filter");
  const eventCards = tourModal.querySelectorAll(".tour-modal-event-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      eventCards.forEach((card) => {
        const type = card.dataset.type;

        if (filter === "all" || type === filter) {
          card.classList.remove("hide");
        } else {
          card.classList.add("hide");
        }
      });
    });
  });
});

/* =========================
   GALLERY MODAL FILTERS
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const galleryModal = document.querySelector(".gallery-modal-upgraded");
  if (!galleryModal) return;

  const filters = galleryModal.querySelectorAll(".gallery-filter-card");
  const rails = galleryModal.querySelectorAll(".gallery-rail");

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const selected = filter.dataset.filter;

      filters.forEach((btn) => btn.classList.remove("active"));
      filter.classList.add("active");

      rails.forEach((rail) => {
        if (rail.dataset.category === selected) {
          rail.style.display = "block";
          rail.classList.add("active");
        } else {
          rail.style.display = "none";
          rail.classList.remove("active");
        }
      });
    });
  });
});

/* =====================
   SOCIAL FEED TABS
===================== */

document.addEventListener("DOMContentLoaded", () => {
  const socialTabs = document.querySelectorAll(".social-tab");
  const socialPanels = document.querySelectorAll(".social-feed-panel");
  const socialText = document.getElementById("socialFeedText");

  const textMap = {
    facebook: "See Sonya’s latest updates directly from Facebook.",
    instagram: "View Sonya’s Instagram highlights and follow her latest comedy moments.",
    tiktok: "Watch short-form clips, comedy moments, and featured TikTok content."
  };

  socialTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const selected = tab.dataset.social;

      socialTabs.forEach((btn) => btn.classList.remove("active"));
      tab.classList.add("active");

      socialPanels.forEach((panel) => {
        panel.classList.remove("active");
      });

      document.getElementById(`${selected}Panel`).classList.add("active");

      if (socialText) {
        socialText.textContent = textMap[selected];
      }
    });
  });
});

const showcaseSection = document.querySelector(".videos-showcase-pro");
const showcaseFilters = document.querySelectorAll(
  ".videos-pro-filters .bubble"
);

let showcaseRotationStarted = false;
let showcaseRotationInterval;

function startShowcaseRotation() {
  if (showcaseRotationStarted) return;

  showcaseRotationStarted = true;

  let currentIndex = 0;

  function activateFilter(index) {
    showcaseFilters[index].click();
  }

  activateFilter(0);

  showcaseRotationInterval = setInterval(() => {
    currentIndex++;

    if (currentIndex >= showcaseFilters.length) {
      currentIndex = 0;
    }

    activateFilter(currentIndex);

  }, 10000);
}

const showcaseObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {

      if (entry.isIntersecting) {
        startShowcaseRotation();
      }

    });
  },
  {
    threshold: 0.4
  }
);

if (showcaseSection) {
  showcaseObserver.observe(showcaseSection);
}


document.addEventListener("DOMContentLoaded", () => {
  const testimonialCards = document.querySelectorAll(".testimonial-card");

  testimonialCards.forEach(card => {
    card.classList.add("reveal-ready");
  });

  const testimonialObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
          testimonialObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  testimonialCards.forEach(card => testimonialObserver.observe(card));
});

//Script for modals to close when button (not X button) is clicked

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".close-and-scroll").forEach(btn => {
    btn.addEventListener("click", function(e) {
      e.preventDefault();

      const modal = this.closest(".custom-modal");

      if (modal) {
        modal.classList.remove("active");
        modal.style.display = "";
      }

      document.body.style.overflow = "auto";

      const target = document.querySelector("#tour");

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
});

document.querySelectorAll(".close-gallery-scroll").forEach(btn => {
  btn.addEventListener("click", function(e) {
    e.preventDefault();

    const galleryModal = document.getElementById("galleryModal");

    if (galleryModal) {
      galleryModal.classList.remove("active");
      document.body.style.overflow = "auto";
    }

    const galleryTarget = document.querySelector("#gallery");

    if (galleryTarget) {
      galleryTarget.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

document.querySelectorAll(".close-showcase-scroll").forEach(btn => {
  btn.addEventListener("click", function(e) {
    e.preventDefault();

    const modal = document.getElementById("showcaseModal");

    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    }

    const showcaseTarget = document.querySelector("#showcase");

    if (showcaseTarget) {
      showcaseTarget.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

document.querySelectorAll(".close-tour-scroll").forEach(btn => {
  btn.addEventListener("click", function(e) {
    e.preventDefault();

    const modal = document.getElementById("tourModal");
    const contactForm = document.getElementById("contactForm");

    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    }

    if (contactForm) {
      setTimeout(() => {
        contactForm.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 250);
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("siteLockOverlay");
  const form = document.getElementById("siteLockForm");
  const input = document.getElementById("siteLockCode");
  const error = document.getElementById("siteLockError");

  const correctCode = "sonya2026";

  if (localStorage.getItem("siteUnlocked") === "true") {
    overlay.style.display = "none";
    return;
  }

  document.body.style.overflow = "hidden";

  form.addEventListener("submit", e => {
    e.preventDefault();

    if (input.value.trim() === correctCode) {
      localStorage.setItem("siteUnlocked", "true");
      overlay.style.display = "none";
      document.body.style.overflow = "auto";
    } else {
      error.textContent = "Incorrect code. Please try again.";
      input.value = "";
      input.focus();
    }
  });
});

/* =========================
   MOBILE MODAL ESCAPE SUPPORT
========================= */
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;

  document.querySelectorAll(".custom-modal.active").forEach(openModal => {
    openModal.classList.remove("active");
    openModal.style.display = "";
  });

  closeVideoModal();
  document.body.style.overflow = "auto";
});
