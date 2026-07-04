(() => {
  'use strict';

  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-toggle]');
  const menuLabel = menuButton?.querySelector('.menu-label');
  const nav = document.querySelector('[data-nav]');

  const setMenu = (open) => {
    menuButton?.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    if (menuLabel) menuLabel.textContent = open ? 'Close' : 'Menu';
  };

  menuButton?.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuButton.focus();
    }
  });

  const desktop = window.matchMedia('(min-width: 1061px)');
  desktop.addEventListener?.('change', (event) => {
    if (event.matches) setMenu(false);
  });

  let scrollFrame = 0;
  const updateHeader = () => {
    header?.classList.toggle('scrolled', window.scrollY > 16);
    scrollFrame = 0;
  };
  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateHeader);
  }, { passive: true });
  updateHeader();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = [...document.querySelectorAll('.reveal')];

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealItems.forEach((item, index) => {
      const startsInView = item.getBoundingClientRect().top < window.innerHeight * 0.92;
      if (startsInView && item.animate) {
        item.animate(
          [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 620, delay: Math.min(index * 45, 180), easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' }
        );
      } else {
        item.classList.add('will-reveal');
        observer.observe(item);
      }
    });
  }

  document.querySelectorAll('.faq-item').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      document.querySelectorAll('.faq-item[open]').forEach((openItem) => {
        if (openItem !== item) openItem.removeAttribute('open');
      });
    });
  });

  document.querySelectorAll('[data-year]').forEach((item) => {
    item.textContent = String(new Date().getFullYear());
  });

  const params = new URLSearchParams(window.location.search);
  const roleSelect = document.querySelector('[data-role-select]');
  const audienceRole = {
    family: 'Family member or friend',
    senior: 'Older adult exploring options',
    professional: 'Hospital or rehabilitation professional',
    case_manager: 'Case manager or care professional'
  }[params.get('audience')];
  if (roleSelect && audienceRole) roleSelect.value = audienceRole;

  const form = document.querySelector('[data-contact-form]');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = `${data.get('firstName')} ${data.get('lastName')}`.trim().slice(0, 100);
    const email = String(data.get('email')).trim().slice(0, 200);
    const role = String(data.get('role')).trim().slice(0, 100);
    const message = String(data.get('message')).trim().slice(0, 3000);
    const subject = encodeURIComponent(`Verisib inquiry from ${name}`);
    const body = encodeURIComponent([
      `Name: ${name}`,
      `Email: ${email}`,
      `Reaching out as: ${role}`,
      '',
      message
    ].join('\n'));
    const status = form.querySelector('[data-form-status]');
    if (status) status.textContent = 'Your email app should open with a prepared message. Review it, then choose Send.';
    window.location.assign(`mailto:hello@verisib.com?subject=${subject}&body=${body}`);
  });

  const mobileContact = document.querySelector('.mobile-contact');
  const contactTarget = document.querySelector('#contact, #refer, .compact-contact');
  if (mobileContact && contactTarget && 'IntersectionObserver' in window) {
    const contactObserver = new IntersectionObserver(([entry]) => {
      mobileContact.classList.toggle('is-hidden', entry.isIntersecting);
    }, { threshold: 0.1 });
    contactObserver.observe(contactTarget);
  }
})();
