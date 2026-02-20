// Critical UI: Mobile Nav & Typing Effect (Execute Immediately)
document.addEventListener('DOMContentLoaded', () => {
  /* ---------- MOBILE NAV TOGGLE ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const navEl = document.getElementById('site-nav');

  if (navToggle && navEl) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navEl.classList.toggle('active');
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    // Close menu when clicking on a link
    navEl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navEl.classList.remove('active');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navEl.classList.contains('active') && !navEl.contains(e.target) && !navToggle.contains(e.target)) {
        navEl.classList.remove('active');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      }
    });
  }

  /* ---------- TYPING EFFECT (simple) ---------- */
  const lines = [
    "We Design, Build & Innovate",
    "Crafting Digital Success Stories",
    "Turning Ideas Into Reality"
  ];
  let li = 0, ci = 0;
  const typed = document.getElementById('typed-line') || document.querySelector('.hero-title span');
  const cursor = document.querySelector('.cursor');
  const typingSpeed = 80, erasingSpeed = 40, pause = 1400;

  if (typed) {
    function type() {
      const line = lines[li];
      if (ci < line.length) {
        typed.textContent = line.slice(0, ci + 1);
        ci++;
        setTimeout(type, typingSpeed);
      } else {
        setTimeout(erase, pause);
      }
    }
    function erase() {
      if (ci > 0) {
        typed.textContent = typed.textContent.slice(0, ci - 1);
        ci--;
        setTimeout(erase, erasingSpeed);
      } else {
        li = (li + 1) % lines.length;
        setTimeout(type, 350);
      }
    }
    setTimeout(type, 100); // Start faster
  }

  // blinking cursor
  setInterval(() => { if (cursor) cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0' }, 500);
});

// Heavy Visuals: Canvas, GSAP, Video (Defer until simple load)
window.addEventListener('load', () => {
  // iOS video autoplay fix
  const heroVideo = document.querySelector(".hero-video");
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.setAttribute("playsinline", "");
    heroVideo.setAttribute("webkit-playsinline", "");
    heroVideo.play().catch(() => {
      // fallback for iOS when autoplay fails
      heroVideo.setAttribute("controls", "true");
    });
  }




  /* ---------- GSAP entrance animations ---------- */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // fade in sections
    gsap.utils.toArray('.section').forEach(sec => {
      const elements = sec.querySelectorAll('.overlay-glass, .card, .card img, .testimonials-wrap, .list');
      if (elements.length > 0) {
        gsap.from(elements, {
          scrollTrigger: { trigger: sec, start: 'top 85%' },
          y: 60, opacity: 0, stagger: 0.2, duration: 1.0, ease: 'power4.out'
        });
      }
    });

    // stagger service cards (Faster)
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length > 0) {
      gsap.from('.service-card', {
        scrollTrigger: { trigger: '#services', start: 'top 85%' },
        y: 40, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out'
      });
    }
  }

  /* ---------- Canvas particles & blobs (mouse reactive) ---------- */
  const canvas = document.getElementById('scene-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = canvas.width = innerWidth;
    let H = canvas.height = innerHeight;
    const particles = [];
    const blobs = [];

    // handle resize
    window.addEventListener('resize', () => {
      W = canvas.width = innerWidth;
      H = canvas.height = innerHeight;
    });

    // mouse
    const mouse = { x: W / 2, y: H / 2 };
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

    // create small particles
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        // Hot Pink hues (330 - 360)
        hue: 330 + Math.random() * 30
      });
    }

    // create blobs
    for (let i = 0; i < 6; i++) {
      blobs.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 60 + Math.random() * 120,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        hue: 340 + Math.random() * 30, // Pink/Red range
        alpha: 0.05 + Math.random() * 0.05
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // blobs (soft)
      blobs.forEach(b => {
        const dx = (mouse.x - b.x) * 0.0006;
        const dy = (mouse.y - b.y) * 0.0006;
        b.x += b.vx + dx * 20;
        b.y += b.vy + dy * 20;

        if (b.x - b.r > W) b.x = -b.r;
        if (b.x + b.r < 0) b.x = W + b.r;
        if (b.y - b.r > H) b.y = -b.r;
        if (b.y + b.r < 0) b.y = H + b.r;

        const g = ctx.createRadialGradient(b.x, b.y, b.r * 0.1, b.x, b.y, b.r * 1.1);
        g.addColorStop(0, `hsla(${b.hue}, 70%, 60%, ${b.alpha})`);
        g.addColorStop(0.4, `hsla(${b.hue}, 60%, 50%, ${b.alpha * 0.5})`);
        g.addColorStop(1, `rgba(10, 12, 22, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // particles
      particles.forEach(p => {
        p.x += p.vx + (mouse.x - p.x) * 0.0005;
        p.y += p.vy + (mouse.y - p.y) * 0.0005;

        if (p.x > W + 10) p.x = -10;
        if (p.x < -10) p.x = W + 10;
        if (p.y > H + 10) p.y = -10;
        if (p.y < -10) p.y = H + 10;

        ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, 0.9)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // subtle connecting lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.strokeStyle = `rgba(120, 180, 245, ${1 - d / 140})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }
    draw();

    /* ---------- small performance tweak: pause canvas when tab hidden ---------- */
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        particles.forEach(p => { p.vx = 0; p.vy = 0; });
        blobs.forEach(b => { b.vx = 0; b.vy = 0; });
      } else {
        particles.forEach(p => { p.vx = (Math.random() - 0.5) * 0.3; p.vy = (Math.random() - 0.5) * 0.3; });
        blobs.forEach(b => { b.vx = (Math.random() - 0.5) * 0.6; b.vy = (Math.random() - 0.5) * 0.6; });
      }
    });
  }

}); // DOMContentLoaded end

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    const images = card.querySelector('.card-images');
    if (images) {
      // Toggle visibility
      if (images.style.display === 'none' || images.style.display === '') {
        images.style.display = 'grid';
        // Scroll into view smoothly
        images.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        images.style.display = 'none';
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".close-btn");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  let currentImages = [];
  let currentIndex = 0;

  // Open lightbox when clicking any image
  document.querySelectorAll(".card-images img").forEach(img => {
    img.addEventListener("click", (e) => {
      e.preventDefault();
      const card = e.target.closest(".card");
      currentImages = Array.from(card.querySelectorAll(".card-images img"));
      currentIndex = currentImages.indexOf(e.target);
      showLightbox(currentIndex);
    });
  });

  // Show image in lightbox
  function showLightbox(index) {
    lightboxImg.src = currentImages[index].parentElement.href;
    lightbox.style.display = "flex";
  }

  // Close lightbox when clicking close button
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      lightbox.style.display = "none";
    });
  }

  // Close lightbox when clicking outside the image
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.style.display = "none";
      }
    });
  }

  // Navigate to next image
  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % currentImages.length;
      showLightbox(currentIndex);
    });
  }

  // Navigate to previous image
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      showLightbox(currentIndex);
    });
  }

  // Close lightbox using Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      lightbox.style.display = "none";
    }
  });
});

