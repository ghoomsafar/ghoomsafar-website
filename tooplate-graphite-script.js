// JavaScript Document

/*

Tooplate 2156 Graphite Creative

https://www.tooplate.com/view/2156-graphite-creative

*/

let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const navLinks = document.querySelectorAll('nav a');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
let slideInterval;

function setMobileMenuOpen(isOpen) {
   menuToggle.classList.toggle('active', isOpen);
   nav.classList.toggle('active', isOpen);
   document.querySelector('header').classList.toggle('menu-open', isOpen);
   menuToggle.setAttribute('aria-expanded', String(isOpen));
   menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
}

// Initialize slider
function initSlider() {
   // Ensure slides and dots exist
   if (slides.length === 0) {
      console.error('No slides found');
      return;
   }

   // Force display of first slide
   slides[0].classList.add('active');
   if (dots.length > 0) {
      dots[0].classList.add('active');
   }

   showSlide(0);
   startAutoSlide();
}

// Start auto-slide with 3 seconds per image
function startAutoSlide() {
   // Clear any existing interval
   if (slideInterval) {
      clearInterval(slideInterval);
   }

   slideInterval = setInterval(() => {
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      showSlide(currentSlideIndex);
   }, 3000);
}

// Stop auto-slide
function stopAutoSlide() {
   clearInterval(slideInterval);
}

// Show specific slide
function showSlide(index) {
   slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      slide.setAttribute('aria-hidden', String(i !== index));
   });
   dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
      dot.setAttribute('aria-pressed', String(i === index));
   });
   const slideIndex = document.querySelector('.hero-image-index');
   if (slideIndex) {
      slideIndex.firstChild.textContent = `${String(index + 1).padStart(2, '0')} `;
   }
}

// Manual slide selection
function currentSlide(n) {
   if (n < 0 || n >= slides.length) return;
   stopAutoSlide();
   currentSlideIndex = n;
   showSlide(currentSlideIndex);
   startAutoSlide();
}

// Mobile Menu Toggle
menuToggle.addEventListener('click', (e) => {
   e.stopPropagation();
   setMobileMenuOpen(!nav.classList.contains('active'));
});

// Scroll to top function
function scrollToTop() {
   window.scrollTo({
      top: 0,
      behavior: 'smooth'
   });
   setMobileMenuOpen(false);
}

// Highlight active nav on scroll
function highlightActiveNav() {
   let current = '';
   const sections = document.querySelectorAll('section');

   sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 300) {
         current = section.getAttribute('id');
      }
   });

   navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
         link.classList.add('active');
      }
   });
}

// Handle nav link clicks
navLinks.forEach(link => {
   link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('href').slice(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
         // Close mobile menu
         setMobileMenuOpen(false);
         document.querySelector('header').classList.remove('header-hidden');

         // Calculate scroll position accounting for header
         const headerHeight = document.querySelector('header').offsetHeight;
         const targetPosition = targetSection.offsetTop - headerHeight;

         // Smooth scroll
         window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
         });

         // Update active class
         navLinks.forEach(l => l.classList.remove('active'));
         link.classList.add('active');
      }
   });
});

// Update nav on scroll
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
   highlightActiveNav();
   const header = document.querySelector('header');
   const currentScrollY = window.scrollY;
   const scrollingDown = currentScrollY > lastScrollY;

   if (nav.classList.contains('active') || currentScrollY < 120 || !scrollingDown) {
      header.classList.remove('header-hidden');
   } else if (currentScrollY - lastScrollY > 2) {
      header.classList.add('header-hidden');
   }
   lastScrollY = currentScrollY;
}, { passive: true });

// Close menu when clicking outside
document.addEventListener('click', (e) => {
   if (e.target instanceof Element && !e.target.closest('header')) {
      setMobileMenuOpen(false);
   }
});

