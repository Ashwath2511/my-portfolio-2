// =========================================
//   PORTFOLIO - script.js
//   Theme switcher | Scroll animations |
//   Skill bars | Custom cursor | Form
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initNavbar();
  initScrollReveal();
  initSkillBars();
  initCustomCursor();
  initContactForm();
  initActiveNavLinks();
  initHamburger();
  initTypingEffect();
});


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
    // Update skill bar colors on theme change
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
    // Hide nav on quick scroll down, show on scroll up
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

  // Close on link click
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
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger sibling elements
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

  // Hide cursor on mobile
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

  // Smooth outline follow
  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;
    outline.style.left = outlineX + 'px';
    outline.style.top = outlineY + 'px';
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-card, .about-card, .contact-item');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => outline.classList.add('hovered'));
    el.addEventListener('mouseleave', () => outline.classList.remove('hovered'));
  });
}


// =========================================
// CONTACT FORM — EmailJS / Mailto fallback
// =========================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (!form) return;

  // EmailJS configuration
  const emailJSServiceId = "service_l5bhjst";
  const emailJSTemplateId = "template_tukicl6";
  const emailJSPublicKey = "VnmxpomUjUlBw0sD4";

  // Initialize EmailJS
  if (window.emailjs) {
    emailjs.init(emailJSPublicKey);
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

      if (window.emailjs) {

        await emailjs.send(emailJSServiceId, emailJSTemplateId, {
          from_name: name,
          from_email: email,
          subject: subject,
          message: message,
          to_email: "ashwathofficial2511@gmail.com"
        });

        showStatus(status, "success", "🎉 Message sent successfully! I'll get back to you soon.");
        form.reset();

      } else {

        // Mailto fallback
        const body = `Name: ${name}%0AEmail: ${email}%0A%0A${encodeURIComponent(message)}`;
        const mailtoLink = `mailto:ashwathofficial2511@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

        window.location.href = mailtoLink;

        showStatus(status, "success", "📬 Opening your mail client...");
        setTimeout(() => form.reset(), 1000);

      }

    } catch (err) {
      console.error(err);
      showStatus(status, "error", "❌ Failed to send. Please try again later.");
    }

    btn.innerHTML = originalText;
    btn.disabled = false;

  });

  function showStatus(el, type, message) {
    el.className = "form-status " + type;
    el.textContent = message;
    el.style.display = "block";

    setTimeout(() => {
      el.style.display = "none";
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
  let isPaused = false;

  function type() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      tagEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentRole.length) {
        isPaused = true;
        setTimeout(() => { isPaused = false; isDeleting = true; type(); }, 2000);
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
// PARTICLES / BACKGROUND EFFECT (Canvas)
// =========================================
(function initParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.35;';
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  const count = 60;

  function resize() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  function getAccentColor() {
    const theme = document.documentElement.getAttribute('data-theme');
    const colors = {
      blue: '79, 158, 255',
      matrix: '0, 255, 65',
      white: '59, 91, 219',
      cosmic: '191, 95, 255'
    };
    return colors[theme] || '79, 158, 255';
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const color = getAccentColor();

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
      ctx.fill();

      // Connect nearby particles
      particles.forEach(p2 => {
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${color}, ${0.06 * (1 - dist / 120)})`;
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

  window.addEventListener('resize', () => { resize(); createParticles(); });
  resize();
  createParticles();
  draw();
})();


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
// PHOTO UPLOAD PLACEHOLDER
// =========================================
// To add your actual photo, replace the src attribute
// in index.html:
//   <img src="your-photo.jpg" alt="Profile Photo" class="profile-img"/>
// Or uncomment below to allow click-to-upload in browser:
//
// document.getElementById('profileImg')?.addEventListener('click', () => {
//   const input = document.createElement('input');
//   input.type = 'file'; input.accept = 'image/*';
//   input.onchange = e => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onload = ev => document.getElementById('profileImg').src = ev.target.result;
//     reader.readAsDataURL(file);
//   };
//   input.click();
// });


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
    position: fixed; top: 0; left: 0; height: 3px; z-index: 9999;
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