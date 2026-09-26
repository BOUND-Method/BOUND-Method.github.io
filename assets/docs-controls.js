(function () {
  const root = document.documentElement;
  const stored = localStorage.getItem('bound-theme');
  if (stored === 'light' || stored === 'dark') root.setAttribute('data-theme', stored);

  const controls = document.createElement('div');
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const isPersian = path === '/fa' || path.startsWith('/fa/docs');
  const counterpart = isPersian ? (path === '/fa' ? '/' : path.replace(/^\/fa/, '') || '/docs/') : ('/fa' + (path === '/' ? '/docs/' : path));
  controls.className = 'docs-utility';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', 'Site controls');
  controls.innerHTML =
    '<a class="docs-utility-lang" href="' + counterpart + '" lang="' + (isPersian ? 'en' : 'fa') + '" hreflang="' + (isPersian ? 'en' : 'fa') + '" aria-label="' + (isPersian ? 'English edition' : 'نسخه فارسی') + '" title="' + (isPersian ? 'English' : 'فارسی') + '"><span class="docs-utility-icon">' + (isPersian ? 'EN' : 'فا') + '</span><span>' + (isPersian ? 'English' : 'فارسی') + '</span></a>' +
    '<button class="docs-utility-theme" type="button" aria-label="Toggle light and dark mode" title="Toggle light and dark mode" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></button>' +
    '<button class="docs-back-to-top" type="button" aria-label="Back to top" title="Back to top"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 15 6-6 6 6"/><path d="M12 9v10"/></svg></button>';
  document.body.appendChild(controls);

  const themeButton = controls.querySelector('.docs-utility-theme');
  function syncTheme() {
    const light = root.getAttribute('data-theme') === 'light';
    themeButton.setAttribute('aria-pressed', String(light));
    themeButton.title = light ? 'Switch to dark mode' : 'Switch to light mode';
    themeButton.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
    themeButton.innerHTML = light
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/><circle cx="12" cy="12" r="4"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  themeButton.addEventListener('click', function () {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('bound-theme', next);
    syncTheme();
  });
  syncTheme();

  const topButton = controls.querySelector('.docs-back-to-top');
  function syncTop() { topButton.classList.toggle('is-visible', window.scrollY > 520); }
  window.addEventListener('scroll', syncTop, { passive: true });
  topButton.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  syncTop();
})();