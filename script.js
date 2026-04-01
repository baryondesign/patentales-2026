const header = document.getElementById('site-header');
const heroLogo = document.querySelector('.hero-logo');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    header.classList.add('scrolled');
    heroLogo.style.opacity = '0';
  } else {
    header.classList.remove('scrolled');
    heroLogo.style.opacity = '1';
  }
});