// SUCCESS MESSAGE animation
if (document.querySelector(".success-inner")) {
  gsap.fromTo(".success-inner",
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".success",
        start: "top 80%",
      }
    }
  );
}

const getQuoteBtn = document.getElementById("get-quote-btn");
const successSection = document.getElementById("success-message");

if (getQuoteBtn && successSection) {
  getQuoteBtn.addEventListener("click", function (e) {
    e.preventDefault();
    successSection.style.display = "block";
    successSection.scrollIntoView({ behavior: "smooth" });

    gsap.fromTo(".success-inner",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  });
}

window.addEventListener('scroll', function () {
  const scrolled = window.pageYOffset;
  const bg = document.querySelector('.parallax-bg');
  if (bg) {
    bg.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
  }
});







/* ================= PORTFOLIO FILTERING ================= */
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add to clicked
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
          const category = item.getAttribute('data-category');

          if (filterValue === 'all' || category === filterValue) {
            item.style.display = '';
            item.style.opacity = '0';
            item.style.transition = 'opacity 0.3s ease';
            setTimeout(() => item.style.opacity = '1', 50);
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
});

/* ================= HERO VIDEO AUTOPLAY ================= */
const heroVideo = document.getElementById('hero-video');
if (heroVideo) {
  heroVideo.play().catch(() => {
    // Autoplay failed, user might need to interact first
  });
}

/* (Mobile navigation logic moved to initialization at top of file) */

/* ================= PORTFOLIO LIGHTBOX ================= */
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  // Get all portfolio items
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  let currentIndex = 0;

  // Function to show image in lightbox
  function showImage(index) {
    if (index < 0) index = portfolioItems.length - 1;
    if (index >= portfolioItems.length) index = 0;

    currentIndex = index;
    const item = portfolioItems[index];
    const img = item.querySelector('img');
    const title = item.querySelector('h3').textContent;
    const category = item.querySelector('p').textContent;

    lightboxImg.src = img.src;
    lightboxCaption.textContent = `${title} - ${category}`;
  }

  // Function to open lightbox
  function openLightbox(index) {
    showImage(index);
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  // Function to close lightbox
  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  if (lightbox && portfolioItems.length > 0) {
    // Add click listeners to VIEW CASE buttons
    portfolioItems.forEach((item, index) => {
      const btn = item.querySelector('.btn');
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          openLightbox(index);
        });
      }
    });

    // Previous button
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        showImage(currentIndex - 1);
      });
    }

    // Next button
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        showImage(currentIndex + 1);
      });
    }

    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }

    // Close on background click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (lightbox.style.display === 'block') {
        if (e.key === 'Escape') {
          closeLightbox();
        } else if (e.key === 'ArrowLeft') {
          showImage(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
          showImage(currentIndex + 1);
        }
      }
    });
  }
});

/* ================= CONTACT FORM MAILTO ================= */
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;

      const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
      const mailtoLink = `mailto:rapidbasedesign1@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

      window.location.href = mailtoLink;
    });
  }
});

/* ================= NEWSLETTER FORM MAILTO ================= */
document.addEventListener('DOMContentLoaded', () => {
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput ? emailInput.value : '';

      if (email) {
        const subject = 'Newsletter Subscription';
        const body = `New subscription request from: ${email}`;
        const mailtoLink = `mailto:rapidbasedesign1@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
      } else {
        alert('Please enter a valid email address.');
      }
    });
  });
});

window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
});
