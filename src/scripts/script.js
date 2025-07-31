document.addEventListener('DOMContentLoaded', function() {
  // ========== Testimonial Data and Loader (Moved from data-provider.js) ==========
  const testimonials = [
    {
      quote: "Supporting Santosh's creative work has been incredibly rewarding. The quality of projects and the community he's building is inspiring.",
      author: "Khushboo Kumari",
      role: "Supporter since 2021",
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
      author: "Anjali Mehta",
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
    const container = document.getElementById('testimonial-container');
    if (!container) return;

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
  const headerSupportBtn = document.querySelector('.support-btn-header');

  // Unified payment handler for both buttons
  function handlePayment() {
    const amountInput = document.querySelector('input[name="donation-amount"]:checked');
    const customAmountInput = document.getElementById('custom-amount');
    
    let amount = amountInput ? parseInt(amountInput.value) : 0;
    
    if (customAmountInput.value && !isNaN(parseInt(customAmountInput.value))) {
      const customAmount = parseInt(customAmountInput.value);
      if (customAmount >= 10) {
        amount = customAmount;
      } else {
        alert('Minimum donation amount is ₹10');
        return;
      }
    }
    
    if (amount <= 0) {
      alert('Please select or enter a valid amount');
      return;
    }
    
    paymentBtn.classList.add('loading');
    paymentBtn.disabled = true;
    
    // Check if Razorpay is available
    if (typeof Razorpay !== 'undefined') {
      const RAZORPAY_KEY_ID = 'rzp_test_Jvbk6GzsufGhNR'; // IMPORTANT: Replace with your LIVE key from Razorpay dashboard

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: 'INR',
        name: 'Support Santosh\'s Work',
        description: 'Creative Work Support',
        image: 'src/image/my-logo.png',
        handler: function(response) {
          paymentSuccess(amount, response);
        },
        theme: { color: '#6c5ce7' },
        modal: {
          ondismiss: function() {
            console.log('Razorpay checkout form closed');
            // Re-enable the button if the user closes the modal without paying
            paymentBtn.classList.remove('loading');
            paymentBtn.disabled = false;
          }
        }
      };
      
      const rzp = new Razorpay(options);

      rzp.on('payment.failed', function (response) {
        console.error('Payment Failed:', response.error);
        alert(`Payment failed: ${response.error.description}. Please try again.`);
        paymentBtn.classList.remove('loading');
        paymentBtn.disabled = false;
      });

      rzp.open();
    } else {
      // Demo mode when Razorpay not available
      setTimeout(() => {
        const mockResponse = {
          razorpay_payment_id: 'pay_demo_' + Math.random().toString(36).substr(2, 12).toUpperCase()
        };
        paymentSuccess(amount, mockResponse);
      }, 1500);
    }
  }

  paymentBtn.addEventListener('click', handlePayment);

  function paymentSuccess(amount, response) {
    paymentBtn.classList.remove('loading');
    paymentBtn.disabled = false;
    
    const transactionIdElement = document.getElementById('transaction-id');
    const transactionIdContainer = transactionIdElement.parentNode;

    // Clear previous test note if it exists
    const existingNote = transactionIdContainer.querySelector('.test-payment-note');
    if (existingNote) {
      existingNote.remove();
    }

    document.getElementById('donation-amount').textContent = '₹' + amount;
    transactionIdElement.textContent = response.razorpay_payment_id;

    // Add a note if it's a test payment
    if (response.razorpay_payment_id.startsWith('pay_demo_')) {
      const testNote = document.createElement('span');
      testNote.className = 'test-payment-note'; // Add class for easy removal
      testNote.textContent = ' (Test Payment)';
      testNote.style.cssText = 'color: var(--warning); font-weight: normal; margin-left: 4px;';
      transactionIdContainer.appendChild(testNote);
    }
    document.getElementById('success-modal').classList.add('active');
    
    createConfetti();
  }

  // ========== Confetti Effect ==========
  function createConfetti() {
    const colors = ['#6c5ce7', '#00cec9', '#a29bfe', '#00b894', '#fdcb6e'];
    const container = document.getElementById('confetti-container');
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
    
    confetti.style.top = startY + 'px';
    confetti.style.opacity = '1';
    
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
        confetti.remove();
      }
    }
    
    requestAnimationFrame(step);
  }

  // ========== Modal Controls ==========
  document.getElementById('close-modal').addEventListener('click', closeModal);
  document.getElementById('modal-ok-btn').addEventListener('click', closeModal);

  function resetSupportForm() {
    // Reset radio buttons to default
    document.getElementById('amount-100').checked = true;
    // Clear custom amount field
    document.getElementById('custom-amount').value = '';
  }

  function hideSupportSection() {
    const supportSection = document.getElementById('support');
    if (supportSection.style.display === 'block') {
      supportSection.style.animation = 'fadeOutDown 0.5s ease-out forwards';
      
      setTimeout(() => {
        supportSection.style.display = 'none';
        supportSection.style.animation = ''; // Reset animation for next time
        resetSupportForm();
      }, 500);
    }
  }

  function closeModal() {
    document.getElementById('success-modal').classList.remove('active');
    // Hide the support section gracefully after a successful payment
    hideSupportSection();
  }

  document.getElementById('close-support-section').addEventListener('click', hideSupportSection);

  // ========== Donation Amount Handling ==========
  document.getElementById('custom-amount').addEventListener('input', function() {
    if (this.value) {
      document.querySelectorAll('input[name="donation-amount"]').forEach(radio => {
        radio.checked = false;
      });
    }
  });

  document.querySelectorAll('input[name="donation-amount"]').forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked) {
        document.getElementById('custom-amount').value = '';
      }
    });
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

  // ========== Reveal/Scroll to Support Section ==========
  const supportSection = document.getElementById('support');
  const heroSupportBtn = document.getElementById('reveal-support-section-btn');
  // headerSupportBtn is already defined in the Payment System section

  function revealSupportSection(focusPaymentButton = false) {
    // Make section visible if it's not already
    if (getComputedStyle(supportSection).display === 'none') {
      supportSection.style.display = 'block';
      supportSection.style.animation = 'fadeInUp 0.6s ease-out forwards';
    }
    
    // Scroll to the section
    supportSection.scrollIntoView({ behavior: 'smooth' });

    // Optionally focus the main payment button after scrolling
    if (focusPaymentButton) {
      setTimeout(() => {
        document.getElementById('payment-btn').focus();
      }, 600); // Wait for scroll and animation
    }
  }

  if (heroSupportBtn) {
    heroSupportBtn.addEventListener('click', (e) => {
      e.preventDefault();
      revealSupportSection();
    });
  }
  if (headerSupportBtn) {
    headerSupportBtn.addEventListener('click', (e) => {
      e.preventDefault();
      revealSupportSection(true);
    });
  }

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

  // ========== Dynamic Year ==========
  document.querySelectorAll('.copyright').forEach(el => {
    el.textContent = el.textContent.replace('2024', new Date().getFullYear());
  });

  // ========== Scroll Effects ==========
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  const backToTopButton = document.querySelector('.back-to-top');
  window.addEventListener('scroll', () => {
    backToTopButton.classList.toggle('visible', window.scrollY > 300);
  });

  // ========== Load Testimonials and Initialize Slider ==========
  // First, load the testimonial data into the DOM
  loadRandomTestimonials();

  // Then, initialize the Swiper slider on the populated container
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
