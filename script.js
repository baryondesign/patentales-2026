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

// load team members
fetch('../assets/team.json')
  .then(res => res.json())
  .then(members => {
    const grid = document.getElementById('team-grid');
    grid.innerHTML = members.map(member => `
      <div class="team-member">
        <img src="${member.photo}" alt="${member.name}" class="team-photo">
        <h3 class="team-name">${member.name}</h3>
        <p class="team-role">${member.role}</p>
        <p class="team-bio">${member.bio}</p>
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