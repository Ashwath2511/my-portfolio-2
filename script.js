// =========================================
//   PORTFOLIO - script.js (Enhanced)
//   Loader | Theme | Scroll animations |
//   Particles | Cursor trail | Magnetic |
//   Ripple | Text scramble | Parallax
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  initPreloader(() => {
    initThemeSwitcher();
    initNavbar();
    initScrollReveal();
    initSkillBars();
    initCustomCursor();
    // cursor trail removed
    initContactForm();
    initActiveNavLinks();
    initHamburger();
    initTypingEffect();
    initMagneticButtons();
    initRippleEffect();
    initTextScramble();
    initParallaxHero();
    initFullPageParticles();
  });
});


// =========================================
// PRELOADER
// =========================================
function initPreloader(onComplete) {
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('loaderProgressBar');
  const progressGlow = document.getElementById('loaderProgressGlow');
  const percentText = document.getElementById('loaderPercent');
  const particleContainer = document.getElementById('loaderParticles');

  if (!preloader) { onComplete(); return; }

  document.body.classList.add('loading');

  // Spawn floating particles
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'loader-particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.bottom = -(Math.random() * 40) + 'px';
    p.style.animationDuration = (3 + Math.random() * 5) + 's';
    p.style.animationDelay = (Math.random() * 4) + 's';
    p.style.width = p.style.height = (1 + Math.random() * 3) + 'px';
    if (Math.random() > 0.7) p.style.background = '#00b4d8';
    particleContainer.appendChild(p);
  }

  // Simulate loading progress
  let progress = 0;
  const minDuration = 2200;
  const startTime = Date.now();

  function updateProgress() {
    const elapsed = Date.now() - startTime;
    const timeRatio = elapsed / minDuration;

    // Ease-in-out progress that feels natural
    if (progress < 30) {
      progress += 1.2 + Math.random() * 1.5;
    } else if (progress < 70) {
      progress += 0.8 + Math.random() * 2;
    } else if (progress < 90) {
      progress += 0.4 + Math.random() * 1;
    } else if (progress < 100) {
      progress += 0.3 + Math.random() * 0.5;
    }

    // Hold at 98 until minimum time has passed
    if (progress > 98 && timeRatio < 1) {
      progress = 98;
    }

    progress = Math.min(progress, 100);

    progressBar.style.width = progress + '%';
    percentText.textContent = Math.floor(progress) + '%';

    if (progress >= 1) {
      progressGlow.style.opacity = '1';
      progressGlow.style.left = `calc(${progress}% - 15px)`;
    }

    if (progress < 100) {
      requestAnimationFrame(updateProgress);
    } else {
      // Complete — fade out
      setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.classList.remove('loading');
        setTimeout(() => {
          preloader.style.display = 'none';
          onComplete();
        }, 700);
      }, 300);
    }
  }

  requestAnimationFrame(updateProgress);
}





// =========================================
// THEME SWITCHER
// =========================================
function initThemeSwitcher() {
  const html = document.documentElement;
  const buttons = document.querySelectorAll('.theme-btn');
  const savedTheme = localStorage.getItem('portfolio-theme') || 'blue';

  setTheme(savedTheme);

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      setTheme(theme);
      localStorage.setItem('portfolio-theme', theme);
    });
  });

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    buttons.forEach(b => {
      b.classList.toggle('active', b.dataset.theme === theme);
    });
    setTimeout(animateSkillBars, 100);
  }
}


// =========================================
// NAVBAR — SCROLL EFFECT
// =========================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    navbar.classList.toggle('scrolled', current > 50);
    if (current > lastScroll + 8 && current > 200) {
      navbar.style.transform = 'translateY(-100%)';
    } else if (current < lastScroll - 8) {
      navbar.style.transform = 'translateY(0)';
    }
    lastScroll = current;
  });
}

// Active nav links on scroll
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  });
}

// Hamburger menu
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}


// =========================================
// SCROLL REVEAL
// =========================================
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = getSiblingDelay(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  function getSiblingDelay(el) {
    const parent = el.parentElement;
    if (!parent) return 0;
    const siblings = [...parent.children].filter(c =>
      c.classList.contains('reveal-up') ||
      c.classList.contains('reveal-left') ||
      c.classList.contains('reveal-right')
    );
    const index = siblings.indexOf(el);
    return index * 120;
  }
}


// =========================================
// SKILL BARS
// =========================================
function initSkillBars() {
  const skillSection = document.getElementById('skills');

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateSkillBars();
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  if (skillSection) observer.observe(skillSection);
}

