window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('loaded');
  }
  // Allow scrolling again once everything is loaded
  document.body.classList.remove('no-scroll');
});

document.addEventListener('DOMContentLoaded', function() {
  // ========== Testimonial Data and Loader (Moved from data-provider.js) ==========
  const testimonials = [
    {
      quote: "Supporting Santosh's creative work has been incredibly rewarding. The quality of projects and the community he's building is inspiring.",
      author: "Khushboo Kumari",
      role: "Supporting since 2021",
      image: "https://randomuser.me/api/portraits/women/32.jpg"
    },
      {
      quote: "I love being a part of this journey. My contribution feels valued, and I get to see tangible results from the projects.",
      author: "Rahul Verma",
      role: "Tech Enthusiast",
      image: "https://randomuser.me/api/portraits/men/45.jpg"
    },
    {
      quote: "An amazing creator with a clear vision. The content is always top-notch and genuinely helpful. Happy to support!",
      author: "Ruby Kumari",
      role: "Designer",
      image: "https://randomuser.me/api/portraits/women/48.jpg"
    },
    {
      quote: "The transparency in how funds are used is what convinced me to contribute. It's great to see my support making a real difference.",
      author: "Vikram Singh",
      role: "Long-time Follower",
      image: "https://randomuser.me/api/portraits/men/51.jpg"
    }
  ];

  function loadRandomTestimonials() {
    return new Promise(resolve => {
      const container = document.getElementById('testimonial-container');
      if (!container) return resolve();

      // Simulate a network delay to show the skeleton
      setTimeout(() => {
        // Clear skeleton loaders
        container.innerHTML = '';

        const shuffledTestimonials = [...testimonials].sort(() => Math.random() - 0.5);

        shuffledTestimonials.forEach(testimonial => {
          const slide = document.createElement('div');
          slide.className = 'swiper-slide';
          slide.innerHTML = `
            <div class="testimonial-card">
              <p class="testimonial-content">${testimonial.quote}</p>
              <div class="testimonial-author">
                <img src="${testimonial.image}" alt="${testimonial.author}" class="author-avatar">
                <div class="author-info">
                  <h4>${testimonial.author}</h4>
                  <p>${testimonial.role}</p>
                </div>
              </div>
            </div>
          `;
          container.appendChild(slide);
        });
        resolve(); // Resolve the promise after loading
      }, 1500); // 1.5 second delay
    });
  }

  // ========== Theme Toggle ==========
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = themeToggleBtn.querySelector('i');
  const currentTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    } else {
      document.body.classList.remove('dark-mode');
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
  }

  if (currentTheme) {
    applyTheme(currentTheme);
  } else if (prefersDark) {
    applyTheme('dark');
  } else {
    applyTheme('light'); // Default to light and set icon
  }

  themeToggleBtn.addEventListener('click', function() {
    const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  });

  // ========== Particles.js ==========
  particlesJS('particles-js', {
    "particles": {
      "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
      "color": { "value": "#6c5ce7" },
      "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" } },
      "opacity": { "value": 0.3, "random": true },
      "size": { "value": 3, "random": true },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#a29bfe",
        "opacity": 0.2,
        "width": 1
      },
      "move": { "enable": true, "speed": 2, "direction": "none" }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": { "enable": true, "mode": "grab" },
        "onclick": { "enable": true, "mode": "push" },
        "resize": true
      }
    },
    "retina_detect": true
  });

  // ========== Payment System ==========
  const paymentBtn = document.getElementById('payment-btn');

  const handlePayment = (event) => {
    // Prevent any default browser action, which is good practice for buttons.
    if(event) event.preventDefault();

    const razorpayUrl = 'https://razorpay.me/@paytosantosh';

    // Try to open the payment link in a new tab. 'noopener' and 'noreferrer' are for security.
    const newWindow = window.open(razorpayUrl, '_blank', 'noopener,noreferrer');

    // Check if the new window was blocked by a popup blocker.
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // If blocked, inform the user and redirect the current page as a fallback.
      alert('Payment page may be blocked by a pop-up blocker. We will redirect you now.');
      window.location.href = razorpayUrl;
    } else {
      // If the new tab opened successfully, show the "redirecting" modal on this page.
      setTimeout(() => { // Use a small timeout for a smoother feel
        closeSupportModal();
        paymentSuccess();
      }, 100);
    }
  };

  if (paymentBtn) {
    paymentBtn.addEventListener('click', handlePayment);
  }

  function paymentSuccess() {
    const successModal = document.getElementById('success-modal');
    if (successModal) {
      successModal.classList.add('active');
      createConfetti();
      // Automatically close the modal after a few seconds for a better UX
      setTimeout(() => {
        // Check if the user hasn't already closed it manually
        if (successModal.classList.contains('active')) {
          successModal.classList.remove('active');
        }
      }, 3000); // 3-second delay
    }
  }

  // ========== Confetti Effect ==========
  function createConfetti() {
    const colors = ['#6c5ce7', '#00cec9', '#a29bfe', '#00b894', '#fdcb6e'];
    const container = document.getElementById('confetti-container');
    if (!container) return;
    container.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      confetti.style.width = Math.random() * 10 + 5 + 'px';
      confetti.style.height = confetti.style.width;
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      container.appendChild(confetti);
      animateConfetti(confetti);
    }
  }

  function animateConfetti(confetti) {
    const startX = parseFloat(confetti.style.left);
    const startY = -10;
    const endY = window.innerHeight + 10;
    const rotation = Math.random() * 360;
    const duration = Math.random() * 3000 + 2000;
    
    const startTime = performance.now();
    
    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const y = startY + (endY - startY) * progress;
      const x = startX + Math.sin(progress * Math.PI * 2) * 100;
      const currentRotation = rotation + progress * 360;
      
      confetti.style.top = y + 'px';
      confetti.style.left = x + 'px';
      confetti.style.transform = 'rotate(' + currentRotation + 'deg)';
      confetti.style.opacity = 1 - progress;
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }
    }
    
    requestAnimationFrame(step);
  }

  // ========== Modal System & Payment Flow ==========
  const supportModalOverlay = document.getElementById('support-modal-overlay');
  const openSupportModalBtn = document.getElementById('open-support-modal-btn');
  const closeSupportModalBtn = document.getElementById('close-support-modal');
  const headerSupportBtn = document.querySelector('.support-btn-header');
  const drawerSupportLink = document.querySelector('.drawer-link[href="#support"]');
  const successModal = document.getElementById('success-modal');

  const openSupportModal = () => {
    if (supportModalOverlay) {
      supportModalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      // No amount to set, just open the modal.
    }
  };

  const closeSupportModal = () => {
    if (supportModalOverlay) {
      supportModalOverlay.classList.remove('active');
      document.body.style.overflow = '';
      // No form to reset.
    }
  };

  // --- Success Modal Controls ---
  if (successModal) {
    document.getElementById('close-modal').addEventListener('click', () => successModal.classList.remove('active'));
    document.getElementById('modal-ok-btn').addEventListener('click', () => successModal.classList.remove('active'));
  }

  // --- Event Listeners to Open/Close Support Modal ---
  openSupportModalBtn.addEventListener('click', openSupportModal);
  headerSupportBtn.addEventListener('click', (e) => { e.preventDefault(); openSupportModal(); });
  drawerSupportLink.addEventListener('click', (e) => { e.preventDefault(); openSupportModal(); });
  closeSupportModalBtn.addEventListener('click', closeSupportModal);
  supportModalOverlay.addEventListener('click', (e) => { if (e.target === supportModalOverlay) closeSupportModal(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && supportModalOverlay.classList.contains('active')) {
      closeSupportModal();
    }
  });

  // ========== Scroll Animations ==========
  const animatedElements = document.querySelectorAll('[data-animation]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => {
    observer.observe(el);
  });

  // ========== Drawer Menu ==========
  const menuToggle = document.getElementById('menu-toggle');
  const drawer = document.getElementById('drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerClose = document.getElementById('drawer-close');

  const openDrawer = () => {
    drawer.classList.add('active');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  menuToggle.addEventListener('click', openDrawer);
  drawerClose.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  // Close drawer when a link is clicked for better UX
  // Note: The support link is handled separately to open the modal
  document.querySelectorAll('.drawer-nav .drawer-link').forEach(link => {
    if (link.getAttribute('href') !== '#support') {
      link.addEventListener('click', closeDrawer);
    }
  });

  // ========== Hero Stats Counter ==========
  const statsContainer = document.querySelector('.hero-stats');

  function animateValue(element, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);
      
      element.textContent = currentValue + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll('.stat-number');
        statNumbers.forEach(el => {
          const text = el.textContent.trim();
          const target = parseFloat(text); // Gets 250 from "250+", 5 from "5K+"
          const suffix = text.replace(/[0-9.]/g, ''); // Gets "+" from "250+", "K+" from "5K+"
          
          animateValue(el, 0, target, 2000, suffix);
        });
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, { threshold: 0.5 });

  if (statsContainer) {
    statsObserver.observe(statsContainer);
  }

  // ========== UPI ID Copy Button ==========
  const copyUpiBtn = document.getElementById('copy-upi-btn');
  const upiIdText = document.getElementById('upi-id-text');

  if (copyUpiBtn && upiIdText) {
    copyUpiBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(upiIdText.value).then(() => {
        showTooltip('UPI ID copied!');
        // Visual feedback on the button
        const icon = copyUpiBtn.querySelector('i');
        icon.classList.remove('fa-copy');
        icon.classList.add('fa-check');
        setTimeout(() => {
          icon.classList.remove('fa-check');
          icon.classList.add('fa-copy');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy UPI ID: ', err);
        showTooltip('Failed to copy!');
      });
    });
  }

  // ========== Share Functionality ==========
  const nativeShareBtn = document.getElementById('native-share-btn');

  const showTooltip = (message) => {
    const tooltip = document.getElementById('copy-tooltip');
    tooltip.textContent = message;
    tooltip.classList.add('show');
    setTimeout(() => tooltip.classList.remove('show'), 2000);
  };

  nativeShareBtn.addEventListener('click', async () => {
    const shareData = {
      title: document.title,
      text: "Check out this awesome page!",
      url: window.location.href,
    };
    try {
      // Use Web Share API if available
      await navigator.share(shareData);
    } catch (err) {
      // Fallback to copying link if Web Share is not available or fails
      navigator.clipboard.writeText(shareData.url).then(() => {
        showTooltip('Link copied to clipboard!');
      });
    }
  });

  // ========== Contact Modal Logic ==========
  const contactModalOverlay = document.getElementById('contact-modal-overlay');
  const openContactModalBtn = document.getElementById('open-contact-modal-btn');
  const openContactModalFooterBtn = document.getElementById('open-contact-modal-footer-btn');
  const closeContactModalBtn = document.getElementById('close-contact-modal');
  const contactForm = document.getElementById('contact-form');

  const openContactModal = () => {
    if (contactModalOverlay) contactModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeContactModal = () => {
    if (contactModalOverlay) contactModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (openContactModalBtn) {
    openContactModalBtn.addEventListener('click', openContactModal);
  }
  if (openContactModalFooterBtn) {
    openContactModalFooterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openContactModal();
    });
  }
  if (closeContactModalBtn) {
    closeContactModalBtn.addEventListener('click', closeContactModal);
  }
  if (contactModalOverlay) {
    contactModalOverlay.addEventListener('click', (e) => {
      if (e.target === contactModalOverlay) {
        closeContactModal();
      }
    });
  }

  // Handle Netlify form submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner" style="display: inline-block; margin: 0;"></span> Sending...';

      const formData = new FormData(contactForm);
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(formData).toString() })
        .then(() => { contactForm.reset(); closeContactModal(); showTooltip('Message sent successfully!'); })
        .catch((error) => { alert('Oops! Something went wrong. Please try again.'); console.error(error); })
        .finally(() => { submitBtn.disabled = false; submitBtn.innerHTML = originalButtonText; });
    });
  }

  // ========== Dynamic Year ==========
  document.querySelectorAll('.copyright-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // ========== Scroll Effects & Scrollspy ==========
  const header = document.querySelector('header');
  const backToTopButton = document.querySelector('.back-to-top');
  const sections = document.querySelectorAll('.hero, .scroll-target');
  const drawerLinks = document.querySelectorAll('.drawer-nav a.drawer-link[href^="#"]');
  const particlesJsEl = document.getElementById('particles-js'); // For parallax
 
  let lastKnownScrollY = 0;
  let ticking = false;

  const handleScroll = () => {
    const scrollY = lastKnownScrollY;
    // 1. Toggle scrolled class on header
    header.classList.toggle('scrolled', scrollY > 50);
    // 2. Toggle visibility of back-to-top button
    backToTopButton.classList.toggle('visible', scrollY > 300);
    // 3. Parallax effect for background
    if (particlesJsEl) {
      particlesJsEl.style.transform = `translateY(${scrollY * 0.4}px)`;
    }
    // 4. Scrollspy logic to highlight active drawer link
    const headerOffset = header.offsetHeight + 20;
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerOffset;
      if (scrollY >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });
    drawerLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };
 
  window.addEventListener('scroll', () => {
    lastKnownScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial call to set correct state on page load
  lastKnownScrollY = window.scrollY;
  handleScroll();

  // ========== FAQ Accordion ==========
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const summary = item.querySelector('summary');
    if (summary) {
      summary.addEventListener('click', (e) => {
        // Prevent the default <details> toggle to handle it manually
        e.preventDefault();

        // If this item is already open, close it.
        if (item.hasAttribute('open')) {
          item.removeAttribute('open');
        } else {
          // Close all other open items first
          faqItems.forEach(otherItem => {
            otherItem.removeAttribute('open');
          });
          // Then, open the clicked item
          item.setAttribute('open', '');
        }
      });
    }
  });

  // ========== Load Testimonials and Initialize Slider ==========
  // Load testimonials and then initialize the slider once the data is in the DOM.
  loadRandomTestimonials().then(() => {
    // Initialize the Swiper slider on the populated container
    new Swiper('.testimonial-slider', {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      slidesPerView: 1,
      spaceBetween: 30,
      
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        }
      }
    });
  });
});
