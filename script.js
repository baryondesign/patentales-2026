const header = document.getElementById('site-header');
const hamburger = document.getElementById('nav-hamburger');
const mobileMenu = document.getElementById('nav-mobile');

// scroll behavior
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// hamburger toggle
hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('is-open');
  hamburger.classList.toggle('is-open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// close menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// detect language from URL path
const lang = window.location.pathname.includes('/nl/') ? 'nl' : 'en';

// load team members
fetch('../assets/team.json')
  .then(res => res.json())
  .then(members => {
    const grid = document.getElementById('team-grid');
    grid.innerHTML = members.map(member => `
      <div class="team-member">
        <img src="${member.photo}" alt="${member.name}" class="team-photo">
        <h3 class="team-name">${member.name}</h3>
        <p class="team-role">${member.role[lang]}</p>
        <p class="team-bio">${member.bio[lang]}</p>
        <div class="team-links">
          <a href="${member.linkedin}" target="_blank" rel="noopener" aria-label="${member.name} on LinkedIn">
            <img src="../assets/images/icon-linkedin.svg" alt="" class="team-link-icon">
          </a>
          <a href="mailto:${member.email}" aria-label="Email ${member.name}">
            <img src="../assets/images/icon-mail.svg" alt="" class="team-link-icon">
          </a>
        </div>
      </div>
    `).join('');
  })
  .catch(err => console.error('Could not load team data:', err));

  // load quotes
fetch('../assets/quotes.json')
  .then(res => res.json())
  .then(quotes => {
    const track = document.getElementById('quotes-track');
    const dotsContainer = document.getElementById('quotes-dots');
    let current = 0;
    let isTransitioning = false;

    // build slides + clone of first slide at the end
    const allSlides = [...quotes, quotes[0]];

    track.innerHTML = allSlides.map(q => `
      <div class="quote-slide">
        <img src="${q.photo}" alt="${q.name}" class="quote-photo">
        <div class="quote-content">
          <div class="quote-stars">${'★'.repeat(q.stars)}</div>
          <p class="quote-text">"${q.quote[lang]}"</p>
          <div class="quote-attribution">
            <div>
              <p class="quote-name">${q.name}</p>
              <p class="quote-role">${q.role[lang]}</p>
            </div>
            <div class="quote-divider"></div>
            <img src="${q.logo}" alt="${q.logoAlt}" class="quote-logo">
          </div>
        </div>
      </div>
    `).join('');

    // build dots (only for real slides, not the clone)
    dotsContainer.innerHTML = quotes.map((_, i) => `
      <button class="quotes-dot ${i === 0 ? 'is-active' : ''}"
              aria-label="Go to quote ${i + 1}"></button>
    `).join('');

    const dots = dotsContainer.querySelectorAll('.quotes-dot');

    function updateDots(index) {
      dots.forEach(d => d.classList.remove('is-active'));
      dots[index % quotes.length].classList.add('is-active');
    }

    function goTo(index, animate = true) {
      if (isTransitioning) return;
      isTransitioning = true;

      if (animate) {
        track.style.transition = 'transform 0.5s ease';
      } else {
        track.style.transition = 'none';
      }

      current = index;
      track.style.transform = `translateX(-${current * 100}%)`;
      updateDots(current);
    }

    // after transition to clone, silently snap to real first slide
    track.addEventListener('transitionend', () => {
      if (current === quotes.length) {
        goTo(0, false);
      }
      isTransitioning = false;
    });

    document.getElementById('quotes-prev').addEventListener('click', () => {
      if (current === 0) return; // no wrap backwards
      goTo(current - 1);
    });

    document.getElementById('quotes-next').addEventListener('click', () => {
      goTo(current + 1);
    });

    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
  })
  .catch(err => console.error('Could not load quotes:', err));