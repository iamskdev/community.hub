    document.addEventListener('DOMContentLoaded', function() {
      // Dark Mode Logic
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

      particlesJS('particles-js', {
        "particles": {
          "number": {
            "value": 80,
            "density": {
              "enable": true,
              "value_area": 800
            }
          },
          "color": {
            "value": "#6c5ce7"
          },
          "shape": {
            "type": "circle",
            "stroke": {
              "width": 0,
              "color": "#000000"
            },
            "polygon": {
              "nb_sides": 5
            }
          },
          "opacity": {
            "value": 0.3,
            "random": true,
            "anim": {
              "enable": false,
              "speed": 1,
              "opacity_min": 0.1,
              "sync": false
            }
          },
          "size": {
            "value": 3,
            "random": true,
            "anim": {
              "enable": false,
              "speed": 40,
              "size_min": 0.1,
              "sync": false
            }
          },
          "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#a29bfe",
            "opacity": 0.2,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 2,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
              "enable": false,
              "rotateX": 600,
              "rotateY": 1200
            }
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": true,
              "mode": "grab"
            },
            "onclick": {
              "enable": true,
              "mode": "push"
            },
            "resize": true
          },
          "modes": {
            "grab": {
              "distance": 140,
              "line_linked": {
                "opacity": 0.5
              }
            },
            "bubble": {
              "distance": 400,
              "size": 40,
              "duration": 2,
              "opacity": 8,
              "speed": 3
            },
            "repulse": {
              "distance": 200,
              "duration": 0.4
            },
            "push": {
              "particles_nb": 4
            },
            "remove": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": true
      });
    });

    // Payment button click handler
    document.getElementById('payment-btn').addEventListener('click', function() {
      const btn = this;
      const amountInput = document.querySelector('input[name="donation-amount"]:checked');
      const customAmountInput = document.getElementById('custom-amount');
      
      let amount = amountInput ? parseInt(amountInput.value) : 0;
      
      // Check if custom amount is entered and valid
      if (customAmountInput.value && !isNaN(parseInt(customAmountInput.value))) {
        const customAmount = parseInt(customAmountInput.value);
        if (customAmount >= 10) { // Minimum amount check
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
      
      // Show loading state
      btn.classList.add('loading');
      btn.disabled = true;
      
      // In a real implementation, this would be Razorpay's payment handler
      // For demo, we'll simulate a successful payment after 2 seconds
      simulateRazorpayPayment(amount, this);
    });

    function simulateRazorpayPayment(amount) {
      // This is where you would normally initialize Razorpay
      // Here's a sample of what the Razorpay integration might look like:
      /*
      const options = {
        key: 'YOUR_RAZORPAY_KEY',
        amount: amount * 100, // Razorpay uses paise
        currency: 'INR',
        name: 'Mr. Santosh Creative Work',
        description: 'Support for creative projects',
        image: '/image/profile.jpg',
        handler: function(response) {
          // response.razorpay_payment_id is the real transaction ID
          paymentSuccess(amount, response);
        },
        prefill: {
          name: 'Supporter',
          email: 'supporter@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#6c5ce7'
        }
      };
      
      const rzp = new Razorpay(options);
      rzp.open();
      */
      
      // For demo purposes, we'll simulate the payment flow
      setTimeout(() => {
        // In a real scenario, Razorpay provides a response object
        const mockResponse = {
          razorpay_payment_id: 'rzp_' + Math.random().toString(36).substr(2, 12).toUpperCase()
        };
        paymentSuccess(amount, mockResponse);
      }, 2000);
    }

    function paymentSuccess(amount, response) {
      // Hide loading state
      const btn = document.getElementById('payment-btn');
      btn.classList.remove('loading');
      btn.disabled = false;
      
      // Use the transaction ID from the response
      const transactionId = response.razorpay_payment_id;
      
      // Set the donation amount and transaction ID in the modal
      document.getElementById('donation-amount').textContent = '₹' + amount;
      document.getElementById('transaction-id').textContent = transactionId;
      
      // Show success modal
      document.getElementById('success-modal').classList.add('active');
      
      // Create confetti effect
      createConfetti();
    }

    // Close modal handlers
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('modal-ok-btn').addEventListener('click', closeModal);

    function closeModal() {
      document.getElementById('success-modal').classList.remove('active');
    }

    // Create confetti effect
    function createConfetti() {
      const colors = ['#6c5ce7', '#00cec9', '#a29bfe', '#00b894', '#fdcb6e'];
      const container = document.getElementById('confetti-container');
      
      // Clear previous confetti
      container.innerHTML = '';
      
      // Create new confetti
      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
        
        // Random size
        const size = Math.random() * 10 + 5;
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';
        
        // Random shape
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        
        container.appendChild(confetti);
        
        // Animate
        animateConfetti(confetti);
      }
    }

    function animateConfetti(confetti) {
      const startX = parseFloat(confetti.style.left);
      const startY = -10;
      const endY = window.innerHeight + 10;
      const rotation = Math.random() * 360;
      const duration = Math.random() * 3000 + 2000;
      
      // Set initial position
      confetti.style.top = startY + 'px';
      confetti.style.opacity = '1';
      
      // Animate
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

    // Custom amount input handling
    document.getElementById('custom-amount').addEventListener('input', function() {
      if (this.value) {
        document.querySelectorAll('input[name="donation-amount"]').forEach(radio => {
          radio.checked = false;
        });
      }
    });

    // Radio button handling
    document.querySelectorAll('input[name="donation-amount"]').forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.checked) {
          document.getElementById('custom-amount').value = '';
        }
      });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });

    // Animation on scroll
    const animatedElements = document.querySelectorAll('[data-animation]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    animatedElements.forEach(el => {
      observer.observe(el);
    });

    // Drawer Menu Logic
    const menuToggle = document.getElementById('menu-toggle');
    const drawer = document.getElementById('drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerClose = document.getElementById('drawer-close');
    const drawerLinks = document.querySelectorAll('.drawer-nav a');

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

    if (menuToggle) menuToggle.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
    drawerLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    // Share functionality
    const pageUrl = window.location.href;
    const pageTitle = document.title;

    const showTooltip = (message) => {
      const tooltip = document.getElementById('copy-tooltip');
      if (!tooltip) return;
      tooltip.textContent = message;
      tooltip.classList.add('show');
      setTimeout(() => {
        tooltip.classList.remove('show');
      }, 2000);
    };

    document.getElementById('share-whatsapp')?.addEventListener('click', () => {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(pageTitle + ' - ' + pageUrl)}`, '_blank');
    });

    document.getElementById('share-facebook')?.addEventListener('click', () => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, '_blank');
    });

    document.getElementById('share-twitter')?.addEventListener('click', () => {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(pageTitle)}&url=${encodeURIComponent(pageUrl)}`, '_blank');
    });

    document.getElementById('copy-link')?.addEventListener('click', () => {
      navigator.clipboard.writeText(pageUrl).then(() => {
        showTooltip('Link copied!');
      }).catch(err => {
        console.error('Failed to copy link: ', err);
        showTooltip('Could not copy link.');
      });
    });

    // Dynamic Copyright Year
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('.copyright').forEach(el => {
      el.innerHTML = el.innerHTML.replace('2024', currentYear).replace('2023', currentYear);
    });

    // Header scroll effect
    const header = document.querySelector('header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });
    }

    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          backToTopButton.classList.add('visible');
        } else {
          backToTopButton.classList.remove('visible');
        }
      });
    }

    // Scroll-spy for drawer nav
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.drawer-nav .nav-link');

    const activateLink = (id) => {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    };

    const scrollSpyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activateLink(entry.target.id);
        }
      });
    }, { rootMargin: '-30% 0px -70% 0px', threshold: 0.1 });

    sections.forEach(section => {
      scrollSpyObserver.observe(section);
    });
