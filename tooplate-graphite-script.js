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
   });
   dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
   });
}

// Manual slide selection
function currentSlide(n) {
   stopAutoSlide();
   currentSlideIndex = n;
   showSlide(currentSlideIndex);
   startAutoSlide();
}

// Mobile Menu Toggle
menuToggle.addEventListener('click', (e) => {
   e.stopPropagation();
   menuToggle.classList.toggle('active');
   nav.classList.toggle('active');
});

// Scroll to top function
function scrollToTop() {
   window.scrollTo({
      top: 0,
      behavior: 'smooth'
   });
   menuToggle.classList.remove('active');
   nav.classList.remove('active');
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
         menuToggle.classList.remove('active');
         nav.classList.remove('active');

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
window.addEventListener('scroll', highlightActiveNav);

// Close menu when clicking outside
document.addEventListener('click', (e) => {
   if (!e.target.closest('header')) {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
   }
});

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
function openPortfolioModal(item) {
   const modal = document.getElementById('portfolioModal');
   const label = item.querySelector('.portfolio-label');
   const data = item.querySelector('.portfolio-data');
   const image = item.querySelector('img');

   // Get data from hidden content
   const title = label.querySelector('h3').textContent;
   const category = label.querySelector('p').textContent;
   const imageUrl = image.src;
   const description = data.querySelector('.description').textContent;
   const features = data.querySelectorAll('.features li');
   const visitUrl = data.querySelector('.visit-url').href;

   // Populate modal
   document.getElementById('modalTitle').textContent = title;
   document.getElementById('modalCategory').textContent = category;
   document.getElementById('modalImage').src = imageUrl;
   document.getElementById('modalDescription').textContent = description;

   // Populate features list
   const featuresList = document.getElementById('modalFeatures');
   featuresList.innerHTML = '';
   features.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature.textContent;
      featuresList.appendChild(li);
   });

   // Set visit button

   modal.classList.add('active');
   document.body.style.overflow = 'hidden';
}

function closePortfolioModal() {
   const modal = document.getElementById('portfolioModal');
   modal.classList.remove('active');
   document.body.style.overflow = 'auto';
}

// Add click listeners to portfolio items
document.querySelectorAll('.portfolio-item').forEach(item => {
   item.addEventListener('click', () => openPortfolioModal(item));
});

// Close modal when clicking outside the content
document.getElementById('portfolioModal').addEventListener('click', (e) => {
   if (e.target.id === 'portfolioModal') {
      closePortfolioModal();
   }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
   if (e.key === 'Escape') {
      closePortfolioModal();
   }
});

// Initialize on page load
initSlider();