document.addEventListener('keydown', (e) => {
   if (e.key === 'Escape' && nav.classList.contains('active')) {
      setMobileMenuOpen(false);
      menuToggle.focus();
   }
});

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
   const revealItems = document.querySelectorAll(
      '.section-services .geography-eyebrow, .service-card, .geography-header, .geo-stats, .section-portfolio .geography-eyebrow, .portfolio-item, .section-about > .section-title, .about-content, .about-block, .contact-info, .contact-form'
   );
   const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
         if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
         }
      });
   }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

   revealItems.forEach((item, index) => {
      item.classList.add('reveal');
      item.style.transitionDelay = `${(index % 4) * 70}ms`;
      revealObserver.observe(item);
   });
   document.body.classList.add('reveal-ready');
}

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = contactForm.querySelector('.submit-btn');
    const btnText = btn.textContent;

    // Button loading state
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const data = new FormData(contactForm);

    try {
        const response = await fetch('https://formspree.io/f/mbdzjkvd', {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            // Hide form, show success
            contactForm.style.transition = 'opacity 0.4s ease';
            contactForm.style.opacity = '0';
            setTimeout(() => {
                contactForm.style.display = 'none';
                formSuccess.classList.add('active');
            }, 400);

            // Reset form silently in background
            contactForm.reset();

            // Bring form back after 5 seconds
            setTimeout(() => {
                formSuccess.classList.remove('active');
                contactForm.style.display = 'flex';
                setTimeout(() => {
                    contactForm.style.opacity = '1';
                }, 50);
                btn.textContent = btnText;
                btn.disabled = false;
            }, 5000);

        } else {
            btn.textContent = 'Something went wrong. Try again.';
            btn.disabled = false;
            setTimeout(() => {
                btn.textContent = btnText;
            }, 3000);
        }

    } catch (error) {
        btn.textContent = 'Something went wrong. Try again.';
        btn.disabled = false;
        setTimeout(() => {
            btn.textContent = btnText;
        }, 3000);
    }
});

// Portfolio Modal Functions
let activePortfolioItem = null;
let modalCloseTimeout;

function openPortfolioModal(item) {
   const modal = document.getElementById('portfolioModal');
   const label = item.querySelector('.portfolio-label');
   const data = item.querySelector('.portfolio-data');
   const image = item.querySelector('img');

   if (!modal || !label || !data || !image) return;

   const titleElement = label.querySelector('h3');
   const categoryElement = label.querySelector('.portfolio-location, p');
   const descriptionElement = data.querySelector('.description');
   if (!titleElement || !categoryElement || !descriptionElement) return;

   document.getElementById('modalTitle').textContent = titleElement.textContent;
   document.getElementById('modalCategory').textContent = categoryElement.textContent;
   document.getElementById('modalImage').src = image.currentSrc || image.src;
   document.getElementById('modalImage').alt = image.alt;
   document.getElementById('modalDescription').textContent = descriptionElement.textContent.trim();

   const featuresList = document.getElementById('modalFeatures');
   featuresList.replaceChildren();
   activePortfolioItem = item;
   window.clearTimeout(modalCloseTimeout);
   modal.classList.remove('active', 'closing');
   void modal.offsetWidth;
   modal.setAttribute('aria-hidden', 'false');
   modal.classList.add('active');
   document.body.style.overflow = 'hidden';
   modal.querySelector('.modal-close').focus();
}

function closePortfolioModal() {
   const modal = document.getElementById('portfolioModal');
   if (!modal || !modal.classList.contains('active') || modal.classList.contains('closing')) return;
   modal.classList.add('closing');
   modal.setAttribute('aria-hidden', 'true');
   document.body.style.overflow = 'auto';
   modalCloseTimeout = window.setTimeout(() => {
      modal.classList.remove('active', 'closing');
      if (activePortfolioItem) {
         activePortfolioItem.focus();
         activePortfolioItem = null;
      }
   }, 320);
}

// Add click listeners to portfolio items
document.querySelectorAll('.portfolio-item').forEach(item => {
   item.addEventListener('click', () => openPortfolioModal(item));
   item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
         e.preventDefault();
         openPortfolioModal(item);
      }
   });
});

// Close modal when clicking outside the content
document.getElementById('portfolioModal').addEventListener('click', (e) => {
   if (e.target.id === 'portfolioModal') {
      closePortfolioModal();
   }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
   if (e.key === 'Escape' && document.getElementById('portfolioModal').classList.contains('active')) {
      closePortfolioModal();
   }
});

// Initialize on page load
initSlider();

let loaderDismissed = false;
let loaderTimeout;
function dismissLoader() {
   if (loaderDismissed) return;
   loaderDismissed = true;
   window.clearTimeout(loaderTimeout);
   document.documentElement.classList.add('is-ready');
}

loaderTimeout = window.setTimeout(dismissLoader, 800);
const heroImage = document.querySelector('.slide.active img');
Promise.all([
   document.fonts.ready,
   heroImage ? heroImage.decode().catch(() => undefined) : Promise.resolve()
]).then(() => window.setTimeout(dismissLoader, 120));