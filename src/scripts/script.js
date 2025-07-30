document.addEventListener('DOMContentLoaded', function() {
  // ========== Theme Toggle ==========
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      themeToggle.checked = true;
    } else {
      document.body.classList.remove('dark-mode');
      themeToggle.checked = false;
    }
  }

  if (currentTheme) {
    applyTheme(currentTheme);
  } else if (prefersDark) {
    applyTheme('dark');
  }

  themeToggle.addEventListener('change', function() {
    let theme = this.checked ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    applyTheme(theme);
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
  
  // Update all support buttons with rupee symbol
  document.querySelectorAll('.fa-heart').forEach(icon => {
    icon.parentNode.insertBefore(document.createTextNode('₹ '), icon);
  });

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
      const options = {
        key: 'YOUR_RAZORPAY_KEY', // Replace with your actual key
        amount: amount * 100,
        currency: 'INR',
        name: 'Support Santosh\'s Work',
        description: 'Creative Work Support',
        image: 'src/image/picture.jpg',
        handler: function(response) {
          paymentSuccess(amount, response);
        },
        theme: { color: '#6c5ce7' }
      };
      
      const rzp = new Razorpay(options);
      rzp.open();
    } else {
      // Demo mode when Razorpay not available
      setTimeout(() => {
        const mockResponse = {
          razorpay_payment_id: 'demo_' + Math.random().toString(36).substr(2, 12).toUpperCase()
        };
        paymentSuccess(amount, mockResponse);
      }, 1500);
    }
  }

  paymentBtn.addEventListener('click', handlePayment);
  headerSupportBtn.addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('support').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      document.getElementById('payment-btn').focus();
    }, 500);
  });

  function paymentSuccess(amount, response) {
    paymentBtn.classList.remove('loading');
    paymentBtn.disabled = false;
    
    document.getElementById('donation-amount').textContent = '₹' + amount;
    document.getElementById('transaction-id').textContent = response.razorpay_payment_id;
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

  function closeModal() {
    document.getElementById('success-modal').classList.remove('active');
  }

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

  // ========== Smooth Scrolling ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
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

  // ========== Share Functionality ==========
  const pageUrl = window.location.href;
  const pageTitle = document.title;

  const showTooltip = (message) => {
    const tooltip = document.getElementById('copy-tooltip');
    tooltip.textContent = message;
    tooltip.classList.add('show');
    setTimeout(() => tooltip.classList.remove('show'), 2000);
  };

  document.getElementById('share-whatsapp').addEventListener('click', () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(pageTitle + ' - ' + pageUrl)}`, '_blank');
  });

  document.getElementById('share-facebook').addEventListener('click', () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, '_blank');
  });

  document.getElementById('share-twitter').addEventListener('click', () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(pageTitle)}&url=${encodeURIComponent(pageUrl)}`, '_blank');
  });

  document.getElementById('copy-link').addEventListener('click', () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      showTooltip('Link copied!');
    }).catch(err => {
      console.error('Failed to copy link: ', err);
      showTooltip('Could not copy link.');
    });
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
});