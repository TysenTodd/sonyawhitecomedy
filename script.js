// HAMBURGER MENU
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");

  if (window.scrollY > 20) {
    navbar.style.background = "rgba(10, 15, 30, 0.95)";
    navbar.style.boxShadow = "0 12px 40px rgba(0,0,0,0.5)";
  } else {
    navbar.style.background = "rgba(10, 15, 30, 0.85)";
    navbar.style.boxShadow = "0 8px 30px rgba(0,0,0,0.3)";
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
triggers.forEach(el => {
  el.addEventListener("click", () => {
    const videoSrc = el.dataset.video;

    modal.style.display = "flex";
    modalVideo.src = videoSrc + "?autoplay=1";
  });
});

// close button
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  modalVideo.src = "";
});

// click outside modal
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    modalVideo.src = "";
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