function animateSkillBars() {
  document.querySelectorAll('.skill-fill').forEach(bar => {
    const width = bar.dataset.width;
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.width = width + '%';
    }, 100);
  });
}


// =========================================
// CUSTOM CURSOR
// =========================================
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const outline = document.getElementById('cursorOutline');
  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  if (!dot || !outline) return;

  if ('ontouchstart' in window) {
    dot.style.display = 'none';
    outline.style.display = 'none';
    return;
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;
    outline.style.left = outlineX + 'px';
    outline.style.top = outlineY + 'px';
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-card, .about-card, .contact-item');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => outline.classList.add('hovered'));
    el.addEventListener('mouseleave', () => outline.classList.remove('hovered'));
  });
}





// =========================================
// CONTACT FORM — Uses config.js keys
// =========================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (!form) return;

  // Use CONFIG from config.js (gitignored)
  const serviceId = (typeof CONFIG !== 'undefined') ? CONFIG.EMAILJS_SERVICE_ID : '';
  const templateId = (typeof CONFIG !== 'undefined') ? CONFIG.EMAILJS_TEMPLATE_ID : '';
  const publicKey = (typeof CONFIG !== 'undefined') ? CONFIG.EMAILJS_PUBLIC_KEY : '';
  const contactEmail = (typeof CONFIG !== 'undefined') ? CONFIG.CONTACT_EMAIL : 'ashwathofficial2511@gmail.com';

  // Initialize EmailJS
  if (window.emailjs && publicKey) {
    emailjs.init(publicKey);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    status.className = "form-status";
    status.style.display = "none";

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    try {
      if (window.emailjs && serviceId && templateId) {
        await emailjs.send(serviceId, templateId, {
          from_name: name,
          from_email: email,
          subject: subject,
          message: message,
          to_email: contactEmail
        });
        form.reset();

        // Show Success Modal
        const successModal = document.getElementById('successModal');
        if (successModal) {
          successModal.classList.add('active');
          
          // Trigger confetti burst from the center of the modal icon
          const iconContainer = successModal.querySelector('.success-icon-container') || btn;
          setTimeout(() => fireConfetti(iconContainer), 300);

          // Hide modal and reset button after 4 seconds
          setTimeout(() => {
            successModal.classList.remove('active');
            btn.innerHTML = originalText;
            btn.disabled = false;
          }, 4000);
        } else {
          // Fallback if modal HTML is missing
          showStatus(status, "success", "\u{1F389} Message sent successfully!");
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
          }, 3000);
        }

      } else {
        const body = `Name: ${name}%0AEmail: ${email}%0A%0A${encodeURIComponent(message)}`;
        const mailtoLink = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${body}`;
        window.location.href = mailtoLink;
        showStatus(status, "success", "\u{1F4EC} Opening your mail client...");
        setTimeout(() => form.reset(), 1000);
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    } catch (err) {
      console.error(err);
      showStatus(status, "error", "\u274C Failed to send. Please try again later.");
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });

  // Confetti Burst Effect Generator
  function fireConfetti(buttonEl) {
    const rect = buttonEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const colors = ['#00ffd5', '#00b4d8', '#00c864', '#ffffff', '#ff0055'];

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      particle.style.width = Math.random() * 8 + 4 + 'px';
      particle.style.height = Math.random() * 8 + 4 + 'px';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      particle.style.zIndex = '99999';
      particle.style.pointerEvents = 'none';
      document.body.appendChild(particle);

      // Random explosion angles
      const angle = Math.random() * Math.PI * 2;
      const velocity = 60 + Math.random() * 120;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - 80; // slight upward bias

      particle.animate([
        { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
        { transform: `translate(${tx}px, ${ty}px) scale(0) rotate(${Math.random() * 720}deg)`, opacity: 0 }
      ], {
        duration: 800 + Math.random() * 600,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        fill: 'forwards'
      });

      // Cleanup
      setTimeout(() => particle.remove(), 1500);
    }
  }

  function showStatus(el, type, message) {
    // Reset classes and trigger reflow to restart CSS animations
    el.className = "form-status";
    void el.offsetWidth;

    el.className = "form-status " + type;
    el.innerHTML = message;
    el.style.display = "block";

    // Smooth fade out before hiding
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(-10px)";
      el.style.transition = "all 0.4s ease";
      setTimeout(() => {
        el.style.display = "none";
        el.style.opacity = "";
        el.style.transform = "";
        el.style.transition = "";
      }, 400);
    }, 6000);
  }
}


// =========================================
// TYPING EFFECT — Hero subtitle
// =========================================
function initTypingEffect() {
  const roles = [
    'Frontend Developer',
    'UI/UX Enthusiast',
    'React Developer',
    'Web Designer'
  ];

  const tagEl = document.querySelector('.hero-tag');
  if (!tagEl) return;

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentRole = roles[roleIndex];
    if (!isDeleting) {
      tagEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentRole.length) {
        setTimeout(() => { isDeleting = true; type(); }, 2000);
        return;
      }
    } else {
      tagEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    const speed = isDeleting ? 60 : 100;
    setTimeout(type, speed);
  }
  setTimeout(type, 1500);
}


// =========================================
// MAGNETIC BUTTONS
// =========================================
function initMagneticButtons() {
  if ('ontouchstart' in window) return;
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}


// =========================================
// RIPPLE EFFECT ON BUTTONS
// =========================================
function initRippleEffect() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}


// =========================================
// TEXT SCRAMBLE ON SECTION TITLES
// =========================================
function initTextScramble() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
  const titles = document.querySelectorAll('.section-title[data-text]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        scramble(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  titles.forEach(t => observer.observe(t));

  function scramble(el) {
    const original = el.dataset.text;
    let iteration = 0;
    const interval = setInterval(() => {
      el.dataset.text = original.split('').map((char, i) => {
        if (i < iteration) return original[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      iteration += 1 / 2;
      if (iteration >= original.length) {
        el.dataset.text = original;
        clearInterval(interval);
      }
    }, 40);
  }
}


// =========================================
// PARALLAX HERO ON MOUSE MOVE
// =========================================
function initParallaxHero() {
  const hero = document.querySelector('.hero');
  if (!hero || 'ontouchstart' in window) return;

  const shapes = hero.querySelectorAll('.shape');
  const photo = hero.querySelector('.photo-ring');

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    shapes.forEach((s, i) => {
      const depth = (i + 1) * 12;
      s.style.transform = `translate(${x * depth}px, ${y * depth}px) rotate(${x * 10}deg)`;
    });

    if (photo) {
      photo.style.transform = `translate(${x * -15}px, ${y * -15}px)`;
    }
  });

  hero.addEventListener('mouseleave', () => {
    shapes.forEach(s => { s.style.transform = ''; });
    if (photo) photo.style.transform = '';
  });
}


// =========================================
// FULL PAGE PARTICLES (Canvas)
// =========================================
function initFullPageParticles() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  const count = 80;
  let mouseX = -999, mouseY = -999;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function getColor() {
    const theme = document.documentElement.getAttribute('data-theme');
    const colors = {
      blue: '79,158,255',
      matrix: '0,255,65',
      white: '59,91,219',
      cosmic: '191,95,255',
      darkfuture: '0,255,213'
    };
    return colors[theme] || '79,158,255';
  }

  function create() {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.4 + 0.1
      });
    }
  }

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const color = getColor();

    particles.forEach(p => {
      // Mouse repulsion
      const distMouse = Math.hypot(p.x - mouseX, p.y - mouseY);
      if (distMouse < 120) {
        const angle = Math.atan2(p.y - mouseY, p.x - mouseX);
        const force = (120 - distMouse) / 120;
        p.x += Math.cos(angle) * force * 2;
        p.y += Math.sin(angle) * force * 2;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${p.opacity})`;
      ctx.fill();

      // Connect nearby
      particles.forEach(p2 => {
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${color},${0.05 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); create(); });
  resize();
  create();
  draw();
}


// =========================================
// COUNTER ANIMATION — Hero Stats
// =========================================
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const targets = [4, 2, 5];
  let triggered = false;

  function startCounting() {
    counters.forEach((counter, i) => {
      const target = targets[i];
      let current = 0;
      const increment = target / 40;
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target + '+';
          clearInterval(interval);
        } else {
          counter.textContent = Math.floor(current) + '+';
        }
      }, 40);
    });
  }

  const heroSection = document.getElementById('home');
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !triggered) {
      triggered = true;
      setTimeout(startCounting, 800);
    }
  }, { threshold: 0.5 });

  if (heroSection) obs.observe(heroSection);
})();


// =========================================
// SMOOTH SCROLL for nav links
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


// =========================================
// PROJECT CARD TILT EFFECT
// =========================================
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  });
});


// =========================================
// SCROLL PROGRESS BAR
// =========================================
(function initProgressBar() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px; z-index: 99999;
    background: var(--accent); width: 0%;
    box-shadow: 0 0 10px var(--accent-glow);
    transition: width 0.1s linear;
  `;
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const scrolled = window.scrollY;
    const total = doc.scrollHeight - doc.clientHeight;
    bar.style.width = ((scrolled / total) * 100) + '%';
  });
})();