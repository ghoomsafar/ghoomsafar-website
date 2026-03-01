/*
  ====================================================
  THE GEOGRAPHY INDEX — JavaScript
  Append this to tooplate-graphite-script.js
  or include as a separate <script> before </body>.
  ====================================================
*/

(function () {

  /* ─── FILTER LOGIC ─── */
  const filters   = document.querySelectorAll('.geo-filter');
  const geoCards  = document.querySelectorAll('.geo-card');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {

      // Update active chip
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.dataset.filter;

      geoCards.forEach(card => {
        if (card.classList.contains('geo-card-placeholder')) {
          // placeholder always visible
          card.classList.remove('geo-hidden');
          return;
        }
        const region = card.dataset.region || '';
        if (target === 'all' || region === target) {
          card.classList.remove('geo-hidden');
        } else {
          card.classList.add('geo-hidden');
        }
      });

      // Live-update the destination counter
      updateCounter(target);
    });
  });

  function updateCounter(filter) {
    const counterEl = document.getElementById('countryCounter');
    if (!counterEl) return;
    if (filter === 'all') {
      // count real cards only (no placeholder)
      counterEl.textContent = document.querySelectorAll('.geo-card:not(.geo-card-placeholder)').length;
    } else {
      const count = [...geoCards].filter(c =>
        !c.classList.contains('geo-card-placeholder') && c.dataset.region === filter
      ).length;
      counterEl.textContent = count;
    }
  }

  /* ─── SCROLL-TRIGGERED ENTRANCE ─── */
  // Cards animate in only when they scroll into view (IntersectionObserver)
  // The CSS already sets animation, but we reset it so it replays on scroll-in.
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target); // fire once
      }
    });
  }, observerOptions);

  geoCards.forEach(card => {
    // Pause animations initially; let observer trigger them
    card.style.animationPlayState = 'paused';
    observer.observe(card);
  });

})();
