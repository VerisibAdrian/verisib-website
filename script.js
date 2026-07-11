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

  const desktop = window.matchMedia('(min-width: 961px)');
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

  const form = document.querySelector('[data-contact-form]');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = `${data.get('firstName')} ${data.get('lastName')}`.trim().slice(0, 100);
    const email = String(data.get('email')).trim().slice(0, 200);
    const message = String(data.get('message')).trim().slice(0, 3000);
    const subject = encodeURIComponent(`Verisib inquiry from ${name}`);
    const body = encodeURIComponent([
      `Name: ${name}`,
      `Email: ${email}`,
      '',
      message
    ].join('\n'));
    const status = form.querySelector('[data-form-status]');
    if (status) status.textContent = 'Your email app should open with a prepared message. Review it, then choose Send.';
    window.location.assign(`mailto:sunnyside.aliving@gmail.com?subject=${subject}&body=${body}`);
  });

  const startDialog = document.querySelector('[data-start-dialog]');
  const startForm = document.querySelector('[data-start-form]');
  const startSteps = [...document.querySelectorAll('[data-start-step]')];
  const careInput = startForm?.querySelector('[data-care-input]');
  const selectedCare = startDialog?.querySelector('[data-selected-care]');
  const stepLabel = startDialog?.querySelector('[data-step-label]');
  const stepProgress = startDialog?.querySelector('[data-step-progress]');
  const backButton = startForm?.querySelector('[data-start-back]');
  const nextButton = startForm?.querySelector('[data-start-next]');
  const submitButton = startForm?.querySelector('[data-start-submit]');
  const startStatus = startForm?.querySelector('[data-start-status]');
  const confirmation = startDialog?.querySelector('[data-start-confirmation]');
  const urgentPlacement = startForm?.querySelector('[data-urgent-placement]');
  const placementEndpoints = [
    'https://formsubmit.co/ajax/sunnyside.aliving@gmail.com',
    'https://formsubmit.co/ajax/483fb98a51dfe4be88608df269dbcc39'
  ];
  let currentStartStep = 0;

  const updateUrgentPlacement = () => {
    if (!urgentPlacement) return;
    const timing = startForm?.querySelector('input[name="timeline"]:checked')?.value;
    urgentPlacement.hidden = timing !== 'Today / ASAP';
  };

  const setStartStep = (index) => {
    currentStartStep = Math.max(0, Math.min(index, startSteps.length - 1));
    startSteps.forEach((step, stepIndex) => { step.hidden = stepIndex !== currentStartStep; });
    if (stepLabel) stepLabel.textContent = `Step ${currentStartStep + 1} of ${startSteps.length}`;
    if (stepProgress) stepProgress.style.width = `${((currentStartStep + 1) / startSteps.length) * 100}%`;
    if (backButton) backButton.hidden = currentStartStep === 0;
    if (nextButton) nextButton.hidden = currentStartStep === startSteps.length - 1;
    if (submitButton) submitButton.hidden = currentStartStep !== startSteps.length - 1;
    if (startStatus) startStatus.textContent = '';
    updateUrgentPlacement();
    const focusTarget = startSteps[currentStartStep]?.querySelector('input:not([type="radio"])');
    window.requestAnimationFrame(() => focusTarget?.focus());
  };

  const closeStartDialog = () => {
    if (!startDialog) return;
    if (typeof startDialog.close === 'function') startDialog.close();
    else startDialog.removeAttribute('open');
    document.body.classList.remove('menu-open');
  };

  const openStartDialog = (careType) => {
    if (!startDialog || !startForm) return;
    startForm.reset();
    startForm.hidden = false;
    startDialog.querySelector('.start-progress').hidden = false;
    startDialog.querySelector('.start-dialog-head').hidden = false;
    if (confirmation) confirmation.hidden = true;
    if (careInput) careInput.value = careType;
    if (selectedCare) selectedCare.textContent = `Selected care: ${careType}`;
    if (submitButton) submitButton.disabled = false;
    setStartStep(0);
    if (typeof startDialog.showModal === 'function') startDialog.showModal();
    else startDialog.setAttribute('open', '');
    document.body.classList.add('menu-open');
  };

  const validateStartStep = () => {
    const controls = [...(startSteps[currentStartStep]?.querySelectorAll('input') || [])];
    const invalid = controls.find((control) => !control.checkValidity());
    if (!invalid) return true;
    if (startStatus) startStatus.textContent = invalid.type === 'radio'
      ? 'Please choose one option to continue.'
      : 'Please complete this field to continue.';
    if (invalid.type !== 'radio') invalid.reportValidity();
    return false;
  };

  const readSubmissionResult = async (response) => {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (error) {
      return { message: text };
    }
  };

  const isSubmissionSuccess = (response, result) => {
    const success = String(result?.success ?? '').toLowerCase();
    const message = String(result?.message ?? '');
    return response.ok && (success === 'true' || /submitted successfully/i.test(message));
  };

  const buildSubmissionBody = (submission) => {
    const body = new FormData();
    Object.entries(submission).forEach(([key, value]) => body.append(key, value));
    return body;
  };

  const postPlacementRequest = async (submission) => {
    let lastError = new Error('Submission failed');
    for (const endpoint of placementEndpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: buildSubmissionBody(submission)
        });
        const result = await readSubmissionResult(response);
        if (isSubmissionSuccess(response, result)) return result;
        lastError = new Error(result?.message || `Submission failed with status ${response.status}`);
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  };

  document.querySelectorAll('[data-care-type]').forEach((card) => {
    card.addEventListener('click', () => openStartDialog(card.dataset.careType || 'Care'));
  });

  nextButton?.addEventListener('click', () => {
    if (validateStartStep()) setStartStep(currentStartStep + 1);
  });
  backButton?.addEventListener('click', () => setStartStep(currentStartStep - 1));
  startForm?.querySelectorAll('input[name="timeline"]').forEach((option) => {
    option.addEventListener('change', updateUrgentPlacement);
  });
  startDialog?.querySelector('[data-start-close]')?.addEventListener('click', closeStartDialog);
  startDialog?.querySelector('[data-start-done]')?.addEventListener('click', closeStartDialog);
  startDialog?.addEventListener('close', () => document.body.classList.remove('menu-open'));
  startDialog?.addEventListener('click', (event) => {
    if (event.target === startDialog) closeStartDialog();
  });

  startForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateStartStep() || !startForm.reportValidity()) return;
    if (submitButton) submitButton.disabled = true;
    if (startStatus) startStatus.textContent = 'Sending your information…';

    const data = new FormData(startForm);
    const submission = {
      'Preferred City or ZIP Code': String(data.get('preferredArea') || ''),
      'Care type': String(data.get('careType') || ''),
      'Monthly budget': String(data.get('budget') || ''),
      'Room preference': String(data.get('roomPreference') || ''),
      'Placement timing': String(data.get('timeline') || ''),
      'Name': String(data.get('name') || ''),
      'Phone': String(data.get('phone') || ''),
      'Email': String(data.get('email') || ''),
      '_replyto': String(data.get('email') || ''),
      '_subject': String(data.get('_subject') || 'New Verisib placement request'),
      '_template': String(data.get('_template') || 'table'),
      '_captcha': String(data.get('_captcha') || 'false'),
      '_honey': String(data.get('_honey') || '')
    };

    try {
      await postPlacementRequest(submission);
      startForm.hidden = true;
      startDialog.querySelector('.start-progress').hidden = true;
      startDialog.querySelector('.start-dialog-head').hidden = true;
      if (confirmation) {
        confirmation.hidden = false;
        confirmation.focus();
      }
    } catch (error) {
      if (startStatus) startStatus.textContent = 'We could not send your information. Please call (623) 340-3966 for immediate help.';
      if (submitButton) submitButton.disabled = false;
    }
  });

  const mobileActions = document.querySelector('[data-mobile-actions]');
  const actionTargets = document.querySelectorAll('#contact, .site-footer');
  if (mobileActions && actionTargets.length && 'IntersectionObserver' in window) {
    const visibleTargets = new Set();
    const actionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting
        ? visibleTargets.add(entry.target)
        : visibleTargets.delete(entry.target));
      mobileActions.classList.toggle('is-hidden', visibleTargets.size > 0);
    }, { threshold: 0.05 });
    actionTargets.forEach((target) => actionObserver.observe(target));
  }
})();
