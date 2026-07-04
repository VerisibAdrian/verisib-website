const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');

const closeMenu = () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('open');
  document.body.classList.remove('menu-open');
};

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  nav?.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 20), { passive: true });

document.querySelectorAll('.faq-item button').forEach((button) => {
  button.addEventListener('click', () => {
    const willOpen = button.getAttribute('aria-expanded') !== 'true';
    document.querySelectorAll('.faq-item button').forEach((item) => item.setAttribute('aria-expanded', 'false'));
    button.setAttribute('aria-expanded', String(willOpen));
  });
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

document.querySelectorAll('[data-year]').forEach((item) => { item.textContent = new Date().getFullYear(); });

const form = document.querySelector('[data-contact-form]');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = `${data.get('firstName')} ${data.get('lastName')}`.trim();
  const subject = encodeURIComponent(`Verisib inquiry from ${name}`);
  const body = encodeURIComponent([
    `Name: ${name}`,
    `Email: ${data.get('email')}`,
    `Reaching out as: ${data.get('role')}`,
    '',
    String(data.get('message'))
  ].join('\n'));
  const status = form.querySelector('[data-form-status]');
  if (status) status.textContent = 'Opening your email app…';
  window.location.href = `mailto:hello@verisib.com?subject=${subject}&body=${body}`;
});
