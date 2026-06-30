/**
 * Menu rendering from menu.json + tab system
 * Renders items dynamically, handles tab switching, and URL-param deep-linking.
 */
(function () {
  'use strict';

  const TOAST_URL    = 'https://order.toasttab.com/online/thai-i';
  const GRUBHUB_URL  = 'https://www.grubhub.com/restaurant/thai-and-i-restaurant-274-south-st-shrewsbury/2196678';
  const DOORDASH_URL = 'https://www.doordash.com/store/thai-and-i-shrewsbury-865539/';

  function formatPrice(val) {
    return '$' + val.toFixed(2);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildMenuRow(item, priceFrom) {
    let priceStr = '';
    if (item.price != null && item.price !== '') {
      priceStr = formatPrice(item.price);
    } else if (item.priceFrom != null) {
      priceStr = 'From ' + formatPrice(item.priceFrom);
    } else if (priceFrom != null) {
      priceStr = 'From ' + formatPrice(priceFrom);
    }

    return `
      <div class="menu-item">
        <div class="menu-item-row">
          <span class="menu-item-name">${escapeHtml(item.name)}</span>
          <span class="menu-item-dots" aria-hidden="true"></span>
          ${priceStr ? `<span class="menu-item-price">${priceStr}</span>` : ''}
        </div>
        ${item.description ? `<p class="menu-item-desc">${escapeHtml(item.description)}</p>` : ''}
      </div>`;
  }

  function buildProteinTierBlock(proteinTiers) {
    if (!proteinTiers || !proteinTiers.length) return '';

    const rows = proteinTiers.map(tier => `
      <div class="menu-protein-tier-row">
        <span class="menu-protein-tier-label">${escapeHtml(tier.label)}</span>
        <span class="menu-protein-tier-dots" aria-hidden="true"></span>
        <span class="menu-protein-tier-price">${formatPrice(tier.price)}</span>
      </div>`).join('');

    return `
      <div class="menu-protein-tiers" aria-label="Protein options and prices">
        <span class="menu-protein-tiers-label">Protein options</span>
        ${rows}
      </div>`;
  }

  function buildItemsGrid(items, priceFrom) {
    return `<div class="menu-items-grid">${items.map(i => buildMenuRow(i, priceFrom)).join('')}</div>`;
  }

  function buildSubsectionPeriodLabel(period) {
    const labels = {
      lunch:  'Lunch <span class="menu-period-time">until 3 PM</span>',
      dinner: 'Dinner <span class="menu-period-time">after 3 PM</span>'
    };
    return `<span class="menu-period-label">${labels[period] || ''}</span>`;
  }

  function buildPanel(tab) {
    let html = '';

    if (tab.intro) {
      html += `<p class="menu-panel-intro">${escapeHtml(tab.intro)}</p>`;
    }

    if (tab.proteinItem) {
      html += `<p class="menu-protein-note">Choose your protein at checkout — prices shown are starting prices.</p>`;
    }

    if (tab.id === 'dessert') {
      html += `
        <div class="menu-dessert-accent">
          <img src="assets/images/desertheroshot.jpg"
               alt="Mango with sweet sticky rice — house dessert"
               loading="lazy"
               onerror="this.parentElement.style.display='none'">
        </div>`;
    }

    if (tab.dualPeriod) {
      tab.subsections.forEach(sub => {
        html += `<div class="menu-period-group">`;
        html += buildSubsectionPeriodLabel(sub.period);
        html += buildProteinTierBlock(sub.proteinTiers);
        html += buildItemsGrid(sub.items, sub.priceFrom || null);
        html += `</div>`;
      });
    } else {
      tab.subsections.forEach(sub => {
        if (sub.groupLabel) {
          html += `<div class="menu-period-group">`;
          html += `<span class="menu-period-label">${escapeHtml(sub.groupLabel)}</span>`;
          html += buildItemsGrid(sub.items);
          html += `</div>`;
        } else {
          html += buildItemsGrid(sub.items);
        }
      });
    }

    return html;
  }

  /* ── Central tab activation ─────────────────────────────────────────
     opts.scroll  (default true)  — scroll active tab button into view
     opts.animate (default true)  — play panel entry animation
  ─────────────────────────────────────────────────────────────────── */
  function activateTab(tabId, opts) {
    const doScroll  = !opts || opts.scroll  !== false;
    const doAnimate = !opts || opts.animate !== false;

    const tabs   = Array.from(document.querySelectorAll('.menu-tab'));
    const panels = Array.from(document.querySelectorAll('.menu-panel'));

    tabs.forEach(t => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
    });
    panels.forEach(p => p.classList.remove('is-active', 'panel-enter'));

    const btn   = tabs.find(t => t.dataset.tab === tabId);
    const panel = document.getElementById('panel-' + tabId);
    if (!btn || !panel) return;

    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');
    panel.classList.add('is-active');

    if (doAnimate) {
      // Force layout reflow so the animation restarts cleanly on every tab switch
      void panel.offsetWidth;
      panel.classList.add('panel-enter');
    }

    if (doScroll) {
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  function renderMenu(data) {
    const tabsEl   = document.querySelector('.menu-tabs');
    const panelsEl = document.querySelector('.menu-panels');
    if (!tabsEl || !panelsEl) return;

    tabsEl.innerHTML   = '';
    panelsEl.innerHTML = '';

    data.tabs.forEach((tab, i) => {
      const btn = document.createElement('button');
      btn.className   = 'menu-tab' + (i === 0 ? ' is-active' : '');
      btn.type        = 'button';
      btn.textContent = tab.label;
      btn.dataset.tab = tab.id;
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.setAttribute('role', 'tab');
      tabsEl.appendChild(btn);

      const panel = document.createElement('div');
      panel.className   = 'menu-panel' + (i === 0 ? ' is-active' : '');
      panel.id          = 'panel-' + tab.id;
      panel.setAttribute('role', 'tabpanel');
      panel.innerHTML   = buildPanel(tab);
      panelsEl.appendChild(panel);
    });

    if (data.footnote) {
      const footer = document.querySelector('.menu-footer .menu-pricing-note');
      if (footer) footer.textContent = data.footnote;
    }

    // Bind click listeners — each click calls activateTab directly
    document.querySelectorAll('.menu-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activateTab(btn.dataset.tab, { scroll: true, animate: true });
      });
    });

    // Deep-link from URL param — e.g. menu.html?tab=curries
    // requestAnimationFrame ensures layout is complete before activation
    const tabParam = new URLSearchParams(window.location.search).get('tab');
    if (tabParam) {
      requestAnimationFrame(() => {
        activateTab(tabParam, { scroll: true, animate: false });
      });
    }
  }

  function init() {
    fetch('src/data/menu.json')
      .then(r => r.json())
      .then(data => renderMenu(data))
      .catch(err => console.warn('Menu data failed to load:', err));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.BRMenu = { activateTab };
})();
