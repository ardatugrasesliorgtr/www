(function () {
  'use strict';

  var LANGS = ['tr', 'en', 'ar', 'es', 'it', 'fr'];
  var STORAGE_KEY = 'preferred_lang';
  var T = window.TRANSLATIONS || {};
  var body = document.body;

  /* ---------- Dil ---------- */
  function readLang() {
    try {
      var saved = window.localStorage.getItem(STORAGE_KEY);
      if (LANGS.indexOf(saved) !== -1) return saved;
    } catch (e) { /* depolama kapalı olabilir */ }
    var nav = String(navigator.language || '').slice(0, 2).toLowerCase();
    return LANGS.indexOf(nav) !== -1 ? nav : 'en';
  }

  function setLang(lang) {
    if (LANGS.indexOf(lang) === -1 || !T[lang]) lang = 'tr';
    var dict = T[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Yalnızca textContent kullanılır; HTML hiçbir zaman yorumlanmaz.
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = dict[el.getAttribute('data-i18n')];
      if (typeof v === 'string') el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-label]').forEach(function (el) {
      var v = dict[el.getAttribute('data-i18n-label')];
      if (typeof v === 'string') el.setAttribute('aria-label', v);
    });
    var titleKey = body.getAttribute('data-title-key');
    if (titleKey && typeof dict[titleKey] === 'string') {
      document.title = dict[titleKey] + ' · Arda Tuğra Sesli';
    }
    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.setAttribute('aria-checked', btn.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* yok say */ }
  }

  setLang(readLang());

  /* ---------- Kenar çubuğu (mobil) ---------- */
  var burger = document.getElementById('burger');
  var closeNav = document.getElementById('closeNav');
  var scrim = document.getElementById('scrim');

  function openSidebar() {
    body.classList.add('nav-open');
    burger.setAttribute('aria-expanded', 'true');
  }
  function closeSidebar() {
    body.classList.remove('nav-open');
    burger.setAttribute('aria-expanded', 'false');
  }
  burger.addEventListener('click', openSidebar);
  closeNav.addEventListener('click', closeSidebar);
  scrim.addEventListener('click', closeSidebar);

  /* ---------- Profil menüsü ---------- */
  var accountBtn = document.getElementById('accountBtn');
  var menu = document.getElementById('accountMenu');
  var mainPanel = document.getElementById('menuMain');
  var langPanel = document.getElementById('menuLang');

  function closeMenu() {
    menu.hidden = true;
    accountBtn.setAttribute('aria-expanded', 'false');
  }
  function openMenu() {
    mainPanel.hidden = false;
    langPanel.hidden = true;
    menu.hidden = false;
    accountBtn.setAttribute('aria-expanded', 'true');
  }
  accountBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (menu.hidden) openMenu(); else closeMenu();
  });
  menu.addEventListener('click', function (e) { e.stopPropagation(); });

  document.getElementById('langOpen').addEventListener('click', function () {
    mainPanel.hidden = true;
    langPanel.hidden = false;
    var current = langPanel.querySelector('[aria-checked="true"]');
    if (current) current.focus();
  });
  document.getElementById('langBack').addEventListener('click', function () {
    langPanel.hidden = true;
    mainPanel.hidden = false;
  });
  langPanel.querySelectorAll('[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(btn.getAttribute('data-lang'));
      closeMenu();
      accountBtn.focus();
    });
  });

  document.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!menu.hidden) { closeMenu(); accountBtn.focus(); }
    if (body.classList.contains('nav-open')) { closeSidebar(); burger.focus(); }
  });

  /* ---------- Bağış penceresi ---------- */
  var dialog = document.getElementById('donateDialog');
  document.getElementById('donateBtn').addEventListener('click', function () {
    closeSidebar();
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  });
  document.getElementById('donateClose').addEventListener('click', function () {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  });
  dialog.addEventListener('click', function (e) {
    if (e.target === dialog && typeof dialog.close === 'function') dialog.close();
  });
})();
